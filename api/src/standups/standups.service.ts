import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";

import { CreateStandupDto } from "./dto/create-standup.dto";
import { UpdateStandupDto } from "./dto/update-standup.dto";
import { Standup } from "./entities/standup.entity";

@Injectable()
export class StandupsService {
  constructor(
    @InjectRepository(Standup)
    private standupsRepository: Repository<Standup>
  ) {}

  create(createStandupDto: CreateStandupDto): Promise<Standup> {
    return this.standupsRepository.save(createStandupDto);
  }

  findAll(params: { skip?: number; take?: number }): Promise<Standup[]> {
    const { skip, take } = params;
    return this.standupsRepository.find({ skip, take });
  }

  findOne(channelId: string): Promise<Standup> {
    return this.standupsRepository.findOne(channelId);
  }

  update(
    channelId: string,
    updateStandupDto: UpdateStandupDto
  ): Promise<UpdateResult> {
    return this.standupsRepository.update({ channelId }, updateStandupDto);
  }

  async remove(channelId: string): Promise<void> {
    await this.standupsRepository.delete({ channelId });
  }
}
