"use client";

const SAMPLE_CISCO = `hostname EdgeRouter1
!
enable password cisco123
!
service password-encryption
no service password-encryption
!
interface GigabitEthernet0/1
 ip address 203.0.113.1 255.255.255.0
 no shutdown
!
line vty 0 4
 transport input telnet
 password letmein
 login
!
snmp-server community public RO
!
ip http server
!
end`;

const SAMPLE_MIKROTIK = `/system identity set name=CoreRouter
/ip service
set telnet disabled=no
set ftp disabled=no
set www-ssl disabled=yes
/ip firewall filter
add chain=input action=accept
/user
add name=admin password="" group=full
/ip service
set api address=0.0.0.0/0 disabled=no
/system ntp client
set enabled=no`;

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function ConfigInput({
  value,
  onChange,
  onSubmit,
  loading,
}: Props) {
  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => onChange(SAMPLE_CISCO)}
          className="text-xs px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
        >
          Load Cisco sample
        </button>
        <button
          type="button"
          onClick={() => onChange(SAMPLE_MIKROTIK)}
          className="text-xs px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
        >
          Load MikroTik sample
        </button>
        
        {/* NEW CLEAR INPUT BUTTON */}
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs px-3 py-1.5 rounded-md border border-red-900/50 text-red-400 hover:bg-red-900/30 transition ml-auto"
        >
          Clear Input
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your Cisco IOS or MikroTik RouterOS running-config here..."
        spellCheck={false}
        className="w-full h-72 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />

      <button
        onClick={onSubmit}
        disabled={loading || value.trim().length < 10}
        className="mt-4 w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed font-semibold transition"
      >
        {loading ? "Auditing configuration..." : "Run Security Audit"}
      </button>
    </div>
  );
}