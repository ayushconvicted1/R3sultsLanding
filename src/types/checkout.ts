export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutLineItem {
  productId: string;
  name: string;
  price: number; // in dollars
  quantity: number;
  image?: string;
  /** Short line for Stripe (e.g. "Size: M • Color: Red") */
  description?: string;
  size?: string;
  color?: string;
  /** Full product description for storage */
  productDescription?: string;
}

export interface CreateCheckoutBody {
  lineItems: CheckoutLineItem[];
  shippingAddress: ShippingAddress;
  /** When true, billing address is same as shipping (sent as billingAddress copy). */
  billingSameAsShipping?: boolean;
  billingAddress?: ShippingAddress;
  /** Shipping charges in dollars (e.g. 5.99). Stored in order. */
  shippingAmount?: number;
}
