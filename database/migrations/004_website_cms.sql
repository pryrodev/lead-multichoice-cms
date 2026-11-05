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
