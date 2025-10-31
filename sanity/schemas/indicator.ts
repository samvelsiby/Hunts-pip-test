import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'indicator',
  title: 'Indicator',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Trend', value: 'trend' },
          { title: 'Momentum', value: 'momentum' },
          { title: 'Volatility', value: 'volatility' },
          { title: 'Volume', value: 'volume' },
          { title: 'Custom', value: 'custom' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'planAccess',
      title: 'Plan Access',
      type: 'string',
      options: {
        list: [
          { title: 'Free', value: 'free' },
          { title: 'Pro', value: 'pro' },
          { title: 'Premium', value: 'premium' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tradingViewLink',
      title: 'TradingView Link',
      type: 'url',
    }),
    defineField({
      name: 'documentation',
      title: 'Documentation',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
          options: {
            hotspot: true,
          },
        },
        {
          type: 'object',
          name: 'codeBlock',
          title: 'Code Block',
          fields: [
            {
              name: 'filename',
              type: 'string',
              title: 'Filename',
            },
            {
              name: 'language',
              type: 'string',
              title: 'Language',
              options: {
                list: [
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'JSON', value: 'json' },
                  { title: 'Shell', value: 'bash' },
                  { title: 'Markdown', value: 'markdown' },
                ],
              },
            },
            {
              name: 'code',
              type: 'text',
              title: 'Code',
            },
          ],
        },
        {
          type: 'object',
          name: 'youtube',
          title: 'YouTube Embed',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'YouTube URL',
            },
          ],
        },
        {
          type: 'object',
          name: 'callout',
          title: 'Callout',
          fields: [
            {
              name: 'tone',
              type: 'string',
              title: 'Tone',
              options: {
                list: [
                  { title: 'Info', value: 'info' },
                  { title: 'Warning', value: 'warning' },
                  { title: 'Success', value: 'success' },
                ],
              },
            },
            {
              name: 'text',
              type: 'text',
              title: 'Text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'icon',
    },
    prepare(selection) {
      const { title, category } = selection
      return {
        title,
        subtitle: category ? `Category: ${category}` : 'No category',
      }
    },
  },
})
