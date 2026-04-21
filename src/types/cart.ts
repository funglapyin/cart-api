export type Pricing = {
  // currency: string;
  unitPrice: number; // locked at add-time in pence (e.g. 1099 = £10.99) to prevent price drift
};

export type ItemMetadata = {
  name: string; // denormalised from product at add-time — cart stays readable if product is deleted
  imageUrl?: string;
  addedAt: string; // ISO 8601
};

export type CartItem = {
  productId: number;
  quantity: number; // must be > 0, enforced at service layer
  pricing: Pricing;
  metadata: ItemMetadata;
};

export type Cart = {
  id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type CartSummary = Cart & {
  total: number; // sum of unitPrice * quantity per item
  itemCount: number;
};
