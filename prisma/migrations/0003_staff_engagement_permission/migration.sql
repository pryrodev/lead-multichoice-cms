ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('buyer', 'supplier', 'admin', 'staff') NOT NULL DEFAULT 'buyer',
  ADD COLUMN `can_manage_engagements` BOOLEAN NOT NULL DEFAULT false AFTER `role`;
