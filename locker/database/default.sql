-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2017 at 08:44 AM
-- Server version: 5.6.26
-- PHP Version: 5.5.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blog_1`
--

-- --------------------------------------------------------

--
-- Table structure for table `ads_list`
--

CREATE TABLE IF NOT EXISTS `ads_list` (
  `id_ad` int(11) NOT NULL,
  `ad_name` varchar(100) NOT NULL,
  `ad_url` text NOT NULL,
  `ad_priority` int(11) NOT NULL DEFAULT '1',
  `ad_shown_counter` int(11) NOT NULL DEFAULT '0',
  `ad_max_shown` int(11) NOT NULL DEFAULT '2',
  `ad_timestamp_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ad_timestamp_updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ad_status` tinyint(1) NOT NULL DEFAULT '1',
  `ad_min_time_show` time DEFAULT NULL,
  `ad_max_time_show` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ads_log`
--

CREATE TABLE IF NOT EXISTS `ads_log` (
  `id_ad_log` int(11) NOT NULL,
  `id_ad` int(11) NOT NULL,
  `log_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ads_options`
--

CREATE TABLE IF NOT EXISTS `ads_options` (
  `name` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ads_options`
--

INSERT INTO `ads_options` (`name`, `value`, `description`) VALUES
('ads_length', '2', ''),
('auto_ads', '1', ''),
('shuffle_ads', '1', '');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE IF NOT EXISTS `articles` (
  `id_article` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
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
  `article_type` enum('news','event','story','announcement','essay') NOT NULL DEFAULT 'news',
  `article_cover` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id_category` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id_category`, `name`, `description`, `created_at`, `created_by`) VALUES
(1, 'Tester', NULL, '2017-05-12 21:55:19', 0);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id_comment` int(11) NOT NULL,
  `comment_name` varchar(100) NOT NULL,
  `comment_email` varchar(100) NOT NULL,
  `comment_content` text NOT NULL,
  `id_comment_reference` int(11) DEFAULT '0' COMMENT 'only fill when the user commented on other comment',
  `id_article` int(11) NOT NULL,
  `comment_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id_event` int(11) NOT NULL,
  `id_article` int(11) NOT NULL,
  `event_start` int(200) NOT NULL,
  `event_end` int(200) DEFAULT NULL,
  `event_location` varchar(200) DEFAULT NULL,
  `event_location_lat` varchar(100) DEFAULT NULL,
  `event_location_lng` varchar(100) DEFAULT NULL,
  `event_photo` int(11) NOT NULL,
  `event_photo_url` text,
  `event_ticket_url` text,
  `event_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `event_created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `master_files`
--

CREATE TABLE IF NOT EXISTS `master_files` (
  `id_files` int(11) NOT NULL,
  `file_name` text,
  `file_type` varchar(10) DEFAULT NULL,
  `file_path` varchar(200) DEFAULT NULL,
  `raw_name` text,
  `original_name` text,
  `client_name` text,
  `file_ext` varchar(10) DEFAULT NULL,
  `file_size` int(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE IF NOT EXISTS `pages` (
  `id_page` int(11) NOT NULL,
  `page_name` varchar(100) NOT NULL,
  `page_title` varchar(100) NOT NULL,
  `page_description` text,
  `page_url` text NOT NULL,
  `page_icon` text,
  `page_controller_name` text NOT NULL,
  `page_created_by` int(11) NOT NULL,
  `page_created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `page_allow_access_user`
--

CREATE TABLE IF NOT EXISTS `page_allow_access_user` (
  `id_page` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `allow_access_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `page_allow_access_userlevel`
--

CREATE TABLE IF NOT EXISTS `page_allow_access_userlevel` (
  `id_page` int(11) NOT NULL,
  `id_userlevel` int(11) NOT NULL,
  `allow_access_userlevel_added_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `post_categories`
--

CREATE TABLE IF NOT EXISTS `post_categories` (
  `id_article` int(11) NOT NULL,
  `id_category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `post_files`
--

CREATE TABLE IF NOT EXISTS `post_files` (
  `id_post_files` int(11) NOT NULL,
  `id_post` int(11) DEFAULT NULL,
  `id_files` int(11) DEFAULT NULL,
  `uploaded_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uploaded_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userlevel` int(11) NOT NULL DEFAULT '1' COMMENT '0 = admin, 1 = common user',
  `key_A` text NOT NULL,
  `key_B` text NOT NULL,
  `user_key` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ads_list`
--
ALTER TABLE `ads_list`
  ADD PRIMARY KEY (`id_ad`);

--
-- Indexes for table `ads_log`
--
ALTER TABLE `ads_log`
  ADD PRIMARY KEY (`id_ad_log`),
  ADD KEY `id_ad` (`id_ad`);

--
-- Indexes for table `ads_options`
--
ALTER TABLE `ads_options`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id_article`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_category`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id_comment`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id_event`);

--
-- Indexes for table `master_files`
--
ALTER TABLE `master_files`
  ADD PRIMARY KEY (`id_files`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id_page`);

--
-- Indexes for table `page_allow_access_user`
--
ALTER TABLE `page_allow_access_user`
  ADD PRIMARY KEY (`id_page`,`id_user`);

--
-- Indexes for table `page_allow_access_userlevel`
--
ALTER TABLE `page_allow_access_userlevel`
  ADD PRIMARY KEY (`id_page`,`id_userlevel`);

--
-- Indexes for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD PRIMARY KEY (`id_article`,`id_category`);

--
-- Indexes for table `post_files`
--
ALTER TABLE `post_files`
  ADD PRIMARY KEY (`id_post_files`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ads_list`
--
ALTER TABLE `ads_list`
  MODIFY `id_ad` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ads_log`
--
ALTER TABLE `ads_log`
  MODIFY `id_ad_log` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id_article` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id_comment` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id_event` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `master_files`
--
ALTER TABLE `master_files`
  MODIFY `id_files` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id_page` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `post_files`
--
ALTER TABLE `post_files`
  MODIFY `id_post_files` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
