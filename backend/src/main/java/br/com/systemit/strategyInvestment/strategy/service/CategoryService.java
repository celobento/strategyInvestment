package br.com.systemit.strategyInvestment.strategy.service;

import br.com.systemit.strategyInvestment.strategy.model.Category;
import br.com.systemit.strategyInvestment.strategy.repository.CategoryRepository;
import br.com.systemit.strategyInvestment.strategy.validator.CategoryValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryValidator validator;

    public List<Category> buscaPorNome(String nome) {
        return categoryRepository.findByNameContainingIgnoreCase(nome);
    }

    public Optional<Category> findById(Integer id)  {
        return categoryRepository.findById(id);
    }

    public List<Category> listaTodos() {
        return categoryRepository.findAll();
    }

    public List<Category> pesquisar(String name) {

        if (name != null && !name.isEmpty()) {
            return buscaPorNome(name);
        }
        return listaTodos();
    }

    public Category salvar(Category category) {
        validator.validateNewCategory(category);
        return categoryRepository.save(category);
    }

    public Category update(Category category) {
        validator.validateUpdateCategory(category);
        return categoryRepository.save(category);
    }

    public void delete(Integer id) {
        Optional<Category> categoryOptional = validator.validateDeleteCategory(id);
        categoryRepository.delete(categoryOptional.get());
    }
}
