package br.com.systemit.strategyInvestment.strategy.constants;

public enum InvestorProfile {
    CONSERVATIVE(   0, "low risc"),
    MODERATE (      1, "middle risc"),
    AGGRESSIVE (    2, "high risc");

    private final Integer code;
    private final String description;

    private InvestorProfile(Integer code, String description) {
        this.code = code;
        this.description = description;
    }

}
