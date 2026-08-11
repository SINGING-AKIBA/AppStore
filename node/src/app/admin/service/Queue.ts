import { Provide, Inject } from '@midwayjs/core';
import * as bullmq from '@midwayjs/bullmq';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class Queue {
  @Inject()
  bullmq: bullmq.Framework;

  @Inject()
  redis: RedisService;

  async getQueues() {
    const queues = await this.bullmq.getQueueList();
    const result = [];
    for (const queueInfo of queues) {
      const queue = this.bullmq.getQueue(queueInfo.name);
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
      ]);
      result.push({
        name: queueInfo.name,
        isPaused: await queueInfo.isPaused(),
        waiting,
        active,
        completed,
        failed,
        delayed,
      });
    }
    return result;
  }

  async getJobs(name: string, status: string = 'waiting', page: number = 0, size: number = 14) {
    const queue = this.bullmq.getQueue(name);
    const start = (page-1) * size;
    const end = start + size;
    let jobs: any[] = [];
    switch (status) {
      case 'waiting':
        jobs = await queue.getWaiting(start, end);
        break;
      case 'active':
        jobs = await queue.getActive(start, end);
        break;
      case 'completed':
        jobs = await queue.getCompleted(start, end);
        break;
      case 'failed':
        jobs = await queue.getFailed(start, end);
        break;
      case 'delayed':
        jobs = await queue.getDelayed(start, end);
        break;
    }
    const jobsWithStatus = await Promise.all(jobs.map(async job => ({
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      status: await job.getState(),
      returnValue: job.returnvalue,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
      timestamp: job.timestamp,
    })));
    const counts = await queue.getJobCounts();
    const statusKey = status as keyof typeof counts;
    const total = counts[statusKey] || 0;
    return {
      data: jobsWithStatus,
      current_page: page || 1,
      per_page: size,
      total,
      last_page: Math.max(Math.ceil(total / size), 1),
    };
  }

  async addJob(name: string, data: any, options?: any) {
    const queue = this.bullmq.getQueue(name);
    const job = await queue.addJobToQueue(data, options);
    return {
      id: job.id,
      name: job.name,
      data: job.data,
    };
  }

  async updateJob(name: string, id: string, data: any) {
    const queue = this.bullmq.getQueue(name);
    const job = await queue.getJob(id);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }
    await job.updateData(data);
    return { success: true };
  }

  async removeJob(name: string, id: string) {
    const queue = this.bullmq.getQueue(name);
    const job = await queue.getJob(id);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }
    await job.remove();
    return { success: true };
  }

  async pauseQueue(name: string) {
    const queue = this.bullmq.getQueue(name);
    await queue.pause();
    return { success: true };
  }

  async resumeQueue(name: string) {
    const queue = this.bullmq.getQueue(name);
    await queue.resume();
    return { success: true };
  }

  async clean(name: string, status: string, grace: number = 5000, limit: number = 100) {
    const queue = this.bullmq.getQueue(name);
    const jobStatus = status === 'completed' ? 'completed' : 'failed';
    const jobs = await queue.clean(grace, limit, jobStatus);
    return { success: true, count: jobs.length };
  }

  async retryJob(name: string, id: string) {
    const queue = this.bullmq.getQueue(name);
    const job = await queue.getJob(id);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }
    await job.retry();
    return { success: true };
  }

  async removeJobById(name: string, id: string) {
    const queue = this.bullmq.getQueue(name);
    const job = await queue.getJob(id);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }
    await job.remove();
    return { success: true };
  }

  async getJobProgress(name: string, id: string) {
    const queue = this.bullmq.getQueue(name);
    const job = await queue.getJob(id);
    if (!job) {
      return null;
    }
    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      status: await job.getState(),
    };
  }
}
