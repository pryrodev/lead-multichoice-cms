-- Apply once to databases created from the earlier schema.sql.
ALTER TABLE engagements
  ADD COLUMN buyer VARCHAR(200) NOT NULL DEFAULT '' AFTER value_usd,
  ADD COLUMN supplier VARCHAR(200) NOT NULL DEFAULT '' AFTER buyer,
  ADD COLUMN owner VARCHAR(160) NOT NULL DEFAULT '' AFTER supplier,
  ADD COLUMN priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium' AFTER owner,
  ADD COLUMN needs_attention TINYINT(1) NOT NULL DEFAULT 0 AFTER priority;

CREATE TABLE IF NOT EXISTS tenders (
 id CHAR(32) PRIMARY KEY, reference VARCHAR(32) NOT NULL UNIQUE, title VARCHAR(220) NOT NULL, entity VARCHAR(200) NOT NULL,
 category VARCHAR(160) NOT NULL DEFAULT '', portal VARCHAR(160) NOT NULL DEFAULT '', portal_url VARCHAR(1000) NOT NULL DEFAULT '',
 deadline DATE NULL, value_usd DECIMAL(15,2) NOT NULL DEFAULT 0,
 status ENUM('monitoring','preparing','submitted','awarded','lost','cancelled') NOT NULL DEFAULT 'monitoring',
 owner VARCHAR(160) NOT NULL DEFAULT '', notes TEXT NOT NULL, created_by CHAR(32) NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_tenders_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
 INDEX idx_tenders_status_deadline (status, deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shipments (
 id CHAR(32) PRIMARY KEY, reference VARCHAR(32) NOT NULL UNIQUE, cargo VARCHAR(220) NOT NULL,
 corridor VARCHAR(180) NOT NULL DEFAULT '', origin VARCHAR(160) NOT NULL, destination VARCHAR(160) NOT NULL,
 progress TINYINT UNSIGNED NOT NULL DEFAULT 0, eta DATE NULL,
 clearance ENUM('pending','in_review','cleared','held') NOT NULL DEFAULT 'pending', created_by CHAR(32) NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_shipments_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
 INDEX idx_shipments_clearance_eta (clearance, eta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shipment_milestones (
 id CHAR(32) PRIMARY KEY, shipment_id CHAR(32) NOT NULL, label VARCHAR(220) NOT NULL, event_date DATE NULL,
 is_complete TINYINT(1) NOT NULL DEFAULT 0, sort_order INT NOT NULL DEFAULT 0, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_shipment_milestones_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
 INDEX idx_shipment_milestones_order (shipment_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_entries (
 id CHAR(32) PRIMARY KEY, kind ENUM('update','blocker','next_action','decision') NOT NULL,
 reference VARCHAR(32) NOT NULL, message TEXT NOT NULL, author_user_id CHAR(32) NOT NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_activity_author FOREIGN KEY (author_user_id) REFERENCES users(id), INDEX idx_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_preferences (
 user_id CHAR(32) PRIMARY KEY, usd_to_rwf DECIMAL(12,4) NOT NULL DEFAULT 1420,
 deadline_warning_days SMALLINT UNSIGNED NOT NULL DEFAULT 7, email_alerts TINYINT(1) NOT NULL DEFAULT 1,
 blocker_alerts TINYINT(1) NOT NULL DEFAULT 1, weekly_digest TINYINT(1) NOT NULL DEFAULT 0,
 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_admin_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
