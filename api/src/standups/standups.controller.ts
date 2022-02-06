import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";

import { EntityNotFoundExceptionFilter } from "src/core/filters/entity-not-found-exception.filter";

import { CreateStandupDto } from "./dto/create-standup.dto";
import { StandupDto } from "./dto/standup.dto";
import {
  CreateTimezoneOverrideDto,
  TimezoneOverrideDto,
} from "./dto/timezoneOverride.dto";
import { UpdateStandupDto } from "./dto/update-standup.dto";
import { StandupsService } from "./standups.service";

// @UseGuards(SlackGuard)
@ApiTags("standups")
@Controller("standups")
export class StandupsController {
  constructor(private readonly standupsService: StandupsService) {}

  @Post()
  @ApiOperation({ summary: "create standup" })
  @ApiResponse({ status: 201, description: "standup created" })
  async create(
    @Body() createStandupDto: CreateStandupDto
  ): Promise<StandupDto> {
    return plainToClass(
      StandupDto,
      await this.standupsService.create(createStandupDto)
    );
  }

  @Post(":channelId/timezone-overrides/:userId")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "create user timezone override" })
  @ApiResponse({ status: 200 })
  async createTimeZoneOverride(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string,
    @Body() { timezone }: CreateTimezoneOverrideDto
  ): Promise<TimezoneOverrideDto> {
    return plainToClass(
      TimezoneOverrideDto,
      this.standupsService.createTimezoneOverride(channelId, userId, timezone)
    );
  }

  @Get()
  @ApiOperation({ summary: "list standups" })
  @ApiResponse({ status: 200 })
  async findAll(
    @Query("offset") skip = 0,
    @Query("limit") take = 25,
    @Query("day") day: string
  ): Promise<StandupDto[]> {
    return plainToClass(
      StandupDto,
      await this.standupsService.findAll({ take, skip, day })
    );
  }

  @Get(":channelId")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "fetch standup by Id" })
  @ApiResponse({ status: 200 })
  async findOne(@Param("channelId") channelId: string): Promise<StandupDto> {
    return plainToClass(
      StandupDto,
      await this.standupsService.findOne(channelId)
    );
  }

  @Patch(":channelId")
  @UseFilters(EntityNotFoundExceptionFilter)
  async update(
    @Param("channelId") channelId: string,
    @Body() updateStandupDto: UpdateStandupDto
  ): Promise<StandupDto> {
    return plainToClass(
      StandupDto,
      await this.standupsService.update(channelId, updateStandupDto)
    );
  }

  @Patch(":channelId/timezone-overrides/:userId")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "update user timezone override" })
  @ApiResponse({ status: 200 })
  async updateTimeZoneOverride(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string,
    @Body() { timezone }: CreateTimezoneOverrideDto
  ): Promise<TimezoneOverrideDto> {
    return plainToClass(
      TimezoneOverrideDto,
      this.standupsService.updateTimezoneOverride(channelId, userId, timezone)
    );
  }

  @Delete(":channelId")
  @UseFilters(EntityNotFoundExceptionFilter)
  remove(@Param("channelId") channelId: string): Promise<void> {
    return this.standupsService.remove(channelId);
  }

  @Delete(":channelId/timezone-overrides/:userId")
  @UseFilters(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "delete user timezone override" })
  @ApiResponse({ status: 200 })
  async deleteTimeZoneOverride(
    @Param("channelId") channelId: string,
    @Param("userId") userId: string
  ): Promise<void> {
    return this.standupsService.deleteTimezoneOverride(channelId, userId);
  }
}
