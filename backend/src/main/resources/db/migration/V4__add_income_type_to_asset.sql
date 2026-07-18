-- Add income type (FIXED / VARIABLE) to tb_asset
ALTER TABLE strategy.tb_asset
    ADD COLUMN IF NOT EXISTS income_type VARCHAR(20);
