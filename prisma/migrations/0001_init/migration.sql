-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(32) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `organization` VARCHAR(200) NOT NULL,
    `phone` VARCHAR(40) NULL,
    `role` ENUM('buyer', 'supplier', 'admin') NOT NULL DEFAULT 'buyer',
    `password_hash` VARCHAR(180) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `idx_users_role_active`(`role`, `is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_sessions` (
    `id` CHAR(32) NOT NULL,
    `user_id` CHAR(32) NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `token_hash`(`token_hash`),
    INDEX `idx_sessions_expiry`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opportunities` (
    `id` CHAR(32) NOT NULL,
    `reference` VARCHAR(32) NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `type` ENUM('public_tender', 'institutional_procurement', 'direct_buyer_requirement', 'supplier_led', 'other') NOT NULL,
    `buyer` VARCHAR(200) NOT NULL DEFAULT '',
    `source` VARCHAR(200) NOT NULL DEFAULT '',
    `source_url` VARCHAR(1000) NOT NULL DEFAULT '',
    `external_reference` VARCHAR(120) NOT NULL DEFAULT '',
    `country` VARCHAR(120) NOT NULL DEFAULT '',
    `sector` VARCHAR(160) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL,
    `requirements` TEXT NOT NULL,
    `published_at` DATE NULL,
    `deadline` DATE NULL,
    `estimated_value` DECIMAL(15, 2) NULL,
    `potential_supplier` VARCHAR(200) NOT NULL DEFAULT '',
    `owner` VARCHAR(160) NOT NULL,
    `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    `status` ENUM('new', 'under_assessment', 'qualified', 'pursuing', 'monitoring', 'awaiting_information', 'preparing_submission', 'submitted', 'under_evaluation', 'awarded', 'not_awarded', 'withdrawn', 'closed') NOT NULL DEFAULT 'new',
    `next_action` VARCHAR(500) NOT NULL DEFAULT '',
    `next_action_due` DATE NULL,
    `closure_reason` TEXT NOT NULL,
    `created_by` CHAR(32) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `reference`(`reference`),
    INDEX `idx_opportunities_status_created`(`status`, `created_at`),
    INDEX `idx_opportunities_deadline`(`deadline`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_requests` (
    `id` CHAR(32) NOT NULL,
    `reference` VARCHAR(32) NOT NULL,
    `submitted_by` CHAR(32) NOT NULL,
    `request_type` ENUM('buyer_request', 'supplier_offer', 'partnership') NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `category` VARCHAR(160) NOT NULL,
    `target_market` VARCHAR(160) NOT NULL DEFAULT 'Rwanda',
    `details` TEXT NOT NULL,
    `status` ENUM('submitted', 'in_review', 'accepted', 'declined') NOT NULL DEFAULT 'submitted',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `reference`(`reference`),
    INDEX `idx_client_requests_user_created`(`submitted_by`, `created_at`),
    INDEX `idx_client_requests_status_created`(`status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engagements` (
    `id` CHAR(32) NOT NULL,
    `reference` VARCHAR(32) NOT NULL,
    `request_id` CHAR(32) NOT NULL,
    `client_user_id` CHAR(32) NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `stage` ENUM('connect', 'introductions', 'bidding', 'procurement', 'delivery') NOT NULL DEFAULT 'connect',
    `status` ENUM('active', 'on_hold', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
    `value_usd` DECIMAL(15, 2) NULL,
    `buyer` VARCHAR(200) NOT NULL DEFAULT '',
    `supplier` VARCHAR(200) NOT NULL DEFAULT '',
    `owner` VARCHAR(160) NOT NULL DEFAULT '',
    `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    `needs_attention` BOOLEAN NOT NULL DEFAULT false,
    `next_action` VARCHAR(500) NULL,
    `next_action_due` DATE NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `reference`(`reference`),
    UNIQUE INDEX `request_id`(`request_id`),
    INDEX `idx_engagements_client_updated`(`client_user_id`, `updated_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engagement_milestones` (
    `id` CHAR(32) NOT NULL,
    `engagement_id` CHAR(32) NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `due_date` DATE NULL,
    `is_complete` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_milestones_order`(`engagement_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engagement_updates` (
    `id` CHAR(32) NOT NULL,
    `engagement_id` CHAR(32) NOT NULL,
    `author_user_id` CHAR(32) NULL,
    `visibility` ENUM('client', 'internal') NOT NULL DEFAULT 'client',
    `update_type` ENUM('progress', 'milestone', 'document', 'decision', 'blocker') NOT NULL DEFAULT 'progress',
    `title` VARCHAR(220) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_updates_engagement_visibility_date`(`engagement_id`, `visibility`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenders` (
    `id` CHAR(32) NOT NULL,
    `reference` VARCHAR(32) NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `entity` VARCHAR(200) NOT NULL,
    `category` VARCHAR(160) NOT NULL DEFAULT '',
    `portal` VARCHAR(160) NOT NULL DEFAULT '',
    `portal_url` VARCHAR(1000) NOT NULL DEFAULT '',
    `deadline` DATE NULL,
    `value_usd` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `status` ENUM('monitoring', 'preparing', 'submitted', 'awarded', 'lost', 'cancelled') NOT NULL DEFAULT 'monitoring',
    `owner` VARCHAR(160) NOT NULL DEFAULT '',
    `notes` TEXT NOT NULL,
    `created_by` CHAR(32) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `reference`(`reference`),
    INDEX `idx_tenders_status_deadline`(`status`, `deadline`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipments` (
    `id` CHAR(32) NOT NULL,
    `reference` VARCHAR(32) NOT NULL,
    `cargo` VARCHAR(220) NOT NULL,
    `corridor` VARCHAR(180) NOT NULL DEFAULT '',
    `origin` VARCHAR(160) NOT NULL,
    `destination` VARCHAR(160) NOT NULL,
    `progress` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `eta` DATE NULL,
    `clearance` ENUM('pending', 'in_review', 'cleared', 'held') NOT NULL DEFAULT 'pending',
    `created_by` CHAR(32) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `reference`(`reference`),
    INDEX `idx_shipments_clearance_eta`(`clearance`, `eta`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipment_milestones` (
    `id` CHAR(32) NOT NULL,
    `shipment_id` CHAR(32) NOT NULL,
    `label` VARCHAR(220) NOT NULL,
    `event_date` DATE NULL,
    `is_complete` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_shipment_milestones_order`(`shipment_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_entries` (
    `id` CHAR(32) NOT NULL,
    `kind` ENUM('update', 'blocker', 'next_action', 'decision') NOT NULL,
    `reference` VARCHAR(32) NOT NULL,
    `message` TEXT NOT NULL,
    `author_user_id` CHAR(32) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_activity_created`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_preferences` (
    `user_id` CHAR(32) NOT NULL,
    `usd_to_rwf` DECIMAL(12, 4) NOT NULL DEFAULT 1420,
    `deadline_warning_days` SMALLINT UNSIGNED NOT NULL DEFAULT 7,
    `email_alerts` BOOLEAN NOT NULL DEFAULT true,
    `blocker_alerts` BOOLEAN NOT NULL DEFAULT true,
    `weekly_digest` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_settings` (
    `id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `legal_name` VARCHAR(200) NOT NULL DEFAULT 'LEAD MULTICHOICE ',
    `tax_id` VARCHAR(80) NOT NULL DEFAULT '',
    `email` VARCHAR(254) NULL,
    `phone` VARCHAR(40) NOT NULL DEFAULT '+250 788 312 338',
    `legal_address` VARCHAR(500) NOT NULL DEFAULT 'Remera, Kigali, Rwanda',
    `website_url` VARCHAR(500) NULL,
    `updated_by` CHAR(32) NULL,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_assets` (
    `id` CHAR(32) NOT NULL,
    `public_id` VARCHAR(255) NOT NULL,
    `secure_url` VARCHAR(1200) NOT NULL,
    `format` VARCHAR(20) NOT NULL,
    `bytes` INTEGER UNSIGNED NOT NULL,
    `width` INTEGER UNSIGNED NOT NULL,
    `height` INTEGER UNSIGNED NOT NULL,
    `alt_text` VARCHAR(500) NOT NULL DEFAULT '',
    `uploaded_by` CHAR(32) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `public_id`(`public_id`),
    INDEX `idx_media_created`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_pages` (
    `id` CHAR(32) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `draft_content` JSON NULL,
    `published_content` JSON NULL,
    `updated_by` CHAR(32) NULL,
    `published_by` CHAR(32) NULL,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `published_at` DATETIME(0) NULL,

    UNIQUE INDEX `slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_sessions` ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opportunities` ADD CONSTRAINT `fk_opportunities_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_requests` ADD CONSTRAINT `fk_client_requests_user` FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engagements` ADD CONSTRAINT `fk_engagement_request` FOREIGN KEY (`request_id`) REFERENCES `client_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engagements` ADD CONSTRAINT `fk_engagement_client` FOREIGN KEY (`client_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engagement_milestones` ADD CONSTRAINT `fk_milestones_engagement` FOREIGN KEY (`engagement_id`) REFERENCES `engagements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engagement_updates` ADD CONSTRAINT `fk_updates_engagement` FOREIGN KEY (`engagement_id`) REFERENCES `engagements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engagement_updates` ADD CONSTRAINT `fk_updates_author` FOREIGN KEY (`author_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenders` ADD CONSTRAINT `fk_tenders_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipments` ADD CONSTRAINT `fk_shipments_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment_milestones` ADD CONSTRAINT `fk_shipment_milestones_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_entries` ADD CONSTRAINT `fk_activity_author` FOREIGN KEY (`author_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_preferences` ADD CONSTRAINT `fk_admin_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_settings` ADD CONSTRAINT `fk_company_settings_editor` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_assets` ADD CONSTRAINT `fk_media_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `site_pages` ADD CONSTRAINT `fk_site_pages_editor` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `site_pages` ADD CONSTRAINT `fk_site_pages_publisher` FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
