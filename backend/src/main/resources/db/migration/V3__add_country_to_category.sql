-- Add country FK to tb_category
ALTER TABLE strategy.tb_category
    ADD COLUMN IF NOT EXISTS country_id INTEGER REFERENCES strategy.tb_country(id);
