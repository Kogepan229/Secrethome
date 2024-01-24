DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(4096) DEFAULT NULL,
  `room_type` varchar(64) NOT NULL,
  `access_key` varchar(64) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`access_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `contents`;
CREATE TABLE `contents` (
  `id` varchar(64) NOT NULL,
  `room_id` varchar(64) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `description` varchar(4096) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` varchar(64) NOT NULL,
  `room_id` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`room_id`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tags_of_contents`;
CREATE TABLE `tags_of_contents` (
  `content_id` varchar(64) NOT NULL,
  `tag_id` varchar(64) NOT NULL,
  `priority` int unsigned NOT NULL,
  PRIMARY KEY (`content_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
