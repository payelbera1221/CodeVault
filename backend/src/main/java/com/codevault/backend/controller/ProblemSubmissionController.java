package com.codevault.backend.controller;

import com.codevault.backend.entity.ProblemSubmission;
import com.codevault.backend.entity.SubmissionResult;
import com.codevault.backend.service.ProblemSubmissionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class ProblemSubmissionController {

    private final ProblemSubmissionService submissionService;

    public ProblemSubmissionController(
            ProblemSubmissionService submissionService) {

        this.submissionService = submissionService;
    }

    @PostMapping
    public SubmissionResult submit(
            @RequestBody ProblemSubmission submission) {

        return submissionService.submit(submission);
    }
}