-- Wallet ↔ Asset association
CREATE TABLE strategy.tb_wallet_asset (
    id         BIGSERIAL PRIMARY KEY,
    wallet_id  INTEGER NOT NULL REFERENCES strategy.tb_wallet(id) ON DELETE CASCADE,
    asset_id   INTEGER NOT NULL REFERENCES strategy.tb_asset(id)  ON DELETE CASCADE,
    added_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (wallet_id, asset_id)
);

-- Wallet strategy allocations (category → target percentage)
CREATE TABLE strategy.tb_wallet_strategy (
    id          BIGSERIAL PRIMARY KEY,
    wallet_id   INTEGER        NOT NULL REFERENCES strategy.tb_wallet(id) ON DELETE CASCADE,
    category_id INTEGER        NOT NULL REFERENCES strategy.tb_category(id),
    percent     NUMERIC(5, 2)  NOT NULL CHECK (percent > 0 AND percent <= 100),
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    UNIQUE (wallet_id, category_id)
);
