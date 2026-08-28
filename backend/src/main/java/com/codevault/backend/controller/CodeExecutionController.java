package com.codevault.backend.controller;

import com.codevault.backend.entity.CodeSubmission;
import com.codevault.backend.entity.ExecutionResult;
import com.codevault.backend.execution.JavaCodeExecutor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@CrossOrigin(origins = "http://localhost:3000")
public class CodeExecutionController {

    private final JavaCodeExecutor javaCodeExecutor;

    public CodeExecutionController(
            JavaCodeExecutor javaCodeExecutor) {

        this.javaCodeExecutor = javaCodeExecutor;
    }

    @PostMapping
    public ExecutionResult executeCode(
            @RequestBody CodeSubmission submission) {

        if (!"JAVA".equalsIgnoreCase(
                submission.getLanguage())) {

            return new ExecutionResult(
                    false,
                    "",
                    "Currently only JAVA is supported.",
                    0);
        }

        return javaCodeExecutor.execute(
                submission.getCode(),
                submission.getInput());
    }
}