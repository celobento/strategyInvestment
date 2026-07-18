-- Add country FK to tb_category (nullable so existing rows are not broken)
ALTER TABLE strategy.tb_category
    ADD COLUMN IF NOT EXISTS country_id INTEGER REFERENCES strategy.tb_country(id);
