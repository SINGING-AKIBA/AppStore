import { BaseEntity, Column, Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity("smile_rules")
export class SmileRules extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { comment: 'ID' })
  id: number;

  @Column("varchar", { name: "ptype", nullable: true, length: 1020 })
  ptype: string | null;

  @Column("varchar", { name: "v0", nullable: true, length: 1020 })
  v0: string | null;

  @Column("varchar", { name: "v1", nullable: true, length: 1020 })
  v1: string | null;

  @Column("varchar", { name: "v2", nullable: true, length: 1020 })
  v2: string | null;

  @Column("varchar", { name: "v3", nullable: true, length: 1020 })
  v3: string | null;

  @Column("varchar", { name: "v4", nullable: true, length: 1020 })
  v4: string | null;

  @Column("varchar", { name: "v5", nullable: true, length: 1020 })
  v5: string | null;

  @Column("varchar", { name: "v6", nullable: true, length: 1020 })
  v6: string | null;
}
