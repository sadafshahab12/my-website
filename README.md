*[_type == "order"]{
  customerName,
  totalAmount,
  products[]{
    quantity,
    price,
    "productDetails": product->,
    "productImageUrls": product->images[].asset->url
  }
}
