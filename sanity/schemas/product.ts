import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "originalPrice",
      title: "Original Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discountPrice",
      title: "Discount Price",
      type: "number",
      description: "Sale price of the product (leave blank if no discount)",
      validation: (Rule) =>
        Rule.min(0).custom((discountPrice, context) => {
          const doc = context.document as { originalPrice?: number };
          if (
            discountPrice &&
            doc.originalPrice &&
            discountPrice >= doc.originalPrice
          ) {
            return "Discount price must be lower than the original price";
          }
          return true;
        }),
    }),
    defineField({
      name: "isTrending",
      title: "Is Trending?",
      description:
        "Check this to show this product in the search overlay trending section",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "promotion",
      title: "Promotion Status",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "New Arrival", value: "new" },
          { title: "Bestseller", value: "bestseller" },
          { title: "Featured", value: "featured" },
          { title: "Limited Edition", value: "limited" },
          { title: "Clearance", value: "clearance" },
        ],
        layout: "radio", // or "dropdown"
      },
      initialValue: "none",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),

    defineField({
      name: "material",
      title: "Material",
      type: "string",
    }),

    defineField({
      name: "size",
      title: "Size",
      type: "string",
    }),

    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "occasions",
      title: "Occasions",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "images.0",
      promotion: "promotion",
      price: "price",
    },
    prepare({ title, media, promotion, price }) {
      const labelMap: Record<string, string> = {
        new: "🆕 New",
        bestseller: "🔥 Bestseller",
        featured: "⭐ Featured",
        limited: "⏳ Limited",
        clearance: "💸 Clearance",
        none: "",
      };

      return {
        title,
        media,
        subtitle: `${labelMap[promotion] || ""} PKR ${price}`,
      };
    },
  },
});
