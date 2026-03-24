CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(60) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_profile (
    user_id BIGINT NOT NULL,
    profile INTEGER NOT NULL,
    PRIMARY KEY (user_id, profile),
    CONSTRAINT fk_user_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    titulo VARCHAR(25) NOT NULL,
    description VARCHAR(500) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_task_user_id (user_id),
    CONSTRAINT fk_task_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;