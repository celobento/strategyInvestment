package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Asset;
import br.com.systemit.strategyInvestment.strategy.model.Revision;
import br.com.systemit.strategyInvestment.strategy.repository.RevisionRepository;
import br.com.systemit.strategyInvestment.strategy.validator.RevisionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RevisionService {

    private final RevisionRepository revisionRepository;
    private final RevisionValidator validator;

    public Revision save(Revision revision) {
        return revisionRepository.save(revision);
    }

    public void delete(Integer id) {
        Optional<Revision> assetOptional = validator.validateDeleteRevision(id);
        revisionRepository.delete(assetOptional.get());
    }
}
