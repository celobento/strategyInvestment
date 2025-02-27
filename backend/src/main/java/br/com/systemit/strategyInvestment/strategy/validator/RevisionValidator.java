package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.Revision;
import br.com.systemit.strategyInvestment.strategy.repository.RevisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RevisionValidator {

    private final RevisionRepository revisionRepository;

    private Optional<Revision> validateIdExists(Integer id) {
        Optional<Revision> revisionOptional = revisionRepository.findById(id);
        if(revisionOptional.isEmpty()){
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND);
        }
        return revisionOptional;
    }

    public Optional<Revision> validateDeleteRevision(Integer id) {
        return validateIdExists(id);
    }
}
