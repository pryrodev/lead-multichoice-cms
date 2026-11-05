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
