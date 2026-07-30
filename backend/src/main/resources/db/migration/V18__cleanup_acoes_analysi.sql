DELETE FROM strategy.acoes_analysi
WHERE UPPER(ticket) NOT IN (
    SELECT UPPER(a.ticket)
    FROM strategy.tb_asset a
    INNER JOIN strategy.tb_category c  ON c.id  = a.category_id
    INNER JOIN strategy.tb_country  co ON co.id = a.country_id
    WHERE UPPER(c.name)   = 'AÇÕES'
    AND   UPPER(co.acronym) = 'BR'
);
