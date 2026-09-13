"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Confetti from "../../../components/Confetti";

interface TestCaseResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error: string | null;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
}

interface SubmissionResult {
  accepted: boolean;
  passedTests: number;
  totalTests: number;
  testResults: TestCaseResult[];
  message: string;
}

interface Solution {
  approach: string;
  explanation: string;
  code: string;
  language: string;
  timeComplexity: string;
  spaceComplexity: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  publicTest: boolean;
}

interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  difficulty: string;
  topics: string[];
  techniques: string[];
  supportedLanguages: string[];
  testCases: TestCase[];
  solutions: Solution[];
}

const API_URL = "http://localhost:8080";

const DEFAULT_JAVA_CODE = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        // Write your solution here

        sc.close();
    }
}`;

const FALLBACK_PROBLEMS: Record<string, Problem> = {
  p1: {
    id: "p1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hashing"],
    techniques: ["Hash Map", "Two Pointers"],
    supportedLanguages: ["JAVA"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputFormat: "First line contains n. Second line contains n space-separated integers. Third line contains target integer.",
    outputFormat: "Print the two space-separated 0-based indices.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", publicTest: true },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2", publicTest: true }
    ],
    solutions: [
      {
        approach: "Hash Map (One-Pass)",
        explanation: "Store complement in map to achieve O(N) time.",
        code: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                System.out.println(map.get(complement) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n        sc.close();\n    }\n}`,
        language: "JAVA",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N)"
      }
    ]
  },
  p2: {
    id: "p2",
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Medium",
    topics: ["Binary Search", "Arrays"],
    techniques: ["Divide and Conquer"],
    supportedLanguages: ["JAVA"],
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.",
    inputFormat: "First line contains n. Second line contains n sorted integers. Third line contains target integer.",
    outputFormat: "Print the index of target, or -1 if not found.",
    constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4"],
    testCases: [
      { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", publicTest: true },
      { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1", publicTest: true }
    ],
    solutions: [
      {
        approach: "Iterative Binary Search",
        explanation: "Binary search in sorted array.",
        code: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        int left = 0, right = n - 1, ans = -1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) { ans = mid; break; }\n            else if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        System.out.println(ans);\n        sc.close();\n    }\n}`,
        language: "JAVA",
        timeComplexity: "O(log N)",
        spaceComplexity: "O(1)"
      }
    ]
  },
  p3: {
    id: "p3",
    title: "Longest Common Subsequence",
    slug: "longest-common-subsequence",
    difficulty: "Hard",
    topics: ["Dynamic Programming", "Strings"],
    techniques: ["2D DP", "Bottom-Up"],
    supportedLanguages: ["JAVA"],
    description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    inputFormat: "First line contains text1. Second line contains text2.",
    outputFormat: "Print the length of the longest common subsequence.",
    constraints: ["1 <= text1.length, text2.length <= 1000"],
    testCases: [
      { input: "abcde\nace", expectedOutput: "3", publicTest: true },
      { input: "abc\nabc", expectedOutput: "3", publicTest: true }
    ],
    solutions: []
  }
};

export default function SolvePage() {
  const params = useParams();
  const router = useRouter();

  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [language, setLanguage] = useState("JAVA");
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const [input, setInput] = useState("");

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);

  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  useEffect(() => {
    if (!problemId) return;

    fetch(`${API_URL}/api/problems/${problemId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Problem not found");
        }

        return response.json();
      })
      .then((data: Problem) => {
        setProblem(data);

        // Use first supported language
        if (data.supportedLanguages?.length > 0) {
          const firstLanguage = data.supportedLanguages[0];
          setLanguage(firstLanguage);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        if (FALLBACK_PROBLEMS[problemId]) {
          setProblem(FALLBACK_PROBLEMS[problemId]);
        } else {
          setPageError("Could not load this problem from backend.");
        }
        setLoading(false);
      });
  }, [problemId]);

  const handleRunCode = async () => {
    setRunning(true);
    setExecutionResult(null);
    setSubmissionResult(null);

    try {
      const response = await fetch(`${API_URL}/api/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
          input,
        }),
      });

      const data: ExecutionResult = await response.json();

      setExecutionResult(data);
    } catch (error) {
      console.error(error);

      setExecutionResult({
        success: false,
        output: "",
        error: "Could not connect to the CodeVault backend.",
        executionTime: 0,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setExecutionResult(null);
    setSubmissionResult(null);

    try {
      const response = await fetch(`${API_URL}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId,
          language,
          code,
        }),
      });

      const data: SubmissionResult = await response.json();

      setSubmissionResult(data);
    } catch (error) {
      console.error(error);

      setSubmissionResult({
        accepted: false,
        passedTests: 0,
        totalTests: 0,
        testResults: [],
        message: "Could not connect to the CodeVault backend.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const loadExample = () => {
    if (!problem?.solutions || problem.solutions.length === 0) {
      return;
    }

    const javaSolution = problem.solutions.find(
      (solution) => solution.language === "JAVA"
    );

    if (javaSolution) {
      setCode(javaSolution.code);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070b14] p-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="card-3d rounded-2xl p-8 text-center text-slate-400">
            <span className="skeleton inline-block h-4 w-40 rounded" />
            <p className="mt-4">Loading problem...</p>
          </div>
        </div>
      </main>
    );
  }

  if (pageError || !problem) {
    return (
      <main className="min-h-screen bg-[#070b14] p-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-8 text-red-400 backdrop-blur-md">
            {pageError || "Problem not found."}
          </div>

          <button
            onClick={() => router.back()}
            className="button-3d mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {submissionResult?.accepted && <Confetti fire={submissionResult.accepted} />}

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              ← Back to Problems
            </button>

            <h1 className="gradient-text mt-2 text-2xl font-bold">
              {problem.title}
            </h1>
          </div>

          <span
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              (problem.difficulty || "").toUpperCase() === "EASY"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : (problem.difficulty || "").toUpperCase() === "MEDIUM"
                ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                : "border-rose-400/20 bg-rose-400/10 text-rose-300"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
      </header>

      {/* Workspace */}
      <div className="mx-auto grid max-w-[1600px] gap-5 p-5 lg:grid-cols-2">
        {/* LEFT SIDE - Problem */}
        <section className="glass-panel rounded-2xl">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Problem Description
            </h2>
          </div>

          <div className="max-h-[calc(100vh-150px)] overflow-y-auto p-6">
            <p className="text-base leading-7 text-slate-300">
              {problem.description}
            </p>

            {/* Input */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white">
                Input Format
              </h3>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                {problem.inputFormat}
              </p>
            </div>

            {/* Output */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white">
                Output Format
              </h3>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                {problem.outputFormat}
              </p>
            </div>

            {/* Constraints */}
            {problem.constraints?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">
                  Constraints
                </h3>

                <ul className="mt-3 space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <li
                      key={index}
                      className="rounded-md border border-white/10 bg-slate-950/60 px-4 py-2 font-mono text-sm text-slate-400"
                    >
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topics */}
            {problem.topics?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">
                  Topics
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Techniques */}
            {problem.techniques?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white">
                  Techniques
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.techniques.map((technique) => (
                    <span
                      key={technique}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Public Test Cases */}
            {problem.testCases?.filter((test) => test.publicTest).length >
              0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">
                  Examples
                </h3>

                <div className="mt-4 space-y-4">
                  {problem.testCases
                    .filter((test) => test.publicTest)
                    .map((test, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-white/10 bg-slate-950/60 p-4"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            Input
                          </p>

                          <pre className="mt-2 text-sm text-slate-300">
                            {test.input}
                          </pre>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            Expected Output
                          </p>

                          <pre className="mt-2 text-sm text-green-400">
                            {test.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT SIDE - Editor */}
        <section className="glass-panel rounded-2xl">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <label
                htmlFor="language"
                className="text-sm text-slate-400"
              >
                Language
              </label>

              <select
                id="language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  setExecutionResult(null);
                  setSubmissionResult(null);
                }}
                className="rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-400/50"
              >
                {problem.supportedLanguages?.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadExample}
              className="button-3d rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400/40 hover:text-white"
            >
              Load Example
            </button>
          </div>

          {/* Code Editor */}
          <div className="p-5">
            <textarea
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setExecutionResult(null);
                setSubmissionResult(null);
              }}
              spellCheck={false}
              className="h-[420px] w-full resize-none rounded-lg border border-white/10 bg-slate-950/60 p-5 font-mono text-sm leading-6 text-emerald-300 outline-none transition focus:border-cyan-400/50"
              placeholder="Write your solution here..."
            />
          </div>

          {/* Custom Input */}
          <div className="px-5 pb-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Custom Input
              </h3>

              <button
                onClick={() => setInput("")}
                className="text-xs text-slate-500 hover:text-white"
              >
                Clear
              </button>
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="h-28 w-full resize-none rounded-lg border border-white/10 bg-slate-950/60 p-4 font-mono text-sm text-white outline-none transition focus:border-cyan-400/50"
              placeholder="Enter input for your program..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 border-t border-white/10 p-5">
            <button
              onClick={handleRunCode}
              disabled={running || submitting}
              className="button-3d flex-1 rounded-lg border border-cyan-400/40 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? "Running..." : "▶ Run Code"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={running || submitting}
              className="button-3d flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "✓ Submit"}
            </button>
          </div>

          {/* Execution Result */}
          {executionResult && (
            <div className="pop-in border-t border-white/10 p-5">
              <h3 className="mb-3 text-lg font-semibold">
                Execution Result
              </h3>

              <div
                className={`rounded-lg border p-4 backdrop-blur-sm ${
                  executionResult.success
                    ? "border-emerald-400/20 bg-emerald-400/10"
                    : "border-rose-400/20 bg-rose-400/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      executionResult.success
                        ? "font-semibold text-green-400"
                        : "font-semibold text-red-400"
                    }
                  >
                    {executionResult.success
                      ? "✓ Execution Successful"
                      : "✗ Execution Failed"}
                  </span>

                  <span className="text-xs text-slate-500">
                    {executionResult.executionTime} ms
                  </span>
                </div>

                {executionResult.output && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                      Output
                    </p>

                    <pre className="overflow-x-auto rounded-md bg-black p-4 font-mono text-sm text-green-400">
                      {executionResult.output}
                    </pre>
                  </div>
                )}

                {executionResult.error && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase text-red-400">
                      Error
                    </p>

                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-black p-4 font-mono text-sm text-red-400">
                      {executionResult.error}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Result */}
          {submissionResult && (
            <div className="pop-in border-t border-white/10 p-5">
              <div
                className={`rounded-lg border p-5 backdrop-blur-sm ${
                  submissionResult.accepted
                    ? "ring-pulse border-emerald-400/30 bg-emerald-400/10"
                    : "border-rose-400/20 bg-rose-400/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-xl font-bold ${
                      submissionResult.accepted
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    {submissionResult.accepted
                      ? "✓ Accepted"
                      : "✗ Wrong Answer"}
                  </h3>

                  <span className="text-sm text-slate-400">
                    {submissionResult.passedTests}/
                    {submissionResult.totalTests} tests passed
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {submissionResult.message}
                </p>

                {submissionResult.testResults?.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {submissionResult.testResults.map((test, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border p-4 ${
                          test.passed
                            ? "border-emerald-400/20 bg-emerald-400/10"
                            : "border-rose-400/20 bg-rose-400/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${
                              test.passed
                                ? "text-emerald-300"
                                : "text-rose-300"
                            }`}
                          >
                            Test Case {index + 1}{" "}
                            {test.passed ? "✓" : "✗"}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase text-slate-500">
                              Input
                            </p>

                            <pre className="mt-1 overflow-x-auto text-sm text-slate-300">
                              {test.input}
                            </pre>
                          </div>

                          <div>
                            <p className="text-xs uppercase text-slate-500">
                              Expected
                            </p>

                            <pre className="mt-1 overflow-x-auto text-sm text-green-400">
                              {test.expectedOutput}
                            </pre>
                          </div>

                          <div>
                            <p className="text-xs uppercase text-slate-500">
                              Actual
                            </p>

                            <pre className="mt-1 overflow-x-auto text-sm text-yellow-400">
                              {test.actualOutput}
                            </pre>
                          </div>
                        </div>

                        {test.error && (
                          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-md bg-black p-3 text-xs text-red-400">
                            {test.error}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}