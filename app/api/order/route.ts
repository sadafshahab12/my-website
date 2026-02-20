import { serverClient } from "@/app/lib/serverClient";

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { CheckoutAllProduct } from "@/app/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("postalCode") as string;
    const address = formData.get("address") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const totalAmount = Number(formData.get("totalAmount"));

    // Cart products parse kar rahe hain (Dono types isme honge)
    const products: CheckoutAllProduct[] = JSON.parse(
      formData.get("products") as string,
    );

    // Unique Order Number (Universal format)
    const orderNumber = `PRN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Receipt upload logic
    const receiptFile = formData.get("receipt") as File;
    if (!receiptFile) {
      return NextResponse.json(
        { success: false, error: "Please upload payment receipt." },
        { status: 400 },
      );
    }

    const receiptAsset = await serverClient.assets.upload(
      "image",
      receiptFile,
      { filename: receiptFile.name },
    );

    // --- Sanity Document Creation ---
    const createdOrder = await serverClient.create({
      _type: "order", // Universal Type
      orderNumber,
      customerName: `${firstName} ${lastName}`,
      email,
      phone,
      city,
      country,
      address,
      postalCode,
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
        product: {
          _type: "reference",
          _ref: p._id, 
        },
        quantity: p.quantity,
        priceAtPurchase:
          p.discountPrice && p.discountPrice > 0
            ? p.discountPrice
            : p.originalPrice,
        itemType: p._type,
      })),
    });

    // --- Email Notification ---
    try {
      await resend.emails.send({
        from: "Pearion Collections <onboarding@resend.dev>",
        to: [email],
        subject: `Order Confirmed - #${orderNumber}`,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #1a1a1a;">
            <h2 style="text-align: center; color: #B8860B;">PEARION.</h2>
            <p style="text-align: center; font-weight: bold; font-size: 18px;">Order Confirmation</p>
            <p>Dear ${firstName},</p>
            <p>Thank you for shopping with us. We have received your order <b>#${orderNumber}</b> and it is currently under verification.</p>
            
            <div style="background-color: #fafafa; padding: 20px; margin: 20px 0;">
              <h4 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Summary</h4>
              <table style="width: 100%; border-collapse: collapse;">
                ${products
                  .map(
                    (p) => `
                  <tr>
                    <td style="padding: 8px 0;">${p.name} <br/> <small style="color: #666;">(${p._type?.toUpperCase()})</small></td>
                    <td style="text-align: center;">x${p.quantity}</td>
                    <td style="text-align: right;">PKR ${(p.discountPrice || p.originalPrice) * p.quantity}</td>
                  </tr>
                `,
                  )
                  .join("")}
                <tr style="border-top: 2px solid #D4AF37; font-weight: bold;">
                  <td colspan="2" style="padding: 12px 0;">Grand Total</td>
                  <td style="text-align: right; padding: 12px 0;">PKR ${totalAmount}</td>
                </tr>
              </table>
            </div>

            <p><strong>Shipping Details:</strong><br/>
            ${address}, ${city}<br/>
            ${postalCode}, ${country}</p>
            
            <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
              Pearion Collections - Elegant & Timeless
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      const message =
        mailError instanceof Error ? mailError.message : "Mail delivery failed";
      console.error("Resend Error:", message);
    }

    return NextResponse.json({
      success: true,
      orderId: createdOrder._id,
      orderNumber: orderNumber,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Checkout Error:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage || "Internal Server Error" },
      { status: 500 },
    );
  }
}
