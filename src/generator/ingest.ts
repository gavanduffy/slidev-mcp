import { readFile } from 'fs/promises'
import { extname } from 'path'
import yaml from 'js-yaml'
import { LessonSchema, type Lesson } from './schema.js'

export async function loadLesson(filePath: string): Promise<Lesson> {
  const raw = await readFile(filePath, 'utf8')
  const ext = extname(filePath).toLowerCase()
  let data: unknown
  if (ext === '.yaml' || ext === '.yml') {
    data = yaml.load(raw)
  } else if (ext === '.json') {
    data = JSON.parse(raw)
  } else {
    throw new Error(`Unsupported lesson schema format: ${ext}`)
  }

  const parsed = LessonSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(`Invalid lesson schema. ${parsed.error.issues.map((issue) => issue.message).join('; ')}`)
  }

  return parsed.data
}
