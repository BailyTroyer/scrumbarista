import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebClient } from "@slack/web-api";
import { Repository } from "typeorm";

import { TimeUtilsService } from "src/core/utils/time";
import { NotificationsService } from "src/notifications/notifications.service";

import { CreateStandupDto } from "./dto/create-standup.dto";
import { UpdateStandupDto } from "./dto/update-standup.dto";
import { Day } from "./entities/day.entity";
import { Standup } from "./entities/standup.entity";
import { timezone, TimezoneOverride } from "./entities/tzoverride.entity";

@Injectable()
export class StandupsService {
  constructor(
    @InjectRepository(Standup)
    private standupsRepository: Repository<Standup>,
    @InjectRepository(Day)
    private daysRepository: Repository<Day>,
    @InjectRepository(TimezoneOverride)
    private timezoneOverridesRepository: Repository<TimezoneOverride>,
    @Inject("BOLT") private bolt: WebClient,
    private readonly timeUtils: TimeUtilsService,
    private notificationsService: NotificationsService
  ) {}

  private async createOrUpdateStandupNotificationInterval(standup: Standup) {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    // Create base notification
    const dayInterval = standup.days
      .map((d) => days.indexOf(d.day.toString()))
      .join(",");

    const splitTime = standup.startTime.split(":") as any[];

    const standupTime = new Date();
    standupTime.setHours(splitTime[0]);
    standupTime.setMinutes(splitTime[1]);

    const tzOffsetDate = this.timeUtils.tzOffset(
      this.timeUtils.getTimezoneOffset(standup.timezone) * -1,
      standupTime
    );

    const standupCron = await this.notificationsService.getCron(
      standup.channelId
    );

    if (!standupCron) {
      this.notificationsService.addCronJob(
        standup.channelId,
        `${tzOffsetDate.getMinutes()} ${tzOffsetDate.getHours()} * * ${dayInterval}`
      );
    } else {
      this.notificationsService.updateCronJob(
        standup.channelId,
        `${tzOffsetDate.getMinutes()} ${tzOffsetDate.getHours()} * * ${dayInterval}`
      );
    }
  }

  private async createOrUpdateUserStandupNotificationInterval(
    channelId: string,
    userId: string
  ) {
    const standup = await this.findOne(channelId);

    const override = standup.timezoneOverrides.find((o) => o.userId === userId);

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    // Create base notification
    const dayInterval = standup.days
      .map((d) => days.indexOf(d.day.toString()))
      .join(",");

    const splitTime = standup.startTime.split(":") as any[];

    const standupTime = new Date();
    standupTime.setHours(splitTime[0]);
    standupTime.setMinutes(splitTime[1]);

    const tzOffsetDate = this.timeUtils.tzOffset(
      this.timeUtils.getTimezoneOffset(override.timezone) * -1,
      standupTime
    );

    const userStandupCron = await this.notificationsService.getCronForUser(
      channelId,
      userId
    );

    if (!userStandupCron) {
      this.notificationsService.addUserCronJob(
        channelId,
        `${tzOffsetDate.getMinutes()} ${tzOffsetDate.getHours()} * * ${dayInterval}`,
        userId
      );
    } else {
      this.notificationsService.updateUserCron(
        channelId,
        `${tzOffsetDate.getMinutes()} ${tzOffsetDate.getHours()} * * ${dayInterval}`,
        userId
      );
    }
  }

  async create({
    days,
    ...createStandupDto
  }: CreateStandupDto): Promise<Standup> {
    // if already exists, throw custom error

    const standup = await this.standupsRepository.save(createStandupDto);
    standup.days = await this.daysRepository.save(days.map((day) => ({ day })));

    const responseStandup = await this.standupsRepository.save(standup);

    // Create notification
    // this.createOrUpdateStandupNotificationInterval(responseStandup);

    return responseStandup;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    day?: string;
  }): Promise<
    (Standup & {
      users: { name: string; id: string; image: string }[];
      channelName: string;
    })[]
  > {
    const { skip, take, day } = params;

    const standups = await this.standupsRepository.find({
      skip,
      take,
      relations: ["days"],
      where: day
        ? (qb) => {
            qb.where("day IN (:day)", {
              day,
            });
          }
        : null,
    });

    return Promise.all(
      standups.map(async (standup) => {
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
            await this.bolt.conversations
              .info({
                channel: standup.channelId,
              })
              .catch(() => null)
          )?.channel.name || "";

        return { ...standup, users, channelName };
      })
    );
  }

  // Should be DTO maybe? document this and "my architecture standards"
  async findOne(channelId: string): Promise<
    Standup & {
      users: { name: string; id: string; image: string }[];
      channelName: string;
    }
  > {
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

  async update(
    channelId: string,
    { days, ...updateStandupDto }: UpdateStandupDto
  ): Promise<Standup> {
    const standup = await this.findOne(channelId);

    if (days) {
      await this.daysRepository.delete({ standup });
      standup.days = await this.daysRepository.save(
        days.map((day) => ({ day }))
      );
    }

    standup.questions = updateStandupDto.questions;
    standup.name = updateStandupDto.name;
    standup.introMessage = updateStandupDto.introMessage;
    standup.active = updateStandupDto.active;
    standup.timezone = updateStandupDto.timezone;

    const updatedStandup = await this.standupsRepository.save(standup);

    // update notification schedule (if changed)
    // this.createOrUpdateStandupNotificationInterval(standup);

    return updatedStandup;
  }

  async remove(channelId: string): Promise<void> {
    await this.standupsRepository.delete({ channelId });
  }

  async createTimezoneOverride(
    channelId: string,
    userId: string,
    timezone: timezone
  ) {
    const standup = await this.findOne(channelId);

    const timezoneOverride = await this.timezoneOverridesRepository.save({
      timezone,
      standup,
      userId,
    });

    // Update notification interval
    // this.createOrUpdateUserStandupNotificationInterval(
    //   standup.channelId,
    //   userId
    // );

    return timezoneOverride;
  }

  async updateTimezoneOverride(
    channelId: string,
    userId: string,
    timezone: timezone
  ) {
    const standup = await this.findOne(channelId);
    const timezoneOverride = await this.timezoneOverridesRepository.findOne({
      standup,
      userId,
    });

    timezoneOverride.timezone = timezone;

    await this.timezoneOverridesRepository.save(timezoneOverride);

    // Update notification interval
    // this.createOrUpdateUserStandupNotificationInterval(
    //   standup.channelId,
    //   userId
    // );

    return timezoneOverride;
  }

  async deleteTimezoneOverride(channelId: string, userId: string) {
    const standup = await this.findOne(channelId);
    await this.timezoneOverridesRepository.delete({ standup, userId });
  }
}
