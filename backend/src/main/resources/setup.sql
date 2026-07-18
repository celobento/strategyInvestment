-- Run this script against the `strategy` database after creating it.
-- Order matters: tables with foreign keys come after their dependencies.

CREATE SCHEMA IF NOT EXISTS strategy;
CREATE SCHEMA IF NOT EXISTS auth;

-- Enum type
CREATE TYPE investor_profile AS ENUM ('Aggressive', 'Moderate', 'Conservative');

-- No-dependency tables
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
    roles varchar[]
);

-- Tables with foreign keys
CREATE TABLE strategy.tb_asset (
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    ticket VARCHAR(20) UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    sector_id BIGINT,
    segment_id BIGINT,
    category_id BIGINT,
    country_id BIGINT,
    FOREIGN KEY (sector_id) REFERENCES strategy.tb_sector(id),
    FOREIGN KEY (segment_id) REFERENCES strategy.tb_segment(id),
    FOREIGN KEY (category_id) REFERENCES strategy.tb_category(id),
    FOREIGN KEY (country_id) REFERENCES strategy.tb_country(id)
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
    asset_id BIGINT,
    FOREIGN KEY (asset_id) REFERENCES strategy.tb_asset(id)
);

CREATE TABLE strategy.tb_wallet (
    id serial PRIMARY KEY NOT NULL,
    created_date timestamp NOT NULL,
    current_value numeric(16,2) DEFAULT 0.0,
    dividend_yeld numeric(16,2) DEFAULT 0.0,
    name varchar(100),
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES auth.tb_user(id)
);

-- Seed data
INSERT INTO strategy.tb_category (name, description) VALUES
    ('AÇÕES', 'Ações da B3'),
    ('FII', 'Fundos Imobiliários'),
    ('REIT', 'REITS'),
    ('STOCK', 'Stocks'),
    ('ETF Exterior', 'ETF');

INSERT INTO strategy.tb_sector (name, description) VALUES
    ('Retail', 'Retail'),
    ('Logistica', 'Logistica'),
    ('Financeiro e Outros', 'Financeiro'),
    ('Materiais Básicos', 'MB'),
    ('Utilidade Pública', 'CA'),
    ('Fundo Misto', 'Fundo Misto'),
    ('Fundo de Papel', 'Fundo de Papel'),
    ('Fundo de Tijolo', 'Fundo de Tijolo');

INSERT INTO strategy.tb_country (name, acronym) VALUES
    ('Brasil', 'BR'),
    ('United State', 'US'),
    ('Canadá', 'CA');

INSERT INTO strategy.tb_segment (name, description) VALUES
    ('Fundo de Fundos', 'Fundo de Fundos'),
    ('Shopping', 'Shopping'),
    ('Misto', 'Misto'),
    ('Lajes Corporativas', 'Lajes Corporativas'),
    ('Papéis', 'Papéis'),
    ('Imóveis Industriais e Logísticos', 'Imóveis Industriais e Logísticos'),
    ('Fundo de Desenvolvimento', 'Fundo de Desenvolvimento'),
    ('Varejo', 'Varejo'),
    ('Papel e Celulose', 'Papel e Celulose'),
    ('Bancos', 'Bancos'),
    ('Utilidade Pública', 'Energia Elétrica'),
    ('Seguradora', 'Seguradora');

INSERT INTO strategy.tb_broker (name, website) VALUES
    ('Clear', 'www.clear.com.br'),
    ('Rico', 'www.rico.com.br'),
    ('Avenue', 'www.avenue.com.br');
