import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResourceEntity } from "./resource.entity.js";

export enum PropertyType {
  BOOLEAN = 1,
  NULL = 2,
  NUMBER = 3,
  RESOURCE = 4,
  STRING = 5,
}

@Entity()
export class PropertyEntity {
  constructor(data?: {
    name?: string;
    numberValue?: number;
    resourceValue?: ResourceEntity;
    stringValue?: string;
    type?: PropertyType;
  }) {
    this.name = data?.name;
    this.numberValue = data?.numberValue;
    if (data?.resourceValue != null)
      this.resourceValue = Promise.resolve(data.resourceValue);
    this.stringValue = data?.stringValue;
    this.type = data?.type;
  }

  @PrimaryGeneratedColumn()
  iid?: number;

  @Column("varchar", { length: 1024, nullable: false })
  name?: string;

  @Column("float", { nullable: true })
  numberValue?: number;

  @ManyToOne(() => ResourceEntity, (owner) => owner.properties, {
    nullable: false,
  })
  owner?: Promise<ResourceEntity>;

  @ManyToOne(() => ResourceEntity, { nullable: true, lazy: true })
  resourceValue?: Promise<ResourceEntity>;

  @Column("varchar", { length: 1024, nullable: true })
  stringValue?: string;

  @Column({
    enum: PropertyType,
    nullable: false,
    type: "simple-enum",
  })
  type?: PropertyType;
}
