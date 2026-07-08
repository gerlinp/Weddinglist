# Handoff: Wedding Guest List Organizer

## Overview
A working guest-list planning tool for a wedding, styled as a handwritten notebook/diary. It lets a couple:
- Group guests into customizable status groups (default: Guaranteed / Invited / Maybe), with a "Move to Group" dropdown and drag-and-drop as two ways to reassign someone.
- View one group's list at a time, OR an "All Groups" combined flat list (no section dividers, just everyone with a small colored dot showing which group each guest is in).
- Tag guests with named, colored "family" groups for seating purposes (either a full structured family — adults + children in one step — or a lightweight named tag for any cluster of people, e.g. "College Friends").
- Mark individual guests as Child, Under-21, or "has a +1" (which auto-creates a linked "<Name>'s +1" guest row) — all tucked into a per-guest "Details" dropdown, shown as compact badges only when set.
- Split the list into "His" / "Hers" sides (renameable, and now recolorable) with a one-click "Combined" view.
- Filter/isolate by status, family tag, children-only, or under-21-only, with live headcounts that update to match whatever's currently visible (the "scenario" counter).
- Fully customize the visual theme live in the app: 4 preset "paper" color themes plus a custom color picker, 3 heading-font options, and a color picker for each side's accent color — all from a "Customize" panel.
- Export the whole list as JSON (full-fidelity backup/restore) or CSV (spreadsheet/caterer-friendly), and re-import a JSON backup.
- Fully responsive: a distinct mobile layout (hamburger menu, horizontal group-tab pills) alongside the desktop layout (sidebar of groups, top-right Customize panel).
- Everything persists to the browser's localStorage automatically — no backend.

## About the Design Files
The file in this bundle (`Wedding Guest List.dc.html`) is a **fully working HTML/JS prototype** built as a self-contained "Design Component" — it is a real, functional implementation (state, drag-and-drop, persistence, responsive breakpoints), not just a visual mock. Treat it as a **behavioral and visual reference**: the task is to **recreate this experience in the target codebase's environment** (React, Vue, native app, etc.) using that codebase's existing patterns, component library, and backend/data layer — not to ship this HTML file as-is. If no target framework/codebase exists yet, pick the most appropriate stack for a small persisted-state web app (e.g. React + a real database instead of localStorage, if multi-device sync is wanted).

## Fidelity
**High-fidelity, functional prototype.** Colors, type, spacing, and — importantly — all interaction logic (drag/drop, filters, counts, live theming, responsive behavior) are final/intentional, not placeholder. The developer should recreate both the pixel-level styling AND the exact interaction behavior described below.

## Visual Theme: Notebook / Diary
The whole app is styled to feel like a handwritten planner page, not a business app:
- **Spiral binding spine**: a fixed vertical strip along the left edge of the viewport with a repeating punched-hole pattern (`radial-gradient` circles), sitting behind all content (56px wide on desktop, 18px on mobile).
- **Ruled paper background**: the page background is a repeating horizontal-line gradient (simulating notebook ruling) plus a vertical "red margin rule" a little to the right of the spine — both color themeable (see Paper Theme below).
- **Heading font**: large text (event title, big stat numbers, column/modal headings) uses a handwritten/script font, switchable between three options (see Fonts below). Small UI text (labels, buttons, inputs) always stays in a clean sans-serif (Jost) for legibility — never switches with the heading font.
- **Family tag chips**: shown as bold, solid-color-tinted badges with a slight alternating rotation (±1.5–2°) for a scrapbook/sticker feel, plus a soft drop shadow.
- **"Washi tape" card style option**: one of three selectable card treatments for the guest-list card (see Card Style below) that adds two small rotated tape-strip decorations at the top corners.

## Screens / Views
Single-page app with one primary view and several overlays/panels.

### 1. Header
- Editable event **Title** (large, heading font).
- Below it, two separate editable fields side by side: **Names** (e.g. "Sarah & James") and **Date** (e.g. "October 10, 2026") — intentionally split into two fields rather than one freeform subtitle line.

### 2. Customize Panel (top right, desktop only)
A button labeled "Customize" with a small color-swatch preview, top-right of the page. Opens a panel with:
- **Paper Theme**: 4 preset swatches (Cream, Blush, Sage, Slate) plus a native color-picker swatch for a fully custom paper color (derives the whole paper palette — page background, rule lines, spine, card background, toolbar/filter panel backgrounds — from one picked color via CSS `color-mix`).
- **Heading Font**: 3 options — Handwritten (Caveat), Elegant Serif (Playfair Display), Script (Dancing Script) — each button preview-rendered in its own font.
- **Accent Colors**: one native color picker + a pasteable hex text field (commits on blur/Enter) per side (His/Hers), so the couple can pick literally any color, not just presets.
On mobile, the same three sections (Paper Theme, Heading Font, Accent Colors) live at the bottom of the hamburger slide-down menu instead of a top-right panel.

### 3. View Switcher ("His & Hers" — diary tab index)
Row of tabs styled like folder/diary tabs (rounded top corners only, sit slightly above a divider line): one per "side" (default 2: "His", "Hers" — name is an editable inline input) plus a static "Combined" pill. Each side tab is **always a full solid fill** in that side's accent color (not just tinted) — the active tab is fully opaque and lifted up 3px with a stronger shadow; inactive tabs sit at ~62% opacity. Each side tab also has a small circular swatch button that opens a color popover (native color picker + hex text field) to change just that side's accent color. Selecting a side filters the whole app to guests assigned to that side; "Combined" shows everyone.

### 4. Toolbar (desktop) / Hamburger menu (mobile)
Desktop: a horizontal bar with "+ Add Guests" (primary, filled with the His/accent-1 color), "+ New Group", a "Family tags:" label with one clickable chip per existing tag (opens edit/recolor/delete), "+ New Tag" (quick tag, name+color only), "+ Add Family" (structured flow), "Export ▾" (dropdown: Backup .json / Spreadsheet .csv), "Import" (file picker), and a "Filters" toggle on the far right.
Mobile: all of the above collapse into a "☰" hamburger button that opens a full-height slide-down panel from the left with the same actions stacked vertically, plus the Customize sections at the bottom.

### 5. Filters Panel (collapsible, toggled by the Filters button)
Three rows of toggle chips: "Groups" (one per status, click to show/hide), "Families" (one per tag + "No family tag", each with the same slight rotation as tag chips elsewhere), "Isolate" (Children only / Under-21 only — OR'd together when both active, AND'd against the group/family toggles). Plus a "Reset filters" link.

### 6. Counts Bar
Big heading-font numbers: Total guests, Adults, Children, Under 21 — all computed from the currently *visible* (filtered + side-scoped) set, so toggling any filter or side immediately updates these "scenario" counts. A pill reading "Viewing a filtered scenario" appears when any filter is non-default. Below that, a small per-status-group count row (color dot + name + count).

### 7. Groups Navigation + Guest List (replaces a side-by-side kanban board)
This is the core content area, and it is **single-list, not multi-column** — only one group's list (or the combined list) is shown at a time:
- **Desktop**: a left sidebar (~220px, sticky) lists every group as a clickable row (color dot, editable name, count, delete-if->1-group), topped by an "All Groups" row and bottom by a "+ Add Group" button. Clicking a row shows that group's list to the right, full width. You can also **drag a guest row or a whole family-tag group header directly onto a sidebar row** to move it to that group — this is the replacement for the old side-by-side drag-and-drop.
- **Mobile**: the same groups render as horizontally-scrollable pill tabs (with an "All Groups" pill and a "+ Add Group" pill) above the single list.
- **"All Groups" view**: shows every visible guest across all statuses merged into **one flat list** — grouped only by family tag (same as the per-group view), NOT separated into per-status sections. Each guest row shows an extra small colored dot indicating which status group they belong to, since there are no section headers to convey that.
- **Card style** (selectable, see below): the single active list renders inside a card with one of 3 selectable treatments — clean "index card" (soft shadow), "deckle edge" (jagged torn-paper `clip-path` on top/bottom), or "washi tape" (two rotated tape-strip decorations at the top corners).
- Within the list, guests are grouped by family tag: each tag renders as a bold colored badge header (draggable — dragging it moves **every** member of that tag to wherever it's dropped, including a different group's sidebar row). Guests with no tag appear under an italic "No family tag" label.
- **Each guest row is two lines**: line 1 is the drag handle, optional side-dot / status-dot, editable name, and delete "×". Line 2 (indented) holds compact badges for any active +1/Child/Under-21/family-tag flags, plus a "Details ▾" button.

### 8. Per-guest "Details" dropdown
Triggered by "Details ▾" on a row's second line. Contains, top to bottom: a **Family Tag** select (moved here from the row itself — the tag only shows as a small badge on the row when set), Child checkbox, Under-21 checkbox, "+1 (plus one)" checkbox (auto-creates/removes a linked "<Name>'s +1" companion guest), a **Side** select (His/Hers), and a **Move to Group** select (the primary non-drag way to reassign someone's status group, since only one group is visible at a time). Popover is absolutely positioned under the row and closes on outside click.

### 9. Add Guests modal
Bulk-paste flow: choose target Group, optional Family tag, and Side, paste one name per line into a textarea, optional "Give each guest a +1" checkbox. Submits all as new guest rows.

### 10. Add Family modal
Structured single-family creation: Family name (becomes the tag), color swatch picker, target Group + Side, "Adult 1" / "Significant other" name fields (optional), and a dynamic list of Child name rows with "+ Add Child"/remove. Submitting creates the tag plus one guest row per filled-in name (children flagged `isChild: true`).

### 11. New Tag / Edit Tag modal
Lightweight tag creation for any non-family grouping (e.g. "College Friends") — name + color swatch only. Editing offers Delete (clears the tag from guests who had it, doesn't delete the guests).

## Responsive Behavior
- Breakpoint: `window.innerWidth < 760` → mobile layout (tracked in state, updated on resize).
- Mobile changes: hamburger menu replaces the toolbar; horizontal pill tabs replace the sidebar; smaller spine width (18px vs 56px); smaller title font (32px vs 48px); smaller page gutters (18px vs 40px); no top-right Customize button (folded into the hamburger menu instead); "+ Add Group" appears as its own pill at the end of the group-tabs row (in addition to inside the hamburger menu) for discoverability.

## Interactions & Behavior
- **Drag and drop** uses native HTML5 DnD. Dragging a guest row and dropping it on a sidebar/pill group row moves that person to that group (and, if dropped directly on a family-tag group header within the currently open list, also reassigns that tag). Dragging a family-tag group header onto a sidebar/pill row moves every guest with that tag to that group.
- **Click-outside-to-close**: per-guest Details dropdown, the Export dropdown, side-tab color popovers, and the Customize panel all close on any outside click (a root-level click handler resets all "open" flags; each popover stops click propagation internally).
- **Inline editing**: title/names/date, group names (sidebar/pill rows), tag names (via chip click → modal), side-tab names, and guest names are all plain editable text inputs — no separate "edit mode".
- **+1 linkage**: toggling "+1" creates a second guest record immediately after the parent in data order, named "<Name>'s +1", flagged `isPlusOne: true` / `plusOneOf: <parentId>`; deleting either side cleans up the link on the other.
- **Filter combination logic**: a guest is visible if — its status is checked, AND its tag (or "no tag") is checked, AND (no isolate filter is on, OR it matches Children-only and/or Under-21-only), AND (view is Combined, or its assigned side matches the active side tab).
- **Color pickers**: every custom color (paper, His accent, Hers accent) is a native `<input type="color">` swatch paired with a plain hex text `<input>` that commits on blur or Enter (so users can paste a hex code, since native color inputs don't accept pasted text themselves). Colors are stored as hex strings; all tinting/darkening for badges, fills, and text-contrast is computed live via CSS `color-mix()` and a luminance check — not precomputed palettes — so any picked color themes correctly everywhere it's used.
- **Export**: "Backup (.json)" downloads the full data model (statuses, tags, sides, people, event title/names/date, paper theme, custom paper color, font pairing) for later re-import. "Spreadsheet (.csv)" downloads a flattened table (Name, Group, Family Tag, Child, Under 21, Plus One).
- **Import**: file picker accepts a previously exported JSON file; confirms before overwriting if guests already exist; invalid files show an alert instead of crashing.
- No animations/transitions beyond native browser defaults — hover states use a light background tint on rows/buttons.

## State Management
Core data model (see file for exact shape):
- `statuses`: `[{ id, name, color }]` — the selectable groups (Guaranteed/Invited/Maybe by default).
- `tags`: `[{ id, name, color }]` — family/seating groups.
- `sides`: `[{ id, name, color }]` — exactly 2 by default ("His"/"Hers"), each renameable and recolorable; a person's `sideId` points here.
- `people`: `[{ id, name, statusId, tagId, sideId, isChild, isMinor, isPlusOne, plusOneOf, hasPlusOne, plusOneId }]`.
- `filters`: `{ statusIds: [], tagIds: [], onlyChildren, onlyMinors }`.
- `activeSideView`: `'combined' | <sideId>`.
- `mobileActiveStatusId`: which group (or the `'ALL_GROUPS'` sentinel) is currently shown in the single-list view — despite the name, this now drives the list on **both** desktop and mobile.
- `eventTitle`, `eventNames`, `eventDate`: the three header fields.
- `paperTheme`: one of `'cream' | 'blush' | 'sage' | 'slate' | 'custom'`; `customPaperColor`: hex string used when `paperTheme === 'custom'`.
- `fontPairing`: one of `'handwritten' | 'serif' | 'script'` (drives the heading font only).
- Transient UI-only state (which modal/popover is open, drag payload, form field drafts, `isMobile`) should NOT be persisted — everything listed above should survive reload/backend sync.
- Everything is currently persisted to `localStorage` on every change and rehydrated on load. In a real build this should move to a real backend (per-couple account), keeping the same shape.

## Design Tokens

**Colors:**
- Paper theme presets (page background / rule-line color / spine background / hole color / card background / toolbar background / filter-panel background / swatch preview) — 4 built-in presets (Cream, Blush, Sage, Slate), each a family of very light, slightly warm/cool tinted neutrals; a 5th "Custom" mode derives the same 7 values from one user-picked color via `color-mix(in srgb, white N%, <picked color>)` at varying white percentages (93/78/88/74/96/93/90/72).
- Accent colors (His/Hers): fully user-pickable via native color input, default seed colors are a royal blue and a burnt orange. These two colors cascade through the whole app as the primary/secondary brand accent — primary buttons, Child/Under-21 badge colors, active-filter borders, checkbox accent colors, active states — not just the side tabs themselves.
- Family tag colors: separate small fixed palette of 8 hues (unrelated to the two accent colors), cycled when creating new tags/families/groups.
- Text-on-color contrast is computed at runtime (luminance check against real RGB, via a temporary DOM element + `getComputedStyle`) rather than hardcoded, so arbitrary picked colors always get readable label text.

**Typography:**
- Heading font (event title, big stat numbers, group/modal headings): user-selectable — **Caveat** (handwritten, default), **Playfair Display** (elegant serif), or **Dancing Script** (script) — all loaded upfront so switching is instant.
- All functional UI (labels, inputs, buttons, body copy): **Jost** (clean geometric sans) — never changes with the heading font choice.
- Base UI text size: 12–15px; guest row name: 15px; stat numbers: 44px; event title: 48px desktop / 32px mobile.

**Spacing / shape:**
- Card radius: 12px (or a jagged clip-path in "deckle edge" card style); chips/pills: fully rounded (20px+) or 8px for tag badges; small status/tag badges: 14px radius.
- Standard content padding: 40px page gutters desktop / 18px mobile; 16–28px inside panels/modals; 9–16px inside rows.
- Sidebar width: 220px fixed (desktop); spine width: 56px desktop / 18px mobile.

## Assets
No image/icon assets — all indicators are CSS shapes (colored dots/circles, `radial-gradient` punch-holes) or plain unicode glyphs (`⠿` drag handle, `▾` dropdown caret, `×` delete/remove, `☰` hamburger). No emoji, matching the elegant/handwritten tone.

## Files
- `Wedding Guest List.dc.html` — the complete working prototype (template + logic in one file). This is the source of truth for exact copy, spacing, and behavior described above.
