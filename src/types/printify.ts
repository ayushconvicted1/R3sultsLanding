/** Printify product (from API) */
export interface PrintifyProduct {
  id: string;
  title: string;
  description?: string;
  images?: Array<{
    src?: string;
    url?: string;
    position?: string;
    variant_ids?: number[];
  }>;
  /** Alternative image structure (views with files) */
  views?: Array<{
    label?: string;
    position?: string;
    files?: Array<{ src?: string; url?: string; variant_ids?: number[] }>;
  }>;
  variants?: PrintifyVariant[];
  options?: PrintifyOption[];
  /** Printify tags for filtering (array or comma-separated string) */
  tags?: string[] | string;
  [key: string]: unknown;
}

export interface PrintifyVariant {
  id: number;
  options?: Record<string, number>;
  cost?: number;
  price?: number;
  is_available?: boolean;
  [key: string]: unknown;
}

export interface PrintifyOption {
  name: string;
  type?: string;
  values?: Array<{
    id: number;
    title: string;
    colors?: string[];
  }>;
}

/** Line item for cart / order */
export interface PrintifyLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
  /** For display */
  product_title?: string;
  variant_label?: string;
  image_url?: string;
  price?: number;
}

/** Shipping address for checkout */
export interface PrintifyAddressTo {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}
