ALTER TABLE strategy.tb_dividend_entry
  ADD COLUMN wallet_id INTEGER REFERENCES strategy.tb_wallet(id) ON DELETE CASCADE;

ALTER TABLE strategy.tb_dividend_entry
  DROP CONSTRAINT uq_dividend_category_month_year;

ALTER TABLE strategy.tb_dividend_entry
  ADD CONSTRAINT uq_dividend_wallet_category_month_year
  UNIQUE (wallet_id, category, month, year);
