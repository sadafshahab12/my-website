import { defineField, defineType } from "sanity";

export const saleHero = defineType({
  name: "saleHero",
  title: "Sale Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "eventLabel",
      title: "Event Label",
      type: "string",
      initialValue: "Limited Time Event",
      description:
        "Small text above the main title (e.g., 'Limited Time Event')",
    }),
    defineField({
      name: "mainTitle",
      title: "Main Title",
      type: "string",
      initialValue: "Sale",
    }),
    defineField({
      name: "highlightWord",
      title: "Title Highlight Word",
      type: "string",
      initialValue: "Sale",
      description:
        "The word in the title that will be italicized and colored gold.",
    }),
    defineField({
      name: "subTitle",
      title: "Sub-Title / Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "backgroundImage",
      title: "Hero Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alternative Text",
          type: "string",
          description: "Important for SEO and accessibility.",
        },
      ],
    }),
    defineField({
      name: "isActive",
      title: "Show Sale Banner?",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show or hide the hero section on the frontend.",
    }),
  ],
});
