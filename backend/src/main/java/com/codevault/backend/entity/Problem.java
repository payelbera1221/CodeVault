package com.codevault.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "problems")
public class Problem {

    @Id
    private String id;

    private String title;

    private String slug;

    private String description;

    private String inputFormat;

    private String outputFormat;

    private List<String> constraints;

    private String difficulty;

    private List<String> topics;

    private List<String> techniques;

    private List<String> supportedLanguages;

    private String creatorId;

    private String status;

    private List<TestCase> testCases;

    private List<Solution> solutions;
}