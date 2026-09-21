---
name: Santiago Paz
description: Polished steel, ink and blued steel for the maker; each live product struck on a plate in its own colors.
colors:
  blued: "#2a44a8"
  blued-deep: "#1d3183"
  on-blued: "#f5f7fa"
  on-blued-soft: "#d5dcf2"
  steel: "#edf0f3"
  steel-deep: "#dce2e8"
  steel-row: "#e2e7ec"
  steel-rule: "#c4ccd4"
  ink: "#111418"
  ink-soft: "#4a5360"
  white: "#ffffff"
  contract-lens-ink: "#16181d"
  contract-lens-soft: "#4b505a"
  contract-lens-seal: "#a3202f"
  contract-lens-layer: "#3d434d"
  contract-lens-pale: "#e8edf3"
  contract-lens-frame: "#d5dbe3"
  trading-desk-teal: "#008080"
  trading-desk-navy: "#000080"
  trading-desk-grey: "#c0c0c0"
  trading-desk-black: "#000000"
  trading-desk-layer: "#005f5f"
  trading-desk-pale: "#006b6b"
  reema-night: "#00131f"
  reema-aqua: "#25ffcd"
  reema-ink: "#e7edf0"
  reema-soft: "#b4c2c8"
  reema-layer: "#0b3a45"
  reema-pale: "#0a2a33"
  reema-frame: "rgb(231 237 240 / 0.16)"
typography:
  name:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3rem, 1.9rem + 4.1vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 112"
  page-title:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2.5rem, 1.8rem + 2.8vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 120"
  post-title:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 120"
  section-title:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2rem, 1.45rem + 1.9vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  plate-name:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 116"
  subhead:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.05
    fontVariation: "'wdth' 118"
  bench-title:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.375rem, 1.15rem + 0.9vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    fontVariation: "'wdth' 118"
  bench-name:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.375rem)"
    fontWeight: 700
    lineHeight: 1.1
    fontVariation: "'wdth' 116"
  role-line:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.3rem, 1.05rem + 1vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.15
    fontVariation: "'wdth' 106"
  lead:
    fontFamily: "Mozilla Text, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.02rem + 0.45vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Mozilla Text, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  reading:
    fontFamily: "Mozilla Text, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  small:
    fontFamily: "Mozilla Text, system-ui, sans-serif"
    fontSize: "0.9375rem"
    lineHeight: 1.6
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.9em"
  mark:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 118"
  button:
    fontFamily: "Mozilla Headline, Arial, Helvetica, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.015em"
    fontVariation: "'wdth' 110"
rounded:
  none: "0px"
spacing:
  page: "1240px"
  gutter: "clamp(20px, 4vw, 48px)"
  measure: "50ch"
  head-h: "64px"
components:
  mark-maker:
    backgroundColor: "{colors.blued}"
    textColor: "{colors.on-blued}"
    typography: "{typography.mark}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem 0.34rem"
    height: "1.875rem"
  mark-status:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.steel}"
    typography: "{typography.mark}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem 0.34rem"
    height: "1.875rem"
  mark-link:
    backgroundColor: "{colors.blued}"
    textColor: "{colors.on-blued}"
    typography: "{typography.mark}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem 0.34rem"
    height: "1.875rem"
  mark-layer:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.white}"
    typography: "{typography.mark}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem 0.34rem"
    height: "1.875rem"
  mark-pale:
    backgroundColor: "{colors.steel-deep}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.mark}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem 0.34rem"
    height: "1.875rem"
  mark-date:
    backgroundColor: "{colors.steel-deep}"
    textColor: "{colors.ink}"
    typography: "{typography.mark}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.7rem 0.34rem"
    height: "1.875rem"
  button-primary:
    backgroundColor: "{colors.blued}"
    textColor: "{colors.on-blued}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.25rem 0.8rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.blued-deep}"
    textColor: "{colors.on-blued}"
  button-small:
    backgroundColor: "{colors.blued}"
    textColor: "{colors.on-blued}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.6rem 0.9rem 0.55rem"
    height: "2.5rem"
  button-inverse:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.blued}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.25rem 0.8rem"
    height: "3rem"
  button-inverse-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blued}"
  text-action:
    textColor: "{colors.ink}"
    height: "2.75rem"
  masthead:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.ink}"
    height: "{spacing.head-h}"
  nav-link:
    textColor: "{colors.ink-soft}"
    padding: "0 0.8rem"
    height: "2.75rem"
  nav-link-current:
    textColor: "{colors.ink}"
  fact-register:
    backgroundColor: "{colors.steel-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(18px, 2vw, 24px)"
  plate:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.ink}"
    padding: "clamp(40px, 5vw, 72px) clamp(20px, 4vw, 48px) clamp(56px, 6vw, 88px)"
  plate-contract-lens:
    backgroundColor: "{colors.white}"
    textColor: "{colors.contract-lens-ink}"
  plate-trading-desk:
    backgroundColor: "{colors.trading-desk-teal}"
    textColor: "{colors.white}"
  plate-reema:
    backgroundColor: "{colors.reema-night}"
    textColor: "{colors.reema-ink}"
  bench-row:
    backgroundColor: "{colors.steel-row}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px 28px"
  contact-band:
    backgroundColor: "{colors.blued}"
    textColor: "{colors.on-blued}"
    padding: "clamp(64px, 8vw, 120px) clamp(20px, 4vw, 48px)"
---

# Design System: Santiago Paz

## Overview

**Creative North Star: "The Maker's Mark"**

The site reads like an assay register. One maker stamps every piece of work with the same SP mark. Each piece carries a row of hallmarks that anyone can check: whether it runs live, where its code is, and the domain where it runs. The maker's own pages are polished steel and ink, and blued steel is the maker's color. Each live product wears its own real colors wherever it appears. The SP mark stays blued on all of them.

Type does most of the work. Mozilla Headline, a grotesque with a width axis, cuts the name, the headings, the marks and the buttons. Mozilla Text, its reading companion, sets every line meant for reading. Marks are flat cartouches with cut corners. A mark is struck solid when the thing it names is built, and pale when it is not built yet. The density is calm: wide bands of color, a 1240px frame, and tight gaps inside each group of marks.

Real product screens and the headshot are the only pictures. The site's own surfaces carry no texture, gradient or glass, no hairline grid, no eyebrow labels and no section numbers. Only a product screen casts a shadow. The work never appears as a grid of same-size project cards or as text-left, image-right feature bands.

**Key Characteristics:**
- Polished steel ground, ink text and one accent, blued steel.
- Cut corners on every standalone shape. Nothing is rounded.
- Struck capitals in marks that certify facts: SP, Live, Code, dates and layers built.
- Live products in their own colors, on full-bleed plates and bench rows.
- Mozilla Headline cut wide or narrow with its width axis, and Mozilla Text for reading.
- One motion, the strike, which presses each mark in turn and never hides it.

## Colors

The maker's register is cool steel and near-black ink with one blue accent. Each live product brings its own palette and uses it only on its own surfaces.

### Primary
- **Blued Steel** (#2a44a8): the maker's color. It fills the SP mark on every page, plate and share card, the primary button, and link marks on steel. It also draws the focus ring, the current nav underline, text selection, the scrollbar thumb, the highlight bullets and the Contact band.
- **Deep Blued** (#1d3183): the hover state of the primary button and of links in running text.
- **Blued Paper** (#f5f7fa): letters and icons on blued steel.
- **Blued Mist** (#d5dcf2): quieter text on blued steel, such as the CV file size and the Contact details. It also underlines text actions in the Contact band.

### Neutral
- **Polished Steel** (#edf0f3): the page ground, the sticky masthead, plates for projects without their own colors, and the browser theme color.
- **Deep Steel** (#dce2e8): one tonal step down from the ground. It fills the fact register, the exam-domains panel, date marks, pale marks, inline code, quotes and the disclosure note.
- **Row Steel** (#e2e7ec): bench rows for projects without their own colors.
- **Steel Rule** (#c4ccd4): the 1px line under the masthead and the 1px frame around screens on steel. Both lines are decoration. No reader needs them to find an edge.
- **Ink** (#111418): all main text, and status marks on steel.
- **Soft Ink** (#4a5360): secondary text, nav links, layer marks on steel, and the letters on pale marks.
- **White** (#ffffff): letters on layer marks, the hover fill of the inverse button, and the Contract Lens field.

### Product colorways
A colorway fills the same roles on every product. The maker's steel colorway is the default. Each product overrides it on its plate, bench row, project page header and share card.

| Role | Maker | Contract Lens | Multi-Agent Trading Desk | Reema |
|---|---|---|---|---|
| Field | Polished Steel | White | Desktop Teal (#008080) | Reema Night (#00131f) |
| Text | Ink | Lens Ink (#16181d) | White | Reema Mist (#e7edf0) |
| Soft text | Soft Ink | Lens Soft (#4b505a) | White | Reema Soft (#b4c2c8) |
| Status mark | Ink, steel letters | Seal Red (#a3202f), white letters | Title-bar Navy (#000080), white letters | Reema Aqua (#25ffcd), night letters |
| Link mark | Blued Steel, Blued Paper letters | Lens Ink, white letters | Button Grey (#c0c0c0), black letters (#000000) | Reema Mist, night letters |
| Layer mark | Soft Ink, white letters | Lens Slate (#3d434d), white letters | Deep Teal (#005f5f), white letters | Reema Deep (#0b3a45), mist letters |
| Pale mark | Deep Steel, Soft Ink letters | Lens Pale (#e8edf3), slate letters | Shaded Teal (#006b6b), white letters | Reema Shade (#0a2a33), soft letters |
| Underline and focus | Blued Steel | Seal Red | White | Reema Aqua |
| Screen frame | Steel Rule | Lens Frame (#d5dbe3) | none | Reema Mist at 16% |
| Bench row | Row Steel | White | Desktop Teal | Reema Night |

### Named rules
**The Maker's Mark Rule.** The SP mark is always Blued Steel with Blued Paper letters, on every colorway, page and share card. A product may recolor every other mark but never this one. The Contact band is the one exception: it is blued itself, so its SP stamp turns steel with blued letters.

**The Own Colors Rule.** A product's colors stay on that product's plate, bench row, project page header and share card. The maker's pages never borrow them, and no product wears another's.

**The Legible Colorway Rule.** A new colorway fills every role in the table from the product's real colors, and every text pair passes 4.5:1. When nothing softer passes on the field, soft text stays at full strength, so the Trading Desk's soft text is white on its teal (4.77:1). Summaries in light text on the teal and night fields get a 1.68 line height and 0.01em tracking.

## Typography

**Display Font:** Mozilla Headline (with Arial Narrow, Arial, sans-serif)
**Body Font:** Mozilla Text (with system-ui, sans-serif)
**Label/Mono Font:** Mozilla Headline sets the marks too. Inline code uses the system monospace stack (ui-monospace, SF Mono, Menlo, Consolas).

**Character:** Mozilla Headline has struck capitals and a width axis (wdth) running 75 to 125, so each heading is cut to its own width, the way a die is cut. Its weight stops at 700, which is therefore the heaviest strike on the site. Mozilla Text is the same family's reading face, drawn for running text rather than for headlines. Mozilla Headline names and certifies; Mozilla Text explains.

### Hierarchy
- **Name** (700, 48-88px fluid, line height 0.94, wdth 112): the hero name on the home page, set on two lines. It is the one big voice.
- **Page title** (700, 40-68px, 0.98, wdth 120): the h1 on inner pages. Post titles step down to 36-60px because they run long.
- **Section title** (700, 32-44px, 1, wdth 125): Work, Writing and Contact on the home page. It is the widest cut on the site.
- **Plate name** (700, 24-34px, 1, wdth 116): the product name across the top of a plate. Inner-page section heads such as Role, Stack and Highlights share this step at wdth 118.
- **Bench title and bench name** (700; 22-28px at wdth 118, 18-22px at wdth 116): "More projects" and the project names in its rows.
- **Role line** (600, 21-30px, 1.15, wdth 106): the role under the name in the hero.
- **Running titles** (640-700, wdth 108-114): these borrow existing steps rather than adding sizes. Post titles in lists take the bench-title step (22-28px). Headings inside long text take the section-head step (24-34px) for h2 and the bench-name step (18-22px) for h3. Experience roles and FAQ questions take the bench-name step.
- **Lead** (Mozilla Text 400, 18-22px, 1.5): the line under a page title. The hero tagline and the Contact lead use the same size at 1.45.
- **Body** (Mozilla Text 400, 17px, 1.6): all running text. Long reading opens to 1.7. The measure is 50ch, about 69 characters, because Mozilla Text's zero is wide.
- **Small** (Mozilla Text, 15px): the footer, list labels, dates and meta lines. Labels at this size go bold (700), never capitals.
- **Mark** (Mozilla Headline 700, 13px, 0.06em tracking, capitals, wdth 118): the letters of every hallmark. Bench-row marks keep 13px letters and only tighten their padding. A domain keeps its lowercase, also at 13px, with 0.015em tracking.
- **Button** (Mozilla Headline 700, 15px, 0.015em, wdth 110, sentence case): button labels. The masthead CV button keeps the 15px label and only tightens its padding.

### Named rules
**The One Big Voice Rule.** The name is the largest type on the site, and everything else steps well below it. Nothing outgrows the name's 88px.

**The Cut Width Rule.** Mozilla Headline's width axis sets how wide each heading is cut. Section titles are widest (125), then page titles (120), marks and section heads (118), plate and bench names (116), the name (112), running titles (108-114) and the role line (106). Reading text never uses Mozilla Headline.

**The Struck Capitals Rule.** Capitals belong to marks. Headings, buttons and labels stay in mixed case, and open tracking (0.04em and wider) is for marks only. A domain inside a mark keeps its lowercase.

## Layout

Content sits in a 1240px frame with a fluid side gutter (20-48px). Color runs edge to edge: plates and the Contact band are full-bleed bands, and their content returns to the same frame. The masthead sticks to the top at 64px, and in-page jumps stop 16px below it.

The home page is one column of bands: the hero, the Work head, three plates in CV order, the bench, Writing, the blued Contact band and the footer. The hero splits into two equal columns. The name, role, tagline and actions sit on the left, and the fact register sits on the right. At 1020px and below the hero stacks.

A plate reads top to bottom. The title strip puts the name on the left and the hallmarks on the right, aligned on their bottom edge. The lede follows: the summary, up to 60ch, with the live domain mark on its own line to the right. In the body, the product screen and the Layers built stack stand side by side on one ground line. Under 860px each part stacks. Under 760px the screen switches to a phone capture, capped at 380px wide.

The bench lists the rest of the work as full-width rows, 10px apart, in one column. A plain row splits its text 5:7, with the name and marks on the left and the summary on the right. A live product on the bench is set like a small plate, with its screen capped at 640px (280px under 760px).

Inner pages use the same frame. Reading pages (posts and the 404) narrow to the 50ch measure plus gutters. A project page opens with the product's plate as its header. Below it, a 36:64 grid puts role and stack on the side and highlights and overview in the main column. The grid stacks under 860px.

Space between bands is large and fluid: 56-96px before the bench and around Writing, 64-120px inside the Contact band, 40-72px above plate content and 56-88px below it. Space inside a group is tight: 6px between hallmarks, 3px between built layers and 12px between register rows. Text caps are 50ch for body and long text, 60ch for plate and bench summaries, 62ch for post summaries, 52ch for page leads and 30ch for the hero tagline (40ch once the hero stacks).

Breakpoints: 1020px (the hero stacks), 860px (plates, bench rows, the project grid and the Contact band stack, and the large stamp hides), 760px (phone captures) and 640px (the masthead name hides, register, keyed, post and ledger rows stack, and action buttons go full width).

### Named rules
**The Full-Bleed Field Rule.** A colorway's field runs edge to edge. Only the content inside it returns to the 1240px frame.

**The 44px Rule.** Every text control is at least 44px tall: nav links, text actions, back links, footer links and the home link. Buttons are 48px, and the masthead CV button is 40px.

## Elevation & Depth

The system is flat. Marks, buttons, panels, rows and plates are solid fills with no shadow. Depth comes from tone: a panel on steel steps down to Deep Steel, and a bench row to Row Steel. The one thing that lifts is a real product screen on a plate, because the screen is the proof.

The masthead is set apart by a 1px Steel Rule line along its bottom edge, drawn as a zero-blur box-shadow (0 1px 0). It is a line, not a shadow.

### Shadow vocabulary
- **Screen lift** (`filter: drop-shadow(0 28px 36px var(--shadow)) drop-shadow(0 2px 4px var(--shadow-near))`): under each product screen on a plate. It pairs a long soft fall with a tight contact shadow. It is a filter on the screen's wrapper, not a box-shadow, so it follows the cut corners that clip the screen. The color comes from the plate's own ink: rgb(17 20 24 / 0.2) and 0.12 on steel, rgb(22 24 29 / 0.16) and 0.1 on Contract Lens, and rgb(0 0 0 / 0.45) and 0.3 on Reema night.
- **No lift:** the Trading Desk dialog already floats on its own teal desktop, so it takes no frame and no shadow. The exam-domains panel is text and stays flat. Screens on bench rows sit flat inside their frame.

### Named rules
**The Lifted Proof Rule.** Only a real product screen on a plate casts a shadow. Everything else stays flat, and nothing gets a hard offset shadow.

## Shapes

Corners are cut, never rounded. Each object that stands on its own (a mark, a button, a panel, a bench row, a screen, the portrait) is an octagon: a clip-path polygon cuts each corner at 45 degrees. border-radius stays 0 everywhere. The cut grows with the object: 3px on the 12px highlight bullet, 5px on marks, 6px on the masthead button, 7px on buttons, 8px on bench screens, 10px on bench rows and the portrait, 12px on plate screens, the fact register and the exam-domains panel, and 14px on the large SP stamp.

Fills that sit inside running text stay square: inline code, quotes and the disclosure note. Plates and the Contact band are square full-bleed bands, and only the objects on them are cut. The Trading Desk dialog keeps its own square window edges, with no frame and no cut.

A framed screen shows a 1px line in the colorway's frame color that follows the bevel, because the image is clipped 1px inside its frame.

Icons share the geometry: a 24px grid, a single 1.9 stroke, square caps and mitred joins, drawn as inline SVG at 1.1em.

**The Cut Corner Rule.** If an object stands alone, cut its corners with a bevel sized to it. If it sits in text, keep it square. Never round a corner.

## Components

### Marks
The world's own component: struck, flat and exact, like a hallmark on silver.
- **Shape:** a beveled cartouche with a 5px cut, at least 30px tall, padded 0.4rem 0.7rem 0.34rem. Letters are Mozilla Headline 700 at 13px, in capitals.
- **Tones:** maker (the SP mark), status (Live, and plain facts in the fact register), link (Code and the live domain, which open in a new tab and carry the diagonal arrow), layer (a layer that was built), pale (a stage like In progress or Waitlist, or a layer not built yet, which is spoken as "not built yet"), and date (Deep Steel with ink letters and tabular figures). Each tone takes its colors from the colorway.
- **Hover / Focus:** a link mark underlines its letters (1.5px, 0.22em offset). The focus ring sits on the outer link, outside the clipped mark, so the bevel never cuts it.
- **Small:** in bench rows, marks shrink to 26px tall; the letters stay 13px.
- **Large stamp:** the SP stamp in the Contact band, at the page-title step (40-68px) with a 14px cut, steel with blued letters. It hides under 860px.

**The Struck and Pale Rule.** A struck mark stands out from its field in full color. A pale mark sits one small step off its field, so it reads as not struck yet, but its letters still pass 4.5:1.

### Hallmark row
- **Order:** the SP mark first, then the project's standing (Live, or a pale stage), then Code. The live domain stays out of the row. It stands on its own line beside the summary as the assay mark, the place where a reader checks the piece.
- **Spacing:** 6px gaps. The row wraps when it runs out of width.

### The strike
- **Motion:** when a struck row first comes 40% into view, its marks press in turn. Each mark dips 2px and shrinks to 86%, then springs back over 0.52s on cubic-bezier(0.16, 1, 0.3, 1), 90ms after the mark before it. A flash of the mark's own ink rises to 62% and fades over 0.6s.
- **Where:** the fact register in the home page hero, and the hallmark row of every plate, including the plate that heads a project page. Bench rows, dates, the About page's register and other inner-page marks never strike.
- **Safety:** the mark is fully drawn before, during and after the strike. Under reduced motion the strike is removed and nothing else changes.

### Buttons
- **Shape:** cut corners (7px), 48px tall, padded 0.85rem 1.25rem 0.8rem. The label is Mozilla Headline 700 at 15px in sentence case, with a leading icon.
- **Primary:** Blued Steel with Blued Paper letters. Download CV adds the file type and size in Mozilla Text 13px Blued Mist.
- **Hover / Focus:** hover darkens the face to Deep Blued over 0.18s, and a press moves it down 1px. The 2px focus ring (3px offset) sits on the outer link, so the clipped face never cuts it.
- **Small:** the masthead CV button, 40px tall with a 6px cut and the 15px label.
- **Inverse:** on the blued Contact band the button turns steel with blued letters, and white on hover.
- **Text action:** the second action beside a button. It is bold text with a 2px underline in the colorway's underline color, at 0.3em offset. On hover the underline takes the text color.

### Fact register
- A Deep Steel panel with a 12px cut and 18-24px padding. Each row pairs a struck mark with one plain sentence. The first mark is the blued SP, and the rest are status marks.
- The 4:5 portrait floats top right at 104px, as on a German CV, and the rows beside it narrow around it. Under 640px the portrait moves above the rows at 88px, and each mark sits above its sentence.

### Plates
- **Corner Style:** the plate is a square full-bleed band. The screen on it has a 12px cut.
- **Background:** the product's field, or Polished Steel for a project without its own colors.
- **Shadow Strategy:** only the screen lifts (see Elevation & Depth).
- **Border:** none. A framed screen shows its 1px frame line.
- **Internal Padding:** 40-72px above and 56-88px below the content, with the page gutter at the sides.
- **Layers built:** layer marks of equal width, 3px apart, stacked like courses of a wall with the base at the bottom. Planned layers are pale. A 15px bold label, "Layers built", names the list.
- **No screen:** a project without a public screen shows real content from its own source instead. bedrock-genai-labs shows its five exam domains in a Deep Steel panel, keyed by D1-D5 layer marks. A plate never shows an invented picture.

### Bench rows
- Full-width panels with a 10px cut, padded 24px 28px (22px under 860px), filled with Row Steel or the product's field. The name is Mozilla Headline, with small hallmarks beside or under it. The summary is Mozilla Text 17px, the body size.
- A live product's row adds its screen, up to 640px wide, flat inside its frame.

### Navigation
- **Masthead:** sticky, 64px, Polished Steel with the 1px Steel Rule line below. The SP mark and the name (Mozilla Headline 640, 17px, wdth 112) sit on the left, then Work, About and Writing, then the small CV button.
- **Links:** Mozilla Text bold 15px in Soft Ink. They turn Ink on hover. The current section is Ink with a 2px Blued Steel underline at 0.45em offset.
- **Mobile:** under 640px the name hides and only the SP mark stays. Link padding tightens from 0.8rem to 0.55rem.
- **Footer:** 15px. The name and location sit on the left, then email, GitHub and LinkedIn as underlined Soft Ink links.
- **Skip link:** Blued Steel, fixed at the top left, shown on focus.

### Contact band
- A full-bleed Blued Steel band with 64-120px of padding. Text is Blued Paper, and details are Blued Mist. It holds the inverse button, a text action and the large SP stamp. Focus rings turn white on it.

### Lists on inner pages
- **Ledger:** experience rows with an 11rem period column in bold 15px Soft Ink with tabular figures, then the role in Mozilla Headline 640 at 20px.
- **Keyed list:** one mark and one sentence per row, as in Education and Elsewhere. It stacks under 640px.
- **Highlights:** each item starts with a 12px Blued Steel square with 3px cut corners.

### Icons
- Five inline SVG icons: external, download, arrow left, arrow right and mail. The diagonal arrow means a new tab on another site. Moves inside the site use the straight arrows, mail links use the envelope, and the CV uses the download arrow.

### Share cards
- One 1200x630 design serves every page, in the page's colorway. The title is Mozilla Headline Wide Bold at 88px, and long titles step down to 72px and 58px. The subtitle is Mozilla Text 30px in soft text. The marks run along the bottom left, led by the blued SP mark. The right side holds the headshot (360x450, 16px cut) or the product's public screen. The screen is cut on its left corners only (14px) and runs off the right edge.

## Do's and Don'ts

### Do:
- **Do** start every hallmark row with the blued SP mark, then the standing, then Code.
- **Do** give a new live product its own colorway: fill every role in the colorway table from its real colors, and check each text pair at 4.5:1 or better.
- **Do** mark anything not built yet as pale, and give a pale layer the spoken label "not built yet".
- **Do** use only real, public first screens of live products, taken from their own sites. Ship a phone capture for widths under 760px and a provenance file beside each image.
- **Do** cut the corners of any standalone object with a bevel sized to it: 5px on marks, 7px on buttons, 8-12px on panels, rows and screens.
- **Do** put the bevel on an inner face and the link outside it, so the 2px focus ring is never clipped.
- **Do** keep every text control at least 44px tall.
- **Do** set reading text in Mozilla Text at 17px within the 50ch measure.

### Don't:
- **Don't** round a corner. border-radius stays 0.
- **Don't** set text in capitals outside marks, and don't space out the letters of a heading.
- **Don't** put a label, number or kicker above a section or page heading. The only thing above a page title is a back link.
- **Don't** number page sections. Codes that belong to the content, like the exam's D1 to D5, go inside marks.
- **Don't** add texture, grain, gradients or glass. Steel is a flat fill.
- **Don't** draw hairline grids or divider rules between rows. Rows are separated by gaps and tone, and the only 1px lines are the screen frame and the masthead rule.
- **Don't** lift anything but a product screen on a plate, and never use a hard offset shadow.
- **Don't** recolor the SP mark, and don't let a product's colors leave its own plate, bench row, page header and share card.
- **Don't** show the work as a grid of same-size cards or as text-left, image-right feature bands.
- **Don't** use stock photos, illustrations, device mockups or invented screens. The headshot and real product screens are the only pictures.
- **Don't** use text glyphs or icon fonts as icons, and don't put the diagonal arrow on a link that stays on the site or opens mail.
- **Don't** hide a mark in order to animate it in. The strike presses a mark that is already there.
