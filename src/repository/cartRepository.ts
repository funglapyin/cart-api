import { Cart } from '../types/cart';

const carts = new Map<string, Cart>();

export function findCart(cartId: string): Cart | undefined {
  return carts.get(cartId);
}

export function saveCart(cart: Cart): Cart {
  carts.set(cart.id, cart);
  return cart;
}

export function deleteCart(cartId: string): boolean {
  return carts.delete(cartId);
}
