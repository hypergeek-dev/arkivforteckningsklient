-- SCHEMA & DB --

CREATE SCHEMA IF NOT EXISTS ihp;

SET
  search_path TO ihp,
  public;

ALTER DATABASE ihp
SET
  search_path TO ihp,
  public;

-- END SCHEMA & DB --