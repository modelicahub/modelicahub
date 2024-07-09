import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PropertyEntity } from "./property.entity.js";

@Entity()
export class ResourceEntity {
  constructor(data?: { cid?: Uint8Array; properties?: PropertyEntity[] }) {
    this.cid = data?.cid;
    this.properties = data?.properties;
  }

  @PrimaryGeneratedColumn()
  iid?: number;

  @Index()
  @Column("blob", { nullable: false, unique: true })
  cid?: Uint8Array;

  @OneToMany(() => PropertyEntity, (property) => property.owner, {
    cascade: true,
    eager: true,
  })
  properties?: PropertyEntity[];
}
