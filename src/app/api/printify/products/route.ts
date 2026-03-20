import { NextRequest, NextResponse } from "next/server";
import { getShopProducts } from "@/lib/printify-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shop_id") ?? process.env.PRINTIFY_SHOP_ID;
    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "shop_id is required" },
        { status: 400 }
      );
    }
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10)));
    const { products, total, page: resPage, limit: resLimit } = await getShopProducts(shopId, page, limit);
    return NextResponse.json({
      success: true,
      data: {
        products,
        total: total ?? products.length,
        page: resPage ?? page,
        limit: resLimit ?? limit,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
