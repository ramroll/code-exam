drop database if exists codeexam;
create database codeexam default charset utf8;
use codeexam;

drop table if exists `account`;
CREATE TABLE `account` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `password` varchar(32) NOT NULL COMMENT '密码',
  `salt` varchar(30) NOT NULL COMMENT '盐',
  `email` varchar(50) NOT NULL COMMENT 'email',
  `status` smallint NOT NULL default 0 COMMENT '状态:0-未激活 1-激活',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;

drop table if exists `token`;
CREATE TABLE `token` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL COMMENT 'code',
  `account_id` bigint(20) NULL COMMENT '账户ID',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;


drop table if exists `vcode`;
CREATE TABLE `vcode` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(30) NOT NULL COMMENT 'code',
  `account_id` bigint(20) NULL COMMENT '账户ID',
  `status` smallint NOT NULL default 0 COMMENT '状态 0-未使用 1-已使用',
  `type` varchar(20) NOT NULL COMMENT '类型表示注册、找回等等',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;


drop table if exists `student`;
CREATE TABLE `student` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '姓名',
  `email` varchar(50) NOT NULL COMMENT '邮箱',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `account_id` bigint(20) NOT NULL COMMENT '账户ID',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;

drop table if exists `exam`;
CREATE TABLE `exam` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL COMMENT '考试英文代号',
  `time` bigint(20) unsigned NOT NULL COMMENT '考试时长，秒',
  `title` varchar(50) NOT NULL COMMENT '标题',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;

drop table if exists `question`;
CREATE TABLE `question` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `md` text NOT NULL COMMENT '题目说明',
  `sample` text NOT NULL COMMENT '题目示例-placehodler',
  `tester` text NOT NULL COMMENT '题目测试',
  `account_id` bigint(20) NOT NULL COMMENT '出题人ID',
  `scorealg` varchar(20) NOT NULL COMMENT '打分算法',
  `scoreconf` varchar(500) NOT NULL COMMENT '打分设置JSON',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;

drop table if exists `submit`;
CREATE TABLE `submit` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) unsigned NOT NULL COMMENT '学生ID',
  `exam_id` bigint(20) unsigned NOT NULL COMMENT '考试ID',
  `exam` varchar(30) NOT NULL COMMENT '考试名称',
  `question` bigint(20) unsigned NOT NULL COMMENT '问题编号',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  `exe_time` int(11) NULL COMMENT '执行时间',
  `message` varchar(255) NULL COMMENT '错误提示',
  `status` smallint NOT NULL default 0 COMMENT '状态:0-提交 1-已分配执行器 2-执行成功 >2执行失败',
  `code` varchar(2000) NOT NULL COMMENT '提交的代码',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;

ALTER TABLE account ADD CONSTRAINT `cst_email` UNIQUE KEY (`email`);
ALTER TABLE student ADD CONSTRAINT `cst_account_id` UNIQUE KEY (`account_id`);
ALTER TABLE submit ADD INDEX `idx_status_id` (`status`,`id`);

insert into exam (`time`,`name`,`title`) values (604800,'test','测试题目');