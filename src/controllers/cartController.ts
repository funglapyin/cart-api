import { Request, Response } from 'express';
import * as cartService from '../services/cartService';
import { NotFoundError, ValidationError } from '../errors';

type CartParams = { cartId: string };
type CartItemParams = { cartId: string; productId: string };

function handleError(res: Response, err: unknown): void {
  if (err instanceof NotFoundError)
    return void res.status(404).json({ error: (err as Error).message });
  if (err instanceof ValidationError)
    return void res.status(422).json({ error: (err as Error).message });
  res.status(500).json({ error: 'Internal server error' });
}

export function createCart(_req: Request, res: Response): void {
  try {
    res.status(201).json(cartService.createCart());
  } catch (err) {
    handleError(res, err);
  }
}

export function getCart(req: Request<CartParams>, res: Response): void {
  try {
    res.json(cartService.getCart(req.params.cartId));
  } catch (err) {
    handleError(res, err);
  }
}

export function addItem(req: Request<CartParams>, res: Response): void {
  try {
    const { productId, quantity, pricing, metadata } = req.body;
    res.json(cartService.addItem(req.params.cartId, productId, quantity, pricing, metadata));
  } catch (err) {
    handleError(res, err);
  }
}

export function updateItem(req: Request<CartItemParams>, res: Response): void {
  try {
    res.json(cartService.updateItemQuantity(
      req.params.cartId,
      Number(req.params.productId),
      req.body.quantity
    ));
  } catch (err) {
    handleError(res, err);
  }
}

export function removeItem(req: Request<CartItemParams>, res: Response): void {
  try {
    res.json(cartService.removeItem(req.params.cartId, Number(req.params.productId)));
  } catch (err) {
    handleError(res, err);
  }
}

export function deleteCart(req: Request<CartParams>, res: Response): void {
  try {
    cartService.deleteCart(req.params.cartId);
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
}
