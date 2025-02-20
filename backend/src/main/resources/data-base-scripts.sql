CREATE DABASE strategy;

CREATE SCHEMA strategy;

CREATE TABLE strategy.tb_category (
    id serial PRIMARY KEY not null,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

insert into strategy.tb_category (name, description) values ('AÇÕES', 'Ações da B3');
insert into strategy.tb_category (name, description) values ('FII', 'Fundos Imobiliários');
insert into strategy.tb_category (name, description) values ('REIT', 'REITS');
insert into strategy.tb_category (name, description) values ('STOCK', 'Stocks');
insert into strategy.tb_category (name, description) values ('ETF Exterior', 'ETF');

select * from strategy.tb_category;

CREATE TABLE strategy.tb_sector (
    id serial PRIMARY KEY not null,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

insert into strategy.tb_sector (name, description) values ('Financeiro e Outros', 'Financeiro');
insert into strategy.tb_sector (name, description) values ('Materiais Básicos', 'MB');
insert into strategy.tb_sector (name, description) values ('Utilidade Pública', 'CA');
insert into strategy.tb_sector (name, description) values ('Retail', 'Retail');
insert into strategy.tb_sector (name, description) values ('Logistica', 'Logistica');

select * from strategy.tb_sector;

CREATE TYPE investor_profile AS ENUM ('Aggressive', 'Moderate', 'Conservative');

CREATE TABLE strategy.tb_country (
    id serial PRIMARY KEY NOT NULL,
    name varchar(50) NOT NULL,
    acronym varchar(3) NOT NULL
);

insert into strategy.tb_country (name, acronym) values ('Brasil', 'BR');
insert into strategy.tb_country (name, acronym) values ('United State', 'US');
insert into strategy.tb_country (name, acronym) values ('Canadá', 'CA');

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

insert into strategy.tb_broker (name, website) values ('Clear','www.clear.com.br');
insert into strategy.tb_broker (name, website) values ('Rico','www.rico.com.br');
insert into strategy.tb_broker (name, website) values ('Avenue','www.avenue.com.br');

select * from strategy.tb_broker;

CREATE TABLE strategy.tb_segment (
    id serial PRIMARY KEY not null,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

insert into strategy.tb_segment(name, description) values ('Fundo de Fundos', 'Fundo de Fundos');
insert into strategy.tb_segment(name, description) values ('Shopping', 'Fundo de Fundos');
insert into strategy.tb_segment(name, description) values ('Misto', 'Fundo de Fundos');
insert into strategy.tb_segment(name, description) values ('Lajes Corporativas', 'Lajes Corporativas');
insert into strategy.tb_segment(name, description) values ('Papéis', 'Papéis');
insert into strategy.tb_segment(name, description) values ('Imóveis Industriais e Logísticos', 'Imóveis Industriais e Logísticos');
insert into strategy.tb_segment(name, description) values ('Fundo de Desenvolvimento', 'Fundo de Desenvolvimento');
insert into strategy.tb_segment(name, description) values ('Varejo', 'Varejo');
insert into strategy.tb_segment(name, description) values ('Papel e Celulose', 'Papel e Celulose');
insert into strategy.tb_segment(name, description) values ('Bancos', 'Bancos');
insert into strategy.tb_segment(name, description) values ('Utilidade Pública', 'Energia Elétrica');
insert into strategy.tb_segment(name, description) values ('Seguradora', 'Seguradora');

select * from strategy.tb_segment;