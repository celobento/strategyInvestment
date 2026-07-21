-- INSERT NEW assets from carteira-patrimonio-mbf.xlsx
-- Target: strategy.tb_asset
-- Excel unique: 89 | already exist: 63 | to insert: 26
-- Skipped existing: BBAS3, BBDC3, BBSE3, CXSE3, EGIE3, ISAE4, KLBN4, PETR4, PSSA3, RANI3, SANB3, SAPR11, TAEE11, VALE3, BRCR11, BTHF11, CPTS11, DEVA11, GGRC11, HFOF11, HSML11, IRDM11, IRIM11, JSRE11, LVBI11, RBVA11, SNEL11, TGAR11, TRXF11, VILG11, VINO11, VISC11, XPLG11, XPML11, SELIC26, ABBV, AMD, COIN, ENB, MAIN, TD, VZ, ADC, AMT, DLR, LTC, MAA, NNN, NSA, O, PSA, SPG, STAG, SUI, VICI, WPC, DHS, JEPI, JEPQ, PFF, SPHD, TFLO, VOO
-- Tesouro tickets shortened: tesouro-ipca-2045→IPCA45, tesouro-ipca-com-juros-semestrais-2026→IPCAJ26,
--   tesouro-prefixado-com-juros-semestrais-2029→PREJ29, tesouro-selic-2026→SELIC26 (already exists)

INSERT INTO strategy.tb_asset
  (name, ticket, description, country_id, category_id, sector_id, segment_id, income_type, created_at, updated_at)
VALUES
  ('Cemig PN', 'CMIG4', 'Ações', 1, 1, 5, 11, 'VARIABLE', NOW(), NOW()),
  ('Copasa', 'CSMG3', 'Ações', 1, 1, 5, 11, 'VARIABLE', NOW(), NOW()),
  ('Itausa PN', 'ITSA4', 'Ações', 1, 1, 3, 10, 'VARIABLE', NOW(), NOW()),
  ('Itau Unibanco ON', 'ITUB3', 'Ações', 1, 1, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Hectare CE', 'HCTR11', 'FIIs', 1, 2, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('CSHG Logistica', 'HGLG11', 'FIIs', 1, 2, 8, 6, 'VARIABLE', NOW(), NOW()),
  ('CSHG Real Estate', 'HGRE11', 'FIIs', 1, 2, 8, 4, 'VARIABLE', NOW(), NOW()),
  ('Kinea Rendimentos Imobiliarios', 'KNCR11', 'FIIs', 1, 2, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Rio Bravo Fundamental', 'RBFM11', 'FIIs', 1, 2, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Tesouro IPCA 2045', 'IPCA45', 'Tesouro', 1, 6, NULL, NULL, 'FIXED', NOW(), NOW()),
  ('Tesouro IPCA Juros 2026', 'IPCAJ26', 'Tesouro', 1, 6, NULL, NULL, 'FIXED', NOW(), NOW()),
  ('Tesouro Prefixado Juros 2029', 'PREJ29', 'Tesouro', 1, 6, NULL, NULL, 'FIXED', NOW(), NOW()),
  ('Bank of America', 'BAC', 'Stocks', 2, 4, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Cisco', 'CSCO', 'Stocks', 2, 4, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Coca-Cola', 'KO', 'Stocks', 2, 4, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('ONEOK', 'OKE', 'Stocks', 2, 4, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Royal Bank of Canada', 'RY', 'Stocks', 2, 4, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Southern Company', 'SO', 'Stocks', 2, 4, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Aave', 'AAVE', 'Cripto', 2, 7, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Bitcoin', 'BTC', 'Cripto', 2, 7, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Ethereum', 'ETH', 'Cripto', 2, 7, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Solana', 'SOL', 'Cripto', 2, 7, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Uniswap', 'UNI', 'Cripto', 2, 7, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('XRP', 'XRP', 'Cripto', 2, 7, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('iShares Gold Trust', 'IAU', 'ETF Exterior', 2, 5, NULL, NULL, 'VARIABLE', NOW(), NOW()),
  ('Invesco QQQ Trust', 'QQQ', 'ETF Exterior', 2, 5, NULL, NULL, 'VARIABLE', NOW(), NOW());

-- Total inserts: 26