CREATE TABLE IF NOT EXISTS strategy.reits_analysi (
    id             SERIAL PRIMARY KEY,
    data_cadastro  TIMESTAMP,
    ticket         VARCHAR(20),
    sector         VARCHAR(100),
    valor_atual    NUMERIC(16, 2),
    dividend_yield NUMERIC(16, 2),
    market_cap     NUMERIC(24, 2)
);
