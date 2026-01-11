import { defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Reviewer Name",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "text",
      title: "Review Text",
      type: "text",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) =>
        Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "text",
      rating: "rating",
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: `${selection.rating} ⭐ - ${selection.subtitle.substring(
          0,
          50
        )}...`,
      };
    },
  },
});
