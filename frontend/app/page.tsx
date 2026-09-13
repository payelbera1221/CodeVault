"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import TiltCard from "./components/TiltCard";

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  topics?: string[];
  description: string;
};

const mockProblems: Problem[] = [
  { id: "p1", title: "Two Sum", difficulty: "Easy", topics: ["Arrays", "Hashing"], description: "Find two numbers that add up to a target." },
  { id: "p2", title: "Binary Search", difficulty: "Medium", topics: ["Binary Search"], description: "Search in a sorted array efficiently." },
  { id: "p3", title: "Longest Common Subsequence", difficulty: "Hard", topics: ["Dynamic Programming"], description: "DP on sequences to maximize matches." },
];

const difficultyStyle: Record<string, string> = {
  Easy: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  Medium: "bg-amber-400/15 text-amber-300 border-amber-400/20",
  Hard: "bg-rose-400/15 text-rose-300 border-rose-400/20",
  EASY: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  MEDIUM: "bg-amber-400/15 text-amber-300 border-amber-400/20",
  HARD: "bg-rose-400/15 text-rose-300 border-rose-400/20",
};

export default function Page() {
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    fetch("http://localhost:8080/api/problems")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Problem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setProblems(data);
        }
      })
      .catch(() => {
        // Graceful fallback to mock problems
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.topics && p.topics.some((t) => t.toLowerCase().includes(search.toLowerCase())));
      const matchDiff =
        selectedDifficulty === "All" ||
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchSearch && matchDiff;
    });
  }, [problems, search, selectedDifficulty]);

  return (
    <main className="px-6 py-8 w-full max-w-7xl mx-auto">
      {/* Hero with depth */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="blob-float w-80 h-80 bg-sky-500/20 rounded-full absolute -left-20 -top-10 filter blur-3xl" />
          <div className="blob-float-slow w-96 h-96 bg-violet-400/20 rounded-full absolute -right-12 -bottom-12 filter blur-3xl" />
        </div>
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div className="rise-in">
            <p className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-sm">
              Fast, fun, modern coding
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Build, solve, and ship in a more immersive coding UI.
            </h1>
            <p className="mt-4 text-sm text-slate-200 max-w-xl">
              A premium 3D-inspired frontend with depth, motion, and accessible polish — without sacrificing speed.
            </p>
          </div>
          <TiltCard
            className="rise-in rounded-2xl p-6 flex items-center justify-center h-48 md:h-64"
            style={{ animationDelay: "100ms" } as React.CSSProperties}
          >
            <div className="text-center">
              <div className="text-sm uppercase tracking-wider text-slate-300 mb-2">Live stats</div>
              <div className="text-3xl font-semibold text-white">
                {loading ? "Loading…" : `${problems.length} problems in Vault`}
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search problems or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedDifficulty === diff
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </section>

      {/* 3D problem cards row */}
      <section aria-label="Problems" className="mt-8">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Problems ({filteredProblems.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((p, index) => (
            <TiltCard
              key={p.id}
              className="rise-in rounded-2xl p-5 flex flex-col justify-between"
              style={{ animationDelay: `${index * 90}ms` } as React.CSSProperties}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">{p.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${
                      difficultyStyle[p.difficulty] ??
                      "bg-cyan-400/15 text-cyan-300 border-cyan-400/20"
                    }`}
                  >
                    {p.difficulty}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300 line-clamp-2" title={p.description}>
                  {p.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.topics?.map((t) => (
                    <span key={t} className="text-xs bg-white/5 text-slate-200 px-2 py-1 rounded-full border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between pt-3 border-t border-white/5">
                <Link
                  href={`/problems/${p.id}`}
                  className="text-xs text-slate-400 hover:text-cyan-300 transition underline underline-offset-4"
                >
                  View details
                </Link>
                <Link
                  href={`/problems/${p.id}/solve`}
                  className="button-3d bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-400 transition"
                >
                  Solve Challenge
                </Link>
              </div>
            </TiltCard>
          ))}
          {loading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="card-3d rounded-2xl p-5">
                <div className="skeleton w-24 h-4 rounded" />
                <div className="mt-3 skeleton w-4/5 h-3 rounded" />
                <div className="mt-3 skeleton w-3/5 h-3 rounded" />
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}

