
ALTER TABLE `student` ADD COLUMN avatar varchar(100) NULL COMMENT '头像';
ALTER TABLE `student` ADD COLUMN intro varchar(500) NULL COMMENT '个人简介';

drop table if exists `class`;
CREATE TABLE `class` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '班级名称',
  `intro` varchar(200) NOT NULL COMMENT '班级介绍',
  `account_id` bigint(20) unsigned NOT NULL COMMENT '账户id',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;

drop table if exists `class_admin`;
CREATE TABLE `class_admin` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) NOT NULL COMMENT '管理员id',
  `class_id` bigint(20) NOT NULL COMMENT '班级ID',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;



drop table if exists `class_student`;
CREATE TABLE `class_student` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `class_id` bigint(20) unsigned NOT NULL COMMENT '账户ID',
  `account_id` bigint(20) unsigned NOT NULL COMMENT '学员账号',
  `status` varchar(10) NOT NULL COMMENT '申请状态',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;



