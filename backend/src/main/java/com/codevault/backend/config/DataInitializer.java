package com.codevault.backend.config;

import com.codevault.backend.entity.Problem;
import com.codevault.backend.entity.Solution;
import com.codevault.backend.entity.TestCase;
import com.codevault.backend.repository.ProblemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    public DataInitializer(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) {
        if (problemRepository.count() > 0) {
            return;
        }

        Problem twoSum = new Problem();
        twoSum.setId("p1");
        twoSum.setTitle("Two Sum");
        twoSum.setSlug("two-sum");
        twoSum.setDifficulty("Easy");
        twoSum.setTopics(Arrays.asList("Arrays", "Hashing"));
        twoSum.setTechniques(Arrays.asList("Hash Map", "Two Pointers"));
        twoSum.setSupportedLanguages(List.of("JAVA"));
        twoSum.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.");
        twoSum.setInputFormat("First line contains n. Second line contains n space-separated integers. Third line contains target integer.");
        twoSum.setOutputFormat("Print the two space-separated 0-based indices.");
        twoSum.setConstraints(Arrays.asList("2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"));
        twoSum.setTestCases(Arrays.asList(
                new TestCase("4\n2 7 11 15\n9", "0 1", true),
                new TestCase("3\n3 2 4\n6", "1 2", true),
                new TestCase("2\n3 3\n6", "0 1", false)
        ));
        twoSum.setSolutions(List.of(
                new Solution(
                        "Hash Map (One-Pass)",
                        "Store each element and its index in a hash map as we iterate. For each element, check if target - element exists in the map.",
                        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                System.out.println(map.get(complement) + \" \" + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n        sc.close();\n    }\n}",
                        "JAVA",
                        "O(N)",
                        "O(N)"
                )
        ));

        Problem binarySearch = new Problem();
        binarySearch.setId("p2");
        binarySearch.setTitle("Binary Search");
        binarySearch.setSlug("binary-search");
        binarySearch.setDifficulty("Medium");
        binarySearch.setTopics(Arrays.asList("Binary Search", "Arrays"));
        binarySearch.setTechniques(List.of("Divide and Conquer"));
        binarySearch.setSupportedLanguages(List.of("JAVA"));
        binarySearch.setDescription("Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.");
        binarySearch.setInputFormat("First line contains n. Second line contains n sorted integers. Third line contains target integer.");
        binarySearch.setOutputFormat("Print the index of target, or -1 if not found.");
        binarySearch.setConstraints(Arrays.asList("1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All integers in nums are unique", "nums is sorted in ascending order"));
        binarySearch.setTestCases(Arrays.asList(
                new TestCase("6\n-1 0 3 5 9 12\n9", "4", true),
                new TestCase("6\n-1 0 3 5 9 12\n2", "-1", true),
                new TestCase("1\n5\n5", "0", false)
        ));
        binarySearch.setSolutions(List.of(
                new Solution(
                        "Iterative Binary Search",
                        "Maintain left and right pointers, check middle element and halve search space.",
                        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        int left = 0, right = n - 1;\n        int ans = -1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) {\n                ans = mid;\n                break;\n            } else if (nums[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        System.out.println(ans);\n        sc.close();\n    }\n}",
                        "JAVA",
                        "O(log N)",
                        "O(1)"
                )
        ));

        Problem lcs = new Problem();
        lcs.setId("p3");
        lcs.setTitle("Longest Common Subsequence");
        lcs.setSlug("longest-common-subsequence");
        lcs.setDifficulty("Hard");
        lcs.setTopics(Arrays.asList("Dynamic Programming", "Strings"));
        lcs.setTechniques(Arrays.asList("2D DP", "Bottom-Up"));
        lcs.setSupportedLanguages(List.of("JAVA"));
        lcs.setDescription("Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.");
        lcs.setInputFormat("First line contains text1. Second line contains text2.");
        lcs.setOutputFormat("Print the length of the longest common subsequence.");
        lcs.setConstraints(Arrays.asList("1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters"));
        lcs.setTestCases(Arrays.asList(
                new TestCase("abcde\nace", "3", true),
                new TestCase("abc\nabc", "3", true),
                new TestCase("abc\ndef", "0", false)
        ));
        lcs.setSolutions(List.of(
                new Solution(
                        "2D Dynamic Programming",
                        "Create a dp table where dp[i][j] is the LCS of prefixes text1[0..i-1] and text2[0..j-1].",
                        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s1 = sc.next();\n        String s2 = sc.next();\n        int m = s1.length(), n = s2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {\n                    dp[i][j] = dp[i - 1][j - 1] + 1;\n                } else {\n                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n                }\n            }\n        }\n        System.out.println(dp[m][n]);\n        sc.close();\n    }\n}",
                        "JAVA",
                        "O(M * N)",
                        "O(M * N)"
                )
        ));

        problemRepository.saveAll(Arrays.asList(twoSum, binarySearch, lcs));
    }
}
