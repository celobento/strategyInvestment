-- Increase asset type description limit from 250 to 500 characters
ALTER TABLE strategy.tb_asset_type
    ALTER COLUMN description TYPE VARCHAR(500);
