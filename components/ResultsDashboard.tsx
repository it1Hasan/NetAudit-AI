"use client";

import { useState } from "react";
import { AuditResult, Severity } from "@/lib/types";

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: "bg-red-950 border-red-600 text-red-300",
  high: "bg-orange-950 border-orange-600 text-orange-300",
  medium: "bg-yellow-950 border-yellow-600 text-yellow-300",
  low: "bg-blue-950 border-blue-600 text-blue-300",
};

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80
      ? "#22c55e"
      : score >= 50
      ? "#eab308"
      : score >= 25
      ? "#f97316"
      : "#dc2626";
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold border-8"
        style={{ borderColor: color, color }}
      >
        {score}
      </div>
      <span className="text-xs text-slate-400 mt-2">Security Score / 100</span>
    </div>
  );
}

function IssueCard({ issue }: { issue: AuditResult["issues"][number] }) {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    await navigator.clipboard.writeText(issue.remediation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-3 ${SEVERITY_STYLES[issue.severity]}`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded bg-black/30">
            {issue.severity}
          </span>
          <h3 className="font-semibold mt-1">{issue.title}</h3>
          <p className="text-sm text-slate-300 mt-1">{issue.explanation}</p>
          {issue.lineRef && (
            <p className="text-xs text-slate-400 mt-1">
              Reference: {issue.lineRef}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 bg-black/40 rounded-md p-3 relative">
        <pre className="text-xs whitespace-pre-wrap font-mono text-green-300">
          {issue.remediation}
        </pre>
        <button
          onClick={copyCommand}
          className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default function ResultsDashboard({ result }: { result: AuditResult }) {
  const grouped = SEVERITY_ORDER.map((sev) => ({
    severity: sev,
    issues: result.issues.filter((i) => i.severity === sev),
  })).filter((g) => g.issues.length > 0);

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <ScoreRing score={result.overallScore} />
        <div className="flex-1">
          <div className="text-sm text-slate-400 mb-1">
            Detected platform:{" "}
            <span className="text-slate-200 font-medium capitalize">
              {result.deviceType}
            </span>
          </div>
          <p className="text-slate-200">{result.summary}</p>
          <p className="text-sm text-slate-400 mt-2">
            {result.issues.length} issue{result.issues.length !== 1 && "s"} found
          </p>
        </div>
      </div>

      <div className="mt-6">
        {grouped.length === 0 && (
          <p className="text-slate-400">No issues detected. 🎉</p>
        )}
        {grouped.map((g) => (
          <div key={g.severity} className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-2">
              {g.severity} ({g.issues.length})
            </h2>
            {g.issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
