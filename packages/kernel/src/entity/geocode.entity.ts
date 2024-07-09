import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Index(["ipRangeEnd", "ipRangeStart"])
export abstract class GeocodeIPEntity {
  constructor(data?: {
    countryCode?: string;
    ipRangeEnd?: Uint8Array;
    ipRangeStart?: Uint8Array;
  }) {
    this.countryCode = data?.countryCode;
    this.ipRangeEnd = data?.ipRangeEnd;
    this.ipRangeStart = data?.ipRangeStart;
  }

  @Column("varchar", { length: 2, nullable: false })
  countryCode?: string;

  @PrimaryColumn("blob", { nullable: false })
  ipRangeEnd?: Uint8Array;

  @PrimaryColumn("blob", { nullable: false })
  ipRangeStart?: Uint8Array;
}

@Entity()
export class GeocodeIPv4Entity extends GeocodeIPEntity {
  constructor(data?: {
    countryCode?: string;
    ipRangeEnd?: Uint8Array;
    ipRangeStart?: Uint8Array;
  }) {
    super(data);
  }
}

@Entity()
export class GeocodeIPv6Entity extends GeocodeIPEntity {
  constructor(data?: {
    countryCode?: string;
    ipRangeEnd?: Uint8Array;
    ipRangeStart?: Uint8Array;
  }) {
    super(data);
  }
}
