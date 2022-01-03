import { join } from "path";

import { ConnectionOptions } from "typeorm";

declare let process: {
  env: {
    DB_URL: string;
  };
};

export const config: ConnectionOptions = {
  type: "mysql",
  url: process.env.DB_URL || "mysql://username:password@db:3306/scrumbarista",
  entities: [join(__dirname, "*/entities/*.entity.{ts,js}")],
  migrations: [join(__dirname, "core/migrations/*.ts")],
  cli: {
    migrationsDir: "src/core/migrations",
  },
};

export default config;
