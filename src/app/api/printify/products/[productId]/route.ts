import { NextRequest, NextResponse } from "next/server";
import { getShopProduct } from "@/lib/printify-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shop_id") ?? process.env.PRINTIFY_SHOP_ID;
    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "shop_id is required" },
        { status: 400 }
      );
    }
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId is required" },
        { status: 400 }
      );
    }
    const { product } = await getShopProduct(shopId, productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch product";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
