ALTER TABLE `exam` ADD COLUMN account_id bigint(20) unsigned NOT NULL COMMENT '试卷出题人';
ALTER TABLE `submit` ADD COLUMN console text NULL COMMENT '控制台';


drop table if exists `exam_question`;
CREATE TABLE `exam_question` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint(20) unsigned NOT NULL COMMENT '考试id',
  `question_id` bigint(20) unsigned NOT NULL COMMENT '问题id',
  `ref_time` bigint(20) unsigned NOT NULL COMMENT '参考执行时间纳秒',
  `weight` int NOT NULL COMMENT '权重',
  `min_score` int NOT NULL COMMENT '正确提交的最低分值',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;

drop table if exists `class`;
CREATE TABLE `class` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint(20) unsigned NOT NULL COMMENT '考试id',
  `question_id` bigint(20) unsigned NOT NULL COMMENT '问题id',
  `exe_time` bigint(20) unsigned NOT NULL COMMENT '参考执行时间纳秒',
  `weight` int NOT NULL COMMENT '权重',
  `min_score` int NOT NULL COMMENT '正确提交的最低分值',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;


drop table if exists `student_class`;
CREATE TABLE `class` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint(20) unsigned NOT NULL COMMENT '考试id',
  `question_id` bigint(20) unsigned NOT NULL COMMENT '问题id',
  `exe_time` bigint(20) unsigned NOT NULL COMMENT '参考执行时间纳秒',
  `weight` int NOT NULL COMMENT '权重',
  `min_score` int NOT NULL COMMENT '正确提交的最低分值',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;