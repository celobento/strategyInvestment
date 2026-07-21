CREATE TABLE strategy.tb_goal (
    id              SERIAL PRIMARY KEY,
    description     VARCHAR(255)   NOT NULL,
    goal_value      NUMERIC(16, 2) NOT NULL,
    limit_date      DATE           NOT NULL,
    start_date      DATE           NOT NULL,
    monthly_rate    NUMERIC(8, 4)  NOT NULL,
    initial_balance NUMERIC(16, 2) NOT NULL DEFAULT 0,
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW()
);
