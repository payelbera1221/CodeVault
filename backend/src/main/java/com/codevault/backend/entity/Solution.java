package com.codevault.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solution {

    private String approach;

    private String explanation;

    private String code;

    private String language;

    private String timeComplexity;

    private String spaceComplexity;
}