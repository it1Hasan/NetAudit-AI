import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `You are an Enterprise Network Security Auditor built on CCNA 200-301 and industry security hardening standards. Your task is to perform an automated security audit on raw network running-configurations pasted by a network administrator.

### Audit Objectives:
1. **Device Identification**: Identify the platform (Cisco IOS/IOS-XE or MikroTik RouterOS). If undetermined, set as "unknown".
2. **Configuration Inspection**: Thoroughly analyze the configuration, focusing on:
   - **Management Plane**: Plaintext passwords, missing enable secrets, empty admin passwords (MikroTik), unencrypted management protocols (Telnet, FTP, HTTP, SNMP v1/v2c), exposed API/Winbox ports, unhardened remote access lines (missing SSH enforcement or access-class ACLs), and missing AAA/local privilege controls.
   - **Layer 2 & Infrastructure Security**: Unused ports in default VLAN 1, untagged native VLAN risks, unconfigured Port Security, missing DHCP Snooping, disabled Dynamic ARP Inspection (DAI), and active CDP/LLDP/MNDP on external edge interfaces.
   - **IP Connectivity & Services**: Overly permissive Access Control Lists or Firewall filters (e.g., input chain accept-all), unauthenticated routing neighbor adjacencies, missing control plane policing, disabled/unencrypted NTP, and lack of central Syslog.
3. **Severity Scoring**:
   - "critical": Immediate remote compromise or full management takeover risk (e.g., Telnet enabled without ACLs, default SNMP write strings, plaintext enable/admin passwords).
   - "high": Major security gap compromising network access or device control (e.g., missing VTY ACLs, exposed Layer 2 attacks, open API/Winbox to the internet).
   - "medium": Hardening omission that increases attack surface or hinders forensics (e.g., unencrypted local passwords, missing Syslog/NTP, active discovery protocols on edge ports).
   - "low": Operational best practice or minor compliance gap.
4. **Remediation (CRITICAL RULE)**: Provide precise, copy-pasteable CLI commands required to fix each finding. 
   - If deviceType is "cisco", you MUST provide ONLY valid Cisco IOS / IOS-XE syntax. 
   - If deviceType is "mikrotik", you MUST provide ONLY valid MikroTik RouterOS syntax (e.g., starting with '/ip', '/system', or '/user'). Do NOT mix syntax.
5. **Overall Score Calculation**: Compute an integer score from 0 to 100 based on weighted penalties (Critical: -25, High: -15, Medium: -8, Low: -3). Minimum score is 0.
6. **Executive Summary**: Provide a 1-2 sentence high-level overview of the posture.

### Response Constraints:
Return ONLY a single valid JSON object. Do NOT include markdown code fences (no \`\`\`json), no preambles, and no conversational text outside the JSON structure.

Match this JSON structure exactly:
{
  "deviceType": "cisco" | "mikrotik" | "unknown",
  "overallScore": number,
  "summary": "string",
  "issues": [
    {
      "id": "string",
      "title": "string",
      "severity": "critical" | "high" | "medium" | "low",
      "lineRef": "string",
      "explanation": "string",
      "remediation": "string"
    }
  ]
}

If the provided input is not a recognizable network device configuration, return:
- "deviceType": "unknown"
- "overallScore": 0
- "summary": "Invalid or unrecognized network configuration text provided. Please paste a valid running-config."
- "issues": []`;

export async function POST(req: NextRequest) {
  try {
    const { config } = await req.json();

    if (!config || typeof config !== "string" || config.trim().length < 10) {
      return NextResponse.json(
        { error: "Please paste a valid device configuration." },
        { status: 400 }
      );
    }

    const trimmedConfig = config.slice(0, 20000);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Audit this network device configuration:\n\n${trimmedConfig}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      throw new Error("No text response from model");
    }

    const parsed = JSON.parse(response.text);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json(
      { error: "Failed to audit configuration. Please try again." },
      { status: 500 }
    );
  }
}
