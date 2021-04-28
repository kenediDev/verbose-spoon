import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { dbTime } from "../../utils/setup";
import bcrypt from "bcrypt";
import { AccountsEntity } from "./AccountsEntity";
import { CountryEntity } from "./CountryEntity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column("varchar", { nullable: false, unique: true, length: 225 })
  username: string;
  @Column("varchar", { nullable: false, unique: true, length: 225 })
  email: string;
  @Column({ type: dbTime, nullable: false })
  createAt: Date;
  @Column({ type: dbTime, nullable: false, onUpdate: "current_timestamp" })
  updateAt: Date;
  @Column("varchar", { nullable: false, length: 225 })
  password: string;
  @OneToOne((type: any) => AccountsEntity)
  @JoinColumn()
  accounts: AccountsEntity;

  async insertCountry() {
    const country = new CountryEntity();
    return country.save();
  }

  async insertAccounts() {
    const accounts = new AccountsEntity();
    accounts.location = await this.insertCountry();
    return accounts.save();
  }

  @BeforeInsert()
  async insertCreateAt() {
    this.createAt = new Date();
  }
  @BeforeInsert()
  async insertUpdateAt() {
    this.updateAt = new Date();
  }

  @BeforeInsert()
  async insertPassword() {
    this.password = await bcrypt.hash(
      this.password,
      Math.floor((Math.random() + 3) * Math.random())
    );
  }
  static filter(options: any) {
    return this.findOne({
      where: [{ username: options.username }, { email: options.email }],
    });
  }
  static async verify(options: any, args: any) {
    return await bcrypt.compare(options.password, args.password);
  }
}
