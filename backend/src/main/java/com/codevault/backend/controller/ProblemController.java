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

    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public Problem getProblem(@PathVariable String id) {
        return problemService.getProblemById(id);
    }

    @PostMapping
    public Problem createProblem(@RequestBody Problem problem) {
        return problemService.createProblem(problem);
    }

    @PutMapping("/{id}")
    public Problem updateProblem(
            @PathVariable String id,
            @RequestBody Problem problem) {
        return problemService.updateProblem(id, problem);
    }

    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable String id) {
        problemService.deleteProblem(id);
    }

    @GetMapping("/difficulty/{difficulty}")
    public List<Problem> getByDifficulty(
            @PathVariable String difficulty) {
        return problemService.getByDifficulty(difficulty);
    }

    @GetMapping("/topic/{topic}")
    public List<Problem> getByTopic(
            @PathVariable String topic) {
        return problemService.getByTopic(topic);
    }

    @GetMapping("/technique/{technique}")
    public List<Problem> getByTechnique(
            @PathVariable String technique) {
        return problemService.getByTechnique(technique);
    }
}