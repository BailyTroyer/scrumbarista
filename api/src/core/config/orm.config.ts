import { ConfigModule } from "@nestjs/config";

import dbConfiguration from "./database.config";

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [".env.development.local", ".env.development"],
  load: [dbConfiguration],
});

export default dbConfiguration();
