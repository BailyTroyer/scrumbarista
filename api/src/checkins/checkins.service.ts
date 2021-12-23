import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { startOfDay, endOfDay } from "date-fns";
import { Between, Repository, UpdateResult } from "typeorm";

import { StandupsService } from "../standups/standups.service";
import { CreateCheckinDto } from "./dto/create-checkin.dto";
import { UpdateCheckinDto } from "./dto/update-checkin.dto";
import { Checkin } from "./entities/checkin.entity";

@Injectable()
export class CheckinsService {
  constructor(
    @InjectRepository(Checkin)
    private checkinsRepository: Repository<Checkin>,
    private readonly standupsService: StandupsService
  ) {}

  search(userId: string, date: string): Promise<Checkin> {
    return this.checkinsRepository.findOneOrFail({
      where: {
        userId,
        createdDate: Between(
          startOfDay(new Date(date)),
          endOfDay(new Date(date))
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
    const standup = await this.standupsService.findOne(channelId);
    // Create checkin
    const checkin = this.checkinsRepository.create(createCheckinDto);
    // Tie relation 1toM
    checkin.standup = standup;
    return this.checkinsRepository.save(checkin);
  }

  findAll(
    channelId: string,
    params: { skip?: number; take?: number; userId?: string; date?: string }
  ): Promise<Checkin[]> {
    const { skip, take, userId, date } = params;

    // Conditionally add date/userId if passed
    let filters = {};
    if (userId) filters = { ...filters, userId };
    if (date)
      filters = {
        ...filters,
        createdDate: Between(
          startOfDay(new Date(date)),
          endOfDay(new Date(date))
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
