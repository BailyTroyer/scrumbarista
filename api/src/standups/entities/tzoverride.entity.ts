import { Entity, Column, ManyToOne } from "typeorm";

import { Standup } from "./standup.entity";

export const timezones = [
  "GMT",
  "UTC",
  "ECT",
  "EET",
  "ART",
  "EAT",
  "MET",
  "NET",
  "PLT",
  "IST",
  "BST",
  "VST",
  "CTT",
  "JST",
  "ACT",
  "AET",
  "SST",
  "NST",
  "MIT",
  "HST",
  "AST",
  "PST",
  "PNT",
  "MST",
  "CST",
  "EST",
  "IET",
  "PRT",
  "CNT",
  "AGT",
  "BET",
  "CAT",
];

export type timezone = typeof timezones[number];

@Entity()
export class TimezoneOverride {
  @Column({ primary: true })
  userId: string;

  @ManyToOne(() => Standup, (standup) => standup.timezoneOverrides, {
    onDelete: "CASCADE",
  })
  standup: Standup;

  @Column({
    type: "enum",
    enum: timezones,
    default: "CST",
  })
  timezone: timezone;
}
