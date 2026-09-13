package com.codevault.backend.controller;

import com.codevault.backend.entity.Problem;
import com.codevault.backend.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:3000")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    // Get all problems
    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    // IMPORTANT: /search comes before /{id}
    @GetMapping("/search")
    public List<Problem> searchProblems(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String technique) {
        return problemService.searchProblems(
                difficulty,
                topic,
                technique);
    }

    // Get by difficulty
    @GetMapping("/difficulty/{difficulty}")
    public List<Problem> getByDifficulty(
            @PathVariable String difficulty) {
        return problemService.getByDifficulty(difficulty);
    }

    // Get by topic
    @GetMapping("/topic/{topic}")
    public List<Problem> getByTopic(
            @PathVariable String topic) {
        return problemService.getByTopic(topic);
    }

    // Get by technique
    @GetMapping("/technique/{technique}")
    public List<Problem> getByTechnique(
            @PathVariable String technique) {
        return problemService.getByTechnique(technique);
    }

    // Get by ID
    @GetMapping("/{id}")
    public Problem getProblem(
            @PathVariable String id) {
        return problemService.getProblemById(id);
    }

    // Create problem
    @PostMapping
    public Problem createProblem(
            @RequestBody Problem problem) {
        return problemService.createProblem(problem);
    }

    // Delete problem
    @DeleteMapping("/{id}")
    public void deleteProblem(
            @PathVariable String id) {
        problemService.deleteProblem(id);
    }

    // Update problem
    @PutMapping("/{id}")
    public Problem updateProblem(
            @PathVariable String id,
            @RequestBody Problem problem) {
        return problemService.updateProblem(id, problem);
    }
}