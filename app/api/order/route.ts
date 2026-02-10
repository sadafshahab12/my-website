import { serverClient } from "@/app/lib/serverClient";
import { CheckoutProduct } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

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
      formData.get("products") as string,
    );

    // Get receipt file
    const receiptFile = formData.get("receipt") as File;
    if (!receiptFile) {
      return NextResponse.json(
        { success: false, error: "Please upload payment receipt." },
        { status: 400 },
      );
    }

    // 1. Upload receipt to Sanity
    const receiptAsset = await serverClient.assets.upload(
      "image",
      receiptFile,
      {
        filename: receiptFile.name,
      },
    );

    // 2. Create order document in Sanity
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
        _key: uuidv4(),
        product: { _type: "reference", _ref: p._id },
        quantity: p.quantity,
        originalPrice: p.originalPrice,
        discountPrice: p.discountPrice || 0,
        finalPrice:
          p.discountPrice && p.discountPrice > 0
            ? p.discountPrice
            : p.originalPrice,
      })),
    });

    try {
      await resend.emails.send({
        from: "Pearion Collections <onboarding@resend.dev>", 
        to: [email],
        subject: `Order Confirmed - #${createdOrder._id.slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #1a1a1a;">
            <h2 style="text-align: center; color: #D4AF37;">PEARION.</h2>
            <p>Dear ${firstName},</p>
            <p>Thank you for your order! We have received your payment receipt and our team is currently verifying it.</p>
            <div style="background-color: #fafafa; padding: 20px; margin: 20px 0;">
              <h4 style="margin-top: 0;">Order Summary</h4>
              <table style="width: 100%; border-collapse: collapse;">
                ${products
                  .map(
                    (p) => `
                  <tr>
                    <td style="padding: 8px 0;">${p.name} x ${p.quantity}</td>
                    <td style="text-align: right; padding: 8px 0;">PKR ${(p.discountPrice || p.originalPrice) * p.quantity}</td>
                  </tr>
                `,
                  )
                  .join("")}
                <tr style="border-top: 1px solid #ddd; font-weight: bold;">
                  <td style="padding: 12px 0;">Total Amount</td>
                  <td style="text-align: right; padding: 12px 0;">PKR ${totalAmount}</td>
                </tr>
              </table>
            </div>
            <p><strong>Shipping Address:</strong><br/> ${address}, ${city}, ${country}</p>
            <p style="font-size: 13px; color: #666;">Once verified, your order will be shipped within 2-3 business days.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Mail sending failed:", mailError);
    }

    return NextResponse.json({ success: true, orderId: createdOrder._id });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
