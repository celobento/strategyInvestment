CREATE TABLE IF NOT EXISTS strategy.acoes_analysi (
    id                          SERIAL PRIMARY KEY,
    data_cadastro               TIMESTAMP,
    ticket                      VARCHAR(10),
    setor                       VARCHAR(100),
    segmento                    VARCHAR(100),
    valor_atual                 NUMERIC(16, 2),
    dividend_yield              NUMERIC(16, 2),
    fator_renda                 NUMERIC(16, 2),
    ultimo_rendimento           NUMERIC(16, 4),
    rendimento_12m              NUMERIC(16, 4),
    rendimento_medio_12m        NUMERIC(16, 4),
    rendimento_mensal_medio_24m NUMERIC(16, 4),
    liquidez_media_diaria       NUMERIC(20, 2)
);
