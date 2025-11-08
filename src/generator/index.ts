import { Command } from 'commander'
import { ensureDir, writeFile } from 'fs-extra'
import { basename, extname, join, resolve } from 'path'
import { loadLesson } from './ingest.js'
import { generateMarkdown } from './markdown.js'
import { type Lesson } from './schema.js'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function writeManifest(deckDir: string, lesson: Lesson) {
  const manifest = {
    project: lesson.project,
    assets: (lesson.assets ?? []).map((asset) => ({
      id: asset.id,
      alt: asset.alt,
      license: asset.license,
      source: asset.source,
    })),
    exportedAt: new Date().toISOString(),
  }
  await writeFile(join(deckDir, 'lesson.manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
}

async function run(input: string, options: { outDir: string; name?: string }) {
  const lesson = await loadLesson(resolve(input))
  const markdown = generateMarkdown(lesson)
  const slug = options.name ?? slugify(lesson.project.title ?? basename(input, extname(input)))
  const deckDir = resolve(options.outDir, slug)
  await ensureDir(deckDir)
  await writeFile(join(deckDir, 'slides.md'), markdown, 'utf8')
  await writeManifest(deckDir, lesson)
  return deckDir
}

const program = new Command()
program
  .name('slidev-mcp-generator')
  .description('Generate Slidev decks from lesson schemas')
  .argument('<lesson>', 'Path to the lesson JSON or YAML file')
  .option('-o, --out-dir <dir>', 'Output directory for generated decks', 'decks')
  .option('-n, --name <name>', 'Override generated deck folder name')
  .action(async (lesson, opts) => {
    try {
      const deckPath = await run(lesson, { outDir: opts.outDir, name: opts.name })
      console.log(`Deck generated at ${deckPath}`)
    } catch (error) {
      console.error('Failed to generate deck')
      console.error(error)
      process.exit(1)
    }
  })

program.parse()
