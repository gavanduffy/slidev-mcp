import { z } from 'zod'

export const AssetSourceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('url'),
    url: z.string().min(1, 'Asset url must not be empty'),
  }),
  z.object({
    type: z.literal('query'),
    query: z.string().min(1, 'Asset query must not be empty'),
  }),
])

export const AssetSchema = z.object({
  id: z.string().min(1, 'Asset id must not be empty'),
  source: AssetSourceSchema,
  alt: z.string().optional(),
  license: z.string().optional(),
})

const FeatureFlagsSchema = z
  .object({
    presenter_mode: z.boolean().optional(),
    drawing: z.boolean().optional(),
    vue_components: z.boolean().optional(),
    syntax_highlighting: z.boolean().optional(),
  })
  .partial()

const ExportSchema = z.object({
  formats: z.array(z.enum(['pptx', 'pdf', 'html'])).nonempty(),
})

const CompatibilitySchema = z
  .object({
    require_full_feature_parity: z.boolean().optional(),
    validate_markdown: z.boolean().optional(),
    allow_theme_overrides: z.boolean().optional(),
  })
  .partial()

export const ProjectSchema = z.object({
  engine: z.literal('slidev'),
  title: z.string().min(1),
  subject: z.string().optional(),
  duration_min: z.number().int().positive().optional(),
  theme: z.string().default('default'),
  unocss: z.boolean().optional(),
  features: FeatureFlagsSchema.optional(),
  export: ExportSchema.optional(),
  compatibility: CompatibilitySchema.optional(),
})

export const SlideSchema = z
  .object({
    layout: z.string().min(1),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    notes: z.string().optional(),
    class: z.string().optional(),
    css: z.string().optional(),
    transition: z.string().optional(),
  })
  .passthrough()

export const LessonSchema = z.object({
  project: ProjectSchema,
  assets: z.array(AssetSchema).optional(),
  slides: z.array(SlideSchema).min(1, 'At least one slide is required'),
})

export type Lesson = z.infer<typeof LessonSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Slide = z.infer<typeof SlideSchema>
export type Asset = z.infer<typeof AssetSchema>
