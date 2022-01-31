import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { WebClient } from "@slack/web-api";
import { CronJob, CronTime } from "cron";
import { Repository } from "typeorm";

import { CheckinNotifierService } from "src/core/modules/checkin-notifier.module";
import { Standup } from "src/standups/entities/standup.entity";

import { NotificationDto } from "./dto/notification.dto";
import {
  StandupNotification,
  UserStandupNotification,
} from "./entities/notification.entity";

type StandupAndUsers = Standup & {
  users: {
    name: string;
    id: string;
    image: string;
  }[];
  channelName: string;
};

@Injectable()
export class NotificationsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(StandupNotification)
    private standupNotificationsRepository: Repository<StandupNotification>,
    @InjectRepository(UserStandupNotification)
    private userNotificationsRepository: Repository<UserStandupNotification>,
    private schedulerRegistry: SchedulerRegistry,
    private checkinNotifier: CheckinNotifierService,
    @InjectRepository(Standup)
    private standupsRepository: Repository<Standup>,
    @Inject("BOLT") private bolt: WebClient
  ) {}

  // Break this out into module between standups.service and this
  async getStandup(channelId: string): Promise<StandupAndUsers | null> {
    const standup = await this.standupsRepository.findOneOrFail({ channelId });

    const users = await Promise.all(
      await (
        await this.bolt.conversations
          .members({
            channel: standup.channelId,
          })
          .catch(() => null)
      )?.members.map(async (user: string) => {
        const profile = await (
          await this.bolt.users.info({ user }).catch(() => null)
        )?.user.profile;
        return {
          name: profile.real_name || "",
          id: user,
          image: profile.image_192 || "",
        };
      })
    ).catch(() => []);

    const channelName =
      (
        await this.bolt.conversations
          .info({
            channel: standup.channelId,
          })
          .catch(() => null)
      )?.channel.name || "";

    return { ...standup, users, channelName };
  }

  // load the standup notifications + any user overrides
  async onApplicationBootstrap() {
    // const standupNotifications =
    //   await this.standupNotificationsRepository.find();
    // for (const notification of standupNotifications) {
    //   const { channelId, interval } = notification;
    //   const standup = await this.getStandup(channelId);
    //   const cron = new CronJob(interval, () =>
    //     this.checkinNotifier.pingUsersForCheckin(standup)
    //   );
    //   this.schedulerRegistry.addCronJob(channelId, cron);
    //   cron.start();
    // }
    // const userNotifications = await this.userNotificationsRepository.find();
    // for (const notification of userNotifications) {
    //   const { channelId, interval, userId } = notification;
    //   const standup = await this.getStandup(channelId);
    //   const cron = new CronJob(interval, () =>
    //     this.checkinNotifier.pingUsersForCheckin(standup)
    //   );
    //   this.schedulerRegistry.addCronJob(`${channelId}-${userId}`, cron);
    //   cron.start();
    // }
  }

  async addCronJob(
    channelId: string,
    interval: string
  ): Promise<StandupNotification> {
    const notification = await this.standupNotificationsRepository.save({
      interval,
      channelId,
    });

    const standup = await this.getStandup(channelId);

    const job = new CronJob(notification.interval, () =>
      this.checkinNotifier.pingUsersForCheckin(standup)
    );

    // if userId exists append to cronjob name
    this.schedulerRegistry.addCronJob(channelId, job);
    job.start();

    return notification;
  }

  async addUserCronJob(
    channelId: string,
    interval: string,
    userId: string
  ): Promise<UserStandupNotification> {
    const notification = await this.userNotificationsRepository.save({
      interval,
      channelId,
      userId,
    });

    const standup = await this.getStandup(channelId);

    const job = new CronJob(notification.interval, () =>
      this.checkinNotifier.pingUserForCheckin(standup, userId)
    );

    // if userId exists append to cronjob name
    this.schedulerRegistry.addCronJob(`${channelId}-${userId}`, job);
    job.start();

    return notification;
  }

  async updateCronJob(
    channelId: string,
    interval: string
  ): Promise<StandupNotification> {
    // Find & Update interval resource
    const notification = await this.standupNotificationsRepository.findOne({
      channelId,
    });

    notification.interval = interval;
    this.standupNotificationsRepository.save(notification);

    // Update cronjob interval
    const jobs = this.schedulerRegistry.getCronJobs();
    const job = jobs.get(notification.channelId);
    job.setTime(new CronTime(interval));

    return notification;
  }

  async updateUserCron(
    channelId: string,
    interval: string,
    userId: string
  ): Promise<UserStandupNotification> {
    // Find & Update interval resource
    const notification = await this.userNotificationsRepository.findOne({
      channelId,
      userId,
    });

    notification.interval = interval;
    this.userNotificationsRepository.save(notification);

    // Update cronjob interval
    const jobs = this.schedulerRegistry.getCronJobs();
    const job = jobs.get(`${channelId}-${userId}`);
    job.setTime(new CronTime(interval));

    return notification;
  }

  async getCrons(): Promise<NotificationDto[]> {
    const jobs = this.schedulerRegistry.getCronJobs();
    const notifications = await this.standupNotificationsRepository.find();
    const userNotifications = await this.userNotificationsRepository.find();

    const nextJobs = [];
    jobs.forEach((_, key) => {
      // @todo This is gross; double back once MVP and fix this
      const interval = notifications.find((n) => n.channelId === key)?.interval;
      const userInterval = userNotifications.find(
        (n) => `${n.channelId}-${n.userId}` === key
      )?.interval;
      nextJobs.push({ name: key, interval: interval || userInterval });
    });

    return nextJobs;
  }

  getCron(channelId: string): Promise<StandupNotification | null> {
    return this.standupNotificationsRepository.findOne({ channelId });
  }

  getCronForUser(
    channelId: string,
    userId: string
  ): Promise<StandupNotification | null> {
    return this.userNotificationsRepository.findOne({ channelId, userId });
  }

  async deleteCronForUser(channelId: string, userId: string): Promise<string> {
    await this.userNotificationsRepository.delete({ channelId, userId });

    this.schedulerRegistry.deleteCronJob(`${channelId}-${userId}`);
    return `notification ${channelId}-${userId} deleted!`;
  }

  async deleteCron(channelId: string): Promise<string> {
    await this.standupNotificationsRepository.delete({ channelId });

    this.schedulerRegistry.deleteCronJob(channelId);
    return `notification ${channelId} deleted!`;
  }

  async pingUsersForCheckin(channelId: string) {
    const standup = await this.getStandup(channelId);
    return this.checkinNotifier.pingUsersForCheckin(standup);
  }

  async pingUserForCheckin(channelId: string, userId: string) {
    const standup = await this.getStandup(channelId);
    return this.checkinNotifier.pingUserForCheckin(standup, userId);
  }
}
