/**
 * Product shape aligned with the external API (PRODUCTS_API_EXTERNAL.md).
 * API returns: data.products[] with sellingPrice, images[{url,alt,isPrimary}], stock{}, etc.
 */
export interface Product {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  subcategory?: string;
  costPrice?: number;
  price: number; // sellingPrice
  compareAtPrice?: number; // costPrice for "was $X"
  discount?: number;
  taxRate?: number;
  stock?: ProductStock;
  brand?: string;
  model?: string;
  size?: string[];
  color?: string[];
  material?: string;
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  safetyFeatures?: string[];
  safetyStandards?: string[];
  certifications?: string[];
  images?: ProductImage[];
  image: string; // primary or first image url for display
  imageUrls?: string[]; // all image urls
  videoUrl?: string;
  model3dUrl?: string;
  model3dFormat?: string;
  keyFeatures?: string[];
  variants?: ProductVariant[];
  categoryAttributes?: Record<string, unknown>;
  specifications?: Array<{ key?: string; value?: string }>;
  vendor?: { name?: string; contact?: string; email?: string; address?: string };
  status?: string;
  isFeatured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  warrantyPeriod?: number;
  returnPolicy?: string;
  shippingInfo?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ProductStock {
  quantity?: number;
  lowStockThreshold?: number;
  reservedQuantity?: number;
  reorderPoint?: number;
  maxStock?: number;
  availableQuantity?: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id?: string;
  _id?: string;
  size?: string;
  color?: string;
  stock?: ProductStock;
  sku?: string;
  price?: number;
}

/** Raw product from API */
export type RawProduct = Record<string, unknown>;

/** Extract single product from GET /api/products/:id response. API returns { success, data: { product } } */
export function extractProduct(data: unknown): RawProduct | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const inner = obj.data as Record<string, unknown> | undefined;
  const p = inner?.product ?? obj.product;
  if (p && typeof p === "object") return p as RawProduct;
  return null;
}

/** Extract products from API response. API returns { success, data: { products, pagination } } */
export function extractProducts(data: unknown): RawProduct[] {
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  // { success, data: { products, pagination } }
  const inner = obj.data as Record<string, unknown> | undefined;
  if (inner && Array.isArray(inner.products)) return inner.products as RawProduct[];
  if (Array.isArray(obj.products)) return obj.products as RawProduct[];
  if (Array.isArray(obj.data)) return obj.data as RawProduct[];
  if (Array.isArray(obj.items)) return obj.items as RawProduct[];
  if (Array.isArray(data)) return data as RawProduct[];
  return [];
}

/** Extract pagination from API response */
export function extractPagination(data: unknown): { page: number; limit: number; total: number; pages: number } | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const inner = obj.data as Record<string, unknown> | undefined;
  const p = (inner?.pagination ?? obj.pagination) as Record<string, unknown> | undefined;
  if (!p || typeof p !== "object") return null;
  return {
    page: typeof p.page === "number" ? p.page : 1,
    limit: typeof p.limit === "number" ? p.limit : 20,
    total: typeof p.total === "number" ? p.total : 0,
    pages: typeof p.pages === "number" ? p.pages : 0,
  };
}

/** Normalize raw API product to Product (maps sellingPrice→price, images[].url→image) */
export function normalizeProduct(raw: RawProduct): Product {
  const id = String(raw._id ?? raw.id ?? "");
  const name = String(raw.name ?? raw.title ?? "");
  const desc = raw.description != null ? String(raw.description) : undefined;
  const sku = typeof raw.sku === "string" ? raw.sku : undefined;
  const barcode = typeof raw.barcode === "string" ? raw.barcode : undefined;
  const category = typeof raw.category === "string" ? raw.category : undefined;
  const subcategory = typeof raw.subcategory === "string" ? raw.subcategory : undefined;

  let price = 0;
  if (typeof raw.sellingPrice === "number") price = raw.sellingPrice;
  else if (typeof raw.price === "number") price = raw.price;
  else if (typeof raw.sellingPrice === "string") price = parseFloat(raw.sellingPrice) || 0;

  const costPrice = typeof raw.costPrice === "number" ? raw.costPrice : typeof raw.costPrice === "string" ? parseFloat(raw.costPrice) : undefined;
  const discount = typeof raw.discount === "number" ? raw.discount : undefined;
  const taxRate = typeof raw.taxRate === "number" ? raw.taxRate : undefined;

  const rawImages = raw.images as Array<{ url?: string; alt?: string; isPrimary?: boolean }> | undefined;
  let image = "";
  const imageUrls: string[] = [];
  const productImages: ProductImage[] = [];
  if (Array.isArray(rawImages) && rawImages.length > 0) {
    const primary = rawImages.find((i) => i?.isPrimary);
    const first = rawImages[0];
    const url = (primary ?? first)?.url;
    image = typeof url === "string" ? url : "";
    rawImages.forEach((i) => {
      if (i?.url) {
        imageUrls.push(i.url);
        productImages.push({ url: i.url, alt: i.alt, isPrimary: i.isPrimary });
      }
    });
  }

  const rawStock = raw.stock as Record<string, unknown> | undefined;
  let stock: ProductStock | undefined;
  if (rawStock && typeof rawStock === "object") {
    stock = {
      quantity: typeof rawStock.quantity === "number" ? rawStock.quantity : undefined,
      lowStockThreshold: typeof rawStock.lowStockThreshold === "number" ? rawStock.lowStockThreshold : undefined,
      reservedQuantity: typeof rawStock.reservedQuantity === "number" ? rawStock.reservedQuantity : undefined,
      reorderPoint: typeof rawStock.reorderPoint === "number" ? rawStock.reorderPoint : undefined,
      maxStock: typeof rawStock.maxStock === "number" ? rawStock.maxStock : undefined,
      availableQuantity: typeof rawStock.availableQuantity === "number" ? rawStock.availableQuantity : undefined,
    };
  }

  const brand = typeof raw.brand === "string" ? raw.brand : undefined;
  const model = typeof raw.model === "string" ? raw.model : undefined;
  const size = Array.isArray(raw.size) ? (raw.size as unknown[]).map(String) : undefined;
  const color = Array.isArray(raw.color) ? (raw.color as unknown[]).map(String) : undefined;
  const material = typeof raw.material === "string" ? raw.material : undefined;
  const weight = typeof raw.weight === "number" ? raw.weight : undefined;
  const dimensions = raw.dimensions && typeof raw.dimensions === "object" ? (raw.dimensions as { length?: number; width?: number; height?: number }) : undefined;
  const safetyFeatures = Array.isArray(raw.safetyFeatures) ? (raw.safetyFeatures as unknown[]).map(String) : undefined;
  const safetyStandards = Array.isArray(raw.safetyStandards) ? (raw.safetyStandards as unknown[]).map(String) : undefined;
  const certifications = Array.isArray(raw.certifications) ? (raw.certifications as unknown[]).map(String) : undefined;
  const videoUrl = typeof raw.videoUrl === "string" ? raw.videoUrl : undefined;
  const model3dUrl = typeof raw.model3dUrl === "string" ? raw.model3dUrl : undefined;
  const model3dFormat = typeof raw.model3dFormat === "string" ? raw.model3dFormat : undefined;
  const keyFeatures = Array.isArray(raw.keyFeatures) ? (raw.keyFeatures as unknown[]).map(String) : undefined;
  const variants = Array.isArray(raw.variants) ? (raw.variants as RawProduct[]) as ProductVariant[] : undefined;
  const categoryAttributes = raw.categoryAttributes && typeof raw.categoryAttributes === "object" ? (raw.categoryAttributes as Record<string, unknown>) : undefined;
  const specifications = Array.isArray(raw.specifications) ? (raw.specifications as Array<{ key?: string; value?: string }>) : undefined;
  const vendor = raw.vendor && typeof raw.vendor === "object" ? (raw.vendor as { name?: string; contact?: string; email?: string; address?: string }) : undefined;
  const status = typeof raw.status === "string" ? raw.status : undefined;
  const isFeatured = raw.isFeatured === true;
  const tags = Array.isArray(raw.tags) ? (raw.tags as unknown[]).map(String) : undefined;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : undefined;
  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : undefined;
  const warrantyPeriod = typeof raw.warrantyPeriod === "number" ? raw.warrantyPeriod : undefined;
  const returnPolicy = typeof raw.returnPolicy === "string" ? raw.returnPolicy : undefined;
  const shippingInfo = raw.shippingInfo && typeof raw.shippingInfo === "object" ? (raw.shippingInfo as Record<string, unknown>) : undefined;

  return {
    id,
    _id: raw._id as string | undefined,
    name,
    description: desc,
    sku,
    barcode,
    category,
    subcategory,
    costPrice,
    price,
    compareAtPrice: costPrice,
    discount,
    taxRate,
    stock,
    brand,
    model,
    size,
    color,
    material,
    weight,
    dimensions,
    safetyFeatures,
    safetyStandards,
    certifications,
    images: productImages.length ? productImages : undefined,
    image: image || (imageUrls[0] ?? ""),
    imageUrls: imageUrls.length ? imageUrls : undefined,
    videoUrl,
    model3dUrl,
    model3dFormat,
    keyFeatures,
    variants,
    categoryAttributes,
    specifications,
    vendor,
    status,
    isFeatured,
    tags,
    createdAt,
    updatedAt,
    warrantyPeriod,
    returnPolicy,
    shippingInfo,
    ...raw,
  };
}
