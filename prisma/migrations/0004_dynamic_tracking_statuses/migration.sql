ALTER TABLE `engagement_updates`
  ADD COLUMN `tracking_status_id` CHAR(32) NULL,
  ADD INDEX `idx_updates_tracking_status` (`tracking_status_id`);

CREATE TABLE `tracking_statuses` (
  `id` CHAR(32) NOT NULL,
  `request_type` ENUM('buyer_request', 'supplier_offer', 'partnership', 'buying', 'selling', 'sourcing', 'bidding', 'shipping', 'market_access', 'other') NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) NOT NULL DEFAULT '',
  `sort_order` INTEGER NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `is_terminal` BOOLEAN NOT NULL DEFAULT false,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  UNIQUE INDEX `uq_tracking_status_type_name` (`request_type`, `name`),
  INDEX `idx_tracking_status_type_active_order` (`request_type`, `is_active`, `sort_order`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `engagement_updates`
  ADD CONSTRAINT `fk_updates_tracking_status`
  FOREIGN KEY (`tracking_status_id`) REFERENCES `tracking_statuses` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
