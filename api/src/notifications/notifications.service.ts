import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { CronJob } from "cron";
import { Repository } from "typeorm";

import { Notification } from "./entities/notification.entity";

@Injectable()
export class NotificationsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  async onApplicationBootstrap() {
    const notifications = await this.notificationsRepository.find();

    notifications.forEach(({ id, interval }) => {
      const cron = new CronJob(interval, () => {
        console.warn(`${id} just ran at ${interval}!`);
      }); // You can define the handler for each job type
      this.schedulerRegistry.addCronJob(id, cron);
      cron.start();
    });
  }

  async addCronJob(interval: string): Promise<Notification> {
    const notification = await this.notificationsRepository.save({ interval });

    const job = new CronJob(notification.interval, () => {
      console.warn(`${notification.id} just ran at ${notification.interval}!`);
    });

    this.schedulerRegistry.addCronJob(notification.id, job);
    job.start();

    return notification;
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();

    const nextJobs = [];
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = "error: next fire date is in the past!";
      }
      console.log(`job: ${key} -> next: ${next}`);
      nextJobs.push({ name: key, next });
    });
    return nextJobs;
  }

  async deleteCron(id: string): Promise<string> {
    await this.notificationsRepository.delete({ id });
    this.schedulerRegistry.deleteCronJob(id);
    return `notification ${id} deleted!`;
  }
}
