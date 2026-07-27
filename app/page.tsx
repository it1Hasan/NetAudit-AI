"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, ensureAnonymousAuth } from "@/lib/firebase";
import { AuditResult } from "@/lib/types";
import ConfigInput from "@/components/ConfigInput";
import ResultsDashboard from "@/components/ResultsDashboard";

export default function Home() {
  const [config, setConfig] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Audit failed");
      }

      setResult(data);

      // Save to Firestore under the visitor's anonymous session
      try {
        const user = await ensureAnonymousAuth();
        await addDoc(collection(db, "audits"), {
          userId: user.uid,
          deviceType: data.deviceType,
          overallScore: data.overallScore,
          summary: data.summary,
          issues: data.issues,
          configPreview: config.slice(0, 300),
          createdAt: serverTimestamp(),
        });
      } catch (saveErr) {
        // Don't block the UX if saving history fails
        console.error("Failed to save audit history:", saveErr);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            NetAudit <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Paste a Cisco IOS or MikroTik config. Get an instant AI security
            audit with severity scoring and exact CLI fixes.
          </p>
        </div>
        <Link
          href="/history"
          className="text-sm px-4 py-2 rounded-md border border-slate-700 hover:bg-slate-800 transition whitespace-nowrap"
        >
          View History
        </Link>
      </header>

      <ConfigInput
        value={config}
        onChange={setConfig}
        onSubmit={runAudit}
        loading={loading}
      />

      {error && (
        <div className="mt-4 bg-red-950 border border-red-700 text-red-300 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {result && <ResultsDashboard result={result} />}
    </main>
  );
}
