import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { WebClient } from "@slack/web-api";
import { CronJob, CronTime } from "cron";
import { Repository } from "typeorm";

import { CheckinNotifierService } from "src/core/modules/checkin-notifier.module";
import { Standup } from "src/standups/entities/standup.entity";

import { NotificationDto } from "./dto/notification.dto";
import { StandupNotification } from "./entities/notification.entity";

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
    private notificationsRepository: Repository<StandupNotification>,
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
          await this.bolt.users.info({ user })
        ).user.profile;
        return {
          name: profile.real_name || "",
          id: user,
          image: profile.image_192 || "",
        };
      })
    ).catch(() => []);

    const channelName =
      (
        await this.bolt.conversations.info({
          channel: standup.channelId,
        })
      ).channel.name || "";

    return { ...standup, users, channelName };
  }

  // load the standup notifications + any user overrides
  async onApplicationBootstrap() {
    const notifications = await this.notificationsRepository.find();

    for (const notification of notifications) {
      const { channelId, interval } = notification;

      const standup = await this.getStandup(channelId);

      const cron = new CronJob(interval, () =>
        this.checkinNotifier.pingUsersForCheckin(standup)
      );
      this.schedulerRegistry.addCronJob(channelId, cron);
      cron.start();
    }
  }

  async addCronJob(
    channelId: string,
    interval: string
  ): Promise<StandupNotification> {
    const notification = await this.notificationsRepository.save({
      interval,
      channelId,
    });

    const standup = await this.getStandup(channelId);

    const job = new CronJob(notification.interval, () =>
      this.checkinNotifier.pingUsersForCheckin(standup)
    );

    this.schedulerRegistry.addCronJob(notification.channelId, job);
    job.start();

    return notification;
  }

  async updateCronJob(
    channelId: string,
    interval: string
  ): Promise<StandupNotification> {
    // Find & Update interval resource
    const notification = await this.notificationsRepository.findOne({
      channelId,
    });

    notification.interval = interval;
    this.notificationsRepository.save(notification);

    // Update cronjob interval
    const jobs = this.schedulerRegistry.getCronJobs();
    const job = jobs.get(notification.channelId);
    job.setTime(new CronTime(interval));

    return notification;
  }

  async getCrons(): Promise<NotificationDto[]> {
    const jobs = this.schedulerRegistry.getCronJobs();
    const notifications = await this.notificationsRepository.find();

    const nextJobs = [];
    jobs.forEach((_, key) => {
      const interval = notifications.find((n) => n.channelId === key).interval;
      nextJobs.push({ name: key, interval });
    });
    return nextJobs;
  }

  getCron(channelId: string): Promise<StandupNotification | null> {
    return this.notificationsRepository.findOne({ channelId });
  }

  async deleteCron(channelId: string): Promise<string> {
    await this.notificationsRepository.delete({ channelId });

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
