import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

@Injectable()
export class NotifierService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`*/${seconds} * * * *`, () => {
      console.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    console.warn(`job ${name} added for each minute at ${seconds} seconds!`);
    return name;
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

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    return `job ${name} deleted!`;
  }
}
