-- Pustakalaya schema
-- Re-runnable development schema: drops and recreates all tables.

CREATE DATABASE IF NOT EXISTS pustakalaya
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pustakalaya;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS admins;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Authors ───────────────────────────────────────────────────────────────
CREATE TABLE authors (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  bio        TEXT,
  specialty  VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_authors_name (name)
) ENGINE = InnoDB;

-- ── Genres ────────────────────────────────────────────────────────────────
CREATE TABLE genres (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(255) NOT NULL UNIQUE,
  description    TEXT,
  shelf_location VARCHAR(255),
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- ── Books ─────────────────────────────────────────────────────────────────
CREATE TABLE books (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title              VARCHAR(255) NOT NULL,
  author_id          INT UNSIGNED NOT NULL,
  genre_id           INT UNSIGNED NOT NULL,
  isbn               VARCHAR(20) UNIQUE,
  archive_ref        VARCHAR(50),
  description        TEXT,
  cover_image_url    VARCHAR(500),
  published_year     SMALLINT UNSIGNED,
  total_copies       INT UNSIGNED NOT NULL DEFAULT 1,
  available_copies   INT UNSIGNED NOT NULL DEFAULT 1,
  condition_level    VARCHAR(50),
  restoration_log    VARCHAR(255),
  low_stock_threshold INT UNSIGNED NOT NULL DEFAULT 3,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_books_author
    FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE RESTRICT,
  CONSTRAINT fk_books_genre
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE RESTRICT,
  CONSTRAINT chk_books_available_not_above_total
    CHECK (available_copies <= total_copies),
  INDEX idx_books_author (author_id),
  INDEX idx_books_genre (genre_id),
  INDEX idx_books_title (title)
) ENGINE = InnoDB;

-- ── Admins (Archivist accounts) ───────────────────────────────────────────
CREATE TABLE admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;
