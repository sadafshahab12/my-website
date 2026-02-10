import { type SchemaTypeDefinition } from "sanity";
import { product } from "../schemas/product";
import { review } from "../schemas/review";
import { order } from "../schemas/order";
import { category } from "../schemas/category";
import { contact } from "../schemas/contact";
import { newsletter } from "../schemas/newsletter";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, review, order, category, contact, newsletter],
};
