import { DataSource, DataSourceOptions } from "typeorm";

import { ActivityService } from "./service/activity.service.js";
import { GeocodeService } from "./service/geocode.service.js";
import { SearchService } from "./service/search.service.js";
import { ActivityEntity } from "./entity/activity.entity.js";
import {
  GeocodeIPv4Entity,
  GeocodeIPv6Entity,
} from "./entity/geocode.entity.js";
import { PropertyEntity } from "./entity/property.entity.js";
import { ResourceEntity } from "./entity/resource.entity.js";
import {
  ArchiveDependencyEntity,
  ArchiveEntity,
  ArchiveReleaseEntity,
} from "./entity/archive.entity.js";

export class Kernel {
  readonly activity: ActivityService;
  readonly dataSource: DataSource;
  readonly geocode: GeocodeService;
  readonly search: SearchService;

  constructor(readonly options: DataSourceOptions) {
    this.dataSource = new DataSource({
      entities: [
        ActivityEntity,
        ArchiveEntity,
        ArchiveDependencyEntity,
        ArchiveReleaseEntity,
        GeocodeIPv4Entity,
        GeocodeIPv6Entity,
        PropertyEntity,
        ResourceEntity,
      ],
      ...options,
    });
    this.activity = new ActivityService(this);
    this.geocode = new GeocodeService(this);
    this.search = new SearchService(this);
  }

  async initialize() {
    await this.dataSource.initialize();
    await this.geocode.initialize();
  }
}
