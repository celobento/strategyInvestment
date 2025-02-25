package br.com.systemit.strategyInvestment.constants;

public enum ProcessingResultConstant {

    ERROR_ALREADY_EXISTS(							 401, "Record Already exists"),
    ERROR_NOT_PERMITED(							     403, "Access not permited"),
    ERROR_NOT_FOUND(							     404, "Record not found"),
    ERROR_NOT_CATALOGED(							 999, "Error not cataloged");

    private Integer id;
    private String description;

    public int getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    ProcessingResultConstant(Integer id, String description) {
        this.id = id;
        this.description = description;
    }

    public static ProcessingResultConstant findById(Integer id) {

        ProcessingResultConstant[] resultados = values();

        for (ProcessingResultConstant resultado : resultados) {

            if (resultado.getId() == id) {

                return resultado;

            }

        }

        return null;
    }
}
