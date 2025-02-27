package br.com.systemit.strategyInvestment.exception;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.dto.Validations;

public class StrategyInvestmentException extends RuntimeException {

    private ProcessingResultConstant result;
    private Validations validation;

    public StrategyInvestmentException(ProcessingResultConstant result) {
        super(result.getId() + " - " + result.getDescription());
        this.result = result;
    }

    public StrategyInvestmentException(ProcessingResultConstant result,  Validations validation) {
        super(result.getId() + " - " + result.getDescription());
        this.result = result;
        this.validation = validation;
    }

    public ProcessingResultConstant getResult() {
        return result;
    }

    public Validations getValidation() {
        return validation;
    }
}
