import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from "@nestjs/common";
import { WebClient } from "@slack/web-api";

@Injectable()
export class SlackGuard implements CanActivate {
  constructor(@Inject("BOLT") private readonly bolt: WebClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.slice(7);

    if (!token) return false;

    const testResults = await this.bolt.auth.test({ token });

    return testResults.ok;
  }
}
