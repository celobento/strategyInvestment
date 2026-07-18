-- Link asset to asset type
ALTER TABLE strategy.tb_asset
    ADD COLUMN IF NOT EXISTS asset_type_id INTEGER REFERENCES strategy.tb_asset_type(id);
