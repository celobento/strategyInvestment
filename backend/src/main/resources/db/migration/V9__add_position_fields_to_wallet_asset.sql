-- Portfolio position data per wallet asset
ALTER TABLE strategy.tb_wallet_asset
    ADD COLUMN IF NOT EXISTS quantity      INTEGER,
    ADD COLUMN IF NOT EXISTS medium_price  NUMERIC(16, 2),
    ADD COLUMN IF NOT EXISTS current_price NUMERIC(16, 2);
