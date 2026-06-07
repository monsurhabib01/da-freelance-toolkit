import { useState } from "react";

const API = "https://api.anthropic.com/v1/messages";

async function askClaude(system, user) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? "Error: " + JSON.stringify(data.error ?? data);
  } catch (e) {
    return "Error: " + e.message;
  }
}

const STAGES = ["lead", "proposed", "interview", "hired", "done"];
const STAGE_LABEL = { lead: "Leads", proposed: "Proposed", interview: "Interview", hired: "Hired", done: "Done" };
const STAGE_HUE = { lead: "#4a90e2", proposed: "#f5a623", interview: "#9b7fe8", hired: "#22d46a", done: "#4a5568" };

export default function DAToolkit() {
  const [tab, setTab] = useState("proposal");

  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [mySkills, setMySkills] = useState("");
  const [proposal, setProposal] = useState("");
  const [propBusy, setPropBusy] = useState(false);

  const [gigTitle, setGigTitle] = useState("");
  const [gigDesc, setGigDesc] = useState("");
  const [seoOut, setSeoOut] = useState("");
  const [seoBusy, setSeoBusy] = useState(false);

  const [level, setLevel] = useState("mid");
  const [projType, setProjType] = useState("dashboard");
  const [scope, setScope] = useState("");
  const [rateOut, setRateOut] = useState("");
  const [rateBusy, setRateBusy] = useState(false);

  const [leads, setLeads] = useState([
    { id: 1, client: "TechVentures", project: "Sales Dashboard", stage: "lead", budget: "$450", date: "Jun 1" },
    { id: 2, client: "RetailPlus", project: "Excel Automation", stage: "proposed", budget: "$280", date: "Jun 3" },
  ]);
  const [form, setForm] = useState({ client: "", project: "", budget: "" });

  async function genProposal() {
    if (!jobTitle || !jobDesc) return;
    setPropBusy(true); setProposal("");
    const sys = `You are a top 1% Upwork Data Analytics freelancer with 500+ completed jobs.
Write a winning proposal that:
- Opens by directly addressing the client's core pain point in line 1 (NOT "I am an experienced..." or "I saw your job posting")
- Shows you read and understood their specific situation
- Gives one concrete approach or insight tailored to this project
- Keeps it under 180 words — clients don't read long proposals
- Ends with a low-friction CTA ("Would you like a quick mockup?" or "Happy to start tomorrow")
Return ONLY the proposal text. No labels, no markdown.`;
    const msg = `Job: ${jobTitle}\nDescription: ${jobDesc}\nMy skills: ${mySkills || "Python, SQL, Power BI, Excel, data visualization"}`;
    const out = await askClaude(sys, msg);
    setProposal(out); setPropBusy(false);
  }

  async function optimizeGig() {
    if (!gigTitle) return;
    setSeoBusy(true); setSeoOut("");
    const sys = `You are a Fiverr/Upwork SEO specialist for Data Analytics gigs.
Return in EXACTLY this format — nothing else:

OPTIMIZED TITLE:
[max 80 chars, buyer-intent keywords, result-focused, starts with strong verb or outcome]

TOP 5 TAGS:
[tag1], [tag2], [tag3], [tag4], [tag5]

PREVIEW SNIPPET:
[150 chars max — the description's first sentence that appears in search; must hook immediately]

KEY CHANGES:
• [specific change 1 — what and why it improves ranking/conversion]
• [specific change 2]
• [specific change 3]`;
    const msg = `Current title: ${gigTitle}\nCurrent description: ${gigDesc || "(none provided)"}`;
    const out = await askClaude(sys, msg);
    setSeoOut(out); setSeoBusy(false);
  }

  async function calcRate() {
    if (!scope) return;
    setRateBusy(true); setRateOut("");
    const sys = `You are a freelance pricing strategist for Data Analytics.
Return in EXACTLY this format:

HOURLY RATE: $X–$Y / hr
FIXED PRICE: $X–$Y

MARKET BENCHMARK:
Low: $X  |  Mid: $Y  |  High: $Z

REASONING:
[2–3 sentences: complexity factors, skill premium, why this range]

UPSELL MOVE:
[One specific deliverable addition that justifies +25–40% more, with example wording]

Use USD. Be realistic for international freelancers competing on Upwork/Fiverr.`;
    const msg = `Level: ${level}\nType: ${projType}\nScope: ${scope}`;
    const out = await askClaude(sys, msg);
    setRateOut(out); setRateBusy(false);
  }

  function addLead() {
    if (!form.client || !form.project) return;
    const d = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setLeads(p => [...p, { ...form, id: Date.now(), stage: "lead", date: d }]);
    setForm({ client: "", project: "", budget: "" });
  }

  function moveLead(id, dir) {
    setLeads(p => p.map(l => {
      if (l.id !== id) return l;
      const i = STAGES.indexOf(l.stage);
      return { ...l, stage: STAGES[Math.max(0, Math.min(STAGES.length - 1, i + dir))] };
    }));
  }

  const C = {
    bg: "#04060d", surf: "#0a0d16", surf2: "#0f1320",
    border: "#181e30", accent: "#00c2f0", green: "#1ece68",
    text: "#c4d0e8", muted: "#4e5f7a", warn: "#f5a623",
  };
  const MONO = "'JetBrains Mono','Courier New',monospace";
  const SANS = "'DM Sans',system-ui,sans-serif";

  const inp = {
    width: "100%", background: C.surf2, border: `1px solid ${C.border}`,
    color: C.text, padding: "9px 13px", borderRadius: "6px", fontSize: "14px",
    fontFamily: SANS, outline: "none", boxSizing: "border-box",
  };
  const lbl = {
    fontFamily: MONO, fontSize: "10px", color: C.muted,
    letterSpacing: "1.5px", textTransform: "uppercase", display: "block", marginBottom: "6px",
  };
  const btn = (off) => ({
    background: off ? C.surf2 : C.accent, color: off ? C.muted : "#04060d",
    border: off ? `1px solid ${C.border}` : "none",
    padding: "10px 22px", fontFamily: MONO, fontSize: "11px", letterSpacing: "1px",
    cursor: off ? "not-allowed" : "pointer", borderRadius: "6px", fontWeight: "600",
  });
  const resultBox = {
    background: C.surf2, borderLeft: `3px solid ${C.green}`, padding: "15px 18px",
    borderRadius: "6px", marginTop: "14px", fontFamily: SANS, fontSize: "14px",
    lineHeight: "1.8", whiteSpace: "pre-wrap", color: C.text, border: `1px solid ${C.border}`,
  };

  const TABS_DEF = [
    { id: "proposal", icon: "⚡", label: "Proposal" },
    { id: "seo", icon: "🔍", label: "Gig SEO" },
    { id: "rate", icon: "💰", label: "Rate" },
    { id: "pipeline", icon: "📋", label: "Pipeline" },
  ];

  const totalPipelineValue = leads.reduce((s, l) => {
    const v = parseInt((l.budget || "0").replace(/\D/g, ""));
    return s + (isNaN(v) ? 0 : v);
  }, 0);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: SANS, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus,textarea:focus,select:focus{border-color:#00c2f0!important;box-shadow:0 0 0 3px rgba(0,194,240,0.08)!important}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#04060d}
        ::-webkit-scrollbar-thumb{background:#181e30;border-radius:4px}
        .act-btn:hover{opacity:0.85}
        .ghost-btn:hover{border-color:#00c2f0!important;color:#00c2f0!important}
        .tab-item:hover{color:#c4d0e8!important}
        .lead-card:hover{border-color:rgba(0,194,240,0.25)!important}
        .del-btn:hover{border-color:#e05a5a!important;color:#e05a5a!important}
      `}</style>

      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: MONO, fontSize: "15px", color: C.accent, letterSpacing: "3px", fontWeight: "600" }}>DA_TOOLKIT</span>
          <span style={{ fontFamily: MONO, fontSize: "9px", color: C.muted, letterSpacing: "1.5px" }}>// freelance growth engine v1</span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {TABS_DEF.map(t => (
            <button key={t.id} className="tab-item" onClick={() => setTab(t.id)}
              style={{
                padding: "7px 14px", fontFamily: MONO, fontSize: "10px", letterSpacing: "0.5px",
                cursor: "pointer", border: "none", borderRadius: "6px", transition: "all 0.12s",
                background: tab === t.id ? C.surf : "transparent",
                color: tab === t.id ? C.accent : C.muted,
                outline: tab === t.id ? `1px solid ${C.border}` : "none",
              }}>
              {t.icon} {t.label}
              {t.id === "pipeline" && (
                <span style={{ marginLeft: "6px", background: C.accent, color: C.bg, fontSize: "9px", padding: "1px 5px", borderRadius: "8px" }}>{leads.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 26px", maxWidth: "760px", margin: "0 auto" }}>

        {tab === "proposal" && (
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "500", marginBottom: "6px" }}>Proposal Generator</h2>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "24px" }}>
              Paste a job → get a client-focused opening that wins. Never starts with "I am experienced in..."
            </p>
            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={lbl}>Job Title</label>
                <input style={inp} placeholder="e.g. Data Analyst for monthly revenue dashboard" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Job Description</label>
                <textarea style={{ ...inp, resize: "vertical", minHeight: "110px" }} placeholder="Paste the full job posting here..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Your Skills <span style={{ color: C.muted, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <input style={inp} placeholder="Python, SQL, Power BI, Excel, Tableau..." value={mySkills} onChange={e => setMySkills(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button className="act-btn" style={btn(propBusy || !jobTitle || !jobDesc)} disabled={propBusy || !jobTitle || !jobDesc} onClick={genProposal}>
                  {propBusy ? "Generating..." : "Generate Proposal →"}
                </button>
                {proposal && (
                  <button className="ghost-btn" onClick={() => { setProposal(""); setJobTitle(""); setJobDesc(""); setMySkills(""); }}
                    style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "9px 16px", cursor: "pointer", fontSize: "11px", fontFamily: MONO, borderRadius: "6px", transition: "all 0.12s" }}>
                    Clear
                  </button>
                )}
              </div>
            </div>
            {proposal && (
              <div>
                <div style={resultBox}>{proposal}</div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="ghost-btn" onClick={() => navigator.clipboard?.writeText(proposal)}
                    style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "6px 14px", cursor: "pointer", fontSize: "10px", fontFamily: MONO, borderRadius: "5px", letterSpacing: "0.5px", transition: "all 0.12s" }}>
                    Copy to clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "seo" && (
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "500", marginBottom: "6px" }}>Gig SEO Optimizer</h2>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "24px" }}>
              Turn weak gig titles into keyword-ranked search magnets. Get optimized title, tags, and snippet.
            </p>
            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={lbl}>Current Gig Title</label>
                <input style={inp} placeholder='e.g. "I will do data analysis for your business"' value={gigTitle} onChange={e => setGigTitle(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Current Description <span style={{ color: C.muted, textTransform: "none", letterSpacing: 0 }}>(first 300 chars, optional)</span></label>
                <textarea style={{ ...inp, resize: "vertical", minHeight: "80px" }} placeholder="Paste beginning of your current description..." value={gigDesc} onChange={e => setGigDesc(e.target.value)} />
              </div>
              <button className="act-btn" style={btn(seoBusy || !gigTitle)} disabled={seoBusy || !gigTitle} onClick={optimizeGig}>
                {seoBusy ? "Optimizing..." : "Optimize Gig →"}
              </button>
            </div>
            {seoOut && (
              <div>
                <div style={resultBox}>{seoOut}</div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="ghost-btn" onClick={() => navigator.clipboard?.writeText(seoOut)}
                    style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "6px 14px", cursor: "pointer", fontSize: "10px", fontFamily: MONO, borderRadius: "5px", letterSpacing: "0.5px", transition: "all 0.12s" }}>
                    Copy to clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "rate" && (
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "500", marginBottom: "6px" }}>Rate Calculator</h2>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "24px" }}>
              Know your real market value. Stop undercharging. Get range, reasoning, and an upsell move.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={lbl}>Skill Level</label>
                <select style={{ ...inp }} value={level} onChange={e => setLevel(e.target.value)}>
                  <option value="beginner">Beginner (0–1 yr)</option>
                  <option value="mid">Mid-Level (1–3 yrs)</option>
                  <option value="senior">Senior (3+ yrs)</option>
                  <option value="expert">Expert / Specialist</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Project Type</label>
                <select style={{ ...inp }} value={projType} onChange={e => setProjType(e.target.value)}>
                  <option value="dashboard">Dashboard / BI Report</option>
                  <option value="cleaning">Data Cleaning / ETL</option>
                  <option value="analysis">Analysis + Insights Report</option>
                  <option value="automation">Python / Excel Automation</option>
                  <option value="ml">ML / Predictive Model</option>
                  <option value="scraping">Web Scraping</option>
                  <option value="sql">SQL / Database Work</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={lbl}>Project Scope</label>
              <textarea style={{ ...inp, resize: "vertical", minHeight: "80px" }} placeholder="e.g. Build a 5-page Power BI dashboard from 3 Excel files, automated weekly refresh, executive summary slide" value={scope} onChange={e => setScope(e.target.value)} />
            </div>
            <button className="act-btn" style={btn(rateBusy || !scope)} disabled={rateBusy || !scope} onClick={calcRate}>
              {rateBusy ? "Calculating..." : "Get Rate Advice →"}
            </button>
            {rateOut && <div style={resultBox}>{rateOut}</div>}
          </div>
        )}

        {tab === "pipeline" && (
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "500", marginBottom: "6px" }}>Client Pipeline</h2>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "20px" }}>
              Track every lead from first contact to closed. Move cards with ← → arrows.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", padding: "14px 16px", background: C.surf, borderRadius: "8px", border: `1px solid ${C.border}` }}>
              <input style={{ ...inp, flex: "2", minWidth: "120px" }} placeholder="Client name" value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} />
              <input style={{ ...inp, flex: "3", minWidth: "170px" }} placeholder="Project / gig title" value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} />
              <input style={{ ...inp, flex: "1", minWidth: "85px" }} placeholder="Budget $" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} />
              <button className="act-btn" style={{ ...btn(!form.client || !form.project), padding: "9px 18px" }} disabled={!form.client || !form.project} onClick={addLead}>
                + Add
              </button>
            </div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {STAGES.map(stg => {
                const col = leads.filter(l => l.stage === stg);
                return (
                  <div key={stg} style={{ minWidth: "148px", flex: "1", background: C.surf, borderRadius: "8px", border: `1px solid ${C.border}`, padding: "10px" }}>
                    <div style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "2px", color: STAGE_HUE[stg], textTransform: "uppercase", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{STAGE_LABEL[stg]}</span>
                      <span style={{ background: `${STAGE_HUE[stg]}22`, color: STAGE_HUE[stg], padding: "1px 6px", borderRadius: "4px", fontSize: "10px" }}>{col.length}</span>
                    </div>
                    {col.map(lead => (
                      <div key={lead.id} className="lead-card" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "9px 10px", marginBottom: "7px", transition: "border-color 0.15s" }}>
                        <div style={{ fontSize: "12px", fontWeight: "500", color: C.text, marginBottom: "2px" }}>{lead.client}</div>
                        <div style={{ fontSize: "11px", color: C.muted, lineHeight: "1.4", marginBottom: "3px" }}>{lead.project}</div>
                        {lead.budget && <div style={{ fontSize: "10px", color: C.green, fontFamily: MONO }}>{lead.budget}</div>}
                        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                          <button className="ghost-btn" onClick={() => moveLead(lead.id, -1)}
                            style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "2px 7px", cursor: "pointer", fontSize: "10px", borderRadius: "4px", transition: "all 0.12s" }}>←</button>
                          <button className="ghost-btn" onClick={() => moveLead(lead.id, +1)}
                            style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "2px 7px", cursor: "pointer", fontSize: "10px", borderRadius: "4px", transition: "all 0.12s" }}>→</button>
                          <button className="del-btn" onClick={() => setLeads(p => p.filter(l => l.id !== lead.id))}
                            style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "2px 7px", cursor: "pointer", fontSize: "10px", borderRadius: "4px", transition: "all 0.12s" }}>✕</button>
                        </div>
                      </div>
                    ))}
                    {col.length === 0 && (
                      <div style={{ fontFamily: MONO, fontSize: "9px", color: C.muted, textAlign: "center", padding: "14px 0", opacity: 0.4 }}>empty</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              {[
                { label: "Total leads", value: leads.length, color: C.accent },
                { label: "Active", value: leads.filter(l => l.stage !== "done").length, color: C.warn },
                { label: "Won / Done", value: leads.filter(l => l.stage === "done" || l.stage === "hired").length, color: C.green },
                { label: "Pipeline value", value: "$" + totalPipelineValue.toLocaleString(), color: C.text },
              ].map(s => (
                <div key={s.label} style={{ flex: "1", background: C.surf, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "11px 14px" }}>
                  <div style={{ fontFamily: MONO, fontSize: "8px", color: C.muted, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "5px" }}>{s.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: "500", color: s.color, fontFamily: MONO }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
