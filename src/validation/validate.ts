import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import kleur from 'kleur'

interface DeckValidationResult {
  deck: string
  passed: boolean
  errors: string[]
}

const REQUIRED_PATTERNS: Array<[RegExp, string]> = [
  [/layout:\s*cover/, 'cover layout is required'],
  [/layout:\s*two-cols/, 'two-cols layout slot missing'],
  [/::left::[\s\S]*::right::/, 'two-cols slots not generated'],
  [/```[\s\S]*```/, 'code fences missing for syntax highlighting'],
  [/v-bind=\"/, 'Vue component binding missing'],
  [/notes:\s*\|/, 'Speaker notes not found'],
  [/\!\[[^\]]*\]\([^\)]+\)/, 'Image embedding missing'],
  [/\<img\s+query=\"[^\"]+\"/, 'AI asset placeholder missing'],
  [/transition:/, 'Slide transition metadata missing'],
]

async function validateDeck(deckPath: string): Promise<DeckValidationResult> {
  const slidesPath = join(deckPath, 'slides.md')
  const content = await readFile(slidesPath, 'utf8')
  const errors = REQUIRED_PATTERNS.filter(([regex]) => !regex.test(content)).map(([, message]) => message)
  return { deck: deckPath, passed: errors.length === 0, errors }
}

async function findDecks(root = 'decks'): Promise<string[]> {
  const entries = await readdir(root)
  const decks: string[] = []
  for (const entry of entries) {
    const fullPath = join(root, entry)
    if ((await stat(fullPath)).isDirectory()) {
      decks.push(fullPath)
    }
  }
  return decks
}

async function main() {
  try {
    const decks = await findDecks()
    if (decks.length === 0) {
      console.log(kleur.yellow('No decks generated yet. Run `npm run generate` first.'))
      return
    }
    const results = await Promise.all(decks.map(validateDeck))
    let hasErrors = false
    for (const result of results) {
      if (result.passed) {
        console.log(kleur.green(`✔ ${result.deck} passed validation`))
      } else {
        hasErrors = true
        console.log(kleur.red(`✖ ${result.deck} failed validation:`))
        result.errors.forEach((error) => console.log(`  - ${error}`))
      }
    }
    if (hasErrors) {
      process.exitCode = 1
    }
  } catch (error) {
    console.error(kleur.red('Validation failed to execute'))
    console.error(error)
    process.exit(1)
  }
}

main()
