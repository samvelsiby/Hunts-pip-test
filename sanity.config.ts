import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas/index'

export default defineConfig({
  name: 'default',
  title: 'MUNTS PIP Indicators',

  // Hardcoded for deployment
  projectId: '3zh3et0i',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
