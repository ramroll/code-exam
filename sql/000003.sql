drop table if exists `exam_explain`;
CREATE TABLE `exam_explain` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint(20) unsigned NOT NULL COMMENT '考试id',
  `account_id` bigint(20) unsigned NOT NULL COMMENT '账户id',
  `md` text NOT NULL COMMENT '解读',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;



