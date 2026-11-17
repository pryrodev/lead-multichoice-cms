ALTER TABLE `media_assets`
  ADD COLUMN `resource_type` VARCHAR(10) NOT NULL DEFAULT 'image' AFTER `id`;
