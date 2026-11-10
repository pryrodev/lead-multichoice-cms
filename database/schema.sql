-- Import this file into the MySQL/MariaDB database created in cPanel.
-- This schema contains account, service request, engagement, milestone and update records.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(32) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  organization VARCHAR(200) NOT NULL,
  phone VARCHAR(40) NULL,
  role ENUM('buyer', 'supplier', 'admin') NOT NULL DEFAULT 'buyer',
  password_hash VARCHAR(180) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_active (role, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_sessions (
  id CHAR(32) PRIMARY KEY,
  user_id CHAR(32) NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS opportunities (
  id CHAR(32) PRIMARY KEY,
  reference VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(220) NOT NULL,
  type ENUM('public_tender', 'institutional_procurement', 'direct_buyer_requirement', 'supplier_led', 'other') NOT NULL,
  buyer VARCHAR(200) NOT NULL DEFAULT '',
  source VARCHAR(200) NOT NULL DEFAULT '',
  source_url VARCHAR(1000) NOT NULL DEFAULT '',
  external_reference VARCHAR(120) NOT NULL DEFAULT '',
  country VARCHAR(120) NOT NULL DEFAULT '',
  sector VARCHAR(160) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  published_at DATE NULL,
  deadline DATE NULL,
  estimated_value DECIMAL(15,2) NULL,
  potential_supplier VARCHAR(200) NOT NULL DEFAULT '',
  owner VARCHAR(160) NOT NULL,
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status ENUM('new', 'under_assessment', 'qualified', 'pursuing', 'monitoring', 'awaiting_information', 'preparing_submission', 'submitted', 'under_evaluation', 'awarded', 'not_awarded', 'withdrawn', 'closed') NOT NULL DEFAULT 'new',
  next_action VARCHAR(500) NOT NULL DEFAULT '',
  next_action_due DATE NULL,
  closure_reason TEXT NOT NULL,
  created_by CHAR(32) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_opportunities_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_opportunities_status_created (status, created_at),
  INDEX idx_opportunities_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS client_requests (
  id CHAR(32) PRIMARY KEY,
  reference VARCHAR(32) NOT NULL UNIQUE,
  submitted_by CHAR(32) NOT NULL,
  request_type ENUM('buyer_request', 'supplier_offer', 'partnership') NOT NULL,
  title VARCHAR(220) NOT NULL,
  category VARCHAR(160) NOT NULL,
  target_market VARCHAR(160) NOT NULL DEFAULT 'Rwanda',
  details TEXT NOT NULL,
  status ENUM('submitted', 'in_review', 'accepted', 'declined') NOT NULL DEFAULT 'submitted',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_client_requests_user FOREIGN KEY (submitted_by) REFERENCES users(id),
  INDEX idx_client_requests_user_created (submitted_by, created_at),
  INDEX idx_client_requests_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS engagements (
  id CHAR(32) PRIMARY KEY,
  reference VARCHAR(32) NOT NULL UNIQUE,
  request_id CHAR(32) NOT NULL UNIQUE,
  client_user_id CHAR(32) NOT NULL,
  title VARCHAR(220) NOT NULL,
  stage ENUM('connect', 'introductions', 'bidding', 'procurement', 'delivery') NOT NULL DEFAULT 'connect',
  status ENUM('active', 'on_hold', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
  value_usd DECIMAL(15,2) NULL,
  buyer VARCHAR(200) NOT NULL DEFAULT '',
  supplier VARCHAR(200) NOT NULL DEFAULT '',
  owner VARCHAR(160) NOT NULL DEFAULT '',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  needs_attention TINYINT(1) NOT NULL DEFAULT 0,
  next_action VARCHAR(500) NULL,
  next_action_due DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_engagement_request FOREIGN KEY (request_id) REFERENCES client_requests(id),
  CONSTRAINT fk_engagement_client FOREIGN KEY (client_user_id) REFERENCES users(id),
  INDEX idx_engagements_client_updated (client_user_id, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS engagement_milestones (
  id CHAR(32) PRIMARY KEY,
  engagement_id CHAR(32) NOT NULL,
  title VARCHAR(220) NOT NULL,
  due_date DATE NULL,
  is_complete TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_milestones_engagement FOREIGN KEY (engagement_id) REFERENCES engagements(id) ON DELETE CASCADE,
  INDEX idx_milestones_order (engagement_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS engagement_updates (
  id CHAR(32) PRIMARY KEY,
  engagement_id CHAR(32) NOT NULL,
  author_user_id CHAR(32) NULL,
  visibility ENUM('client', 'internal') NOT NULL DEFAULT 'client',
  update_type ENUM('progress', 'milestone', 'document', 'decision', 'blocker') NOT NULL DEFAULT 'progress',
  title VARCHAR(220) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_updates_engagement FOREIGN KEY (engagement_id) REFERENCES engagements(id) ON DELETE CASCADE,
  CONSTRAINT fk_updates_author FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_updates_engagement_visibility_date (engagement_id, visibility, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tenders (
  id CHAR(32) PRIMARY KEY,
  reference VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(220) NOT NULL,
  entity VARCHAR(200) NOT NULL,
  category VARCHAR(160) NOT NULL DEFAULT '',
  portal VARCHAR(160) NOT NULL DEFAULT '',
  portal_url VARCHAR(1000) NOT NULL DEFAULT '',
  deadline DATE NULL,
  value_usd DECIMAL(15,2) NOT NULL DEFAULT 0,
  status ENUM('monitoring', 'preparing', 'submitted', 'awarded', 'lost', 'cancelled') NOT NULL DEFAULT 'monitoring',
  owner VARCHAR(160) NOT NULL DEFAULT '',
  notes TEXT NOT NULL,
  created_by CHAR(32) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tenders_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tenders_status_deadline (status, deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shipments (
  id CHAR(32) PRIMARY KEY,
  reference VARCHAR(32) NOT NULL UNIQUE,
  cargo VARCHAR(220) NOT NULL,
  corridor VARCHAR(180) NOT NULL DEFAULT '',
  origin VARCHAR(160) NOT NULL,
  destination VARCHAR(160) NOT NULL,
  progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
  eta DATE NULL,
  clearance ENUM('pending', 'in_review', 'cleared', 'held') NOT NULL DEFAULT 'pending',
  created_by CHAR(32) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_shipments_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_shipments_clearance_eta (clearance, eta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shipment_milestones (
  id CHAR(32) PRIMARY KEY,
  shipment_id CHAR(32) NOT NULL,
  label VARCHAR(220) NOT NULL,
  event_date DATE NULL,
  is_complete TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shipment_milestones_shipment FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  INDEX idx_shipment_milestones_order (shipment_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_entries (
  id CHAR(32) PRIMARY KEY,
  kind ENUM('update', 'blocker', 'next_action', 'decision') NOT NULL,
  reference VARCHAR(32) NOT NULL,
  message TEXT NOT NULL,
  author_user_id CHAR(32) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_author FOREIGN KEY (author_user_id) REFERENCES users(id),
  INDEX idx_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_preferences (
  user_id CHAR(32) PRIMARY KEY,
  usd_to_rwf DECIMAL(12,4) NOT NULL DEFAULT 1420,
  deadline_warning_days SMALLINT UNSIGNED NOT NULL DEFAULT 7,
  email_alerts TINYINT(1) NOT NULL DEFAULT 1,
  blocker_alerts TINYINT(1) NOT NULL DEFAULT 1,
  weekly_digest TINYINT(1) NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS company_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  legal_name VARCHAR(200) NOT NULL DEFAULT 'Lead Multi-Choice ® ',
  tax_id VARCHAR(80) NOT NULL DEFAULT '',
  email VARCHAR(254) NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '+250 788 312 338',
  legal_address VARCHAR(500) NOT NULL DEFAULT 'Remera, Kigali, Rwanda',
  website_url VARCHAR(500) NULL,
  updated_by CHAR(32) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_company_settings_editor FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO company_settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS media_assets (
  id CHAR(32) PRIMARY KEY,
  public_id VARCHAR(255) NOT NULL UNIQUE,
  secure_url VARCHAR(1200) NOT NULL,
  format VARCHAR(20) NOT NULL,
  bytes INT UNSIGNED NOT NULL,
  width INT UNSIGNED NOT NULL,
  height INT UNSIGNED NOT NULL,
  alt_text VARCHAR(500) NOT NULL DEFAULT '',
  uploaded_by CHAR(32) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id),
  INDEX idx_media_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_pages (
  id CHAR(32) PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  draft_content JSON NULL,
  published_content JSON NULL,
  updated_by CHAR(32) NULL,
  published_by CHAR(32) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at DATETIME NULL,
  CONSTRAINT fk_site_pages_editor FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_site_pages_publisher FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
