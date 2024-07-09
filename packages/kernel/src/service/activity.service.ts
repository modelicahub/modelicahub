import { Repository } from "typeorm";
import {
  ActivityEntity,
  ActivityObjectType,
  ActivityType,
} from "../entity/activity.entity.js";
import { Kernel } from "../kernel.js";
import { int10StrToUint8Array } from "../util.js";

export class ActivityService {
  private readonly activityRepository: Repository<ActivityEntity>;

  constructor(private kernel: Kernel) {
    this.activityRepository = kernel.dataSource.getRepository(ActivityEntity);
  }

  async log(
    activityType: ActivityType,
    objectType: ActivityObjectType,
    objectIid: number,
    ipAddress?: string,
  ): Promise<ActivityEntity> {
    return this.activityRepository.save(
      new ActivityEntity({
        countryCode:
          (await this.kernel.geocode.geocodeIP(
            int10StrToUint8Array(ipAddress),
          )) ?? undefined,
        ipAddress: int10StrToUint8Array(ipAddress) ?? undefined,
        objectIid: objectIid,
        objectType: objectType,
        timestamp: new Date(),
        type: activityType,
      }),
    );
  }
}
