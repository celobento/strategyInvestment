package br.com.systemit.strategyInvestment.handle;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.dto.Problem;
import br.com.systemit.strategyInvestment.dto.Validations;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandle {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Problem handleMethodArgumentNotValidException(MethodArgumentNotValidException methodArgumentNotValidException){
        List<Validations> errors = methodArgumentNotValidException
                                        .getFieldErrors()
                                        .stream()
                                        .map(erro -> new Validations(
                                                erro.getField(),
                                                erro.getDefaultMessage()))
                                        .collect(Collectors.toList());

        return new Problem(HttpStatus.BAD_REQUEST.value(), "Request with invalid format.", errors);
    }

    @ExceptionHandler(StrategyInvestmentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Problem handleStrategyInvestmentException(StrategyInvestmentException e) {
        return new Problem(e.getResult().getId(), e.getResult().getDescription(), List.of());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Problem handleRuntimeException(RuntimeException e){
        e.printStackTrace();
        return new Problem(ProcessingResultConstant.ERROR_NOT_CATALOGED.getId(), ProcessingResultConstant.ERROR_NOT_CATALOGED.getDescription(), List.of());
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Problem handleRuntimeAuthorizationDeniedException(AuthorizationDeniedException e){
        return new Problem(ProcessingResultConstant.ERROR_NOT_PERMITED.getId(), ProcessingResultConstant.ERROR_NOT_PERMITED.getDescription(), List.of());
    }


}
