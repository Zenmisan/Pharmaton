/* ════════════════════════════════════════════════════════════════
   PharmaConnect AI — app.js
   React via CDN + Babel (no build step). All components in one file.

   AI SETUP:
   Add your Anthropic API key below to enable AI features.
   For production, proxy this through your own backend instead of
   exposing the key in frontend code.
════════════════════════════════════════════════════════════════ */

const { useState, useEffect, useRef } = React;

/* ─── API KEY CONFIG ─────────────────────────────────────────── */
const API_KEY = ""; // <-- paste your Anthropic API key here

/* ─── COLOR TOKENS ───────────────────────────────────────────── */
const T = {
  blue:       "#1B3FC4",
  blueDeep:   "#0F2A8E",
  blueLight:  "#E8EDFB",
  green:      "#15803D",
  greenMid:   "#16A34A",
  greenLight: "#DCFCE7",
  teal:       "#0D9488",
  purple:     "#7C3AED",
  white:      "#FFFFFF",
  bg:         "#F4F8F4",
  surface:    "#FFFFFF",
  border:     "#E2E8F0",
  text:       "#0F172A",
  muted:      "#64748B",
  subtle:     "#94A3B8",
  danger:     "#DC2626",
  warning:    "#D97706",
  gMain:      "linear-gradient(135deg,#1B3FC4 0%,#15803D 100%)",
  gGreen:     "linear-gradient(135deg,#15803D 0%,#22C55E 100%)",
  gTeal:      "linear-gradient(135deg,#0D9488 0%,#1B3FC4 100%)",
  gPurple:    "linear-gradient(135deg,#7C3AED 0%,#1B3FC4 100%)",
};

/* ─── AI HELPER ──────────────────────────────────────────────── */
async function callAI(system, user) {
  if (!API_KEY) return "AI features require an API key. Add your Anthropic API key to the API_KEY constant in app.js.";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const d = await r.json();
    if (d.error) return `AI error: ${d.error.message}`;
    return d.content?.map(i => i.text || "").join("") || "";
  } catch (e) {
    return "AI unavailable. Please check your connection and API key.";
  }
}

/* ─── LOGO ───────────────────────────────────────────────────── */
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="18" cy="28" r="6" fill={T.blue} />
      <circle cx="8"  cy="52" r="5" fill={T.blue} />
      <circle cx="32" cy="14" r="5" fill={T.blue} />
      <line x1="18" y1="28" x2="8"  y2="52" stroke={T.blue}    strokeWidth="2.5" />
      <line x1="18" y1="28" x2="32" y2="14" stroke={T.blue}    strokeWidth="2.5" />
      <line x1="18" y1="28" x2="46" y2="27" stroke={T.blue}    strokeWidth="2.5" />
      <circle cx="82" cy="28" r="6" fill={T.greenMid} />
      <circle cx="92" cy="52" r="5" fill={T.greenMid} />
      <circle cx="68" cy="14" r="5" fill={T.greenMid} />
      <line x1="82" y1="28" x2="92" y2="52" stroke={T.greenMid} strokeWidth="2.5" />
      <line x1="82" y1="28" x2="68" y2="14" stroke={T.greenMid} strokeWidth="2.5" />
      <line x1="82" y1="28" x2="54" y2="27" stroke={T.greenMid} strokeWidth="2.5" />
      <path d="M50 8 C34 8 23 21 23 35 C23 53 50 80 50 80 C50 80 77 53 77 35 C77 21 66 8 50 8Z" fill="url(#lg)" />
      <defs>
        <linearGradient id="lg" x1="23" y1="8" x2="77" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={T.blue} />
          <stop offset="100%" stopColor={T.greenMid} />
        </linearGradient>
      </defs>
      <rect x="40" y="20" width="20" height="20" rx="3" fill="white" />
      <rect x="48" y="22" width="4"  height="16" rx="2" fill={T.greenMid} />
      <rect x="41" y="28" width="18" height="4"  rx="2" fill={T.greenMid} />
      <ellipse cx="50" cy="82" rx="9" ry="3.5" fill="rgba(0,0,0,0.12)" />
    </svg>
  );
}

/* ─── STOCK BADGE ────────────────────────────────────────────── */
function Badge({ status }) {
  const cfg = {
    "In Stock":     { bg: T.greenLight, color: T.green,   dot: T.greenMid },
    "Low Stock":    { bg: "#FEF9C3",    color: "#92400E", dot: T.warning  },
    "Out of Stock": { bg: "#FEE2E2",    color: T.danger,  dot: T.danger   },
  };
  const c = cfg[status] || cfg["In Stock"];
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

/* ─── CARD ───────────────────────────────────────────────────── */
function Card({ children, style = {}, onClick, className = "", onMouseEnter, onMouseLeave }) {
  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ background: T.surface, borderRadius: 16, padding: 20, border: `1px solid ${T.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: onClick ? "pointer" : "default", transition: "box-shadow .15s", ...style }}
    >
      {children}
    </div>
  );
}

/* ─── BUTTON ─────────────────────────────────────────────────── */
function Btn({ children, variant = "primary", onClick, style = {}, full, size = "md", gradient }) {
  const pad = size === "lg" ? "14px 28px" : size === "sm" ? "7px 14px" : "10px 20px";
  const fs  = size === "lg" ? 16 : size === "sm" ? 12 : 14;
  const bases = {
    primary:   { background: gradient || T.gMain, color: "#fff", border: "none" },
    secondary: { background: T.white, color: T.blue, border: `1.5px solid ${T.blue}` },
    ghost:     { background: "transparent", color: T.muted, border: `1px solid ${T.border}` },
    danger:    { background: "#FEE2E2", color: T.danger, border: `1px solid ${T.danger}40` },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...bases[variant], borderRadius: 12, padding: pad, fontSize: fs, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 7, justifyContent: "center", width: full ? "100%" : "auto", ...style }}
    >
      {children}
    </button>
  );
}

/* ─── NAV ────────────────────────────────────────────────────── */
function Nav({ page, setPage, userType, onSignOut }) {
  const [open, setOpen] = useState(false);
  const links = userType === "patient"
    ? [["home","Home"],["search","Search Medicine"],["map","Find Pharmacies"],["alerts","Safety Alerts"]]
    : userType === "pharmacist"
    ? [["dashboard","Dashboard"],["inventory","Inventory"],["sourcing","Sourcing"],["insights","AI Insights"]]
    : userType === "hospital"
    ? [["dashboard","Dashboard"],["emergency","Emergency"],["orders","Orders"],["insights","AI Insights"]]
    : [["dashboard","Dashboard"],["stock","My Stock"],["requests","Requests"],["analytics","Analytics"]];

  return (
    <nav style={{ background: T.white, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 32 }}>
        <button onClick={() => setPage("landing")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", flexShrink: 0, cursor: "pointer" }}>
          <Logo size={34} />
          <span style={{ fontWeight: 900, fontSize: 18, color: T.text }}>
            Pharma<span style={{ color: T.greenMid }}>Connect</span>
            <span style={{ fontSize: 13, fontWeight: 800, marginLeft: 5, border: `1px solid ${T.border}`, padding: "1px 6px", borderRadius: 6, color: T.blue }}> AI</span>
          </span>
        </button>

        <div className="nav-links" style={{ display: "flex", gap: 4, flex: 1 }}>
          {links.map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)}
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: page === id ? T.blueLight : "transparent", color: page === id ? T.blue : T.muted, fontWeight: 600, fontSize: 14, transition: "all .15s", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setPage("alerts")} style={{ position: "relative", background: "none", border: "none", fontSize: 20, padding: 6, cursor: "pointer" }}>
            🔔
            <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: T.danger, border: "2px solid white" }} />
          </button>
          <button onClick={() => setPage("profile")}
            style={{ padding: "7px 16px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.white, color: T.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Profile
          </button>
          <button onClick={onSignOut}
            style={{ padding: "7px 16px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.white, color: T.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Switch Role
          </button>
          <button className="hamburger" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 22, display: "none", cursor: "pointer" }}>☰</button>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(([id, label]) => (
            <button key={id} onClick={() => { setPage(id); setOpen(false); }}
              style={{ padding: "12px 16px", borderRadius: 10, border: "none", background: page === id ? T.blueLight : "transparent", color: page === id ? T.blue : T.text, fontWeight: 600, fontSize: 15, textAlign: "left", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── LANDING PAGE ───────────────────────────────────────────── */
function Landing({ onChoose }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: T.gMain, padding: "80px 24px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#86EFAC", display: "inline-block" }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>AI-Powered Pharmaceutical Platform · Nigeria</span>
          </div>
          <div><Logo size={72} /></div>
          <h1 style={{ color: "#fff", fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, margin: "20px 0 16px", lineHeight: 1.1, letterSpacing: -1 }}>
            Medicine Access,<br /><span style={{ color: "#86EFAC" }}>Reimagined for Africa</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(15px,2vw,18px)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Connecting patients, pharmacists, hospitals and suppliers through AI-driven medicine visibility and real-time availability.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" onClick={() => onChoose(null)} style={{ background: T.white, color: T.blue, borderRadius: 14 }}>Get Started Free</Btn>
            <Btn size="lg" variant="secondary" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff", background: "rgba(255,255,255,0.1)", borderRadius: 14 }}>Watch Demo</Btn>
          </div>
        </div>
      </div>

      {/* Role cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Built for Everyone in the Chain</h2>
        <p style={{ textAlign: "center", color: T.muted, marginBottom: 40 }}>Choose your role to access a tailored experience</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {[
            { id:"patient",    icon:"🧑‍⚕️", label:"Patient",              desc:"Search medicines, find nearby pharmacies, get safety alerts",            color:T.blue,   grad:T.gMain   },
            { id:"pharmacist", icon:"💊",    label:"Community Pharmacist", desc:"Manage inventory, source medicines, access AI insights",                  color:T.greenMid,grad:T.gGreen },
            { id:"hospital",   icon:"🏥",    label:"Hospital Pharmacist",  desc:"Emergency sourcing, bulk orders, verified supplier access",               color:T.teal,   grad:T.gTeal   },
            { id:"supplier",   icon:"🚚",    label:"Supplier / Distributor",desc:"List stock, receive requests, monitor demand trends",                    color:T.purple, grad:T.gPurple },
          ].map(u => (
            <Card key={u.id} onClick={() => onChoose(u.id)} style={{ textAlign: "center", padding: 28, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${u.color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: `${u.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 16px" }}>{u.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{u.label}</h3>
              <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{u.desc}</p>
              <Btn full gradient={u.grad} onClick={() => onChoose(u.id)}>Enter as {u.label.split(" ")[0]}</Btn>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background: T.white, padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Why PharmaConnect AI?</h2>
          <p style={{ textAlign: "center", color: T.muted, marginBottom: 48 }}>Because medicine access shouldn't depend on WhatsApp groups and guesswork.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {[
              { icon:"🌍", title:"Multilingual AI Search",      desc:"Search in English, Yoruba, Hausa, Igbo or French. Our AI understands local names, corrects spelling, and finds matches." },
              { icon:"📍", title:"Location-Based Visibility",   desc:"See only pharmacies near you with real-time stock status — In Stock, Low, or Out of Stock — at a glance." },
              { icon:"💰", title:"Budget-Aware Matching",       desc:"Search within your budget. Compare generic and branded options. Find the most affordable verified medicine nearby." },
              { icon:"🔗", title:"Pharmacy-to-Pharmacy",        desc:"Pharmacists can source scarce medicines from other verified pharmacies when suppliers can't deliver fast enough." },
              { icon:"🛡️", title:"Verified Network",            desc:"Every pharmacy and supplier is PCN licensed, CAC registered, and NAFDAC approved before appearing on the platform." },
              { icon:"🚨", title:"Safety & Recall Alerts",      desc:"Instant notifications on counterfeits, NAFDAC recalls, packaging updates, and supply-chain safety notices." },
            ].map(f => (
              <div key={f.title} style={{ display: "flex", gap: 16, padding: "20px 0" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div><h4 style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{f.title}</h4><p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: T.gMain, padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32, textAlign: "center" }}>
          {[["10,000+","Verified Pharmacies"],["5 Languages","Multilingual AI"],["Real-time","Stock Visibility"],["NAFDAC","Compliance Ready"]].map(([v,l]) => (
            <div key={l}>
              <div style={{ color: "#86EFAC", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>{v}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: T.text, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <Logo size={28} /><span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>PharmaConnect AI</span>
        </div>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>Connecting Care. Connecting Medicines. · Nigeria</p>
      </footer>
    </div>
  );
}

/* ─── CHOOSE ROLE ────────────────────────────────────────────── */
function ChooseRole({ onSelect }) {
  const types = [
    { id:"patient",    icon:"🧑‍⚕️", label:"Patient",              desc:"Find medicines, compare prices, locate pharmacies",                      color:T.blue   },
    { id:"pharmacist", icon:"💊",    label:"Community Pharmacist", desc:"Manage inventory, source medicines, get AI demand insights",              color:T.greenMid },
    { id:"hospital",   icon:"🏥",    label:"Hospital Pharmacist",  desc:"Emergency sourcing, bulk orders, verified supplier access",               color:T.teal   },
    { id:"supplier",   icon:"🚚",    label:"Supplier / Distributor",desc:"List medicines, receive pharmacy requests, market analytics",            color:T.purple },
  ];
  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <Logo size={48} />
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: "16px 0 6px", textAlign: "center" }}>Welcome to PharmaConnect AI</h2>
      <p style={{ color: T.muted, marginBottom: 40, textAlign: "center" }}>Select your role to get started</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, maxWidth: 700, width: "100%" }}>
        {types.map(t => (
          <Card key={t.id} onClick={() => onSelect(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", cursor: "pointer", transition: "all .15s", border: "2px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.boxShadow = `0 8px 24px ${t.color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{t.label}</div>
              <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>{t.desc}</div>
            </div>
            <span style={{ color: T.muted, fontSize: 20 }}>›</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── ALERTS PAGE ────────────────────────────────────────────── */
function AlertsPage() {
  const alerts = [
    { type:"danger",  icon:"⚠️", title:"NAFDAC Recall Alert",   body:"Counterfeit Tramadol 200mg has been reported across Lagos. Do not dispense or purchase from unverified sources. Report suspicious medicines to NAFDAC immediately.", time:"2 hours ago",  tag:"RECALL"   },
    { type:"warning", icon:"📉", title:"Shortage Alert",         body:"Augmentin 625mg showing critically low availability across Lagos pharmacies this week. Consider stocking alternatives like Amoxicillin-Clavulanate.", time:"5 hours ago",  tag:"SHORTAGE"  },
    { type:"info",    icon:"📦", title:"Packaging Update",       body:"Emzor Paracetamol 500mg has a new packaging design. New batch features a blue stripe on white box. Old packaging remains valid and safe.", time:"1 day ago",    tag:"UPDATE"    },
    { type:"success", icon:"✅", title:"Safety Clearance",       body:"Metformin 850mg from Greenfield Pharmaceuticals has been cleared following investigation. Safe for dispensing. All batches from Jan 2025 onwards are verified.", time:"2 days ago",   tag:"CLEARED"   },
    { type:"info",    icon:"🔔", title:"Supply Notification",    body:"Insulin Actrapid 100IU has been restocked at 3 verified suppliers near Lagos Island. Availability now rated HIGH. Check the platform for current pricing.", time:"3 days ago",   tag:"SUPPLY"    },
    { type:"warning", icon:"🔍", title:"Verification Required",  body:"Several unverified sellers of Ozempic have been flagged in Abuja. Only purchase from Verified Premium Partners on PharmaConnect AI.", time:"4 days ago",   tag:"ALERT"     },
  ];
  const cols = {
    danger:  { bg:"#FEF2F2", border:T.danger,  text:T.danger,  tag:"#FEE2E2" },
    warning: { bg:"#FFFBEB", border:T.warning, text:"#92400E", tag:"#FEF9C3" },
    info:    { bg:"#EFF6FF", border:T.blue,    text:T.blue,    tag:"#DBEAFE" },
    success: { bg:"#F0FDF4", border:T.green,   text:T.green,   tag:T.greenLight },
  };
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Safety & Alerts</h1>
          <p style={{ color: T.muted, fontSize: 14 }}>Official NAFDAC notices, recalls and supply updates</p>
        </div>
        <Btn variant="ghost" size="sm">Mark all read</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {alerts.map((a, i) => {
          const c = cols[a.type];
          return (
            <div key={i} className="fade-in" style={{ background: c.bg, border: `1px solid ${c.border}30`, borderLeft: `4px solid ${c.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 800, color: c.text, fontSize: 15 }}>{a.title}</span>
                      <span style={{ background: c.tag, color: c.text, fontSize: 10, fontWeight: 800, borderRadius: 6, padding: "2px 8px" }}>{a.tag}</span>
                    </div>
                    <span style={{ color: T.subtle, fontSize: 12 }}>{a.time}</span>
                  </div>
                  <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7 }}>{a.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAP PAGE ───────────────────────────────────────────────── */
function MapPage() {
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const pharmacies = [
    { id:0, name:"HealthPlus Pharmacy",  dist:"1.2 km", status:"In Stock",     price:"₦500–₦1,200",  address:"12 Bode Thomas St, Surulere",    hours:"8AM–9PM",  rating:4.6, reviews:128, x:230, y:140 },
    { id:1, name:"CarePoint Pharmacy",   dist:"2.1 km", status:"Low Stock",    price:"₦450–₦980",   address:"45 Adeniran Ogunsanya, Surulere", hours:"8AM–8PM",  rating:4.3, reviews:89,  x:340, y:190 },
    { id:2, name:"MedLine Pharmacy",     dist:"3.4 km", status:"In Stock",     price:"₦550–₦1,100", address:"7 Western Ave, Surulere",         hours:"24hrs",    rating:4.8, reviews:203, x:180, y:230 },
    { id:3, name:"Pristine Pharmacy",    dist:"4.1 km", status:"Out of Stock", price:"₦400–₦900",   address:"22 Akerele St, Surulere",         hours:"8AM–7PM",  rating:3.9, reviews:52,  x:400, y:140 },
    { id:4, name:"MediCare Plus",        dist:"5.0 km", status:"In Stock",     price:"₦600–₦1,300", address:"5 Eric Moore Rd, Surulere",       hours:"24hrs",    rating:4.7, reviews:176, x:280, y:270 },
    { id:5, name:"PharmaCare",           dist:"5.8 km", status:"Low Stock",    price:"₦350–₦850",   address:"18 Benson St, Surulere",          hours:"8AM–8PM",  rating:4.1, reviews:64,  x:160, y:160 },
  ];
  const dc = { "In Stock": T.greenMid, "Low Stock": T.warning, "Out of Stock": T.danger };
  const filtered = filter === "All" ? pharmacies : pharmacies.filter(p => p.status === filter);
  const selP = sel !== null ? pharmacies.find(p => p.id === sel) : null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Nearby Pharmacies</h1>
      <p style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>Showing pharmacies within 10km of Surulere, Lagos</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All","In Stock","Low Stock","Out of Stock"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 16px", borderRadius: 99, border: `1.5px solid ${filter===f?T.blue:T.border}`, background: filter===f?T.blueLight:T.white, color: filter===f?T.blue:T.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
        {/* SVG Map */}
        <div style={{ background: "#E8F0E8", borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`, position: "relative", minHeight: 420 }}>
          <svg width="100%" height="420" viewBox="0 0 540 420">
            {[80,180,280,380].map(y => <line key={y} x1="0" y1={y} x2="540" y2={y} stroke="white" strokeWidth="14"/>)}
            {[100,220,340,460].map(x => <line key={x} x1={x} y1="0" x2={x} y2="420" stroke="white" strokeWidth="14"/>)}
            {[[10,10,90,170],[110,10,210,170],[230,10,330,170],[350,10,450,170],
              [10,190,90,270],[110,190,210,270],[230,190,330,270],[350,190,450,270],
              [10,290,90,410],[110,290,210,410],[230,290,330,410]].map((b,i) => (
              <rect key={i} x={b[0]} y={b[1]} width={b[2]-b[0]} height={b[3]-b[1]} fill="#C8DEC8" rx="6"/>
            ))}
            <text x="12" y="340" fontSize="11" fill="#666">Surulere</text>
            <text x="360" y="340" fontSize="11" fill="#666">Lagos Island</text>
            <circle cx="270" cy="210" r="16" fill={T.blue} opacity="0.18"/>
            <circle cx="270" cy="210" r="9"  fill={T.blue}/>
            <circle cx="270" cy="210" r="4"  fill="white"/>
            <text x="270" y="234" textAnchor="middle" fontSize="10" fill={T.blue} fontWeight="bold">You</text>
            {filtered.map(p => (
              <g key={p.id} onClick={() => setSel(sel===p.id?null:p.id)} style={{ cursor:"pointer" }}>
                <circle cx={p.x} cy={p.y} r={sel===p.id?22:16} fill={dc[p.status]} opacity="0.18"/>
                <circle cx={p.x} cy={p.y} r={sel===p.id?14:11} fill={dc[p.status]}/>
                <text x={p.x} y={p.y+4} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">+</text>
                {sel===p.id && <text x={p.x} y={p.y-20} textAnchor="middle" fontSize="10" fill={T.text} fontWeight="bold">{p.name.split(" ")[0]}</text>}
              </g>
            ))}
          </svg>
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.95)", borderRadius: 12, padding: "10px 14px", backdropFilter: "blur(8px)" }}>
            {[["In Stock",T.greenMid],["Low Stock",T.warning],["Out of Stock",T.danger]].map(([l,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4, fontSize:12 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:c, display:"inline-block" }}/>
                <span style={{ color:T.muted, fontWeight:500 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {selP && (
            <Card className="fade-in" style={{ border: `2px solid ${T.blue}`, marginBottom: 4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <h3 style={{ fontSize:16, fontWeight:800 }}>{selP.name}</h3><Badge status={selP.status}/>
              </div>
              <p style={{ color:T.muted, fontSize:12, marginBottom:3 }}>⭐ {selP.rating} ({selP.reviews} reviews)</p>
              <p style={{ color:T.muted, fontSize:12, marginBottom:3 }}>📍 {selP.address}</p>
              <p style={{ color:T.muted, fontSize:12, marginBottom:10 }}>🕐 {selP.hours} · 📍 {selP.dist}</p>
              <p style={{ color:T.greenMid, fontWeight:700, marginBottom:12 }}>{selP.price}</p>
              <div style={{ display:"flex", gap:8 }}>
                <Btn full variant="secondary" size="sm">🗺️ Directions</Btn>
                <Btn full size="sm">📞 Call</Btn>
              </div>
            </Card>
          )}
          {filtered.map(p => (
            <Card key={p.id} onClick={() => setSel(sel===p.id?null:p.id)}
              style={{ padding:"14px 16px", cursor:"pointer", border:`1.5px solid ${sel===p.id?T.blue:T.border}`, transition:"all .15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontWeight:700, fontSize:14 }}>{p.name}</span><Badge status={p.status}/>
              </div>
              <p style={{ color:T.muted, fontSize:12 }}>📍 {p.dist} · ⭐ {p.rating}</p>
              <p style={{ color:T.greenMid, fontWeight:600, fontSize:13, marginTop:2 }}>{p.price}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PATIENT HOME ───────────────────────────────────────────── */
function PatientHome({ setPage }) {
  return (
    <div>
      <div style={{ background: T.gMain, padding: "48px 24px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:13, marginBottom:4 }}>📍 Surulere, Lagos</p>
          <h1 style={{ color:"#fff", fontSize:"clamp(24px,4vw,40px)", fontWeight:900, marginBottom:12 }}>Good morning 👋<br/>What medicine do you need?</h1>
          <div style={{ background:T.white, borderRadius:16, padding:"12px 16px", display:"flex", gap:12, maxWidth:600, alignItems:"center" }}>
            <span style={{ fontSize:20 }}>🔍</span>
            <input placeholder="Search medicine name..." onClick={() => setPage("search")} readOnly
              style={{ flex:1, border:"none", outline:"none", fontSize:16, color:T.text, cursor:"pointer", background:"transparent" }} />
            <button onClick={() => setPage("search")} style={{ background:T.gMain, border:"none", borderRadius:10, padding:"10px 20px", color:"#fff", fontWeight:700, cursor:"pointer" }}>Search</button>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
            {["Paracetamol","Amoxicillin","Augmentin","Metformin","Amlodipine"].map(s => (
              <button key={s} onClick={() => setPage("search")} style={{ padding:"6px 14px", borderRadius:99, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", fontSize:12, cursor:"pointer", fontWeight:500 }}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px" }}>
        <div style={{ background:"#FEF9C3", border:`1px solid ${T.warning}`, borderRadius:14, padding:"14px 20px", marginBottom:28, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:22 }}>⚠️</span>
          <div>
            <strong style={{ color:"#92400E", fontSize:14 }}>NAFDAC Alert: </strong>
            <span style={{ color:"#92400E", fontSize:13 }}>Counterfeit Tramadol 200mg reported across Lagos. Only purchase from verified pharmacies.</span>
          </div>
          <button onClick={() => setPage("alerts")} style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:10, border:`1px solid ${T.warning}`, background:"transparent", color:"#92400E", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>View All Alerts</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:36 }}>
          {[
            { icon:"🔍", label:"Search Medicine", sub:"AI-powered search", page:"search", color:T.blue },
            { icon:"🗺️", label:"Find Pharmacies", sub:"Near me now",       page:"map",    color:T.greenMid },
            { icon:"🔔", label:"Safety Alerts",   sub:"6 active alerts",   page:"alerts", color:T.warning },
            { icon:"💰", label:"Budget Search",   sub:"Filter by price",   page:"search", color:T.teal },
          ].map(a => (
            <Card key={a.label} onClick={() => setPage(a.page)} style={{ display:"flex", alignItems:"center", gap:14, padding:16, cursor:"pointer", transition:"all .15s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow=`0 8px 24px ${a.color}20`}
              onMouseLeave={e => e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${a.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{a.icon}</div>
              <div><p style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{a.label}</p><p style={{ color:T.muted, fontSize:12 }}>{a.sub}</p></div>
            </Card>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:20, fontWeight:800 }}>Nearby Pharmacies</h2>
          <button onClick={() => setPage("map")} style={{ color:T.blue, background:"none", border:"none", fontWeight:600, fontSize:14, cursor:"pointer" }}>View map →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
          {[
            { name:"HealthPlus Pharmacy", dist:"1.2 km", status:"In Stock",  price:"₦500–₦1,200", rating:4.6, verified:true },
            { name:"MedLine Pharmacy",    dist:"3.4 km", status:"In Stock",  price:"₦550–₦1,100", rating:4.8, verified:true },
            { name:"CarePoint Pharmacy",  dist:"2.1 km", status:"Low Stock", price:"₦450–₦980",  rating:4.3, verified:true },
          ].map(p => (
            <Card key={p.name} style={{ padding:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:14 }}>{p.name}</span><Badge status={p.status}/>
              </div>
              <p style={{ color:T.muted, fontSize:12, marginBottom:4 }}>📍 {p.dist} · ⭐ {p.rating}{p.verified?" · ✅ PCN":""}</p>
              <p style={{ color:T.greenMid, fontWeight:700, fontSize:14, marginBottom:12 }}>{p.price}</p>
              <div style={{ display:"flex", gap:8 }}>
                <Btn full variant="secondary" size="sm">Directions</Btn>
                <Btn full size="sm">Call</Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SEARCH PAGE ────────────────────────────────────────────── */
function SearchPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [pharmacies, setPharmacies] = useState(null);
  const [budget, setBudget] = useState("");
  const [lang, setLang] = useState("English");

  const mockPharma = [
    { id:0, name:"HealthPlus Pharmacy",  dist:"1.2 km", status:"In Stock",  price:"₦500–₦1,200",  address:"12 Bode Thomas St, Surulere",    hours:"8AM–9PM",  rating:4.6, reviews:128, verified:true },
    { id:1, name:"CarePoint Pharmacy",   dist:"2.1 km", status:"Low Stock", price:"₦450–₦980",   address:"45 Adeniran Ogunsanya, Surulere", hours:"8AM–8PM",  rating:4.3, reviews:89,  verified:true },
    { id:2, name:"MedLine Pharmacy",     dist:"3.4 km", status:"In Stock",  price:"₦550–₦1,100", address:"7 Western Ave, Surulere",         hours:"24hrs",    rating:4.8, reviews:203, verified:true },
  ];

  async function doSearch() {
    if (!q.trim()) return;
    setLoading(true); setAiResult(null); setPharmacies(null);
    const raw = await callAI(
      `You are PharmaConnect AI for Nigeria. Respond ONLY with valid JSON, no markdown, no extra text:
{"drugName":"full medicine name","category":"drug category","uses":"what it treats in one clear sentence","alternatives":["alternative1","alternative2","alternative3"],"safetyNote":"one important safety or dispensing note for Nigeria","availability":"general availability status in Nigerian pharmacies","dosageForm":"tablet/syrup/injection etc","commonBrands":["brand1","brand2"]}`,
      `Search for medicine: "${q}"${budget ? ` Budget: ${budget}` : ""}${lang !== "English" ? ` Language: ${lang}` : ""}`
    );
    try { setAiResult(JSON.parse(raw.replace(/```json|```/g, "").trim())); }
    catch { setAiResult({ drugName: q, uses: "Medicine found. Check with your pharmacist for full details.", alternatives: [], safetyNote: "", availability: "Available at select pharmacies" }); }
    setPharmacies(mockPharma);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Search for Medicines</h1>
      <p style={{ color: T.muted, marginBottom: 32 }}>AI-powered search with local language support, spelling correction and alternatives</p>

      <Card style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "end" }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, display: "block", marginBottom: 6 }}>MEDICINE NAME</label>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key==="Enter"&&doSearch()}
              placeholder="e.g. Paracetamol, Augmentin, Insulin..."
              style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"12px 16px", fontSize:15, outline:"none" }}
              onFocus={e => e.target.style.borderColor=T.blue} onBlur={e => e.target.style.borderColor=T.border} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, display: "block", marginBottom: 6 }}>LANGUAGE</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ border:`1.5px solid ${T.border}`, borderRadius:12, padding:"12px 14px", fontSize:14, outline:"none", background:T.white, color:T.text }}>
              {["English","Yoruba","Hausa","Igbo","French"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, display: "block", marginBottom: 6 }}>BUDGET (OPTIONAL)</label>
            <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. ₦500"
              style={{ width:130, border:`1.5px solid ${T.border}`, borderRadius:12, padding:"12px 14px", fontSize:14, outline:"none" }} />
          </div>
        </div>
        <div style={{ marginTop: 16, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
          <Btn size="lg" onClick={doSearch} style={{ minWidth:160 }}>
            {loading ? <span className="spin">⏳</span> : "🔍"} Search Medicine
          </Btn>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["Paracetamol","Amoxicillin","Metformin","Augmentin","Amlodipine","Insulin"].map(s => (
              <button key={s} onClick={() => setQ(s)} style={{ padding:"6px 14px", borderRadius:99, border:`1px solid ${T.border}`, background:T.white, color:T.muted, fontSize:12, cursor:"pointer", fontWeight:500 }}>{s}</button>
            ))}
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="fade-in" style={{ marginBottom:20, textAlign:"center", padding:40 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
          <p style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>PharmaConnect AI is searching...</p>
          <p style={{ color:T.muted, fontSize:14 }}>Checking spelling · Matching drugs · Finding alternatives</p>
        </Card>
      )}

      {aiResult && !loading && (
        <Card className="fade-in" style={{ marginBottom:20, border:`1.5px solid ${T.blue}25`, background:`linear-gradient(135deg,${T.blueLight}40,${T.greenLight}40)` }}>
          <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:T.gMain, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🤖</div>
            <div>
              <h2 style={{ fontSize:20, fontWeight:900, marginBottom:2 }}>{aiResult.drugName}</h2>
              {aiResult.category && <p style={{ color:T.muted, fontSize:13 }}>{aiResult.category}{aiResult.dosageForm ? ` · ${aiResult.dosageForm}` : ""}</p>}
            </div>
            <span style={{ marginLeft:"auto", background:T.greenLight, color:T.green, fontSize:11, fontWeight:700, borderRadius:8, padding:"4px 10px" }}>AI VERIFIED</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14, marginBottom:16 }}>
            {aiResult.uses && <div style={{ background:T.white, borderRadius:12, padding:"12px 14px" }}><p style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:4 }}>WHAT IT TREATS</p><p style={{ fontSize:14 }}>{aiResult.uses}</p></div>}
            {aiResult.availability && <div style={{ background:T.white, borderRadius:12, padding:"12px 14px" }}><p style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:4 }}>NIGERIA AVAILABILITY</p><p style={{ fontSize:14 }}>{aiResult.availability}</p></div>}
            {aiResult.commonBrands?.length > 0 && <div style={{ background:T.white, borderRadius:12, padding:"12px 14px" }}><p style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:4 }}>COMMON BRANDS</p><p style={{ fontSize:14 }}>{aiResult.commonBrands.join(", ")}</p></div>}
          </div>
          {aiResult.alternatives?.length > 0 && (
            <div style={{ marginBottom:12 }}>
              <p style={{ fontSize:12, fontWeight:700, color:T.muted, marginBottom:8 }}>AI-SUGGESTED ALTERNATIVES</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {aiResult.alternatives.map(a => (
                  <button key={a} onClick={() => { setQ(a); doSearch(); }}
                    style={{ padding:"6px 14px", borderRadius:99, border:`1.5px solid ${T.greenMid}`, background:T.greenLight, color:T.green, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    {a} →
                  </button>
                ))}
              </div>
            </div>
          )}
          {aiResult.safetyNote && (
            <div style={{ background:"#FEF9C3", borderRadius:10, padding:"10px 14px", border:`1px solid ${T.warning}40` }}>
              <p style={{ color:"#92400E", fontSize:13 }}>⚠️ <strong>Safety Note:</strong> {aiResult.safetyNote}</p>
            </div>
          )}
        </Card>
      )}

      {pharmacies && !loading && (
        <div className="fade-in">
          <h3 style={{ fontWeight:800, fontSize:18, marginBottom:16 }}>📍 {pharmacies.length} Pharmacies Near You</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
            {pharmacies.map(p => (
              <Card key={p.id} style={{ transition:"all .15s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <h4 style={{ fontWeight:700, fontSize:15 }}>{p.name}</h4><Badge status={p.status}/>
                </div>
                {p.verified && <p style={{ color:T.green, fontSize:12, fontWeight:600, marginBottom:6 }}>✅ PCN Verified</p>}
                <p style={{ color:T.muted, fontSize:12, marginBottom:2 }}>📍 {p.dist} · {p.address}</p>
                <p style={{ color:T.muted, fontSize:12, marginBottom:8 }}>🕐 {p.hours} · ⭐ {p.rating} ({p.reviews})</p>
                <p style={{ color:T.greenMid, fontWeight:700, fontSize:15, marginBottom:14 }}>{p.price}</p>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn full variant="secondary" size="sm">🗺️ Directions</Btn>
                  <Btn full size="sm">📞 Call</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PHARMACIST DASHBOARD ───────────────────────────────────── */
function PharmacistDashboard({ setPage }) {
  const [iq, setIq] = useState(""); const [ir, setIr] = useState(""); const [il, setIl] = useState(false);
  const inv = [
    { name:"Amoxicillin 500mg", stock:240, status:"In Stock",     expiry:"Dec 2025" },
    { name:"Paracetamol 500mg", stock:18,  status:"Low Stock",    expiry:"Mar 2026" },
    { name:"Augmentin 625mg",   stock:0,   status:"Out of Stock", expiry:"—" },
    { name:"Metformin 850mg",   stock:120, status:"In Stock",     expiry:"Jun 2026" },
    { name:"Amlodipine 5mg",    stock:5,   status:"Low Stock",    expiry:"Jan 2026" },
  ];
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ background:T.gGreen, borderRadius:20, padding:"28px 32px", marginBottom:24, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ opacity:.75, fontSize:13 }}>💊 Community Pharmacist · Verified Partner ✅</p>
            <h1 style={{ fontSize:28, fontWeight:900, margin:"4px 0 2px" }}>Grace Pharmacy</h1>
            <p style={{ opacity:.8, fontSize:14 }}>📍 Surulere, Lagos · PCN/PHR/2019/001234</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn size="sm" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff" }} onClick={() => setPage("inventory")}>Manage Inventory</Btn>
            <Btn size="sm" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff" }}>Update Stock</Btn>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:24 }}>
        {[["42","In Stock","✅",T.greenMid],["18","Low Stock","⚠️",T.warning],["7","Out of Stock","❌",T.danger],["3","Pending Orders","📦",T.blue]].map(([v,l,i,c]) => (
          <Card key={l} style={{ textAlign:"center", padding:20 }}>
            <div style={{ fontSize:28, marginBottom:4 }}>{i}</div>
            <div style={{ fontSize:32, fontWeight:900, color:c, marginBottom:4 }}>{v}</div>
            <div style={{ color:T.muted, fontSize:13 }}>{l}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:20 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ fontSize:18, fontWeight:800 }}>Inventory Overview</h2>
            <Btn variant="ghost" size="sm" onClick={() => setPage("inventory")}>View all →</Btn>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ borderBottom:`2px solid ${T.border}` }}>
              {["Medicine","Stock","Status","Expiry"].map(h => <th key={h} style={{ textAlign:"left", padding:"8px 10px", color:T.muted, fontSize:12, fontWeight:700 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {inv.map(item => (
                <tr key={item.name} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"12px 10px", fontWeight:600, fontSize:14 }}>{item.name}</td>
                  <td style={{ padding:"12px 10px", color:T.muted, fontSize:14 }}>{item.stock}</td>
                  <td style={{ padding:"12px 10px" }}><Badge status={item.status}/></td>
                  <td style={{ padding:"12px 10px", color:T.muted, fontSize:13 }}>{item.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card style={{ background:`linear-gradient(135deg,${T.blueLight},${T.greenLight})`, border:`1px solid ${T.blue}20` }}>
            <h3 style={{ fontSize:15, fontWeight:800, marginBottom:12 }}>🤖 AI Demand Insight</h3>
            <textarea value={iq} onChange={e => setIq(e.target.value)} placeholder="Ask about demand trends, shortages, pricing..."
              style={{ width:"100%", border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", resize:"none", height:80, fontFamily:"inherit", boxSizing:"border-box", marginBottom:10 }}/>
            <Btn full onClick={async () => {
              setIl(true);
              const r = await callAI("You are PharmaConnect AI for Nigerian community pharmacies. Give 2-3 actionable sentences about pharmaceutical demand, market trends, or sourcing advice specific to Nigeria.", iq);
              setIr(r); setIl(false);
            }}>
              {il ? "Analyzing..." : "Ask AI"}
            </Btn>
            {ir && <p className="fade-in" style={{ color:T.text, fontSize:13, lineHeight:1.7, marginTop:12, padding:"10px 12px", background:T.white, borderRadius:10 }}>{ir}</p>}
          </Card>
          <Card>
            <h3 style={{ fontSize:15, fontWeight:800, marginBottom:12 }}>📊 This Week</h3>
            {[["Paracetamol 500mg","High demand",T.greenMid],["Augmentin 625mg","Shortage risk",T.danger],["Metformin 850mg","Stable",T.blue]].map(([d,s,c]) => (
              <div key={d} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:13, fontWeight:600 }}>{d}</span>
                <span style={{ color:c, fontSize:12, fontWeight:700 }}>{s}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── INVENTORY PAGE ─────────────────────────────────────────── */
function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const allInv = [
    { name:"Amoxicillin 500mg",   stock:240, status:"In Stock",     expiry:"Dec 2025", price:"₦800"   },
    { name:"Paracetamol 500mg",   stock:18,  status:"Low Stock",    expiry:"Mar 2026", price:"₦200"   },
    { name:"Augmentin 625mg",     stock:0,   status:"Out of Stock", expiry:"—",        price:"₦2,400" },
    { name:"Metformin 850mg",     stock:120, status:"In Stock",     expiry:"Jun 2026", price:"₦1,200" },
    { name:"Amlodipine 5mg",      stock:5,   status:"Low Stock",    expiry:"Jan 2026", price:"₦950"   },
    { name:"Lisinopril 10mg",     stock:80,  status:"In Stock",     expiry:"Sep 2026", price:"₦1,100" },
    { name:"Diclofenac 50mg",     stock:3,   status:"Low Stock",    expiry:"Nov 2025", price:"₦450"   },
    { name:"Omeprazole 20mg",     stock:0,   status:"Out of Stock", expiry:"—",        price:"₦750"   },
    { name:"Ciprofloxacin 500mg", stock:60,  status:"In Stock",     expiry:"Aug 2026", price:"₦1,800" },
    { name:"Ibuprofen 400mg",     stock:35,  status:"In Stock",     expiry:"Oct 2026", price:"₦300"   },
  ];
  const shown = allInv.filter(i => (filter==="All"||i.status===filter) && i.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Inventory Management</h1><p style={{ color:T.muted, fontSize:14 }}>Manage your medicine stock and availability</p></div>
        <Btn gradient={T.gGreen}>+ Add Medicine</Btn>
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search medicines..."
          style={{ flex:1, minWidth:200, border:`1.5px solid ${T.border}`, borderRadius:12, padding:"10px 16px", fontSize:14, outline:"none" }} />
        {["All","In Stock","Low Stock","Out of Stock"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:"10px 16px", borderRadius:12, border:`1.5px solid ${filter===f?T.green:T.border}`, background:filter===f?T.greenLight:T.white, color:filter===f?T.green:T.muted, fontWeight:600, fontSize:13, cursor:"pointer" }}>
            {f}
          </button>
        ))}
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:T.bg }}>
            {["Medicine Name","Stock","Status","Price","Expiry","Action"].map(h => <th key={h} style={{ textAlign:"left", padding:"14px 18px", color:T.muted, fontSize:12, fontWeight:700, borderBottom:`1px solid ${T.border}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {shown.map(item => (
              <tr key={item.name} style={{ borderBottom:`1px solid ${T.border}`, transition:"background .1s" }}
                onMouseEnter={e => e.currentTarget.style.background=T.bg}
                onMouseLeave={e => e.currentTarget.style.background=""}>
                <td style={{ padding:"14px 18px", fontWeight:600, fontSize:14 }}>{item.name}</td>
                <td style={{ padding:"14px 18px", color:T.muted }}>{item.stock}</td>
                <td style={{ padding:"14px 18px" }}><Badge status={item.status}/></td>
                <td style={{ padding:"14px 18px", color:T.greenMid, fontWeight:600 }}>{item.price}</td>
                <td style={{ padding:"14px 18px", color:T.muted, fontSize:13 }}>{item.expiry}</td>
                <td style={{ padding:"14px 18px" }}><Btn variant="ghost" size="sm">Update</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ─── AI INSIGHTS PAGE ───────────────────────────────────────── */
function InsightsPage({ userType }) {
  const [q, setQ] = useState(""); const [r, setR] = useState(""); const [l, setL] = useState(false);
  const sys = userType === "supplier"
    ? "You are PharmaConnect AI market intelligence for pharmaceutical suppliers and distributors in Nigeria. Provide specific, actionable insight on demand trends, pricing, distribution opportunities, and market conditions. 3-4 sentences."
    : "You are PharmaConnect AI demand and shortage intelligence for Nigerian pharmacists and hospital pharmacies. Provide specific, actionable insight on medicine demand, shortage risks, sourcing strategies, and market conditions. 3-4 sentences.";
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"32px 24px" }}>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>AI Market Insights</h1>
      <p style={{ color:T.muted, marginBottom:32 }}>Real-time demand intelligence powered by PharmaConnect AI</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        <Card style={{ border:`1px solid ${T.greenMid}25` }}>
          <h3 style={{ fontWeight:800, color:T.green, marginBottom:12 }}>📈 High Demand This Week</h3>
          {[["Augmentin 625mg","+34%",T.danger],["Amlodipine 5mg","+18%",T.warning],["Metformin 850mg","+12%",T.blue],["Paracetamol 500mg","+8%",T.greenMid]].map(([d,p,c]) => (
            <div key={d} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:14, fontWeight:600 }}>{d}</span><span style={{ color:c, fontWeight:800 }}>{p}</span>
            </div>
          ))}
        </Card>
        <Card style={{ border:`1px solid ${T.danger}25` }}>
          <h3 style={{ fontWeight:800, color:T.danger, marginBottom:12 }}>⚠️ Shortage Risk</h3>
          {[["Insulin Actrapid","CRITICAL",T.danger],["IV Normal Saline","HIGH",T.danger],["Augmentin 625mg","MEDIUM",T.warning],["Metronidazole 200mg","LOW",T.blue]].map(([d,rv,c]) => (
            <div key={d} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:14, fontWeight:600 }}>{d}</span>
              <span style={{ background:`${c}15`, color:c, fontSize:11, fontWeight:800, padding:"2px 8px", borderRadius:6 }}>{rv}</span>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{ background:`linear-gradient(135deg,${T.blueLight}60,${T.greenLight}60)`, border:`1px solid ${T.blue}20` }}>
        <h3 style={{ fontWeight:800, fontSize:16, marginBottom:6 }}>🤖 Ask AI for Custom Insight</h3>
        <p style={{ color:T.muted, fontSize:13, marginBottom:16 }}>Ask about specific medicines, demand forecasts, pricing, or sourcing strategies</p>
        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. What is the demand forecast for Augmentin 625mg in Lagos this month?"
            style={{ flex:1, minWidth:280, border:`1.5px solid ${T.border}`, borderRadius:12, padding:"12px 16px", fontSize:14, outline:"none", background:T.white }} />
          <Btn onClick={async () => { setL(true); const res = await callAI(sys, q); setR(res); setL(false); }} style={{ minWidth:120 }}>
            {l ? "Analyzing..." : "🤖 Ask AI"}
          </Btn>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
          {["Demand forecast for Augmentin","Best-selling medicines in Lagos","Shortage prediction next 30 days","Pricing trends for antibiotics"].map(s => (
            <button key={s} onClick={() => setQ(s)} style={{ padding:"6px 12px", borderRadius:99, border:`1px solid ${T.border}`, background:T.white, color:T.muted, fontSize:12, cursor:"pointer" }}>{s}</button>
          ))}
        </div>
        {r && <div className="fade-in" style={{ background:T.white, borderRadius:12, padding:"14px 16px", border:`1px solid ${T.border}` }}><p style={{ color:T.text, fontSize:14, lineHeight:1.8 }}>{r}</p></div>}
      </Card>
    </div>
  );
}

/* ─── HOSPITAL DASHBOARD ─────────────────────────────────────── */
function HospitalDashboard({ setPage }) {
  const [eq, setEq] = useState(""); const [er, setEr] = useState(""); const [el, setEl] = useState(false);
  const critical = [
    { name:"Insulin Actrapid 100IU",   qty:"500 vials",   priority:"CRITICAL", status:"Sourcing" },
    { name:"IV Normal Saline 500ml",   qty:"200 bags",    priority:"HIGH",     status:"Ordered"  },
    { name:"Morphine 10mg/ml",         qty:"50 ampoules", priority:"CRITICAL", status:"Pending"  },
    { name:"Ceftriaxone 1g Injection", qty:"100 vials",   priority:"MEDIUM",   status:"Located"  },
  ];
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ background:T.gTeal, borderRadius:20, padding:"28px 32px", marginBottom:24, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ opacity:.75, fontSize:13 }}>🏥 Hospital Pharmacist</p>
            <h1 style={{ fontSize:28, fontWeight:900, margin:"4px 0 2px" }}>General Hospital Lagos</h1>
            <p style={{ opacity:.8, fontSize:14 }}>Pharmacy Department · Lagos Island</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn size="sm" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff" }} onClick={() => setPage("emergency")}>🚨 Emergency Sourcing</Btn>
            <Btn size="sm" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff" }} onClick={() => setPage("orders")}>📋 Track Orders</Btn>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:24 }}>
        {[["3","Critical Needs","🚨",T.danger],["8","Active Orders","📦",T.blue],["5","In Transit","🚚",T.warning],["12","Verified Suppliers","✅",T.greenMid]].map(([v,l,i,c]) => (
          <Card key={l} style={{ textAlign:"center", padding:20 }}>
            <div style={{ fontSize:26 }}>{i}</div>
            <div style={{ fontSize:30, fontWeight:900, color:c, margin:"4px 0" }}>{v}</div>
            <div style={{ color:T.muted, fontSize:13 }}>{l}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:20 }}>
        <Card>
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16, color:T.danger }}>🚨 Critical Needs</h2>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ borderBottom:`2px solid ${T.border}` }}>
              {["Medicine","Quantity","Priority","Status"].map(h => <th key={h} style={{ textAlign:"left", padding:"8px 10px", color:T.muted, fontSize:12, fontWeight:700 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {critical.map(item => (
                <tr key={item.name} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"12px 10px", fontWeight:600, fontSize:14 }}>{item.name}</td>
                  <td style={{ padding:"12px 10px", color:T.muted, fontSize:13 }}>{item.qty}</td>
                  <td style={{ padding:"12px 10px" }}>
                    <span style={{ background:item.priority==="CRITICAL"?T.danger:item.priority==="HIGH"?T.warning:T.blueLight, color:item.priority==="CRITICAL"?"#fff":item.priority==="HIGH"?"#fff":T.blue, fontSize:11, fontWeight:800, borderRadius:6, padding:"3px 8px" }}>{item.priority}</span>
                  </td>
                  <td style={{ padding:"12px 10px", color:T.muted, fontSize:13 }}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card style={{ border:`1px solid ${T.teal}30`, background:`linear-gradient(135deg,${T.teal}06,${T.blue}06)` }}>
          <h3 style={{ fontSize:15, fontWeight:800, marginBottom:6 }}>🤖 AI Emergency Sourcing</h3>
          <p style={{ color:T.muted, fontSize:13, marginBottom:12 }}>Describe what you need to source urgently</p>
          <textarea value={eq} onChange={e => setEq(e.target.value)} placeholder="e.g. Need 500 vials of Insulin Actrapid urgently for ICU patients with DKA..."
            style={{ width:"100%", border:`1px solid ${T.border}`, borderRadius:12, padding:"10px 12px", fontSize:13, outline:"none", resize:"none", height:88, fontFamily:"inherit", boxSizing:"border-box", marginBottom:10 }}/>
          <Btn full gradient={T.gTeal} onClick={async () => {
            setEl(true);
            const r = await callAI("You are PharmaConnect AI for hospital pharmacists in Nigeria. Provide specific emergency sourcing guidance: list 2-3 therapeutic alternatives if needed, types of verified suppliers to contact (NAFDAC-registered), estimated availability in Nigerian market, and any critical patient safety considerations. Be direct and clinical. 4 sentences max.", `Emergency sourcing needed: ${eq}`);
            setEr(r); setEl(false);
          }}>
            {el ? "AI Finding Suppliers..." : "🚨 Find Emergency Suppliers"}
          </Btn>
          {er && <div className="fade-in" style={{ marginTop:12, padding:"12px 14px", background:T.white, borderRadius:12, border:`1px solid ${T.teal}30` }}><p style={{ color:T.text, fontSize:13, lineHeight:1.8 }}>{er}</p></div>}
        </Card>
      </div>
    </div>
  );
}

/* ─── ORDERS PAGE ────────────────────────────────────────────── */
function OrdersPage() {
  const orders = [
    { id:"ORD-001", medicine:"Metformin 850mg",   qty:"1000 tabs", supplier:"MediSupply Wholesalers", status:"In Transit", eta:"Today 3PM",    value:"₦1.2M" },
    { id:"ORD-002", medicine:"Amlodipine 5mg",    qty:"500 tabs",  supplier:"PharmaDist Ltd",         status:"Confirmed",  eta:"Tomorrow",     value:"₦475K" },
    { id:"ORD-003", medicine:"IV Normal Saline",  qty:"100 bags",  supplier:"MediSupply Wholesalers", status:"Delivered",  eta:"Completed",    value:"₦150K" },
    { id:"ORD-004", medicine:"Augmentin 625mg",   qty:"200 packs", supplier:"NovaMed Distributors",   status:"Processing", eta:"3-5 days",     value:"₦480K" },
    { id:"ORD-005", medicine:"Insulin Actrapid",  qty:"50 vials",  supplier:"PharmaChain Nigeria",    status:"In Transit", eta:"Tomorrow 6PM", value:"₦900K" },
  ];
  const sc = { "In Transit":"#3B82F6", "Confirmed":T.warning, "Delivered":T.greenMid, "Processing":T.purple };
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div><h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Order Tracking</h1><p style={{ color:T.muted }}>Track all medicine orders and deliveries</p></div>
        <Btn gradient={T.gTeal}>+ New Order</Btn>
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:T.bg }}>
            {["Order ID","Medicine","Quantity","Supplier","Status","ETA","Value","Action"].map(h => (
              <th key={h} style={{ textAlign:"left", padding:"14px 16px", color:T.muted, fontSize:12, fontWeight:700, borderBottom:`1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom:`1px solid ${T.border}` }}
                onMouseEnter={e => e.currentTarget.style.background=T.bg}
                onMouseLeave={e => e.currentTarget.style.background=""}>
                <td style={{ padding:"14px 16px", color:T.muted, fontSize:13, fontWeight:600 }}>{o.id}</td>
                <td style={{ padding:"14px 16px", fontWeight:700, fontSize:14 }}>{o.medicine}</td>
                <td style={{ padding:"14px 16px", color:T.muted }}>{o.qty}</td>
                <td style={{ padding:"14px 16px", color:T.muted, fontSize:13 }}>{o.supplier}</td>
                <td style={{ padding:"14px 16px" }}><span style={{ color:sc[o.status]||T.muted, fontWeight:700, fontSize:13 }}>● {o.status}</span></td>
                <td style={{ padding:"14px 16px", color:T.muted, fontSize:13 }}>{o.eta}</td>
                <td style={{ padding:"14px 16px", color:T.greenMid, fontWeight:700 }}>{o.value}</td>
                <td style={{ padding:"14px 16px" }}>{o.status!=="Delivered"&&<Btn variant="ghost" size="sm">Track</Btn>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ─── SUPPLIER DASHBOARD ─────────────────────────────────────── */
function SupplierDashboard({ setPage }) {
  const [reqs, setReqs] = useState([
    { id:0, from:"HealthPlus Pharmacy",    medicine:"Augmentin 625mg",  qty:"500 tabs",  time:"2 mins ago",  urgent:true,  status:"pending" },
    { id:1, from:"General Hospital Lagos", medicine:"IV Normal Saline",  qty:"200 bags",  time:"15 mins ago", urgent:true,  status:"pending" },
    { id:2, from:"CarePoint Pharmacy",     medicine:"Metformin 850mg",   qty:"1000 tabs", time:"1 hour ago",  urgent:false, status:"pending" },
    { id:3, from:"MedLine Pharmacy",       medicine:"Amoxicillin 500mg", qty:"300 tabs",  time:"3 hours ago", urgent:false, status:"pending" },
  ]);
  const act = (id, s) => setReqs(p => p.map(r => r.id===id ? {...r, status:s} : r));

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ background:T.gPurple, borderRadius:20, padding:"28px 32px", marginBottom:24, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ opacity:.75, fontSize:13 }}>🚚 Supplier / Distributor · NAFDAC Verified ✅</p>
            <h1 style={{ fontSize:28, fontWeight:900, margin:"4px 0 2px" }}>MediSupply Wholesalers</h1>
            <p style={{ opacity:.8, fontSize:14 }}>📍 Ikeja, Lagos · CAC/BN/2018/004521</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn size="sm" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff" }} onClick={() => setPage("stock")}>Manage Stock</Btn>
            <Btn size="sm" style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff" }} onClick={() => setPage("analytics")}>Analytics</Btn>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:24 }}>
        {[["284","In Stock","📦",T.greenMid],[`${reqs.filter(r=>r.status==="pending").length}`,"New Requests","🔔",T.danger],["12","Dispatched Today","🚚",T.blue],["₦8.4M","Revenue MTD","💰",T.purple]].map(([v,l,i,c]) => (
          <Card key={l} style={{ textAlign:"center", padding:20 }}>
            <div style={{ fontSize:26 }}>{i}</div>
            <div style={{ fontSize:v.startsWith("₦")?20:30, fontWeight:900, color:c, margin:"4px 0" }}>{v}</div>
            <div style={{ color:T.muted, fontSize:13 }}>{l}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ fontSize:18, fontWeight:800 }}>Incoming Requests</h2>
            <span style={{ background:T.danger, color:"#fff", fontSize:11, fontWeight:800, borderRadius:8, padding:"3px 10px" }}>{reqs.filter(r=>r.status==="pending").length} New</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {reqs.map(r => (
              <div key={r.id} style={{ border:`1.5px solid ${r.urgent&&r.status==="pending"?T.danger:T.border}`, borderRadius:14, padding:16, opacity:r.status!=="pending"?.6:1, transition:"opacity .2s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontWeight:700, fontSize:14 }}>{r.from}</span>
                  {r.urgent && r.status==="pending" && <span style={{ background:T.danger, color:"#fff", fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 8px" }}>URGENT</span>}
                  {r.status!=="pending" && <span style={{ background:r.status==="accepted"?T.greenLight:"#F1F5F9", color:r.status==="accepted"?T.green:T.muted, fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 8px" }}>{r.status.toUpperCase()}</span>}
                </div>
                <p style={{ color:T.blue, fontWeight:700, fontSize:14, marginBottom:3 }}>{r.medicine}</p>
                <p style={{ color:T.muted, fontSize:13, marginBottom:r.status==="pending"?12:0 }}>{r.qty} · {r.time}</p>
                {r.status==="pending" && (
                  <div style={{ display:"flex", gap:8 }}>
                    <Btn variant="ghost" size="sm" full onClick={() => act(r.id,"declined")}>✗ Decline</Btn>
                    <Btn size="sm" full onClick={() => act(r.id,"accepted")}>✓ Accept</Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <h3 style={{ fontWeight:800, marginBottom:12 }}>📊 Upcoming Shipments</h3>
            {[["Augmentin 625mg","120 packs","Jun 10"],["IV Normal Saline","200 bags","Jun 12"],["Metformin 850mg","500 tabs","Jun 15"]].map(([d,q,dt]) => (
              <div key={d} style={{ padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                <p style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{d}</p>
                <p style={{ color:T.muted, fontSize:12 }}>{q} · Arrival: {dt}</p>
              </div>
            ))}
          </Card>
          <Card style={{ border:`1px solid ${T.purple}30`, background:`${T.purple}05` }}>
            <h3 style={{ fontWeight:800, marginBottom:8, color:T.purple }}>🤖 AI Market Intel</h3>
            <p style={{ color:T.muted, fontSize:13, marginBottom:10 }}>Get demand forecasts and pricing insights</p>
            <Btn full gradient={T.gPurple} onClick={() => setPage("analytics")}>Open AI Analytics →</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── EMERGENCY PAGE ─────────────────────────────────────────── */
function EmergencyPage() {
  const [eq, setEq] = useState(""); const [er, setEr] = useState(""); const [el, setEl] = useState(false);
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ background:"#FEF2F2", border:`2px solid ${T.danger}`, borderRadius:20, padding:"20px 24px", marginBottom:28, display:"flex", gap:14, alignItems:"center" }}>
        <span style={{ fontSize:32 }}>🚨</span>
        <div><h2 style={{ color:T.danger, fontWeight:900, marginBottom:4 }}>Emergency Medicine Sourcing</h2><p style={{ color:"#991B1B", fontSize:14 }}>For critical and time-sensitive medicine needs. AI will suggest alternatives and verified suppliers.</p></div>
      </div>
      <Card style={{ border:`2px solid ${T.teal}30`, marginBottom:20 }}>
        <h3 style={{ fontWeight:800, fontSize:16, marginBottom:12 }}>🤖 AI Emergency Sourcing Assistant</h3>
        <textarea value={eq} onChange={e => setEq(e.target.value)} placeholder="Describe your emergency sourcing need in detail, e.g.: 'Need 500 vials of Insulin Actrapid urgently for ICU ward. Have 3 patients with DKA. Current stock depleted. Need within 2 hours if possible.'"
          style={{ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:14, padding:"14px 16px", fontSize:14, outline:"none", resize:"none", height:120, fontFamily:"inherit", boxSizing:"border-box", marginBottom:14 }}/>
        <Btn size="lg" full gradient={T.gTeal} onClick={async () => {
          setEl(true);
          const r = await callAI("You are PharmaConnect AI emergency sourcing for hospital pharmacists in Nigeria. Provide: (1) 2-3 therapeutic alternatives with the same class/mechanism, (2) specific types of NAFDAC-registered suppliers to contact, (3) estimated availability in Nigerian market, (4) critical patient safety notes. Format clearly with numbered points. Be direct and clinical.", `Emergency: ${eq}`);
          setEr(r); setEl(false);
        }}>
          {el ? "🤖 AI Finding Emergency Suppliers..." : "🚨 Find Emergency Suppliers Now"}
        </Btn>
        {er && (
          <div className="fade-in" style={{ marginTop:16, padding:"16px 18px", background:`${T.teal}08`, borderRadius:14, border:`1px solid ${T.teal}30` }}>
            <p style={{ fontWeight:800, color:T.teal, marginBottom:10 }}>🤖 AI Emergency Response:</p>
            <p style={{ color:T.text, fontSize:14, lineHeight:1.9, whiteSpace:"pre-wrap" }}>{er}</p>
          </div>
        )}
      </Card>
      <h3 style={{ fontWeight:800, marginBottom:14 }}>Verified Emergency Suppliers Near You</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
        {[
          { name:"MediSupply Wholesalers", loc:"Ikeja, Lagos",       response:"15-30 min", items:"284 medicines" },
          { name:"PharmaDist Ltd",         loc:"Victoria Island",     response:"30-60 min", items:"196 medicines" },
          { name:"NovaMed Distributors",   loc:"Yaba, Lagos",         response:"45-90 min", items:"152 medicines" },
        ].map(s => (
          <Card key={s.name}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <h4 style={{ fontWeight:700, fontSize:15 }}>{s.name}</h4>
              <span style={{ color:T.green, fontSize:12, fontWeight:700 }}>✅ NAFDAC</span>
            </div>
            <p style={{ color:T.muted, fontSize:13, marginBottom:2 }}>📍 {s.loc}</p>
            <p style={{ color:T.muted, fontSize:13, marginBottom:2 }}>⏱ Response: {s.response}</p>
            <p style={{ color:T.muted, fontSize:13, marginBottom:14 }}>📦 {s.items}</p>
            <div style={{ display:"flex", gap:8 }}>
              <Btn full variant="secondary" size="sm">📞 Call</Btn>
              <Btn full size="sm">Request</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── STOCK PAGE (Supplier) ──────────────────────────────────── */
function StockPage() {
  const [search, setSearch] = useState("");
  const stock = [
    { name:"Augmentin 625mg",        qty:0,   price:"₦2,400/pack",  status:"Out of Stock" },
    { name:"Metformin 850mg",        qty:500, price:"₦1,200/pack",  status:"In Stock"     },
    { name:"Amoxicillin 500mg",      qty:200, price:"₦800/pack",    status:"In Stock"     },
    { name:"Insulin Actrapid 100IU", qty:12,  price:"₦18,000/vial", status:"Low Stock"    },
    { name:"IV Normal Saline",       qty:80,  price:"₦1,500/bag",   status:"In Stock"     },
    { name:"Amlodipine 5mg",         qty:3,   price:"₦950/pack",    status:"Low Stock"    },
    { name:"Ciprofloxacin 500mg",    qty:120, price:"₦1,800/pack",  status:"In Stock"     },
    { name:"Omeprazole 20mg",        qty:0,   price:"₦750/pack",    status:"Out of Stock" },
  ];
  const shown = stock.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h1 style={{ fontSize:26, fontWeight:800 }}>Stock Management</h1>
        <Btn gradient={T.gPurple}>+ List New Medicine</Btn>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search stock..."
        style={{ width:"100%", maxWidth:400, border:`1.5px solid ${T.border}`, borderRadius:12, padding:"10px 16px", fontSize:14, outline:"none", marginBottom:20 }} />
      <Card style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:T.bg }}>
            {["Medicine","Available Qty","Price","Status","Action"].map(h => <th key={h} style={{ textAlign:"left", padding:"14px 18px", color:T.muted, fontSize:12, fontWeight:700, borderBottom:`1px solid ${T.border}` }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {shown.map(item => (
              <tr key={item.name} style={{ borderBottom:`1px solid ${T.border}` }}
                onMouseEnter={e => e.currentTarget.style.background=T.bg}
                onMouseLeave={e => e.currentTarget.style.background=""}>
                <td style={{ padding:"14px 18px", fontWeight:600, fontSize:14 }}>{item.name}</td>
                <td style={{ padding:"14px 18px", color:T.muted }}>{item.qty}</td>
                <td style={{ padding:"14px 18px", color:T.greenMid, fontWeight:700 }}>{item.price}</td>
                <td style={{ padding:"14px 18px" }}><Badge status={item.status}/></td>
                <td style={{ padding:"14px 18px", display:"flex", gap:8 }}>
                  <Btn variant="ghost" size="sm">Edit</Btn>
                  <Btn variant="secondary" size="sm">Update Stock</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ─── SOURCING PAGE ──────────────────────────────────────────── */
function SourcingPage() {
  const [q, setQ] = useState(""); const [r, setR] = useState(""); const [l, setL] = useState(false);
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Medicine Sourcing</h1>
      <p style={{ color:T.muted, marginBottom:28 }}>Find verified suppliers and source scarce medicines</p>
      <Card style={{ marginBottom:24 }}>
        <h3 style={{ fontWeight:800, marginBottom:12 }}>🤖 AI Sourcing Assistant</h3>
        <div style={{ display:"flex", gap:12, marginBottom:10, flexWrap:"wrap" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="What medicine do you need to source? Include quantity and urgency..."
            style={{ flex:1, minWidth:250, border:`1.5px solid ${T.border}`, borderRadius:12, padding:"12px 16px", fontSize:14, outline:"none" }}/>
          <Btn onClick={async () => {
            setL(true);
            const res = await callAI("You are PharmaConnect AI sourcing agent for Nigerian community pharmacists. Provide specific sourcing advice: name 2-3 verified supplier types in Nigeria, suggest alternatives if shortage exists, mention typical turnaround times, and note any NAFDAC considerations. Be practical and specific. 4 sentences max.", q);
            setR(res); setL(false);
          }}>
            {l ? "Finding..." : "🔍 Find Sources"}
          </Btn>
        </div>
        {r && <div className="fade-in" style={{ padding:"12px 16px", background:T.blueLight, borderRadius:12 }}><p style={{ fontSize:14, lineHeight:1.8 }}>{r}</p></div>}
      </Card>
      <h3 style={{ fontWeight:800, marginBottom:14 }}>Verified Supplier Network</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
        {[
          { name:"MediSupply Wholesalers", loc:"Ikeja, Lagos",     items:284, rating:4.9, badge:"NAFDAC Verified", response:"Same day" },
          { name:"PharmaDist Ltd",         loc:"Victoria Island",  items:196, rating:4.7, badge:"NAFDAC Verified", response:"1-2 days" },
          { name:"NovaMed Distributors",   loc:"Yaba, Lagos",      items:152, rating:4.5, badge:"PCN Partner",     response:"1-3 days" },
        ].map(s => (
          <Card key={s.name} style={{ transition:"all .15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <h4 style={{ fontWeight:700, fontSize:15 }}>{s.name}</h4>
              <span style={{ color:T.green, fontSize:11, fontWeight:700 }}>✅ {s.badge}</span>
            </div>
            <p style={{ color:T.muted, fontSize:13, marginBottom:2 }}>📍 {s.loc}</p>
            <p style={{ color:T.muted, fontSize:13, marginBottom:2 }}>📦 {s.items} medicines · ⭐ {s.rating}</p>
            <p style={{ color:T.muted, fontSize:13, marginBottom:14 }}>⏱ Response: {s.response}</p>
            <div style={{ display:"flex", gap:8 }}>
              <Btn full variant="secondary" size="sm">View Stock</Btn>
              <Btn full size="sm">Request Supply</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── PROFILE PAGE ───────────────────────────────────────────── */
function ProfilePage({ userType, onSwitchRole }) {
  const profiles = {
    patient:    { name:"Amara Okonkwo",         role:"Patient",               icon:"🧑‍⚕️", loc:"Surulere, Lagos",      plan:"Free Plan",        grad:T.gMain   },
    pharmacist: { name:"Grace Adeyemi",          role:"Community Pharmacist",  icon:"💊",    loc:"Surulere, Lagos",      plan:"Verified Partner", grad:T.gGreen  },
    hospital:   { name:"Dr. Emeka Nwosu",        role:"Hospital Pharmacist",   icon:"🏥",    loc:"Lagos Island General", plan:"Hospital Account", grad:T.gTeal   },
    supplier:   { name:"MediSupply Wholesalers", role:"Supplier / Distributor",icon:"🚚",    loc:"Ikeja, Lagos",         plan:"NAFDAC Verified",  grad:T.gPurple },
  };
  const p = profiles[userType] || profiles.patient;
  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"32px 24px" }}>
      <Card style={{ background:p.grad, marginBottom:20, color:"#fff", padding:32 }}>
        <div style={{ display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>{p.icon}</div>
          <div>
            <h1 style={{ fontSize:24, fontWeight:900, marginBottom:4 }}>{p.name}</h1>
            <p style={{ opacity:.8, fontSize:14, marginBottom:4 }}>{p.role}</p>
            <p style={{ opacity:.7, fontSize:13 }}>📍 {p.loc}</p>
          </div>
          <div style={{ marginLeft:"auto" }}>
            <span style={{ background:"rgba(255,255,255,0.2)", padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:700 }}>✅ {p.plan}</span>
          </div>
        </div>
      </Card>
      {[
        ["🔔","Notifications","Manage alerts and safety notices"],
        ["🔐","Security & Privacy","Password, 2FA, data settings"],
        ["🌐","Language Settings","English, Yoruba, Hausa, Igbo, French"],
        ["💳","Subscription & Billing","Manage your plan"],
        ["❓","Help & Support","Documentation and support"],
        ["📋","Terms & Privacy","Legal information"],
      ].map(([ic,lb,desc]) => (
        <Card key={lb} style={{ marginBottom:10, display:"flex", alignItems:"center", gap:14, padding:"16px 20px", cursor:"pointer", transition:"all .15s" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"}>
          <span style={{ fontSize:22 }}>{ic}</span>
          <div style={{ flex:1 }}><p style={{ fontWeight:600, fontSize:14 }}>{lb}</p><p style={{ color:T.muted, fontSize:12 }}>{desc}</p></div>
          <span style={{ color:T.muted, fontSize:18 }}>›</span>
        </Card>
      ))}
      <div style={{ display:"flex", gap:12, marginTop:20 }}>
        <Btn full variant="secondary" onClick={onSwitchRole}>🔄 Switch Role</Btn>
        <Btn full variant="danger">Sign Out</Btn>
      </div>
    </div>
  );
}

/* ─── APP (ROOT) ─────────────────────────────────────────────── */
function App() {
  const [userType, setUserType] = useState(null);
  const [page, setPage] = useState("landing");

  function chooseRole(role) {
    if (role === null) {
      setPage("choose");
    } else {
      setUserType(role);
      setPage(role === "patient" ? "home" : "dashboard");
    }
  }

  function signOut() {
    setUserType(null);
    setPage("landing");
  }

  if (page === "landing") return <Landing onChoose={chooseRole} />;
  if (page === "choose" || !userType) return <ChooseRole onSelect={r => { setUserType(r); setPage(r === "patient" ? "home" : "dashboard"); }} />;

  function renderPage() {
    if (page === "alerts")  return <AlertsPage />;
    if (page === "profile") return <ProfilePage userType={userType} onSwitchRole={signOut} />;

    switch (userType) {
      case "patient":
        if (page === "home")   return <PatientHome setPage={setPage} />;
        if (page === "search") return <SearchPage />;
        if (page === "map")    return <MapPage />;
        return <PatientHome setPage={setPage} />;

      case "pharmacist":
        if (page === "dashboard") return <PharmacistDashboard setPage={setPage} />;
        if (page === "inventory") return <InventoryPage />;
        if (page === "sourcing")  return <SourcingPage />;
        if (page === "insights")  return <InsightsPage userType={userType} />;
        return <PharmacistDashboard setPage={setPage} />;

      case "hospital":
        if (page === "dashboard") return <HospitalDashboard setPage={setPage} />;
        if (page === "emergency") return <EmergencyPage />;
        if (page === "orders")    return <OrdersPage />;
        if (page === "insights")  return <InsightsPage userType={userType} />;
        return <HospitalDashboard setPage={setPage} />;

      case "supplier":
        if (page === "dashboard") return <SupplierDashboard setPage={setPage} />;
        if (page === "stock")     return <StockPage />;
        if (page === "requests")  return <SupplierDashboard setPage={setPage} />;
        if (page === "analytics") return <InsightsPage userType={userType} />;
        return <SupplierDashboard setPage={setPage} />;

      default:
        return <ChooseRole onSelect={r => { setUserType(r); setPage(r === "patient" ? "home" : "dashboard"); }} />;
    }
  }

  return (
    <div>
      <Nav page={page} setPage={setPage} userType={userType} onSignOut={signOut} />
      {renderPage()}
    </div>
  );
}

/* ─── MOUNT ──────────────────────────────────────────────────── */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
