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
import { CreateStandupDto } from "./dto/create-standup.dto";
import { UpdateStandupDto } from "./dto/update-standup.dto";
import { Standup } from "./entities/standup.entity";
import { StandupsService } from "./standups.service";

@ApiTags("standups")
@Controller("standups")
export class StandupsController {
  constructor(private readonly standupsService: StandupsService) {}

  @Post()
  @ApiOperation({ summary: "create standup" })
  @ApiResponse({ status: 201, description: "standup created" })
  create(
    @Body() createStandupDto: CreateStandupDto
  ): Promise<CreateStandupDto & Standup> {
    return this.standupsService.create(createStandupDto);
  }

  @Get()
  @ApiOperation({ summary: "list standups" })
  @ApiResponse({ status: 200 })
  findAll(
    @Query("offset") skip = 0,
    @Query("limit") take = 25
  ): Promise<Standup[]> {
    return this.standupsService.findAll({ take, skip });
  }

  @Get(":channelId")
  @UseInterceptors(EntityNotFoundExceptionFilter)
  @ApiOperation({ summary: "fetch standup by Id" })
  @ApiResponse({ status: 200 })
  findOne(@Param("channelId") channelId: string): Promise<Standup> {
    return this.standupsService.findOne(channelId);
  }

  @Patch(":channelId")
  @UseInterceptors(EntityNotFoundExceptionFilter)
  update(
    @Param("channelId") channelId: string,
    @Body() updateStandupDto: UpdateStandupDto
  ): Promise<UpdateResult> {
    return this.standupsService.update(channelId, updateStandupDto);
  }

  @Delete(":channelId")
  @UseInterceptors(EntityNotFoundExceptionFilter)
  remove(@Param("channelId") channelId: string): Promise<void> {
    return this.standupsService.remove(channelId);
  }
}
