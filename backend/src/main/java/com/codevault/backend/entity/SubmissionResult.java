package com.codevault.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResult {

    private boolean accepted;

    private int passedTests;

    private int totalTests;

    private List<TestCaseResult> testResults;

    private String message;
}