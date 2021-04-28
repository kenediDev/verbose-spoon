import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { dbTime } from "../../utils/setup";

@Entity("country")
export class CountryEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column("varchar", { nullable: true, length: 225 })
  country: string;
  @Column("varchar", { nullable: true, length: 225 })
  city: string;
  @Column("varchar", { nullable: true, length: 225 })
  province: string;
  @Column("varchar", { nullable: true, length: 225 })
  address: string;
  @Column({ type: dbTime, nullable: false })
  createAt: Date;
  @Column({ type: dbTime, nullable: false, onUpdate: "current_timestamp" })
  updateAt: Date;

  @BeforeInsert()
  async insertCreateAt() {
    this.createAt = new Date();
  }
  @BeforeInsert()
  async insertUpdateAt() {
    this.updateAt = new Date();
  }
}
