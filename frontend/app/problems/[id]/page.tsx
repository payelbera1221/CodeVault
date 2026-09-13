"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import TiltCard from "../../components/TiltCard";

type TestCase = {
  input: string;
  expectedOutput: string;
  publicTest: boolean;
};

type ProblemDetail = {
  id: string;
  title: string;
  difficulty: string;
  topics?: string[];
  techniques?: string[];
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  testCases?: TestCase[];
};

const fallbackProblems: Record<string, ProblemDetail> = {
  p1: {
    id: "p1",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hashing"],
    techniques: ["Hash Map", "Two Pointers"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputFormat: "First line contains n (number of elements). Second line contains n space-separated integers. Third line contains target integer.",
    outputFormat: "Print the two space-separated 0-based indices.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", publicTest: true },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2", publicTest: true }
    ]
  },
  p2: {
    id: "p2",
    title: "Binary Search",
    difficulty: "Medium",
    topics: ["Binary Search", "Arrays"],
    techniques: ["Divide and Conquer"],
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.",
    inputFormat: "First line contains n. Second line contains n sorted integers. Third line contains target integer.",
    outputFormat: "Print the index of target, or -1 if not found.",
    constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All integers in nums are unique", "nums is sorted in ascending order"],
    testCases: [
      { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", publicTest: true },
      { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1", publicTest: true }
    ]
  },
  p3: {
    id: "p3",
    title: "Longest Common Subsequence",
    difficulty: "Hard",
    topics: ["Dynamic Programming", "Strings"],
    techniques: ["2D DP", "Bottom-Up"],
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    inputFormat: "First line contains text1. Second line contains text2.",
    outputFormat: "Print the length of the longest common subsequence.",
    constraints: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters"],
    testCases: [
      { input: "abcde\nace", expectedOutput: "3", publicTest: true },
      { input: "abc\nabc", expectedOutput: "3", publicTest: true }
    ]
  }
};

const difficultyStyle: Record<string, string> = {
  Easy: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  Medium: "bg-amber-400/15 text-amber-300 border-amber-400/20",
  Hard: "bg-rose-400/15 text-rose-300 border-rose-400/20",
  EASY: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  MEDIUM: "bg-amber-400/15 text-amber-300 border-amber-400/20",
  HARD: "bg-rose-400/15 text-rose-300 border-rose-400/20",
};

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/api/problems/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Problem not found");
        return res.json();
      })
      .then((data: ProblemDetail) => {
        setProblem(data);
      })
      .catch(() => {
        if (fallbackProblems[id]) {
          setProblem(fallbackProblems[id]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 max-w-5xl mx-auto flex items-center justify-center">
        <div className="card-3d p-8 rounded-2xl text-slate-300 text-center">
          <div className="skeleton w-48 h-6 rounded mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading problem details...</p>
        </div>
      </main>
    );
  }

  if (!problem) {
    return (
      <main className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="card-3d p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-rose-400 mb-2">Problem Not Found</h2>
          <p className="text-slate-300 mb-6">We couldn&apos;t find the requested problem in the vault.</p>
          <Link href="/" className="button-3d bg-sky-500 text-white px-5 py-2.5 rounded-lg text-sm">
            ← Return to Problems
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 w-full max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
        >
          ← Back to all problems
        </Link>
        <Link
          href={`/problems/${problem.id}/solve`}
          className="button-3d bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition shadow-lg shadow-sky-500/25"
        >
          Solve in Workspace →
        </Link>
      </div>

      <TiltCard className="p-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">
              Problem #{problem.id}
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">{problem.title}</h1>
          </div>
          <span
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
              difficultyStyle[problem.difficulty] ??
              "bg-cyan-400/15 text-cyan-300 border-cyan-400/20"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Description
          </h2>
          <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </p>
        </div>

        {problem.inputFormat && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Input Format
            </h2>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-sm text-slate-300">
              {problem.inputFormat}
            </div>
          </div>
        )}

        {problem.outputFormat && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Output Format
            </h2>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-sm text-slate-300">
              {problem.outputFormat}
            </div>
          </div>
        )}

        {problem.constraints && problem.constraints.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Constraints
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
              {problem.constraints.map((c, idx) => (
                <li key={idx} className="font-mono text-xs text-slate-300">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {problem.testCases && problem.testCases.filter(t => t.publicTest).length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Example Test Cases
            </h2>
            <div className="space-y-4">
              {problem.testCases.filter(t => t.publicTest).map((tc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="text-xs font-semibold text-cyan-400 mb-2">Example {idx + 1}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400">Input:</span>
                      <pre className="mt-1 p-2 rounded bg-black/40 text-xs text-slate-200 font-mono whitespace-pre-wrap">
                        {tc.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Expected Output:</span>
                      <pre className="mt-1 p-2 rounded bg-black/40 text-xs text-emerald-300 font-mono whitespace-pre-wrap">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {problem.topics?.map((t) => (
              <span
                key={t}
                className="text-xs bg-white/5 text-slate-300 px-2.5 py-1 rounded-full border border-white/10"
              >
                {t}
              </span>
            ))}
            {problem.techniques?.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-cyan-500/10 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-400/20"
              >
                {tech}
              </span>
            ))}
          </div>
          <Link
            href={`/problems/${problem.id}/solve`}
            className="button-3d bg-sky-500 hover:bg-sky-400 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            Launch Solver Workspace →
          </Link>
        </div>
      </TiltCard>
    </main>
  );
}

