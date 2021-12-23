import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    private daysRepository: Repository<Day>
  ) {}

  async create({
    days,
    ...createStandupDto
  }: CreateStandupDto): Promise<Standup> {
    // if already exists, throw custom error

    const standup = await this.standupsRepository.save(createStandupDto);
    standup.days = await this.daysRepository.create(
      days.map((day) => ({ day }))
    );

    return this.standupsRepository.save(standup);
  }

  findAll(params: {
    skip?: number;
    take?: number;
    day?: string;
  }): Promise<Standup[]> {
    const { skip, take, day } = params;

    return this.standupsRepository.find({
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
  }

  findOne(channelId: string): Promise<Standup> {
    return this.standupsRepository.findOneOrFail({ channelId });
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

    return this.standupsRepository.save(standup);
  }

  async remove(channelId: string): Promise<void> {
    await this.standupsRepository.delete({ channelId });
  }
}
