import { join } from "path";

import { ConnectionOptions } from "typeorm";

import { Checkin } from "./checkins/entities/checkin.entity";
import { Day } from "./standups/entities/day.entity";
import { Standup } from "./standups/entities/standup.entity";

declare let process: {
  env: {
    DB_URL: string;
  };
};

export const config: ConnectionOptions = {
  type: "mysql",
  url: process.env.DB_URL || "mysql://username:password@db:3306/scrumbarista",
  // entities: [join(__dirname, "*/entities/*.entity.ts")],
  entities: [Standup, Day, Checkin],
  synchronize: true,
  // migrations: [join(__dirname, "migrations/*.ts")],
  // cli: {
  //   migrationsDir: "src/migrations",
  // },
};

export default config;
