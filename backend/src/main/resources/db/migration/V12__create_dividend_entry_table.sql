CREATE TABLE strategy.tb_dividend_entry (
    id          SERIAL PRIMARY KEY,
    category    VARCHAR(100)   NOT NULL,
    month       SMALLINT       NOT NULL CHECK (month BETWEEN 1 AND 12),
    year        SMALLINT       NOT NULL,
    value       NUMERIC(16, 2) NOT NULL,
    currency    VARCHAR(3)     NOT NULL DEFAULT 'BRL',
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_dividend_category_month_year UNIQUE (category, month, year)
);
