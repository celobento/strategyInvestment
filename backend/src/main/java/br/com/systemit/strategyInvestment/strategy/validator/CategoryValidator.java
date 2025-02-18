package br.com.systemit.strategyInvestment.strategy.validator;

import br.com.systemit.strategyInvestment.constants.ProcessingResultConstant;
import br.com.systemit.strategyInvestment.exception.StrategyInvestmentException;
import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CategoryValidator {

    private final CategoryRepository categoryRepository;

    public void validateNewCategory(Category category){
        if(categoryNameExists(category)) {
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_ALREADY_EXISTS);
        }
    }

    private boolean categoryNameExists(Category category) {
        Optional<Category> categoryTemp = categoryRepository.findByNameIgnoreCase(category.getName());
        return categoryTemp.isPresent();

    }

    public void validateUpdateCategory(Category category) {
        validateIdExists(category.getId());
    }

    private void validateIdExists(Integer id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if(categoryOptional.isEmpty()){
            throw new StrategyInvestmentException(ProcessingResultConstant.ERROR_NOT_FOUND);
        }
    }

    public Optional<Category> validateDeleteCategory(Integer id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        validateIdExists(id);
        return categoryOptional;
    }
}
