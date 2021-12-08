import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateResult } from "typeorm";

import { EntityNotFoundExceptionFilter } from "../filters/entity-not-found-exception.filter";
import { CheckinsService } from "./checkins.service";
import { CreateCheckinDto } from "./dto/create-checkin.dto";
import { UpdateCheckinDto } from "./dto/update-checkin.dto";
import { Checkin } from "./entities/checkin.entity";

@ApiTags("checkins")
@Controller("/standups")
@UseInterceptors(EntityNotFoundExceptionFilter)
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post(":channelId/checkins")
  @ApiOperation({ summary: "create checkin" })
  @ApiResponse({ status: 201, description: "checkin created" })
  create(
    @Param("channelId") channelId: string,
    @Body() createCheckinDto: CreateCheckinDto
  ): Promise<CreateCheckinDto & Checkin> {
    return this.checkinsService.create(channelId, createCheckinDto);
  }

  @Get(":channelId/checkins")
  @ApiOperation({ summary: "list checkins" })
  @ApiResponse({ status: 200 })
  findAll(
    @Param("channelId") channelId: string,
    @Query("offset") skip = 0,
    @Query("limit") take = 25
  ): Promise<Checkin[]> {
    return this.checkinsService.findAll(channelId, { take, skip });
  }

  @Get(":channelId/checkins/:checkinId")
  @ApiOperation({ summary: "fetch checkin by Id" })
  @ApiResponse({ status: 200 })
  findOne(
    @Param("channelId") channelId: string,
    @Param("checkinId") checkinId: string
  ): Promise<Checkin> {
    return this.checkinsService.findOne(channelId, checkinId);
  }

  @Patch(":channelId/checkins/:checkinId")
  update(
    @Param("channelId") channelId: string,
    @Param("checkinId") checkinId: string,
    @Body() updateCheckinDto: UpdateCheckinDto
  ): Promise<UpdateResult> {
    return this.checkinsService.update(channelId, checkinId, updateCheckinDto);
  }

  @Delete(":channelId/checkins/:checkinId")
  remove(@Param("checkinId") checkinId: string): Promise<void> {
    return this.checkinsService.remove(checkinId);
  }
}
