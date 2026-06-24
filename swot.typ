// ── COLOURS ─────────────────────────────────────────────────────
#let C = (
  blue:   rgb("#1B3FC4"),
  green:  rgb("#15803D"),
  red:    rgb("#DC2626"),
  amber:  rgb("#D97706"),
  bg:     rgb("#FAF8F3"),
  text:   rgb("#14130F"),
  muted:  rgb("#6B6657"),
  border: rgb("#E7E2D6"),
  white:  rgb("#FFFFFF"),
)

// ── PAGE ────────────────────────────────────────────────────────
#set page(
  paper: "a4",
  margin: (top: 0pt, bottom: 16pt, left: 0pt, right: 0pt),
  background: rect(fill: C.bg, width: 100%, height: 100%),
)
#set text(font: "Inter", size: 7.5pt, fill: C.text)
#set par(leading: 0.55em, justify: false)

// ── HELPERS ─────────────────────────────────────────────────────
#let tag(l, col) = box(
  fill: col, radius: 3pt, inset: (x: 5pt, y: 2pt),
)[#text(size: 8pt, weight: "black", fill: C.white)[#l]]

#let sub(t) = {
  v(5pt)
  text(size: 5.5pt, weight: "bold", fill: C.muted, tracking: 1.5pt)[#upper(t)]
  v(1.5pt)
}

#let b(content, col) = {
  grid(columns: (6pt, 1fr),
    align(top)[#box(width: 3.5pt, height: 3.5pt, baseline: 0.5pt, radius: 50%, fill: col)],
    align(top)[#text(size: 7pt, fill: C.text)[#content]],
  )
  v(0.8pt)
}

#let card(l, title, col, body) = block(
  breakable: false, width: 100%,
  fill: C.white, radius: 6pt,
  stroke: (left: 2.5pt + col, top: 0.4pt + C.border,
           right: 0.4pt + C.border, bottom: 0.4pt + C.border),
  inset: (left: 11pt, right: 11pt, top: 9pt, bottom: 9pt),
)[
  #grid(columns: (auto, 5pt, 1fr),
    tag(l, col), [],
    align(horizon)[#text(size: 9.5pt, weight: "black", fill: col)[#title]],
  )
  #v(3pt)
  #line(length: 100%, stroke: 0.3pt + C.border)
  #body
]

// ── HERO ────────────────────────────────────────────────────────
#block(width: 100%, height: 96pt, fill: C.blue, breakable: false)[
  #place(top + right,
    block(width: 150pt, height: 96pt, fill: C.green.transparentize(60%)))
  #place(bottom + right, dx: -28pt, dy: -12pt,
    circle(radius: 42pt, fill: C.white.transparentize(93%)))
  #place(top + left, dx: 16pt, dy: 10pt,
    circle(radius: 20pt, fill: C.white.transparentize(93%)))
  #pad(left: 34pt, top: 16pt)[
    #text(size: 6.5pt, fill: C.white.transparentize(30%), weight: "semibold",
      tracking: 2.5pt)[STRATEGIC ANALYSIS · JUNE 2026]
    #v(4pt)
    #text(size: 22pt, fill: C.white, weight: "black",
      tracking: -0.6pt)[PharmaConnect]
    #v(2pt)
    #text(size: 9.5pt, fill: C.white.transparentize(22%),
      weight: "medium")[SWOT Analysis — Patient ↔ Pharmacist Platform · Lagos, Nigeria]
    #v(7pt)
    #box(fill: C.white.transparentize(80%), stroke: C.white.transparentize(68%),
      radius: 12pt, inset: (x: 8pt, y: 3pt),
    )[#text(size: 6.5pt, fill: C.white, weight: "semibold"
      )[🇳🇬  pharmaton.web.app · Medicine Access, Reimagined for Africa]]
  ]
]

// ── SUMMARY BAR ─────────────────────────────────────────────────
#pad(left: 26pt, right: 26pt, top: 6pt)[
  #block(width: 100%, fill: C.white, stroke: C.border, radius: 6pt,
    inset: (x: 0pt, y: 7pt))[
    #grid(columns: (1fr, 0.4pt, 1fr, 0.4pt, 1fr, 0.4pt, 1fr),
      align(center)[
        #text(size: 13pt, weight: "black", fill: C.green)[S]
        #linebreak()
        #text(size: 5.5pt, weight: "bold", fill: C.muted, tracking: 1pt)[STRENGTHS]
        #linebreak()
        #text(size: 6.5pt, fill: C.muted)[Live · Data · AI]
      ],
      block(height: 26pt, width: 0.4pt, fill: C.border),
      align(center)[
        #text(size: 13pt, weight: "black", fill: C.red)[W]
        #linebreak()
        #text(size: 5.5pt, weight: "bold", fill: C.muted, tracking: 1pt)[WEAKNESSES]
        #linebreak()
        #text(size: 6.5pt, fill: C.muted)[No payments · Manual]
      ],
      block(height: 26pt, width: 0.4pt, fill: C.border),
      align(center)[
        #text(size: 13pt, weight: "black", fill: C.blue)[O]
        #linebreak()
        #text(size: 5.5pt, weight: "bold", fill: C.muted, tracking: 1pt)[OPPORTUNITIES]
        #linebreak()
        #text(size: 6.5pt, fill: C.muted)[120k+ pharmacies]
      ],
      block(height: 26pt, width: 0.4pt, fill: C.border),
      align(center)[
        #text(size: 13pt, weight: "black", fill: C.amber)[T]
        #linebreak()
        #text(size: 5.5pt, weight: "bold", fill: C.muted, tracking: 1pt)[THREATS]
        #linebreak()
        #text(size: 6.5pt, fill: C.muted)[Incumbents · Trust]
      ],
    )
  ]
]

// ── 4 CARDS — single non-breakable block ────────────────────────
#pad(left: 26pt, right: 26pt, top: 7pt)[
  #block(breakable: false, width: 100%)[
    #grid(columns: (1fr, 1fr), gutter: 8pt,

      card("S", "Strengths", C.green)[
        #sub("Product")
        #b([*Deployed today* at pharmaton.web.app — live, working product], C.green)
        #b([Dual-sided network: patients find medicine, pharmacists get discovery], C.green)
        #b([AI search maps symptoms/categories to real drug names; "Did you mean" fallback], C.green)
        #b([Broaden-search shows all Lagos pharmacies when local stock is empty], C.green)

        #sub("Data & Trust")
        #b([Real pharmacy locations from OpenStreetMap + WHO EML drug catalog], C.green)
        #b([NAFDAC verified badge; PCN license required for pharmacist signup], C.green)

        #sub("Technology")
        #b([React 19 + Vite 8; Firebase Auth (email + Google); Express 5 + SQLite on Railway], C.green)
        #b([Pharmacist sidebar dashboard; fully responsive down to iPhone 8], C.green)
        #b([Search limits via localStorage; unlimited whitelist for team/demo accounts], C.green)
      ],

      card("W", "Weaknesses", C.red)[
        #sub("Product Gaps")
        #b([No payment integration — Paystack not wired; zero revenue flowing today], C.red)
        #b([Delivery/logistics decided by team but not yet built — gap in patient journey], C.red)
        #b([No push notifications; demand insight "This Week" card uses static mock data], C.red)

        #sub("Data & Trust")
        #b([Inventory accuracy requires pharmacists to update manually — no auto-sync], C.red)
        #b([PCN number is self-reported; not validated against the official PCN registry], C.red)
        #b([Search limits stored in localStorage — bypassable by clearing browser storage], C.red)

        #sub("Scale & Business")
        #b([SQLite will bottleneck above ~1,000 concurrent pharmacists], C.red)
        #b([Anthropic API is single point of failure for all AI features in production], C.red)
        #b([Firebase sends verification emails to spam; no pharmacist retention after trial], C.red)
      ],

      card("O", "Opportunities", C.blue)[
        #sub("Market")
        #b([*120,000+ registered pharmacies* in Nigeria — only a fraction are online], C.blue)
        #b([No dominant patient-facing pharmacy discovery platform exists in Nigeria], C.blue)
        #b([Lagos is ~20M people; early adoption creates compounding network effects], C.blue)

        #sub("Product Expansion")
        #b([Delivery/logistics layer closes the commerce loop (already planned by team)], C.blue)
        #b([Paystack enables pharmacist subscriptions + patient delivery payments], C.blue)
        #b([Abuja, Port Harcourt, Kano expansion via same OSM + seed data approach], C.blue)
        #b([WhatsApp bot integration — meets patients where they already are], C.blue)

        #sub("Partnerships & Revenue")
        #b([NAFDAC/PCN partnerships create regulatory moat; SDG 3 opens grant funding], C.blue)
        #b([Pharma distributors (Emzor, Fidson) would pay for demand forecasting data], C.blue)
      ],

      card("T", "Threats", C.amber)[
        #sub("Competition")
        #b([HealthPlus and MedPlus have brand trust, physical stores, and are building apps], C.amber)
        #b([mPharma (Ghana) already operates in Nigeria with deeper pockets], C.amber)
        #b([Remedial Health (B2B supply chain) could pivot patient-facing at any time], C.amber)

        #sub("Adoption Barriers")
        #b([Pharmacist behaviour change: daily digital inventory vs. 20 years of pen-and-paper], C.amber)
        #b([English-only UI excludes Yoruba/Igbo/Hausa speakers — significant market gap], C.amber)

        #sub("Regulatory & Operational")
        #b([NAFDAC/PCN licensing requirements for digital health platforms — compliance risk], C.amber)
        #b([Nigeria Data Protection Regulation (NDPR) compliance needed for health data], C.amber)
        #b([*Accuracy is existential* — wrong stock data destroys patient trust immediately], C.amber)
        #b([AI API cost scales with usage; small team with Paystack + delivery still outstanding], C.amber)
      ],
    )
  ]
]

// ── FOOTER ──────────────────────────────────────────────────────
#pad(left: 26pt, right: 26pt, top: 8pt)[
  #line(length: 100%, stroke: 0.4pt + C.border)
  #v(4pt)
  #grid(columns: (1fr, auto),
    text(size: 6pt, fill: C.muted)[*PharmaConnect* · Patient ↔ Pharmacist Medicine Discovery Platform · Lagos, Nigeria],
    text(size: 6pt, fill: C.muted)[pharmaton.web.app · June 2026],
  )
]
