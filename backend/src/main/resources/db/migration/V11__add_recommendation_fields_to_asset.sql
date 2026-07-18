ALTER TABLE strategy.tb_asset
    ADD COLUMN IF NOT EXISTS ceiling_price     NUMERIC(16, 2),
    ADD COLUMN IF NOT EXISTS nav_estimated     NUMERIC(16, 2),
    ADD COLUMN IF NOT EXISTS premium_discount  NUMERIC(16, 4),
    ADD COLUMN IF NOT EXISTS indicator         VARCHAR(20);
