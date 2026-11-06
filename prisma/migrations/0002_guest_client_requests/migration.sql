ALTER TABLE `client_requests`
  DROP FOREIGN KEY `fk_client_requests_user`;

ALTER TABLE `engagements`
  DROP FOREIGN KEY `fk_engagement_client`;

ALTER TABLE `client_requests`
  MODIFY COLUMN `submitted_by` CHAR(32) NULL,
  ADD COLUMN `client_name` VARCHAR(160) NOT NULL DEFAULT '' AFTER `submitted_by`,
  ADD COLUMN `client_email` VARCHAR(254) NULL AFTER `client_name`,
  ADD COLUMN `client_phone` VARCHAR(40) NULL AFTER `client_email`,
  ADD COLUMN `organization` VARCHAR(200) NOT NULL DEFAULT '' AFTER `client_phone`,
  MODIFY COLUMN `request_type` ENUM(
    'buyer_request',
    'supplier_offer',
    'partnership',
    'buying',
    'selling',
    'sourcing',
    'bidding',
    'shipping',
    'market_access',
    'other'
  ) NOT NULL;

ALTER TABLE `engagements`
  MODIFY COLUMN `client_user_id` CHAR(32) NULL;

ALTER TABLE `client_requests`
  ADD CONSTRAINT `fk_client_requests_user`
  FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `engagements`
  ADD CONSTRAINT `fk_engagement_client`
  FOREIGN KEY (`client_user_id`) REFERENCES `users`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
