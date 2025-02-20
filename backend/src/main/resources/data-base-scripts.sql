CREATE DABASE strategy;

CREATE SCHEMA strategy;

CREATE TABLE strategy.tb_category (
    id serial PRIMARY KEY not null,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

select * from strategy.tb_category;

CREATE TABLE strategy.tb_sector (
    id serial PRIMARY KEY not null,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

select * from strategy.tb_sector;

CREATE TYPE investor_profile AS ENUM ('Aggressive', 'Moderate', 'Conservative');

CREATE TABLE strategy.tb_country (
    id serial PRIMARY KEY NOT NULL,
    name varchar(50) NOT NULL,
    acronym varchar(3) NOT NULL
);

select * from strategy.tb_country;

CREATE TABLE strategy.tb_asset (
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    ticket VARCHAR(20) UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    sector_id BIGINT,
    category_id BIGINT,
    country_id BIGINT,
    FOREIGN KEY (sector_id) REFERENCES strategy.tb_sector(id),
    FOREIGN KEY (category_id) REFERENCES strategy.tb_category(id),
    FOREIGN KEY (country_id) REFERENCES strategy.tb_country(id)
);

select * from strategy.tb_asset;

CREATE TABLE strategy.tb_broker (
    id serial PRIMARY KEY NOT NULL,
    name varchar(100),
    website varchar(250)
);

select * from strategy.tb_broker;