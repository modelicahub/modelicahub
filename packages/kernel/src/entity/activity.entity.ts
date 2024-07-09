import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ActivityType {
  DOWNLOAD = 0,
  VIEW = 1,
}

export enum ActivityObjectType {
  ARCHIVE = 1,
  ARCHIVE_RELEASE = 2,
}

@Entity()
export class ActivityEntity {
  constructor(data?: {
    countryCode?: string;
    ipAddress?: Uint8Array;
    objectIid?: number;
    objectType?: ActivityObjectType;
    timestamp?: Date;
    type?: ActivityType;
  }) {
    this.countryCode = data?.countryCode;
    this.ipAddress = data?.ipAddress;
    this.objectIid = data?.objectIid;
    this.objectType = data?.objectType;
    this.timestamp = data?.timestamp;
    this.type = data?.type;
  }

  @PrimaryGeneratedColumn()
  iid?: number;

  @Column("varchar", { length: 2, nullable: true })
  countryCode?: string;

  @Column("blob", { nullable: true })
  ipAddress?: Uint8Array;

  @Column("bigint", { nullable: false })
  objectIid?: number;

  @Column({
    enum: ActivityObjectType,
    nullable: false,
    type: "simple-enum",
  })
  objectType?: ActivityObjectType;

  @Column("datetime", { nullable: false })
  timestamp?: Date;

  @Column({
    enum: ActivityType,
    nullable: false,
    type: "simple-enum",
  })
  type?: ActivityType;
}
