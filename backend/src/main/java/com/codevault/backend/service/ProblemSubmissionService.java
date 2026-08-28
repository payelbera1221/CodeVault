package com.codevault.backend.service;

import com.codevault.backend.entity.ExecutionResult;
import com.codevault.backend.entity.Problem;
import com.codevault.backend.entity.ProblemSubmission;
import com.codevault.backend.entity.SubmissionResult;
import com.codevault.backend.entity.TestCase;
import com.codevault.backend.entity.TestCaseResult;
import com.codevault.backend.execution.JavaCodeExecutor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProblemSubmissionService {

    private final ProblemService problemService;
    private final JavaCodeExecutor javaCodeExecutor;

    public ProblemSubmissionService(
            ProblemService problemService,
            JavaCodeExecutor javaCodeExecutor) {

        this.problemService = problemService;
        this.javaCodeExecutor = javaCodeExecutor;
    }

    public SubmissionResult submit(ProblemSubmission submission) {

        Problem problem = problemService.getProblemById(submission.getProblemId());

        if (!"JAVA".equalsIgnoreCase(submission.getLanguage())) {

            return new SubmissionResult(
                    false,
                    0,
                    0,
                    new ArrayList<>(),
                    "Currently only JAVA is supported.");
        }

        List<TestCase> testCases = problem.getTestCases();

        if (testCases == null || testCases.isEmpty()) {

            return new SubmissionResult(
                    false,
                    0,
                    0,
                    new ArrayList<>(),
                    "This problem has no test cases.");
        }

        List<TestCaseResult> results = new ArrayList<>();

        int passedTests = 0;

        for (TestCase testCase : testCases) {

            ExecutionResult executionResult = javaCodeExecutor.execute(
                    submission.getCode(),
                    testCase.getInput());

            String actualOutput = executionResult.getOutput();

            boolean passed = executionResult.isSuccess()
                    && normalize(actualOutput)
                            .equals(normalize(testCase.getExpectedOutput()));

            if (passed) {
                passedTests++;
            }

            results.add(
                    new TestCaseResult(
                            passed,
                            testCase.isPublicTest()
                                    ? testCase.getInput()
                                    : "HIDDEN",

                            testCase.isPublicTest()
                                    ? testCase.getExpectedOutput()
                                    : "HIDDEN",

                            testCase.isPublicTest()
                                    ? actualOutput
                                    : (passed ? "HIDDEN" : actualOutput),
                            executionResult.getError()));

            // Stop immediately if compilation/runtime error occurs.
            if (!executionResult.isSuccess()) {
                break;
            }
        }

        boolean accepted = passedTests == testCases.size();

        String message;

        if (accepted) {

            message = "Accepted";

        } else if (!results.isEmpty()
                && results.get(results.size() - 1).getError() != null
                && !results.get(results.size() - 1).getError().isBlank()) {

            String error = results.get(results.size() - 1).getError();

            if (error.contains("error:")
                    || error.contains("cannot find symbol")
                    || error.contains("';' expected")
                    || error.contains("illegal start")) {

                message = "Compilation Error";

            } else {

                message = "Runtime Error";
            }

        } else {

            message = "Wrong Answer";
        }

        return new SubmissionResult(
                accepted,
                passedTests,
                testCases.size(),
                results,
                message);
    }

    private String normalize(String value) {

        if (value == null) {
            return "";
        }

        return value.trim()
                .replaceAll("\\s+", " ");
    }
}