CREATE TABLE IF NOT EXISTS public.fii_analysi (
    id                      SERIAL PRIMARY KEY,
    ticket                  VARCHAR(20)     NOT NULL,
    segmento                VARCHAR(100),
    vlr_atual               NUMERIC(16, 4),
    yield                   NUMERIC(10, 4),
    p_vp                    NUMERIC(10, 4),
    fator_renda             NUMERIC(10, 4),
    ult_rend                NUMERIC(16, 4),
    rend_12m                NUMERIC(16, 4),
    rend_medio_12m          NUMERIC(16, 4),
    rend_mensal_medio_24m   NUMERIC(16, 4),
    liquidez_media_diaria   NUMERIC(20, 2),
    data_ult_rend           DATE,
    prox_rend               NUMERIC(16, 4),
    data_prox_rend          DATE,
    ult_atualizacao         TIMESTAMP
);
