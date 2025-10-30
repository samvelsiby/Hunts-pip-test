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
      of: [{ type: 'block' }],
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
