import { Command } from 'commander'
import { exportDeck } from './builder.js'

const program = new Command()
program
  .name('slidev-mcp-export')
  .description('Compile and export Slidev decks')
  .argument('<entry>', 'Path to the Slidev entry markdown file (slides.md)')
  .option('-o, --out-dir <dir>', 'Output directory for exported assets')
  .option('-f, --formats <formats...>', 'Export formats (pdf pptx html)')
  .option('-t, --theme <theme>', 'Override Slidev theme')
  .action(async (entry, options) => {
    const formats = options.formats as string[] | undefined
    const normalizedFormats = formats?.length ? (formats as string[]).map((f) => f.toLowerCase()) : undefined
    try {
      await exportDeck({
        entry,
        outDir: options.outDir,
        formats: normalizedFormats as any,
        theme: options.theme,
      })
    } catch (error) {
      console.error('Failed to export deck')
      console.error(error)
      process.exit(1)
    }
  })

program.parse()
