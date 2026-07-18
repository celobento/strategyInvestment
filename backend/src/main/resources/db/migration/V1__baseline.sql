-- Baseline: represents the initial schema already present in the database.
-- Flyway will NOT run this script (baselineOnMigrate=true, baselineVersion=1).
-- It is kept here for documentation purposes only.

CREATE SCHEMA IF NOT EXISTS strategy;
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE strategy.tb_category (
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

CREATE TABLE strategy.tb_sector (
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

CREATE TABLE strategy.tb_country (
    id serial PRIMARY KEY NOT NULL,
    name varchar(50) NOT NULL,
    acronym varchar(3) NOT NULL
);

CREATE TABLE strategy.tb_segment (
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

CREATE TABLE strategy.tb_broker (
    id serial PRIMARY KEY NOT NULL,
    name varchar(100),
    website varchar(250)
);

CREATE TABLE auth.tb_user (
    id serial PRIMARY KEY NOT NULL,
    created_date timestamp NOT NULL,
    username varchar(50) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    last_password varchar(200) NOT NULL,
    first_access boolean DEFAULT TRUE NOT NULL,
    email varchar(150) NOT NULL UNIQUE,
    roles varchar[],
    name VARCHAR(200),
    avatar_url VARCHAR(500)
);

CREATE TABLE strategy.tb_asset (
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    ticket VARCHAR(20) UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    sector_id BIGINT REFERENCES strategy.tb_sector(id),
    segment_id BIGINT REFERENCES strategy.tb_segment(id),
    category_id BIGINT REFERENCES strategy.tb_category(id),
    country_id BIGINT REFERENCES strategy.tb_country(id)
);

CREATE TABLE strategy.tb_revision (
    id serial PRIMARY KEY NOT NULL,
    created_date timestamp NOT NULL,
    current_value numeric(16,2),
    dividend_yeld numeric(16,2),
    income_factor numeric(16,2),
    pvp numeric(16,2),
    last_income numeric(16,2),
    date_last_income date NOT NULL,
    next_income numeric(16,2),
    date_next_income date,
    notes varchar(500),
    asset_id BIGINT REFERENCES strategy.tb_asset(id)
);

CREATE TABLE strategy.tb_wallet (
    id serial PRIMARY KEY NOT NULL,
    created_date timestamp NOT NULL,
    current_value numeric(16,2) DEFAULT 0.0,
    dividend_yeld numeric(16,2) DEFAULT 0.0,
    name varchar(100),
    user_id BIGINT REFERENCES auth.tb_user(id)
);

CREATE TABLE auth.tb_oauth_account (
    id serial PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.tb_user(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT NOW(),
    UNIQUE (provider, provider_account_id)
);
