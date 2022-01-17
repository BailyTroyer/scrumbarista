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
  UseFilters,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";

import { EntityNotFoundExceptionFilter } from "src/core/filters/entity-not-found-exception.filter";

import { CheckinsService } from "./checkins.service";
import { CheckinDto } from "./dto/checkin.dto";
import { CreateCheckinDto } from "./dto/create-checkin.dto";
import { UserFilterDto } from "./dto/filters.dto";
import { UpdateCheckinDto } from "./dto/update-checkin.dto";

// @UseGuards(SlackGuard)
@ApiTags("checkins")
@Controller("/standups")
@UseInterceptors(EntityNotFoundExceptionFilter)
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Get("/checkins/search")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "create checkin" })
  @ApiResponse({ status: 201, description: "checkin created" })
  async search(
    @Query("userId") userId: string,
    @Query("createdDate") createdDate: string
  ): Promise<CheckinDto> {
    return plainToClass(
      CheckinDto,
      await this.checkinsService.search(userId, createdDate)
    );
  }

  @Post(":channelId/checkins")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "create checkin" })
  @ApiResponse({ status: 201, description: "checkin created" })
  async create(
    @Param("channelId") channelId: string,
    @Body() createCheckinDto: CreateCheckinDto
  ): Promise<CheckinDto> {
    return plainToClass(
      CheckinDto,
      await this.checkinsService.create(channelId, createCheckinDto)
    );
  }

  @Get(":channelId/checkins")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "list checkins" })
  @ApiResponse({ status: 200 })
  async findAll(
    @Param("channelId") channelId: string,
    @Query("offset") skip = 0,
    @Query("limit") take = 25,
    @Query(new ValidationPipe({ transform: true })) users: UserFilterDto,
    @Query("createdDate") createdDate: string
  ): Promise<CheckinDto[]> {
    return plainToClass(
      CheckinDto,
      await this.checkinsService.findAll(channelId, {
        take,
        skip,
        users,
        createdDate,
      })
    );
  }

  @Get(":channelId/checkins/:checkinId")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "fetch checkin by Id" })
  @ApiResponse({ status: 200 })
  async findOne(
    @Param("channelId") channelId: string,
    @Param("checkinId") checkinId: string
  ): Promise<CheckinDto> {
    return plainToClass(
      CheckinDto,
      await this.checkinsService.findOne(channelId, checkinId)
    );
  }

  @Patch(":channelId/checkins/:checkinId")
  @UseFilters(EntityNotFoundExceptionFilter)
  async update(
    @Param("channelId") channelId: string,
    @Param("checkinId") checkinId: string,
    @Body() updateCheckinDto: UpdateCheckinDto
  ): Promise<CheckinDto> {
    return plainToClass(
      CheckinDto,
      await this.checkinsService.update(channelId, checkinId, updateCheckinDto)
    );
  }

  @Delete("/checkins/:checkinId")
  @UseFilters(EntityNotFoundExceptionFilter)
  remove(@Param("checkinId") checkinId: string): Promise<void> {
    return this.checkinsService.remove(checkinId);
  }
}
