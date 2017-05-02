

/*Table structure for table `ads_list` */

DROP TABLE IF EXISTS `ads_list`;

CREATE TABLE `ads_list` (
  `id_ad` int(11) NOT NULL AUTO_INCREMENT,
  `ad_name` varchar(100) NOT NULL,
  `ad_url` text NOT NULL,
  `ad_priority` int(11) NOT NULL,
  `ad_shown_counter` int(11) NOT NULL,
  `ad_max_shown` int(11) NOT NULL,
  `ad_timestamp_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ad_timestamp_updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id_ad`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `ads_log` */

DROP TABLE IF EXISTS `ads_log`;

CREATE TABLE `ads_log` (
  `id_ad_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_ad` int(11) NOT NULL,
  `log_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ad_log`),
  KEY `id_ad` (`id_ad`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `ads_options` */

DROP TABLE IF EXISTS `ads_options`;

CREATE TABLE `ads_options` (
  `name` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

/*Table structure for table `master_files` */

DROP TABLE IF EXISTS `master_files`;

CREATE TABLE `master_files` (
  `id_files` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` text,
  `file_type` varchar(10) DEFAULT NULL,
  `file_path` varchar(200) DEFAULT NULL,
  `raw_name` text,
  `original_name` text,
  `client_name` text,
  `file_ext` varchar(10) DEFAULT NULL,
  `file_size` int(200) DEFAULT NULL,
  PRIMARY KEY (`id_files`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `post_categories` */

DROP TABLE IF EXISTS `post_categories`;

CREATE TABLE `post_categories` (
  `id_post` int(11) NOT NULL,
  `id_category` int(11) NOT NULL,
  PRIMARY KEY (`id_post`,`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `post_files` */

DROP TABLE IF EXISTS `post_files`;

CREATE TABLE `post_files` (
  `id_post_files` int(11) NOT NULL AUTO_INCREMENT,
  `id_post` int(11) DEFAULT NULL,
  `id_files` int(11) DEFAULT NULL,
  `uploaded_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uploaded_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_post_files`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `posts` */

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `id_post` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext,
  `posted_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `post_status` enum('draft','publish') DEFAULT 'draft',
  `avatar_post` text,
  `post_tag` mediumtext,
  `post_categories` text,
  `counter_post` int(11) DEFAULT '0',
  `schedule_publish` datetime DEFAULT NULL,
  `published_time` datetime DEFAULT NULL,
  `article_hash` text NOT NULL,
  `cron_id` int(200) DEFAULT NULL,
  PRIMARY KEY (`id_post`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userlevel` int(11) NOT NULL DEFAULT '1' COMMENT '0 = admin, 1 = common user',
  `key_A` text NOT NULL,
  `key_B` text NOT NULL,
  `user_key` varchar(20) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
