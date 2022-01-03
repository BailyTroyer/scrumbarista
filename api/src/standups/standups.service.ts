import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebClient } from "@slack/web-api";
import { Repository } from "typeorm";

import { CreateStandupDto } from "./dto/create-standup.dto";
import { UpdateStandupDto } from "./dto/update-standup.dto";
import { Day } from "./entities/day.entity";
import { Standup } from "./entities/standup.entity";

@Injectable()
export class StandupsService {
  constructor(
    @InjectRepository(Standup)
    private standupsRepository: Repository<Standup>,
    @InjectRepository(Day)
    private daysRepository: Repository<Day>,
    @Inject("BOLT") private bolt: WebClient
  ) {}

  async create({
    days,
    ...createStandupDto
  }: CreateStandupDto): Promise<Standup> {
    // if already exists, throw custom error

    const standup = await this.standupsRepository.save(createStandupDto);
    standup.days = await this.daysRepository.save(days.map((day) => ({ day })));

    return this.standupsRepository.save(standup);
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
            await this.bolt.conversations.info({
              channel: standup.channelId,
            })
          ).channel.name || "";

        return { ...standup, users, channelName };
      })
    );
  }

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

    return this.standupsRepository.save(standup);
  }

  async remove(channelId: string): Promise<void> {
    await this.standupsRepository.delete({ channelId });
  }
}
