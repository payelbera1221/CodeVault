package com.codevault.backend.repository;

import com.codevault.backend.entity.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProblemRepository extends MongoRepository<Problem, String> {

    List<Problem> findByDifficulty(String difficulty);

    List<Problem> findByTopicsContaining(String topic);

    List<Problem> findByTechniquesContaining(String technique);

    List<Problem> findBySupportedLanguagesContaining(String language);

    List<Problem> findByDifficultyAndTopicsContaining(
            String difficulty,
            String topic);

    List<Problem> findByDifficultyAndTechniquesContaining(
            String difficulty,
            String technique);

    List<Problem> findByTopicsContainingAndTechniquesContaining(
            String topic,
            String technique);

    List<Problem> findByDifficultyAndTopicsContainingAndTechniquesContaining(
            String difficulty,
            String topic,
            String technique);
}