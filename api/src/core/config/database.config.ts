import { join } from "path";

import { registerAs } from "@nestjs/config";
import { ConnectionOptions } from "typeorm";

export default registerAs(
  "database",
  (): ConnectionOptions => ({
    type: "mysql",
    // Enable when debugging issues with ORM (otherwise too noisy)
    // logging: true,
    url: process.env.DB_URL,
    entities: [join(__dirname, "../../*/entities/*.entity.{ts,js}")],
    migrations: [join(__dirname, "../core/migrations/*.ts")],
    cli: {
      migrationsDir: "src/core/migrations",
    },
  })
);
