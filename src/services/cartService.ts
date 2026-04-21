import { randomUUID } from 'crypto';
import { Cart, CartItem, CartSummary, Pricing, ItemMetadata } from '../types/cart';
import * as repository from '../repository/cartRepository';
import { NotFoundError, ValidationError } from '../errors';

export function createCart(): Cart {
  const cart: Cart = {
    id: randomUUID(),
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return repository.saveCart(cart);
}

export function getCart(cartId: string): CartSummary {
  const cart = repository.findCart(cartId);
  if (!cart) throw new NotFoundError(`Cart ${cartId} not found`);
  return toSummary(cart);
}

// If productId already exists, merge quantity instead of duplicating
export function addItem(
  cartId: string,
  productId: number,
  quantity: number,
  pricing: Pricing,
  metadata: Omit<ItemMetadata, 'addedAt'>
): CartSummary {
  if (quantity < 1) throw new ValidationError('Quantity must be greater than 0');

  const cart = repository.findCart(cartId);
  if (!cart) throw new NotFoundError(`Cart ${cartId} not found`);

  const existing = cart.items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      pricing,
      metadata: { ...metadata, addedAt: new Date().toISOString() },
    });
  }

  cart.updatedAt = new Date().toISOString();
  repository.saveCart(cart);
  return toSummary(cart);
}

export function updateItemQuantity(
  cartId: string,
  productId: number,
  quantity: number
): CartSummary {
  if (quantity < 1) throw new ValidationError('Quantity must be greater than 0');

  const cart = repository.findCart(cartId);
  if (!cart) throw new NotFoundError(`Cart ${cartId} not found`);

  const item = cart.items.find(i => i.productId === productId);
  if (!item) throw new NotFoundError(`Product ${productId} not found in cart`);

  item.quantity = quantity;
  cart.updatedAt = new Date().toISOString();
  repository.saveCart(cart);
  return toSummary(cart);
}

export function removeItem(cartId: string, productId: number): CartSummary {
  const cart = repository.findCart(cartId);
  if (!cart) throw new NotFoundError(`Cart ${cartId} not found`);

  const index = cart.items.findIndex(i => i.productId === productId);
  if (index === -1) throw new NotFoundError(`Product ${productId} not found in cart`);

  cart.items.splice(index, 1);
  cart.updatedAt = new Date().toISOString();
  repository.saveCart(cart);
  return toSummary(cart);
}

export function deleteCart(cartId: string): void {
  const deleted = repository.deleteCart(cartId);
  if (!deleted) throw new NotFoundError(`Cart ${cartId} not found`);
}

// Kept as a pure function so it can be unit tested independently
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.pricing.unitPrice * item.quantity, 0);
}

function toSummary(cart: Cart): CartSummary {
  return {
    ...cart,
    total: calculateTotal(cart.items),
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
