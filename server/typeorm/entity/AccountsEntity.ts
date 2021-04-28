import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { dbTime } from "../../utils/setup";

@Entity("accounts")
export class AccountsEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column("varchar", { nullable: true, length: 225 })
  avatar: string;
  @Column("varchar", { nullable: true, length: 225 })
  first_name: string;
  @Column("varchar", { nullable: true, length: 225 })
  last_name: string;
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
