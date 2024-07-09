import { Column } from "typeorm";

export class SemanticVersionEntity {
  @Column("varchar", { length: 32, nullable: true })
  buildLabel?: string;

  @Column("bigint", { nullable: false })
  major?: number;

  @Column("bigint", { nullable: false })
  minor?: number;

  @Column("bigint", { nullable: false })
  patch?: number;

  @Column("varchar", { length: 32, nullable: true })
  preReleaseLabel?: string;

  @Column("varchar", { length: 128, nullable: false })
  string?: string;
}
