-- Asset type table (e.g. Qualidade, Crescimento, Dividendo, Valor)
CREATE TABLE IF NOT EXISTS strategy.tb_asset_type (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);
