import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1619644517203 implements MigrationInterface {
    name = 'migrations1619644517203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `country` (`id` varchar(36) NOT NULL, `country` varchar(225) NULL, `city` varchar(225) NULL, `province` varchar(225) NULL, `address` varchar(225) NULL, `createAt` timestamp NOT NULL, `updateAt` timestamp NOT NULL ON UPDATE current_timestamp, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `accounts` (`id` varchar(36) NOT NULL, `avatar` varchar(225) NULL, `first_name` varchar(225) NULL, `last_name` varchar(225) NULL, `createAt` timestamp NOT NULL, `updateAt` timestamp NOT NULL ON UPDATE current_timestamp, `locationId` varchar(36) NULL, UNIQUE INDEX `REL_7bda73c73a959f34539273d02e` (`locationId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `username` varchar(225) NOT NULL, `email` varchar(225) NOT NULL, `createAt` timestamp NOT NULL, `updateAt` timestamp NOT NULL ON UPDATE current_timestamp, `password` varchar(225) NOT NULL, `accountsId` varchar(36) NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `REL_c6db777a4be2277bbee8cc546f` (`accountsId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `accounts` ADD CONSTRAINT `FK_7bda73c73a959f34539273d02ee` FOREIGN KEY (`locationId`) REFERENCES `country`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c6db777a4be2277bbee8cc546ff` FOREIGN KEY (`accountsId`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c6db777a4be2277bbee8cc546ff`");
        await queryRunner.query("ALTER TABLE `accounts` DROP FOREIGN KEY `FK_7bda73c73a959f34539273d02ee`");
        await queryRunner.query("DROP INDEX `REL_c6db777a4be2277bbee8cc546f` ON `user`");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP INDEX `REL_7bda73c73a959f34539273d02e` ON `accounts`");
        await queryRunner.query("DROP TABLE `accounts`");
        await queryRunner.query("DROP TABLE `country`");
    }

}
