import { spawn } from 'child_process'
import { dirname, resolve } from 'path'
import { ensureDir } from 'fs-extra'

type ExportFormat = 'pdf' | 'pptx' | 'html'

export interface ExportOptions {
  entry: string
  outDir?: string
  formats?: ExportFormat[]
  theme?: string
}

interface SlidevCommandOptions {
  command: 'export' | 'build'
  entry: string
  format?: 'pdf' | 'pptx'
  outDir?: string
  theme?: string
}

function runSlidevCommand({ command, entry, format, outDir, theme }: SlidevCommandOptions): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const args: string[] = [command, entry]
    if (command === 'export' && format) {
      args.push('--format', format)
    }
    if (command === 'build') {
      args.push('--out', outDir ?? 'dist')
      args.push('--format', 'static')
    }
    if (command === 'export' && outDir) {
      args.push('--output', outDir)
    }
    if (theme) {
      args.push('--theme', theme)
    }

    const child = spawn('npx', ['slidev', ...args], {
      stdio: 'inherit',
      env: { ...process.env },
    })

    child.on('close', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`slidev ${command} exited with code ${code}`))
    })
    child.on('error', reject)
  })
}

export async function exportDeck({ entry, outDir, formats = ['pdf', 'pptx', 'html'], theme }: ExportOptions): Promise<void> {
  const resolvedEntry = resolve(entry)
  const targetDir = outDir ? resolve(outDir) : resolve(dirname(resolvedEntry), 'dist')
  await ensureDir(targetDir)

  for (const format of formats) {
    if (format === 'html') {
      await runSlidevCommand({ command: 'build', entry: resolvedEntry, outDir: targetDir, theme })
    } else {
      const outputPath = resolve(targetDir, `${format}`)
      await ensureDir(outputPath)
      await runSlidevCommand({ command: 'export', entry: resolvedEntry, format, outDir: outputPath, theme })
    }
  }
}
