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

import { EntityNotFoundExceptionFilter } from "../core/filters/entity-not-found-exception.filter";
import { CreateStandupDto } from "./dto/create-standup.dto";
import { StandupDto } from "./dto/standup.dto";
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

  @Delete(":channelId")
  @UseFilters(EntityNotFoundExceptionFilter)
  remove(@Param("channelId") channelId: string): Promise<void> {
    return this.standupsService.remove(channelId);
  }
}
