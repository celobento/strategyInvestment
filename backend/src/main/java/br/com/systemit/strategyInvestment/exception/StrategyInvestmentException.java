package br.com.systemit.strategyInvestment.exception;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;

public class StrategyInvestmentException extends RuntimeException {

    private ProcessingResultConstant result;

    public StrategyInvestmentException(ProcessingResultConstant result) {
        super(result.getId() + " - " + result.getDescription());
        this.result = result;
    }

    public ProcessingResultConstant getResult() {
        return result;
    }
}
