import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SemanticVersionEntity } from "./semantic-version.entity.js";

@Entity()
export class ArchiveEntity {
  @PrimaryGeneratedColumn()
  iid?: number;

  @Column(() => ArchiveMetricsEntity)
  metrics?: ArchiveMetricsEntity;

  @Column("varchar", { length: 256, nullable: false })
  name?: string;

  @OneToMany(() => ArchiveReleaseEntity, (release) => release.archive, {
    cascade: true,
  })
  releases?: Promise<ArchiveReleaseEntity[]>;
}

@Entity()
export class ArchiveDependencyEntity {
  @PrimaryGeneratedColumn()
  iid?: number;

  @Column("varchar", { length: 256, nullable: false })
  name?: string;

  @ManyToOne(() => ArchiveReleaseEntity, (release) => release.dependencies)
  release?: Promise<ArchiveReleaseEntity>;

  @Column("varchar", { length: 128, nullable: false })
  version?: string;
}

export class ArchiveDistributionEntity {
  @Column("bigint", { nullable: false })
  fileCount?: number;

  @Column("varchar", { length: 1024, nullable: false })
  tarball?: string;

  @Column("bigint", { nullable: false })
  unpackedSize?: number;
}

export class ArchiveMetricsEntity {
  @Column("bigint", { nullable: false })
  lifetimeDownloads?: number;

  @Column("bigint", { nullable: false })
  lifetimeViews?: number;

  @Column("datetime", { nullable: false })
  timestamp?: number;

  @Column("varchar", { length: 1024, nullable: false })
  weeklyDownloads?: string;

  @Column("varchar", { length: 1024, nullable: false })
  weeklyViews?: string;
}

@Entity()
export class ArchiveReleaseEntity {
  @PrimaryGeneratedColumn()
  iid?: number;

  @ManyToOne(() => ArchiveEntity, (archive) => archive.releases)
  archive?: Promise<ArchiveEntity>;

  @OneToMany(
    () => ArchiveDependencyEntity,
    (dependency) => dependency.release,
    { cascade: true },
  )
  dependencies?: Promise<ArchiveDependencyEntity[]>;

  @Column("varchar", { length: 1024, nullable: true })
  description?: string;

  @Column(() => ArchiveDistributionEntity)
  distribution?: ArchiveDistributionEntity;

  @Column("varchar", { length: 64, nullable: true })
  license?: string;

  @Column(() => ArchiveMetricsEntity)
  metrics?: ArchiveMetricsEntity;

  @Column("datetime", { nullable: false })
  timestamp?: number;

  @Column("varchar", { length: 1024, nullable: true })
  repositoryUrl?: string;

  @Column(() => SemanticVersionEntity)
  version?: SemanticVersionEntity;
}
