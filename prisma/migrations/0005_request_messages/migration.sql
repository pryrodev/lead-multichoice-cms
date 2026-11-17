CREATE TABLE `request_messages` (
  `id` CHAR(32) NOT NULL,
  `request_id` CHAR(32) NOT NULL,
  `sender_user_id` CHAR(32) NULL,
  `sender_type` ENUM('client', 'team') NOT NULL,
  `sender_name` VARCHAR(160) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  INDEX `idx_request_messages_request_created` (`request_id`, `created_at`),
  INDEX `idx_request_messages_sender` (`sender_user_id`),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_request_messages_request` FOREIGN KEY (`request_id`) REFERENCES `client_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_request_messages_sender` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
