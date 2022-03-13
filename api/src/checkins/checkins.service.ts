import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { startOfDay, endOfDay } from "date-fns";
import { Between, In, Repository, UpdateResult } from "typeorm";

import { Standup } from "src/standups/entities/standup.entity";

import { CreateCheckinDto } from "./dto/create-checkin.dto";
import { UserFilterDto } from "./dto/filters.dto";
import { UpdateCheckinDto } from "./dto/update-checkin.dto";
import { Checkin } from "./entities/checkin.entity";

@Injectable()
export class CheckinsService {
  constructor(
    @InjectRepository(Checkin)
    private checkinsRepository: Repository<Checkin>,
    @InjectRepository(Standup)
    private standupsRepository: Repository<Standup>
  ) {}

  search(userId: string, createdDate: string): Promise<Checkin> {
    return this.checkinsRepository.findOneOrFail({
      where: {
        userId,
        createdDate: Between(
          startOfDay(new Date(createdDate)),
          endOfDay(new Date(createdDate))
        ),
      },
      relations: ["standup"],
    });
  }

  async create(
    channelId: string,
    createCheckinDto: CreateCheckinDto
  ): Promise<Checkin> {
    // Fetch standup
    const standup = await this.standupsRepository.findOne({ channelId });
    // Create checkin
    const checkin = this.checkinsRepository.create(createCheckinDto);
    // Tie relation 1toM
    checkin.standup = standup;
    return this.checkinsRepository.save(checkin);
  }

  findAll(
    channelId: string,
    params: {
      skip?: number;
      take?: number;
      users?: UserFilterDto;
      createdDate?: string;
    }
  ): Promise<Checkin[]> {
    const { skip, take, users, createdDate } = params;

    // Conditionally add date/userId if passed
    let filters = {};
    if (users?.users) filters = { ...filters, userId: In(users.users) };
    if (createdDate)
      filters = {
        ...filters,
        createdDate: Between(
          startOfDay(new Date(createdDate)),
          endOfDay(new Date(createdDate))
        ),
      };

    return this.checkinsRepository.find({
      where: {
        standup: { channelId },
        ...filters,
      },
      relations: ["standup"],
      skip,
      take,
    });
  }

  findOne(channelId: string, checkinId: string): Promise<Checkin> {
    return this.checkinsRepository.findOneOrFail({
      where: {
        id: checkinId,
        standup: { channelId },
      },
      relations: ["standup"],
    });
  }

  update(
    channelId: string,
    checkinId: string,
    updateCheckinDto: UpdateCheckinDto
  ): Promise<UpdateResult> {
    return this.checkinsRepository.update(
      { id: checkinId, standup: { channelId } },
      updateCheckinDto
    );
  }

  async remove(id: string): Promise<void> {
    await this.checkinsRepository.delete(id);
  }
}
