package com.codevault.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResult {

    private boolean passed;

    private String input;

    private String expectedOutput;

    private String actualOutput;

    private String error;
}