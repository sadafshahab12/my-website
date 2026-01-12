import { serverClient } from "@/app/lib/serverClient";
import { CheckoutProduct } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // <- import uuidv4

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract customer info
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const address = `${formData.get("address")}, ${formData.get("postalCode")}`;
    const paymentMethod = formData.get("paymentMethod") as string;
    const totalAmount = Number(formData.get("totalAmount"));

    const products: CheckoutProduct[] = JSON.parse(
      formData.get("products") as string
    );

    // Get receipt file
    const receiptFile = formData.get("receipt") as File;
    if (!receiptFile) {
      return NextResponse.json(
        { success: false, error: "Please upload payment receipt." },
        { status: 400 }
      );
    }

    // Upload receipt to Sanity
    const receiptAsset = await serverClient.assets.upload(
      "image",
      receiptFile,
      {
        filename: receiptFile.name,
      }
    );

    // Create order document
    const createdOrder = await serverClient.create({
      _type: "order",
      customerName: `${firstName} ${lastName}`,
      email,
      phone,
      city,
      country,
      address,
      paymentMethod,
      totalAmount,
      status: "pending",
      transactionScreenshot: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: receiptAsset._id,
        },
      },
      products: products.map((p) => ({
        _key: uuidv4(), // <- add this unique key
        product: { _type: "reference", _ref: p._id }, // <- reference to product
        quantity: p.quantity,
        price: p.price,
      })),
    });

    return NextResponse.json({ success: true, orderId: createdOrder._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
