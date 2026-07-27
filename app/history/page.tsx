"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuditRecord } from "@/lib/types";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
};

export default function HistoryPage() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "audits"),
            where("userId", "==", user.uid)
          );
          
          const snap = await getDocs(q);
          const data = snap.docs.map((d) => {
            const raw = d.data();
            return {
              id: d.id,
              deviceType: raw.deviceType,
              overallScore: raw.overallScore,
              summary: raw.summary,
              issues: raw.issues || [],
              configPreview: raw.configPreview,
              createdAt: raw.createdAt?.toMillis?.() ?? Date.now(),
            } as AuditRecord;
          });

          data.sort((a, b) => b.createdAt - a.createdAt);
          
          setRecords(data);
        } catch (err) {
          console.error("Failed to load history:", err);
        }
      } else {
        setRecords([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this audit?")) return;
    
    try {
      await deleteDoc(doc(db, "audits", id));
      // Remove it from the UI instantly without reloading the page
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete audit:", err);
      alert("Failed to delete the audit. Check console for details.");
    }
  };

  const averageScore = records.length > 0 
    ? Math.round(records.reduce((acc, curr) => acc + curr.overallScore, 0) / records.length) 
    : 0;

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h1 className="text-2xl font-bold">Audit History</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="text-sm px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition hidden sm:block"
          >
            Export PDF
          </button>
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-md border border-slate-700 hover:bg-slate-800 transition"
          >
            New Audit
          </Link>
        </div>
      </div>

      {/* Enterprise Feature: Risk Posture Summary */}
      {!loading && records.length > 0 && (
        <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Risk Posture Summary</h2>
            <p className="text-sm text-slate-400">Based on your {records.length} previous audits</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${averageScore < 50 ? 'text-red-400' : 'text-green-400'}`}>
              {averageScore}/100
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Avg Score</div>
          </div>
        </div>
      )}

      {loading && <p className="text-slate-400">Loading history...</p>}

      {!loading && records.length === 0 && (
        <p className="text-slate-400">
          No audits yet in this session. Run your first audit from the home page.
        </p>
      )}

      <div className="space-y-4">
        {records.map((r) => (
          <div
            key={r.id}
            className="border border-slate-800 rounded-lg p-5 bg-slate-900 page-break-inside-avoid"
          >
            <div className="flex justify-between items-start gap-4">
              
              {/* LEFT COLUMN: Device Type, Summary, and Severity Badges */}
              <div className="flex-1">
                <span className="text-xs uppercase text-slate-500 font-bold tracking-widest">
                  {r.deviceType}
                </span>
                <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {r.summary}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-4 text-xs font-medium">
                  {["critical", "high", "medium", "low"].map((sev) => {
                    const count = r.issues.filter(
                      (i: any) => i.severity === sev
                    ).length;
                    if (!count) return null;
                    return (
                      <span key={sev} className={`${SEVERITY_COLOR[sev]} bg-slate-950 px-2 py-1 rounded`}>
                        {count} {sev.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Score, Date, and Delete Button */}
              <div className="text-right shrink-0 flex flex-col items-end">
                <div className="text-2xl font-bold">{r.overallScore}/100</div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <button 
                  onClick={() => handleDelete(r.id!)}
                  className="text-xs text-red-500 hover:text-red-400 mt-2 underline transition print:hidden"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
}