# Slidev MCP Generator

A modular content presentation pipeline that converts structured lesson schemas (YAML/JSON) into fully featured [Slidev](https://sli.dev/) decks with support for interactive Vue components, UnoCSS theming, presenter tooling, and export automation.

## Features

- **Schema-driven generation** – turn JSON/YAML lesson definitions into Slidev-compatible Markdown decks.
- **Asset orchestration** – resolve hosted image URLs and generate `<img query="…" />` placeholders for AI-generated assets.
- **Layout coverage** – cover, center, two-cols, fact, and default layouts with slot-aware rendering.
- **Interactive content** – automatic Vue component injection, syntax-highlighted code blocks, and markdown enhancements.
- **UnoCSS theming** – ready-to-tweak `uno.config.ts` for rapid theme overrides and per-slide styling.
- **Export automation** – run the official Slidev CLI to produce PDF, PPTX, and static HTML bundles.
- **Validation tooling** – lightweight checks to confirm decks include required Slidev constructs (animations, notes, keyboard nav-ready structure, responsive assets).

## Getting Started

Install dependencies with your preferred package manager (Node.js ≥ 18 recommended):

```bash
npm install
```

### 1. Generate a deck from a lesson schema

```bash
npm run generate examples/resilience/lesson.yaml -- --out-dir decks
```

This command creates a folder such as `decks/building-resilience-and-growth-mindset/slides.md` plus a manifest describing the ingested project metadata and assets.

### 2. Validate generated decks

```bash
npm run validate
```

Validation checks confirm that generated decks contain presenter notes, AI asset placeholders, Vue components, transitions, keyboard navigation-ready sections, and code blocks for syntax highlighting.

### 3. Develop or present

Start Slidev in development mode with hot module replacement, drawing tools, and presenter mode:

```bash
npm run dev -- decks/building-resilience-and-growth-mindset/slides.md
```

### 4. Export deliverables

Use the runtime exporter to invoke the official Slidev pipeline:

```bash
npm run export:pdf -- decks/building-resilience-and-growth-mindset/slides.md
npm run export:pptx -- decks/building-resilience-and-growth-mindset/slides.md
npm run export:html -- decks/building-resilience-and-growth-mindset/slides.md
```

Or run the consolidated helper:

```bash
npm run validate && npx tsx src/runtime/index.ts decks/building-resilience-and-growth-mindset/slides.md --out-dir dist/resilience
```

### Example Deck

An example lesson (`examples/resilience/lesson.yaml`) and the generated Slidev deck (`examples/resilience/slides.md`) demonstrate:

- Cover, center, and two-column layouts
- Presenter notes and exit tickets
- Vue quizzes with progress tracking
- Syntax-highlighted TypeScript snippets
- Image handling with generated placeholders

## Project Structure

```
src/
  generator/        # schema parsing and markdown generation
  runtime/          # Slidev build/export automation
  validation/       # deck validation scripts
examples/           # sample lessons and generated slides
uno.config.ts       # UnoCSS presets and theme overrides
```

## Testing

```bash
npm test
```

`vitest` ensures that the generator renders expected layouts, Vue components, media assets, and code fences.

## Compatibility Guarantees

- Targets the latest Slidev CLI (`@slidev/cli@^0.43.10`).
- Respects Slidev presenter mode, drawing tools, live reload (HMR), keyboard navigation, notes view, and responsive scaling.
- Supports UnoCSS theming, custom shortcuts, and per-slide CSS overrides.
- Generates decks ready for `slidev export` to PDF, PPTX, and static HTML formats.
