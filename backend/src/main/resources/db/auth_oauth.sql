CREATE TABLE IF NOT EXISTS auth.tb_oauth_account (
    id serial PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.tb_user(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT NOW(),
    UNIQUE (provider, provider_account_id)
);

ALTER TABLE auth.tb_user ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE auth.tb_user ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
