import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas/index'

export default defineConfig({
  name: 'default',
  title: 'MUNTS PIP Indicators',

  // Prefer Studio env vars, then Next public vars, then safe defaults
  projectId:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    '3zh3et0i',
  dataset:
    process.env.SANITY_STUDIO_DATASET ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
