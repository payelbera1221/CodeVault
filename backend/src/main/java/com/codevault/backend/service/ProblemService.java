package com.codevault.backend.service;

import com.codevault.backend.entity.Problem;
import com.codevault.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    // Get all problems
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    // Get problem by ID
    public Problem getProblemById(String id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    // Create problem
    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    // Update problem
    public Problem updateProblem(String id, Problem problem) {

        Problem existingProblem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        problem.setId(existingProblem.getId());

        return problemRepository.save(problem);
    }

    // Delete problem
    public void deleteProblem(String id) {
        problemRepository.deleteById(id);
    }

    // Get problems by difficulty
    public List<Problem> getByDifficulty(String difficulty) {
        return problemRepository.findByDifficulty(difficulty);
    }

    // Get problems by topic
    public List<Problem> getByTopic(String topic) {
        return problemRepository.findByTopicsContaining(topic);
    }

    // Get problems by technique
    public List<Problem> getByTechnique(String technique) {
        return problemRepository.findByTechniquesContaining(technique);
    }

    // Get problems by programming language
    public List<Problem> getByLanguage(String language) {
        return problemRepository.findBySupportedLanguagesContaining(language);
    }

    // Combined problem search
    public List<Problem> searchProblems(
            String difficulty,
            String topic,
            String technique) {

        // Difficulty + Topic + Technique
        if (difficulty != null && topic != null && technique != null) {
            return problemRepository
                    .findByDifficultyAndTopicsContainingAndTechniquesContaining(
                            difficulty,
                            topic,
                            technique);
        }

        // Difficulty + Topic
        if (difficulty != null && topic != null) {
            return problemRepository
                    .findByDifficultyAndTopicsContaining(
                            difficulty,
                            topic);
        }

        // Difficulty + Technique
        if (difficulty != null && technique != null) {
            return problemRepository
                    .findByDifficultyAndTechniquesContaining(
                            difficulty,
                            technique);
        }

        // Topic + Technique
        if (topic != null && technique != null) {
            return problemRepository
                    .findByTopicsContainingAndTechniquesContaining(
                            topic,
                            technique);
        }

        // Only difficulty
        if (difficulty != null) {
            return getByDifficulty(difficulty);
        }

        // Only topic
        if (topic != null) {
            return getByTopic(topic);
        }

        // Only technique
        if (technique != null) {
            return getByTechnique(technique);
        }

        // No filters
        return getAllProblems();
    }
}