-- Minimum income each asset should pay, stored per wallet strategy config
ALTER TABLE strategy.tb_wallet
    ADD COLUMN IF NOT EXISTS min_asset_pays NUMERIC(16, 2);
