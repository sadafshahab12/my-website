import { type SchemaTypeDefinition } from "sanity";
import { product } from "../schemas/product";
import { review } from "../schemas/review";
import { order } from "../schemas/order";
import { category } from "../schemas/category";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, review, order, category],
};
