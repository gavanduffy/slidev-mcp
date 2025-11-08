import yaml from 'js-yaml'
import { type Asset, type Lesson, type Project, type Slide } from './schema.js'

function encodeQuery(query: string): string {
  return encodeURIComponent(query.replace(/\s+/g, ' ').trim())
}

function assetToUrl(asset: Asset): string {
  if (asset.source.type === 'url') {
    return asset.source.url
  }
  const query = encodeQuery(asset.source.query)
  return `https://source.unsplash.com/1600x900/?${query}`
}

function assetPlaceholder(asset: Asset): string {
  const attrs = [`query=\"${asset.source.type === 'query' ? asset.source.query.replace(/\"/g, '"') : assetToUrl(asset)}\"`]
  if (asset.alt) {
    attrs.push(`alt=\"${asset.alt.replace(/\"/g, '"')}\"`)
  }
  return `<img ${attrs.join(' ')} />`
}

function renderNotes(notes?: string): { frontMatter?: string; body?: string } {
  if (!notes) {
    return {}
  }
  const trimmed = notes.trim()
  if (!trimmed) {
    return {}
  }
  const fm = `notes: |\n${trimmed
    .split(/\r?\n/)
    .map((line) => `  ${line}`)
    .join('\n')}`
  return { frontMatter: fm }
}

function renderFrontMatter(data: Record<string, unknown>): string {
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
  )
  if (Object.keys(filtered).length === 0) {
    return ''
  }
  return yaml.dump(filtered, { lineWidth: 0 }).trimEnd()
}

function renderObjectLiteral(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  const nextPad = '  '.repeat(indent + 1)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value
      .map((item) => `${nextPad}${renderObjectLiteral(item, indent + 1)}`)
      .join('\n')
    return `[` + `\n${items}\n${pad}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const inner = entries
      .map(([key, val]) => {
        const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `'${key}'`
        return `${nextPad}${safeKey}: ${renderObjectLiteral(val, indent + 1)}`
      })
      .join('\n')
    return `{` + `\n${inner}\n${pad}}`
  }
  if (typeof value === 'string') {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }
  return String(value)
}

function renderComponents(slide: Slide, assets: Map<string, Asset>): string {
  if (!Array.isArray(slide.components)) {
    return ''
  }
  return slide.components
    .map((component: any) => {
      if (!component || typeof component !== 'object') {
        return ''
      }
      const name = component.name
      if (!name || typeof name !== 'string') {
        return ''
      }
      const slot = component.slot ? `\n${component.slot}\n` : ''
      return `<${name} v-bind="${renderObjectLiteral(component.props ?? {}, 0)}">${slot}</${name}>`
    })
    .join('\n\n')
}

function renderInlineAssets(slide: Slide, assets: Map<string, Asset>): string {
  const blocks: string[] = []
  if (slide.mediaTop?.imageRef) {
    const asset = assets.get(slide.mediaTop.imageRef)
    if (asset) {
      const url = assetToUrl(asset)
      blocks.push(
        `![${asset.alt ?? asset.id}](${url})\n\n${assetPlaceholder(asset)}`
      )
    }
  }
  return blocks.join('\n\n')
}

function renderTwoCols(slide: Slide, assets: Map<string, Asset>): string {
  if (!slide.left && !slide.right) return ''
  const sections: string[] = []
  if (slide.left) {
    sections.push('::left::')
    if (slide.left.heading) {
      sections.push(`### ${slide.left.heading}`)
    }
    if (slide.left.items) {
      const bullets = (slide.left.items as any[]).map((item) => `- ${item}`).join('\n')
      sections.push(bullets)
    }
    sections.push('::')
  }
  if (slide.right) {
    sections.push('::right::')
    if (slide.right.heading) {
      sections.push(`### ${slide.right.heading}`)
    }
    if (slide.right.items) {
      const bullets = (slide.right.items as any[]).map((item) => `- ${item}`).join('\n')
      sections.push(bullets)
    }
    sections.push('::')
  }
  return sections.join('\n\n')
}

function renderBullets(slide: Slide): string {
  if (!slide.bullets) return ''
  return (slide.bullets as any[]).map((item) => `- ${item}`).join('\n')
}

function renderBigBullets(slide: Slide): string {
  if (!slide.bigBullets) return ''
  return (slide.bigBullets as any[])
    .map((item) => `- <span class="text-2xl font-semibold">${item}</span>`)
    .join('\n')
}

function renderSteps(slide: Slide): string {
  if (!slide.steps_numbered) return ''
  return (slide.steps_numbered as any[]).map((item, idx) => `${idx + 1}. ${item}`).join('\n')
}

function renderCallout(slide: Slide): string {
  if (!slide.callout) return ''
  return `> ${slide.callout}`
}

function renderExitTicket(slide: Slide): string {
  if (!slide.exitTicket?.prompt) return ''
  return [':::info', `**Exit Ticket:** ${slide.exitTicket.prompt}`, ':::'].join('\n')
}

function renderCodeBlock(slide: Slide): string {
  const code = slide.codeBlock as any
  if (!code?.content) return ''
  const lang = code.language ?? ''
  const trimmed = typeof code.content === 'string' ? code.content.trimEnd() : ''
  return ['```' + lang, trimmed, '```'].join('\n')
}

function resolveBackground(slide: Slide, assets: Map<string, Asset>): string | undefined {
  const background = slide.background as any
  if (!background || !background.imageRef) return undefined
  const asset = assets.get(background.imageRef)
  if (!asset) return undefined
  return assetToUrl(asset)
}

function renderSlide(slide: Slide, assets: Map<string, Asset>): string {
  const frontMatterData: Record<string, unknown> = {
    layout: slide.layout,
    title: slide.title,
    subtitle: slide.subtitle,
    class: slide.class,
    css: slide.css,
    transition: slide.transition,
  }

  const backgroundUrl = resolveBackground(slide, assets)
  if (backgroundUrl) {
    frontMatterData.background = backgroundUrl
    if (slide.background?.dim !== undefined) {
      frontMatterData.backgroundDim = slide.background.dim
    }
  }

  const notes = renderNotes(slide.notes)
  if (notes.frontMatter) {
    frontMatterData.notes = undefined
  }

  let frontMatter = renderFrontMatter(frontMatterData)
  if (notes.frontMatter) {
    frontMatter += `\n${notes.frontMatter}`
  }

  const bodySections: string[] = []
  if (slide.title && slide.layout !== 'cover') {
    bodySections.push(`# ${slide.title}`)
  }

  if (slide.callout) {
    bodySections.push(renderCallout(slide))
  }
  const inlineAssets = renderInlineAssets(slide, assets)
  if (inlineAssets) {
    bodySections.push(inlineAssets)
  }
  const twoCols = renderTwoCols(slide, assets)
  if (twoCols) {
    bodySections.push(twoCols)
  }
  const bullets = renderBullets(slide)
  if (bullets) {
    bodySections.push(bullets)
  }
  const bigBullets = renderBigBullets(slide)
  if (bigBullets) {
    bodySections.push(bigBullets)
  }
  const steps = renderSteps(slide)
  if (steps) {
    bodySections.push(steps)
  }
  const components = renderComponents(slide, assets)
  if (components) {
    bodySections.push(components)
  }
  const codeBlock = renderCodeBlock(slide)
  if (codeBlock) {
    bodySections.push(codeBlock)
  }
  const exitTicket = renderExitTicket(slide)
  if (exitTicket) {
    bodySections.push(exitTicket)
  }
  if (slide.notes && !notes.frontMatter) {
    bodySections.push('Notes:\n:::info\n' + slide.notes + '\n:::')
  }

  return `---\n${frontMatter}\n---\n\n${bodySections.join('\n\n').trim()}\n`
}

function renderProjectFrontMatter(project: Project): string {
  const fm: Record<string, unknown> = {
    title: project.title,
    theme: project.theme,
    duration: project.duration_min ? `${project.duration_min} minutes` : undefined,
    download: project.export?.formats?.includes('pdf') ?? false,
    presenter: project.features?.presenter_mode ?? true,
    drawing: project.features?.drawing ?? true,
    css: project.unocss ? 'uno.css' : undefined,
  }
  const base = renderFrontMatter(fm)
  return `---\n${base}\n---`
}

export function generateMarkdown(lesson: Lesson): string {
  const assets = new Map((lesson.assets ?? []).map((asset) => [asset.id, asset]))
  const header = renderProjectFrontMatter(lesson.project)
  const slides = lesson.slides.map((slide) => renderSlide(slide, assets)).join('\n\n')
  return [header, slides].join('\n\n').trim() + '\n'
}
