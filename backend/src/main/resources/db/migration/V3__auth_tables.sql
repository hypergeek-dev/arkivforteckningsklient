-- V3: Spring Security JDBC authentication tables.
-- Provides JDBC-backed user authentication with role-based access control.
-- Roles: ROLE_ARKIVANSVARIG, ROLE_ARKIVARIE, ROLE_LASARE

SET search_path TO ihp, public;

CREATE TABLE IF NOT EXISTS ihp_users (
  username VARCHAR(150) NOT NULL,
  password VARCHAR(200) NOT NULL,
  enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (username)
);

COMMENT ON TABLE  ihp_users          IS 'Autentiseringsuppgifter för systemanvändare (bcrypt-hashat lösenord)';
COMMENT ON COLUMN ihp_users.username IS 'Unikt användarnamn (kan vara e-post eller kortnamn)';
COMMENT ON COLUMN ihp_users.password IS 'Bcrypt-hashat lösenord — aldrig lagra klartext';
COMMENT ON COLUMN ihp_users.enabled  IS 'false = kontot är inaktiverat utan att raderas';

CREATE TABLE IF NOT EXISTS ihp_authorities (
  username  VARCHAR(150) NOT NULL,
  authority VARCHAR(50)  NOT NULL,
  PRIMARY KEY (username, authority),
  CONSTRAINT ihp_auth_user_fk FOREIGN KEY (username) REFERENCES ihp_users (username) ON DELETE CASCADE
);

COMMENT ON TABLE  ihp_authorities           IS 'Rollkoppling för systemanvändare';
COMMENT ON COLUMN ihp_authorities.authority IS 'Spring Security-roll: ROLE_ARKIVANSVARIG, ROLE_ARKIVARIE, eller ROLE_LASARE';

-- Default admin account for first-run setup.
-- Password: "changeme" bcrypt-hashed. MUST be changed before production use.
-- Replace this with a proper initial-user provisioning process.
INSERT INTO ihp_users (username, password, enabled)
VALUES ('admin', '$2a$12$8JhFJ9.3FrkM2aXH8N7IquJtWXNVjDSbPJNJkl1H5E2jL8VLKR5V6', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO ihp_authorities (username, authority)
VALUES ('admin', 'ROLE_ARKIVANSVARIG')
ON CONFLICT (username, authority) DO NOTHING;
