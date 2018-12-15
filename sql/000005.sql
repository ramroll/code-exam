drop table if exists `submit_applaud`;
CREATE TABLE `submit_applaud` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `submit_id` bigint(20) unsigned NOT NULL COMMENT '提交id',
  `account_id` bigint(20) unsigned NOT NULL COMMENT '账户id',
  `update` bigint(20) NOT NULL COMMENT '更新时间戳',
  `applaud` tinyint NOT NULL COMMENT '赞同',
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY(`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;


