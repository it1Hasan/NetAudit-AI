export type Severity = "critical" | "high" | "medium" | "low";

export interface AuditIssue {
  id: string;
  title: string;
  severity: Severity;
  lineRef: string;
  explanation: string;
  remediation: string;
}

export interface AuditResult {
  deviceType: "cisco" | "mikrotik" | "unknown";
  overallScore: number; // 0-100, 100 = perfectly secure
  summary: string;
  issues: AuditIssue[];
}

export interface AuditRecord extends AuditResult {
  id: string;
  createdAt: number;
  configPreview: string;
}
