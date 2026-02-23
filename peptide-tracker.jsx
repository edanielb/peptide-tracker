import { useState, useMemo, useCallback, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  Search, Filter, Star, AlertTriangle, Shield,
  BarChart3, Users, FileText, LogIn, LogOut, Plus, ArrowLeft, Check, X,
  Activity, Brain, Dumbbell, Heart, Flame, Zap, Clock, Eye, Flag, Trash2,
  Info, TrendingUp, ChevronRight, Database, Beaker, Pill, Hash, ArrowUpRight,
  CircleDot, SlidersHorizontal, LayoutGrid, List
} from "lucide-react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────
const T = {
  // Colors — blue data + amber highlights palette
  primary: "#1E40AF",
  primaryLight: "#3B82F6",
  primaryLighter: "#DBEAFE",
  primaryDark: "#1E3A8A",
  accent: "#F59E0B",
  accentLight: "#FEF3C7",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  success: "#059669",
  successLight: "#D1FAE5",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  warn: "#D97706",
  warnLight: "#FEF3C7",
  // Chart palette — accessible, distinct
  chart: ["#1E40AF", "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#059669", "#0891B2", "#D97706", "#DC2626", "#64748B"],
  chartSoft: ["#DBEAFE", "#E0E7FF", "#EDE9FE", "#D1FAE5", "#CFFAFE", "#FEF3C7", "#FEE2E2", "#F1F5F9"],
  // Spacing
  radius: 10,
  radiusSm: 6,
  radiusLg: 16,
  radiusFull: 9999,
  // Shadows
  shadow: "0 1px 3px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.06)",
  shadowMd: "0 4px 6px -1px rgba(15,23,42,0.05), 0 2px 4px -2px rgba(15,23,42,0.05)",
  shadowLg: "0 10px 25px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.04)",
  shadowGlow: "0 0 0 3px rgba(59,130,246,0.15)",
  // Typography
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
};

// ─── MOCK DATA ──────────────────────────────────────────────────────────
const PEPTIDES = [
  { id: "bpc-157", name: "BPC-157", category: "Recovery", description: "Body Protection Compound, a pentadecapeptide derived from gastric juice." },
  { id: "tb-500", name: "TB-500", category: "Recovery", description: "Thymosin Beta-4 fragment, associated with tissue repair and recovery." },
  { id: "cjc-1295", name: "CJC-1295", category: "Growth Hormone", description: "Growth hormone-releasing hormone analog." },
  { id: "ipamorelin", name: "Ipamorelin", category: "Growth Hormone", description: "Growth hormone secretagogue peptide." },
  { id: "semaglutide", name: "Semaglutide", category: "Metabolic", description: "GLP-1 receptor agonist peptide." },
  { id: "pt-141", name: "PT-141", category: "Other", description: "Bremelanotide, a melanocortin receptor agonist." },
  { id: "selank", name: "Selank", category: "Cognitive", description: "Synthetic analog of immunomodulatory peptide tuftsin." },
  { id: "semax", name: "Semax", category: "Cognitive", description: "Synthetic peptide derived from ACTH fragment." },
  { id: "ghk-cu", name: "GHK-Cu", category: "Longevity", description: "Copper peptide associated with skin and tissue remodeling." },
  { id: "mots-c", name: "MOTS-c", category: "Longevity", description: "Mitochondrial-derived peptide linked to metabolic regulation." },
  { id: "ss-31", name: "SS-31 (Elamipretide)", category: "Longevity", description: "Mitochondria-targeted peptide." },
  { id: "kisspeptin", name: "Kisspeptin-10", category: "Hormonal", description: "Peptide involved in reproductive hormone signaling." },
  { id: "aod-9604", name: "AOD-9604", category: "Metabolic", description: "Fragment of human growth hormone associated with fat metabolism." },
  { id: "epithalon", name: "Epithalon", category: "Longevity", description: "Tetrapeptide associated with telomerase activity." },
  { id: "ll-37", name: "LL-37", category: "Immune", description: "Antimicrobial peptide from the cathelicidin family." },
  { id: "thymalin", name: "Thymalin", category: "Immune", description: "Thymic peptide associated with immune modulation." },
];

const GOALS = ["Fat Loss", "Muscle Growth", "Recovery", "Longevity", "Cognitive", "Sleep", "Immune Support", "Other"];
const SIDE_EFFECTS_LIST = ["Nausea", "Headache", "Fatigue", "Injection site reaction", "Flushing", "Dizziness", "Appetite change", "Water retention", "Insomnia", "Mood changes", "GI discomfort", "None"];
const TIME_RANGES = ["< 1 week", "1-4 weeks", "1-3 months", "3+ months", "Never"];
const FREQUENCIES = ["Daily", "Twice daily", "Every other day", "Weekly", "Twice weekly", "Cycle (on/off)"];
const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const ACTIVITY_LEVELS = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Athlete"];

const CATEGORY_COLORS = {
  Recovery: "#059669", "Growth Hormone": "#7C3AED", Metabolic: "#D97706",
  Cognitive: "#2563EB", Longevity: "#0891B2", Hormonal: "#DB2777",
  Immune: "#DC2626", Other: "#64748B",
};

function generateMockReports() {
  const reports = [];
  const names = ["User_A1","User_B2","User_C3","User_D4","User_E5","User_F6","User_G7","User_H8","User_I9","User_J10","User_K11","User_L12","User_M13","User_N14","User_O15"];
  let id = 1;
  PEPTIDES.forEach(p => {
    const count = 8 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const goal = GOALS[Math.floor(Math.random() * GOALS.length)];
      const eff = Math.floor(Math.random() * 5) + 1;
      const se = SIDE_EFFECTS_LIST.filter(() => Math.random() > 0.75);
      const dosage = Math.round((50 + Math.random() * 950) * 10) / 10;
      const unit = Math.random() > 0.5 ? "mcg" : "mg";
      const durationWeeks = Math.floor(Math.random() * 24) + 1;
      reports.push({
        id: id++, peptideId: p.id, userId: names[Math.floor(Math.random() * names.length)],
        goal, dosage, unit, frequency: FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)],
        durationWeeks, effectiveness: eff, sideEffects: se.length ? se : ["None"],
        noticeableChange: ["Yes","No","Unsure"][Math.floor(Math.random()*3)],
        timeToEffect: TIME_RANGES[Math.floor(Math.random()*TIME_RANGES.length)],
        ageRange: AGE_RANGES[Math.floor(Math.random()*AGE_RANGES.length)],
        gender: GENDERS[Math.floor(Math.random()*GENDERS.length)],
        activityLevel: ACTIVITY_LEVELS[Math.floor(Math.random()*ACTIVITY_LEVELS.length)],
        notes: "", flagged: Math.random() > 0.95,
        createdAt: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString(),
      });
    }
  });
  return reports;
}
const INITIAL_REPORTS = generateMockReports();

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────

function GoalIcon({ goal, size = 16 }) {
  const props = { size, strokeWidth: 1.5 };
  switch (goal) {
    case "Fat Loss": return <Flame {...props} />;
    case "Muscle Growth": return <Dumbbell {...props} />;
    case "Recovery": return <Heart {...props} />;
    case "Longevity": return <Activity {...props} />;
    case "Cognitive": return <Brain {...props} />;
    case "Sleep": return <Clock {...props} />;
    case "Immune Support": return <Shield {...props} />;
    default: return <Zap {...props} />;
  }
}

function Disclaimer() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
      border: "1px solid #FDE68A", borderRadius: T.radius, padding: "14px 18px",
      marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: T.radiusFull, background: "#FEF3C7",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        border: "1px solid #FDE68A",
      }}>
        <AlertTriangle size={14} color="#D97706" />
      </div>
      <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
        <strong style={{ color: "#78350F" }}>Disclaimer:</strong> This platform shares user-reported experiences only. This is not medical advice.
        Peptides may not be FDA approved. Consult a licensed healthcare professional before use.
      </div>
    </div>
  );
}

function StarRating({ value, size = 16, interactive, onChange }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} onClick={interactive ? () => onChange(i) : undefined}
          style={{ cursor: interactive ? "pointer" : "default", display: "inline-flex", padding: interactive ? 2 : 0 }}>
          <Star size={size} fill={i <= value ? "#F59E0B" : "none"}
            color={i <= value ? "#F59E0B" : "#CBD5E1"} strokeWidth={1.5} />
        </span>
      ))}
    </span>
  );
}

function Badge({ children, color = T.primary, style: extra }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px",
      borderRadius: T.radiusFull, fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
      background: color + "12", color, textTransform: "uppercase", ...extra,
    }}>{children}</span>
  );
}

function Card({ children, style, onClick, hover, glow }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`,
        padding: 24, transition: "all 0.2s ease", boxShadow: T.shadow,
        ...(hover && hovered ? { borderColor: T.primaryLight, boxShadow: T.shadowLg, transform: "translateY(-2px)" } : {}),
        ...(glow && hovered ? { boxShadow: T.shadowGlow } : {}),
        ...(onClick ? { cursor: "pointer" } : {}),
        ...style,
      }}
    >{children}</div>
  );
}

function StatCard({ icon, label, value, sub, trend, color = T.primary }) {
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: T.radius, background: color + "10",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</div>
        {trend && (
          <span style={{ fontSize: 12, fontWeight: 600, color: trend > 0 ? T.success : T.danger,
            display: "flex", alignItems: "center", gap: 2 }}>
            <ArrowUpRight size={12} /> {trend}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: -0.5, fontFamily: T.fontMono }}>{value}</div>
      <div style={{ fontSize: 13, color: T.textSecondary, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{sub}</div>}
    </Card>
  );
}

function ChartCard({ title, subtitle, children, style: extra }) {
  return (
    <Card style={{ padding: 0, ...extra }}>
      <div style={{ padding: "20px 24px 0" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.text }}>{title}</h3>
        {subtitle && <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textMuted }}>{subtitle}</p>}
      </div>
      <div style={{ padding: "16px 12px 12px" }}>{children}</div>
    </Card>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", disabled, style: extra }) {
  const [hovered, setHovered] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: T.radius,
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease", opacity: disabled ? 0.5 : 1, fontFamily: T.fontFamily,
    padding: size === "sm" ? "6px 14px" : size === "lg" ? "14px 28px" : "10px 20px",
    fontSize: size === "sm" ? 13 : size === "lg" ? 15 : 14,
    letterSpacing: 0.1,
  };
  const v = {
    primary: { background: hovered && !disabled ? "#1D4ED8" : T.primary, color: "#fff", boxShadow: hovered && !disabled ? T.shadowMd : "none" },
    secondary: { background: hovered && !disabled ? "#E2E8F0" : T.surfaceAlt, color: T.text, border: `1px solid ${T.border}` },
    ghost: { background: hovered && !disabled ? T.primaryLighter : "transparent", color: T.primaryLight },
    danger: { background: hovered && !disabled ? "#FEE2E2" : T.dangerLight, color: T.danger },
    accent: { background: hovered && !disabled ? "#E5A107" : T.accent, color: "#fff", boxShadow: hovered && !disabled ? T.shadowMd : "none" },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...v[variant], ...extra }}>{children}</button>
  );
}

function Input({ label, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary }}>{label}</label>}
      <input {...props} onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={{
          padding: "10px 14px", borderRadius: T.radius, border: `1px solid ${error ? T.danger : focused ? T.primaryLight : T.border}`,
          fontSize: 14, outline: "none", transition: "all 0.2s", fontFamily: T.fontFamily,
          boxShadow: focused ? T.shadowGlow : "none", background: T.surface, color: T.text,
          ...props.style,
        }} />
      {error && <span style={{ fontSize: 12, color: T.danger }}>{error}</span>}
    </div>
  );
}

function Select({ label, options, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary }}>{label}</label>}
      <select {...props} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          padding: "10px 14px", borderRadius: T.radius, border: `1px solid ${error ? T.danger : focused ? T.primaryLight : T.border}`,
          fontSize: 14, outline: "none", background: T.surface, fontFamily: T.fontFamily,
          boxShadow: focused ? T.shadowGlow : "none", color: props.value ? T.text : T.textMuted,
          transition: "all 0.2s", ...props.style,
        }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span style={{ fontSize: 12, color: T.danger }}>{error}</span>}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 14, color: T.textSecondary }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function DataFooter({ count }) {
  return (
    <div style={{
      marginTop: 20, padding: "10px 16px", background: T.surfaceAlt, borderRadius: T.radius,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <Info size={13} color={T.textMuted} />
      <span style={{ fontSize: 12, color: T.textMuted }}>
        User-reported data only. Not clinical research.{count ? ` Sample size: ${count} reports.` : ""}
      </span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.text, borderRadius: T.radiusSm, padding: "8px 12px",
      boxShadow: T.shadowLg, border: "none",
    }}>
      <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: T.radiusFull, background: p.color, display: "inline-block" }} />
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

// ─── PAGES ──────────────────────────────────────────────────────────────

function HomePage({ navigate }) {
  const stats = useMemo(() => ({
    totalReports: INITIAL_REPORTS.length,
    totalPeptides: PEPTIDES.length,
    avgEffectiveness: (INITIAL_REPORTS.reduce((s,r)=>s+r.effectiveness,0)/INITIAL_REPORTS.length).toFixed(1),
    uniqueUsers: new Set(INITIAL_REPORTS.map(r => r.userId)).size,
  }), []);

  const topPeptides = useMemo(() => {
    const grouped = {};
    INITIAL_REPORTS.forEach(r => {
      if (!grouped[r.peptideId]) grouped[r.peptideId] = { count: 0, effSum: 0 };
      grouped[r.peptideId].count++;
      grouped[r.peptideId].effSum += r.effectiveness;
    });
    return PEPTIDES
      .map(p => ({ ...p, count: grouped[p.id]?.count || 0, avgEff: grouped[p.id] ? (grouped[p.id].effSum / grouped[p.id].count).toFixed(1) : 0 }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 6);
  }, []);

  const trendData = useMemo(() => {
    const months = {};
    INITIAL_REPORTS.forEach(r => {
      const d = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).sort().map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en", { month: "short" }), count,
    }));
  }, []);

  return (
    <div>
      <Disclaimer />

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${T.primary} 0%, #3B82F6 50%, #6366F1 100%)`,
        borderRadius: T.radiusLg, padding: "48px 40px", marginBottom: 28,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: T.radiusFull, background: "rgba(255,255,255,0.06)",
        }} />
        <div style={{
          position: "absolute", bottom: -30, right: 80, width: 120, height: 120,
          borderRadius: T.radiusFull, background: "rgba(255,255,255,0.04)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: T.radius, background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}>
              <Database size={24} color="#fff" />
            </div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
              PeptideTracker
            </h1>
          </div>
          <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.8)", fontSize: 16, maxWidth: 540, lineHeight: 1.6 }}>
            A transparent, community-driven repository of self-reported peptide experiences.
            Browse structured data. No medical claims. No vendor links.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Button variant="accent" size="lg" onClick={() => navigate("browse")}>
              <Search size={18} /> Browse Database
            </Button>
            <Button size="lg" onClick={() => navigate("submit")}
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              <Plus size={18} /> Submit Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        <StatCard icon={<FileText size={20} color={T.primary} />} label="Total Reports" value={stats.totalReports} />
        <StatCard icon={<Beaker size={20} color="#7C3AED" />} label="Peptides Tracked" value={stats.totalPeptides} color="#7C3AED" />
        <StatCard icon={<Star size={20} color={T.accent} />} label="Avg. Effectiveness" value={`${stats.avgEffectiveness}/5`} color={T.accent} />
        <StatCard icon={<Users size={20} color={T.success} />} label="Contributors" value={stats.uniqueUsers} color={T.success} />
      </div>

      {/* Submission trend + top peptides */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 32 }}>
        <ChartCard title="Submission Trend" subtitle="Reports over time">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.primaryLight} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={T.primaryLight} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke={T.primaryLight} strokeWidth={2} fill="url(#areaGrad)" name="Reports" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div>
          <SectionHeader title="Most Reported" subtitle="Top peptides by submission volume"
            action={<Button variant="ghost" size="sm" onClick={() => navigate("browse")}>View all <ChevronRight size={14} /></Button>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {topPeptides.map((p, i) => (
              <Card key={p.id} hover onClick={() => navigate("peptide", p.id)} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: T.radiusFull, display: "inline-flex",
                    alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                    background: i < 3 ? T.primaryLighter : T.surfaceAlt, color: i < 3 ? T.primary : T.textMuted,
                  }}>{i + 1}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{p.name}</span>
                </div>
                <Badge color={CATEGORY_COLORS[p.category] || T.primary}>{p.category}</Badge>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: T.primary, fontFamily: T.fontMono }}>{p.count}</span>
                    <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 4 }}>reports</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <StarRating value={Math.round(parseFloat(p.avgEff))} size={12} />
                    <span style={{ fontSize: 12, color: T.textSecondary, fontWeight: 600 }}>{p.avgEff}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowsePage({ navigate, reports }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const [sort, setSort] = useState("reports");
  const [view, setView] = useState("grid");
  const categories = useMemo(() => [...new Set(PEPTIDES.map(p => p.category))], []);

  const peptideStats = useMemo(() => {
    const grouped = {};
    reports.forEach(r => {
      if (!grouped[r.peptideId]) grouped[r.peptideId] = { count: 0, effSum: 0, goals: {} };
      grouped[r.peptideId].count++;
      grouped[r.peptideId].effSum += r.effectiveness;
      grouped[r.peptideId].goals[r.goal] = (grouped[r.peptideId].goals[r.goal] || 0) + 1;
    });
    return PEPTIDES.map(p => {
      const s = grouped[p.id] || { count: 0, effSum: 0, goals: {} };
      const topGoal = Object.entries(s.goals).sort((a,b) => b[1]-a[1])[0];
      return { ...p, count: s.count, avgEff: s.count ? (s.effSum/s.count).toFixed(1) : "0.0", topGoal: topGoal?topGoal[0]:"N/A", goals: s.goals };
    });
  }, [reports]);

  const filtered = useMemo(() => {
    let list = peptideStats;
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (catFilter) list = list.filter(p => p.category === catFilter);
    if (goalFilter) list = list.filter(p => p.goals[goalFilter] > 0);
    if (sort === "reports") list = [...list].sort((a,b) => b.count-a.count);
    else if (sort === "effectiveness") list = [...list].sort((a,b) => parseFloat(b.avgEff)-parseFloat(a.avgEff));
    else list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [peptideStats, search, catFilter, goalFilter, sort]);

  return (
    <div>
      <Disclaimer />
      <SectionHeader title="Browse Peptides"
        subtitle={`${filtered.length} peptides${catFilter ? ` in ${catFilter}` : ""}`}
        action={
          <div style={{ display: "flex", gap: 4, background: T.surfaceAlt, borderRadius: T.radiusSm, padding: 2 }}>
            {[{id:"grid",icon:<LayoutGrid size={14}/>},{id:"list",icon:<List size={14}/>}].map(v => (
              <button key={v.id} onClick={() => setView(v.id)} style={{
                padding: "6px 10px", borderRadius: T.radiusSm, border: "none", cursor: "pointer",
                background: view === v.id ? T.surface : "transparent",
                color: view === v.id ? T.primary : T.textMuted,
                boxShadow: view === v.id ? T.shadow : "none", transition: "all 0.15s",
              }}>{v.icon}</button>
            ))}
          </div>
        }
      />

      {/* Filters */}
      <Card style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Input placeholder="Search peptides..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <Select options={categories} value={catFilter} label="Category"
            onChange={e => setCatFilter(e.target.value)} />
          <Select options={GOALS} value={goalFilter} label="Goal"
            onChange={e => setGoalFilter(e.target.value)} />
          <Select options={["reports","effectiveness","name"]} value={sort} label="Sort"
            onChange={e => setSort(e.target.value)} />
          {(catFilter || goalFilter || search) && (
            <Button variant="ghost" size="sm" onClick={() => { setCatFilter(""); setGoalFilter(""); setSearch(""); }}>
              <X size={14} /> Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Grid / List */}
      <div style={{
        display: view === "grid" ? "grid" : "flex",
        gridTemplateColumns: view === "grid" ? "repeat(2, 1fr)" : undefined,
        flexDirection: view === "list" ? "column" : undefined,
        gap: 12,
      }}>
        {filtered.map(p => (
          <Card key={p.id} hover onClick={() => navigate("peptide", p.id)} style={{ padding: view === "list" ? 16 : 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: T.radius,
                    background: (CATEGORY_COLORS[p.category] || T.primary) + "12",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Pill size={18} color={CATEGORY_COLORS[p.category] || T.primary} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{p.name}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                      <Badge color={CATEGORY_COLORS[p.category] || T.primary}>{p.category}</Badge>
                      <Badge color={T.textSecondary}><GoalIcon goal={p.topGoal} size={10} /> {p.topGoal}</Badge>
                    </div>
                  </div>
                </div>
                {view === "grid" && <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5, marginTop: 4 }}>{p.description}</div>}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: T.primary, fontFamily: T.fontMono }}>{p.count}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>reports</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                  <StarRating value={Math.round(parseFloat(p.avgEff))} size={12} />
                  <span style={{ fontSize: 12, color: T.textSecondary, fontWeight: 600 }}>{p.avgEff}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card style={{ textAlign: "center", padding: 60 }}>
          <Search size={32} color={T.textMuted} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: T.textSecondary }}>No peptides match your filters</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Try adjusting your search or filter criteria</div>
        </Card>
      )}
    </div>
  );
}

function PeptideDetailPage({ peptideId, navigate, reports }) {
  const peptide = PEPTIDES.find(p => p.id === peptideId);
  const peptideReports = useMemo(() => reports.filter(r => r.peptideId === peptideId), [reports, peptideId]);
  if (!peptide) return <div>Peptide not found.</div>;

  const stats = useMemo(() => {
    const n = peptideReports.length;
    if (!n) return null;
    const avgEff = (peptideReports.reduce((s,r)=>s+r.effectiveness,0)/n).toFixed(1);
    const avgDosage = (peptideReports.reduce((s,r)=>s+r.dosage,0)/n).toFixed(0);
    const goalCounts = {};
    peptideReports.forEach(r => goalCounts[r.goal]=(goalCounts[r.goal]||0)+1);
    const topGoal = Object.entries(goalCounts).sort((a,b)=>b[1]-a[1])[0];
    const seCounts = {};
    peptideReports.forEach(r => r.sideEffects.forEach(se => seCounts[se]=(seCounts[se]||0)+1));
    const changePct = Math.round(peptideReports.filter(r=>r.noticeableChange==="Yes").length/n*100);
    const effDist = [1,2,3,4,5].map(v=>({rating:`${v}`,count:peptideReports.filter(r=>r.effectiveness===v).length}));
    const goalData = Object.entries(goalCounts).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
    const seData = Object.entries(seCounts).filter(([k])=>k!=="None").map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,8);
    const timeToPct = {};
    peptideReports.forEach(r => timeToPct[r.timeToEffect]=(timeToPct[r.timeToEffect]||0)+1);
    const timeData = TIME_RANGES.map(t=>({name:t,count:timeToPct[t]||0}));
    const doseBuckets = {};
    peptideReports.forEach(r => {
      const bucket = Math.round(r.dosage/100)*100;
      if(!doseBuckets[bucket]) doseBuckets[bucket]={sum:0,count:0};
      doseBuckets[bucket].sum+=r.effectiveness; doseBuckets[bucket].count++;
    });
    const doseEffData = Object.entries(doseBuckets)
      .map(([dose,d])=>({dose:`${dose}`,avgEff:parseFloat((d.sum/d.count).toFixed(1)),reports:d.count}))
      .sort((a,b)=>parseInt(a.dose)-parseInt(b.dose));
    return { n, avgEff, avgDosage, topGoal, seCounts, changePct, effDist, goalData, seData, timeData, doseEffData };
  }, [peptideReports]);

  return (
    <div>
      <Disclaimer />
      <button onClick={() => navigate("browse")} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
        color: T.primaryLight, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0,
      }}>
        <ArrowLeft size={15} /> Back to all peptides
      </button>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${(CATEGORY_COLORS[peptide.category]||T.primary)}08 0%, ${T.surfaceAlt} 100%)`,
        borderRadius: T.radiusLg, padding: "28px 32px", marginBottom: 24,
        border: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: T.radius,
            background: (CATEGORY_COLORS[peptide.category]||T.primary)+"15",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Pill size={24} color={CATEGORY_COLORS[peptide.category]||T.primary} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>{peptide.name}</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <Badge color={CATEGORY_COLORS[peptide.category]||T.primary}>{peptide.category}</Badge>
              {stats?.topGoal && <Badge color={T.textSecondary}>Top goal: {stats.topGoal[0]}</Badge>}
            </div>
          </div>
        </div>
        <p style={{ color: T.textSecondary, margin: 0, fontSize: 14, lineHeight: 1.6, maxWidth: 600 }}>{peptide.description}</p>
      </div>

      {!stats ? (
        <Card style={{ textAlign: "center", padding: 60 }}>
          <Database size={32} color={T.textMuted} style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 600, color: T.textSecondary }}>No reports yet</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Be the first to submit a report for {peptide.name}.</div>
        </Card>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            <StatCard icon={<FileText size={18} color={T.primary} />} label="Total Reports" value={stats.n} />
            <StatCard icon={<Star size={18} color={T.accent} />} label="Avg Effectiveness" value={`${stats.avgEff}/5`} color={T.accent} />
            <StatCard icon={<Hash size={18} color="#7C3AED" />} label="Avg Dosage" value={stats.avgDosage} color="#7C3AED" />
            <StatCard icon={<TrendingUp size={18} color={T.success} />} label="Noticed Change" value={`${stats.changePct}%`} color={T.success} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <ChartCard title="Effectiveness Distribution" subtitle="User ratings (1-5 scale)">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={stats.effDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
                  <XAxis dataKey="rating" fontSize={12} tickLine={false} axisLine={false} stroke={T.textMuted} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke={T.textMuted} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={T.primary} radius={[6,6,0,0]} name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Goals Breakdown" subtitle="Why users report using this peptide">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={stats.goalData} cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                    dataKey="value" paddingAngle={2} strokeWidth={2} stroke={T.surface}
                    label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {stats.goalData.map((_,i) => <Cell key={i} fill={T.chart[i%T.chart.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Dosage vs Effectiveness" subtitle="Average rating by dosage range">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={stats.doseEffData}>
                  <defs>
                    <linearGradient id="doseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
                  <XAxis dataKey="dose" fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
                  <YAxis domain={[0,5]} fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="avgEff" stroke="#6366F1" strokeWidth={2.5} fill="url(#doseGrad)" name="Avg Effectiveness" dot={{ r: 4, fill: "#6366F1", stroke: T.surface, strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Time to Notice Effects" subtitle="How long before users report changes">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={stats.timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke={T.textMuted} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#0891B2" radius={[6,6,0,0]} name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <Card style={{ marginBottom: 0 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: T.text }}>Most Reported Side Effects</h3>
            {stats.seData.length === 0 ? (
              <p style={{ color: T.textMuted, fontSize: 14 }}>No side effects reported.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stats.seData.map(se => {
                  const pct = Math.round((se.value / stats.n) * 100);
                  return (
                    <div key={se.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 140, fontSize: 13, fontWeight: 500, color: T.textSecondary }}>{se.name}</span>
                      <div style={{ flex: 1, height: 10, background: T.surfaceAlt, borderRadius: T.radiusFull, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${pct}%`, borderRadius: T.radiusFull,
                          background: pct > 40 ? "#DC2626" : pct > 20 ? "#F59E0B" : "#3B82F6",
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, width: 70, textAlign: "right", fontFamily: T.fontMono }}>
                        {pct}% <span style={{ color: T.textMuted, fontWeight: 400 }}>({se.value})</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
          <DataFooter count={stats.n} />
        </>
      )}
    </div>
  );
}

function SubmitPage({ user, navigate, onSubmit }) {
  const [form, setForm] = useState({
    peptideId: "", goal: "", dosage: "", unit: "mcg", frequency: "", durationWeeks: "",
    effectiveness: 3, sideEffects: [], noticeableChange: "", timeToEffect: "",
    ageRange: "", gender: "", activityLevel: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  if (!user) {
    return (
      <Card style={{ textAlign: "center", padding: 60, maxWidth: 440, margin: "40px auto" }}>
        <div style={{
          width: 56, height: 56, borderRadius: T.radiusFull, background: T.primaryLighter,
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        }}>
          <LogIn size={24} color={T.primary} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: T.text }}>Sign In Required</h3>
        <p style={{ color: T.textSecondary, marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
          You must be signed in to submit an experience report. No anonymous posting.
        </p>
        <Button size="lg" onClick={() => navigate("login")}>
          <LogIn size={16} /> Sign In to Continue
        </Button>
      </Card>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.peptideId) errs.peptideId = "Required";
    if (!form.goal) errs.goal = "Required";
    if (!form.dosage || isNaN(form.dosage) || parseFloat(form.dosage) <= 0) errs.dosage = "Valid dosage required";
    if (!form.frequency) errs.frequency = "Required";
    if (!form.durationWeeks || isNaN(form.durationWeeks)) errs.durationWeeks = "Required";
    if (!form.noticeableChange) errs.noticeableChange = "Required";
    if (!form.timeToEffect) errs.timeToEffect = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { setStep(1); return; }
    onSubmit({
      ...form, dosage: parseFloat(form.dosage), durationWeeks: parseInt(form.durationWeeks),
      userId: user.email, id: Date.now(), flagged: false, createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const toggleSE = (se) => setForm(f => ({
    ...f, sideEffects: f.sideEffects.includes(se) ? f.sideEffects.filter(s=>s!==se) : [...f.sideEffects, se],
  }));

  if (submitted) {
    return (
      <Card style={{ textAlign: "center", padding: 60, maxWidth: 480, margin: "40px auto" }}>
        <div style={{
          width: 56, height: 56, borderRadius: T.radiusFull, background: T.successLight,
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        }}>
          <Check size={28} color={T.success} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: T.success }}>Report Submitted</h3>
        <p style={{ color: T.textSecondary, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
          Your experience report has been recorded. Thank you for contributing to the community.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Button onClick={() => { setSubmitted(false); setForm({peptideId:"",goal:"",dosage:"",unit:"mcg",frequency:"",durationWeeks:"",effectiveness:3,sideEffects:[],noticeableChange:"",timeToEffect:"",ageRange:"",gender:"",activityLevel:"",notes:""}); setStep(1); }}>
            <Plus size={16} /> Submit Another
          </Button>
          <Button variant="secondary" onClick={() => navigate("browse")}>Browse Peptides</Button>
        </div>
      </Card>
    );
  }

  // Step indicators
  const steps = [
    { num: 1, label: "Peptide & Dosage" },
    { num: 2, label: "Experience" },
    { num: 3, label: "Demographics" },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <Disclaimer />
      <SectionHeader title="Submit Experience Report" subtitle="Share structured data. Fields marked * are required." />

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <button onClick={() => setStep(s.num)} style={{
              display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
              cursor: "pointer", padding: 0,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: T.radiusFull, display: "inline-flex",
                alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700,
                background: step >= s.num ? T.primary : T.surfaceAlt,
                color: step >= s.num ? "#fff" : T.textMuted,
                transition: "all 0.2s",
              }}>{s.num}</span>
              <span style={{ fontSize: 13, fontWeight: step === s.num ? 700 : 500, color: step === s.num ? T.text : T.textMuted }}>
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: step > s.num ? T.primary : T.border, margin: "0 16px", borderRadius: 1, transition: "background 0.2s" }} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: T.text }}>Peptide & Dosage</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Select label="Peptide *" options={PEPTIDES.map(p=>p.name)} error={errors.peptideId}
              value={form.peptideId ? PEPTIDES.find(p=>p.id===form.peptideId)?.name : ""}
              onChange={e => setForm(f=>({...f,peptideId:PEPTIDES.find(p=>p.name===e.target.value)?.id||""}))} />
            <Select label="Primary Goal *" options={GOALS} value={form.goal} error={errors.goal}
              onChange={e => setForm(f=>({...f,goal:e.target.value}))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 1fr", gap: 16 }}>
            <Input label="Dosage *" type="number" value={form.dosage} error={errors.dosage}
              onChange={e => setForm(f=>({...f,dosage:e.target.value}))} placeholder="e.g. 250" />
            <Select label="Unit" options={["mcg","mg"]} value={form.unit}
              onChange={e => setForm(f=>({...f,unit:e.target.value}))} />
            <Select label="Frequency *" options={FREQUENCIES} value={form.frequency} error={errors.frequency}
              onChange={e => setForm(f=>({...f,frequency:e.target.value}))} />
            <Input label="Duration (weeks) *" type="number" value={form.durationWeeks} error={errors.durationWeeks}
              onChange={e => setForm(f=>({...f,durationWeeks:e.target.value}))} placeholder="e.g. 8" />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <Button onClick={() => setStep(2)}>Next: Experience <ChevronRight size={16} /></Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: T.text }}>Experience</h3>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary, display: "block", marginBottom: 10 }}>
              Perceived Effectiveness * - <span style={{ color: T.accent, fontWeight: 700 }}>{form.effectiveness}/5</span>
            </label>
            <StarRating value={form.effectiveness} size={32} interactive
              onChange={v => setForm(f=>({...f,effectiveness:v}))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Select label="Noticeable Change? *" options={["Yes","No","Unsure"]} value={form.noticeableChange}
              error={errors.noticeableChange} onChange={e => setForm(f=>({...f,noticeableChange:e.target.value}))} />
            <Select label="Time Until Effects *" options={TIME_RANGES} value={form.timeToEffect}
              error={errors.timeToEffect} onChange={e => setForm(f=>({...f,timeToEffect:e.target.value}))} />
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary, display: "block", marginBottom: 10 }}>Side Effects</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SIDE_EFFECTS_LIST.map(se => {
              const active = form.sideEffects.includes(se);
              return (
                <button key={se} onClick={() => toggleSE(se)} style={{
                  padding: "7px 14px", borderRadius: T.radiusFull, fontSize: 13, fontWeight: 500,
                  border: `1.5px solid ${active ? T.primary : T.border}`,
                  background: active ? T.primaryLighter : T.surface,
                  color: active ? T.primary : T.textSecondary,
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  {active && <Check size={13} />}{se}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <Button variant="secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</Button>
            <Button onClick={() => setStep(3)}>Next: Demographics <ChevronRight size={16} /></Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: T.text }}>
              Optional Demographics
              <span style={{ fontWeight: 400, color: T.textMuted, fontSize: 12, marginLeft: 8 }}>No PII collected</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Select label="Age Range" options={AGE_RANGES} value={form.ageRange}
                onChange={e => setForm(f=>({...f,ageRange:e.target.value}))} />
              <Select label="Gender" options={GENDERS} value={form.gender}
                onChange={e => setForm(f=>({...f,gender:e.target.value}))} />
              <Select label="Activity Level" options={ACTIVITY_LEVELS} value={form.activityLevel}
                onChange={e => setForm(f=>({...f,activityLevel:e.target.value}))} />
            </div>
          </Card>
          <Card style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: T.text }}>Additional Notes</h3>
            <textarea value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))}
              rows={3} placeholder="Any additional context about your experience..."
              style={{
                width: "100%", padding: "12px 14px", borderRadius: T.radius, border: `1px solid ${T.border}`,
                fontSize: 14, resize: "vertical", fontFamily: T.fontFamily, boxSizing: "border-box",
                outline: "none", transition: "border 0.2s", color: T.text,
              }} />
          </Card>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="secondary" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</Button>
            <Button size="lg" variant="accent" onClick={handleSubmit}>
              <Check size={18} /> Submit Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function AnalyticsPage({ reports }) {
  const analytics = useMemo(() => {
    const goalCounts = {};
    const allSE = {};
    const peptideEff = {};
    const cycleLengths = {};
    reports.forEach(r => {
      goalCounts[r.goal]=(goalCounts[r.goal]||0)+1;
      r.sideEffects.forEach(se => { if(se!=="None") allSE[se]=(allSE[se]||0)+1; });
      if(!peptideEff[r.peptideId]) peptideEff[r.peptideId]={sum:0,count:0};
      peptideEff[r.peptideId].sum+=r.effectiveness; peptideEff[r.peptideId].count++;
      if(!cycleLengths[r.goal]) cycleLengths[r.goal]=[];
      cycleLengths[r.goal].push(r.durationWeeks);
    });
    const goalChart = Object.entries(goalCounts).map(([name,value])=>({name,count:value})).sort((a,b)=>b.count-a.count);
    const seChart = Object.entries(allSE).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,10);
    const topRated = Object.entries(peptideEff).filter(([_,d])=>d.count>=5)
      .map(([id,d])=>({name:PEPTIDES.find(p=>p.id===id)?.name||id,avgEff:parseFloat((d.sum/d.count).toFixed(2)),reports:d.count}))
      .sort((a,b)=>b.avgEff-a.avgEff).slice(0,10);
    const avgCycleByGoal = Object.entries(cycleLengths).map(([goal,weeks])=>({
      name:goal, avgWeeks:parseFloat((weeks.reduce((s,w)=>s+w,0)/weeks.length).toFixed(1)),
    })).sort((a,b)=>b.avgWeeks-a.avgWeeks);
    return { goalChart, seChart, topRated, avgCycleByGoal };
  }, [reports]);

  return (
    <div>
      <Disclaimer />
      <SectionHeader title="Analytics Dashboard"
        subtitle={`Aggregated patterns from ${reports.length} user-reported submissions`} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <ChartCard title="Reports by Goal" subtitle="Distribution of usage objectives">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.goalChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
              <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke={T.textSecondary} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={T.primary} radius={[0,6,6,0]} name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Rated Peptides" subtitle="Minimum 5 reports, sorted by avg effectiveness">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.topRated} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" domain={[0,5]} fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
              <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke={T.textSecondary} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgEff" fill="#7C3AED" radius={[0,6,6,0]} name="Avg Effectiveness" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Common Side Effects" subtitle="Across all peptide reports">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.seChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
              <YAxis type="category" dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke={T.textSecondary} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#DC2626" radius={[0,6,6,0]} name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Cycle Length by Goal" subtitle="Mean duration in weeks per objective">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.avgCycleByGoal} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} stroke={T.textMuted} />
              <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke={T.textSecondary} width={110} />
              <Tooltip content={<CustomTooltip />} formatter={v=>`${v} weeks`} />
              <Bar dataKey="avgWeeks" fill={T.success} radius={[0,6,6,0]} name="Avg Weeks" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <DataFooter count={reports.length} />
    </div>
  );
}

function ModerationPage({ reports, onFlag, onRemove }) {
  const flagged = useMemo(() => reports.filter(r=>r.flagged), [reports]);
  const recent = useMemo(() => [...reports].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,20), [reports]);

  return (
    <div>
      <SectionHeader title="Moderation Queue"
        subtitle="Review flagged and recent submissions" />

      {flagged.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
            padding: "8px 14px", background: T.dangerLight, borderRadius: T.radius,
          }}>
            <Flag size={15} color={T.danger} />
            <span style={{ fontSize: 14, fontWeight: 700, color: T.danger }}>Flagged Reports ({flagged.length})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {flagged.map(r => {
              const p = PEPTIDES.find(pp=>pp.id===r.peptideId);
              return (
                <Card key={r.id} style={{ borderColor: "#FECACA", borderLeft: `4px solid ${T.danger}`, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: T.text }}>{p?.name}</span>
                        <Badge color={T.textMuted}>{r.userId}</Badge>
                        <span style={{ fontSize: 12, color: T.textMuted }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span style={{ fontSize: 13, color: T.textSecondary }}>
                        {r.dosage}{r.unit} · {r.goal} · Effectiveness: {r.effectiveness}/5
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="secondary" size="sm" onClick={() => onFlag(r.id, false)}>
                        <Check size={14} /> Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onRemove(r.id)}>
                        <Trash2 size={14} /> Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12 }}>Recent Submissions</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {recent.map(r => {
          const p = PEPTIDES.find(pp=>pp.id===r.peptideId);
          return (
            <Card key={r.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{p?.name}</span>
                  <Badge color={T.primary}>{r.goal}</Badge>
                  <span style={{ fontSize: 13, color: T.textSecondary, fontFamily: T.fontMono }}>{r.dosage}{r.unit}</span>
                  <StarRating value={r.effectiveness} size={12} />
                  <span style={{ fontSize: 12, color: T.textMuted }}>{r.userId}</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {!r.flagged && (
                    <Button variant="ghost" size="sm" onClick={() => onFlag(r.id, true)}><Flag size={13} /></Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onRemove(r.id)} style={{ color: T.danger }}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function LoginPage({ onLogin, navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.includes("@") || !password) {
      setError("Please enter a valid email and password.");
      return;
    }
    onLogin({ email, name: email.split("@")[0] });
    navigate("home");
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <Card style={{ padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: T.radiusFull, background: T.primaryLighter,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <Database size={24} color={T.primary} />
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ color: T.textSecondary, fontSize: 14, margin: "6px 0 0", lineHeight: 1.5 }}>
            {mode === "login" ? "Sign in to submit experience reports" : "Email verification required"}
          </p>
        </div>

        {error && (
          <div style={{
            background: T.dangerLight, color: T.danger, padding: "10px 14px",
            borderRadius: T.radius, fontSize: 13, fontWeight: 500, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        </div>

        <Button size="lg" onClick={handleSubmit} style={{ width: "100%", justifyContent: "center" }}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => setMode(m => m === "login" ? "register" : "login")}
            style={{
              background: "none", border: "none", color: T.primaryLight,
              cursor: "pointer", fontSize: 14, fontWeight: 600,
            }}>
            {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [pageParam, setPageParam] = useState(null);
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const navigate = useCallback((p, param) => { setPage(p); setPageParam(param||null); window.scrollTo(0,0); }, []);
  const handleSubmit = useCallback(report => setReports(prev => [report, ...prev]), []);
  const handleFlag = useCallback((id, flagged) => setReports(prev => prev.map(r => r.id===id ? {...r,flagged}:r)), []);
  const handleRemove = useCallback(id => setReports(prev => prev.filter(r => r.id!==id)), []);

  const navItems = [
    { id: "home", label: "Home", icon: <Database size={15} /> },
    { id: "browse", label: "Browse", icon: <Search size={15} /> },
    { id: "submit", label: "Submit", icon: <Plus size={15} /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp size={15} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.fontFamily }}>
      {/* ── HEADER ── */}
      <header style={{
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`, padding: "0 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <button onClick={() => navigate("home")} style={{
              display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: T.radiusSm, background: T.primary,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Database size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: T.text, letterSpacing: -0.3 }}>PeptideTracker</span>
            </button>

            <nav style={{ display: "flex", gap: 2 }}>
              {navItems.map(n => {
                const active = page === n.id;
                return (
                  <button key={n.id} onClick={() => navigate(n.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                      borderRadius: T.radius, border: "none", fontSize: 13, cursor: "pointer",
                      fontWeight: active ? 700 : 500, transition: "all 0.15s",
                      background: active ? T.primaryLighter : "transparent",
                      color: active ? T.primary : T.textSecondary,
                    }}>
                    {n.icon} {n.label}
                  </button>
                );
              })}
              {user && (
                <button onClick={() => navigate("moderation")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                    borderRadius: T.radius, border: "none", fontSize: 13, cursor: "pointer",
                    fontWeight: page === "moderation" ? 700 : 500, transition: "all 0.15s",
                    background: page === "moderation" ? T.primaryLighter : "transparent",
                    color: page === "moderation" ? T.primary : T.textSecondary,
                  }}>
                  <Shield size={15} /> Mod
                </button>
              )}
            </nav>
          </div>

          <div>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: T.radiusFull, background: T.primaryLighter,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: T.primary,
                }}>
                  {user.email[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, color: T.textSecondary, fontWeight: 500 }}>{user.name}</span>
                <Button variant="ghost" size="sm" onClick={() => setUser(null)}><LogOut size={14} /></Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => navigate("login")}><LogIn size={14} /> Sign In</Button>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 24px 64px" }}>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "browse" && <BrowsePage navigate={navigate} reports={reports} />}
        {page === "peptide" && <PeptideDetailPage peptideId={pageParam} navigate={navigate} reports={reports} />}
        {page === "submit" && <SubmitPage user={user} navigate={navigate} onSubmit={handleSubmit} />}
        {page === "analytics" && <AnalyticsPage reports={reports} />}
        {page === "moderation" && <ModerationPage reports={reports} onFlag={handleFlag} onRemove={handleRemove} />}
        {page === "login" && <LoginPage onLogin={setUser} navigate={navigate} />}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "24px", background: T.surface }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Database size={14} color={T.textMuted} />
            <span style={{ fontSize: 12, color: T.textMuted }}>
              PeptideTracker -- User-reported experiences only. Not medical advice.
            </span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
            {["Terms of Service","Privacy Policy","Content Guidelines"].map(l => (
              <span key={l} style={{ color: T.textMuted, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
