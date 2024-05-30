import { Response, Request } from "express";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import CartItem from "../entities/CartItem";
import Cart from "../entities/Cart";

export const createCartItem = async (req: Request, res: Response) => {
  const { quantity, cartId, productId } = req.body;

  const cartItemRepository = myDataSource.getRepository(CartItem);

  try {
    let existingCartItem = await cartItemRepository.findOne({
      where: {
        cart: { id: cartId },
        product: { id: productId },
      },
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;

      await cartItemRepository.save(existingCartItem);
      return res.json(existingCartItem);
    } else {
      const cartItem = cartItemRepository.create({
        quantity,
        cart: { id: cartId },
        product: { id: productId },
      });
      const result = await cartItem.save();
      return res.json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { quantity, cartId } = req.body;
  const { cartItemId } = req.params;

  const cart = await myDataSource.getRepository(Cart).findOne({
    where: {
      id: cartId,
    },
  });

  if (cart.user.id !== tkUser.id)
    return res
      .status(403)
      .json("User does not have permission for this action");

  try {
    const result = myDataSource
      .getRepository(CartItem)
      .update(cartItemId, { quantity: quantity });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const deleteCartItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { cartId } = req.body;
  const { cartItemId } = req.params;

  const cart = await myDataSource.getRepository(Cart).findOne({
    where: {
      id: cartId,
    },
  });

  try {
    const cartItem = await myDataSource.getRepository(CartItem).findOne({
      where: {
        id: cartItemId,
      },
    });

    await myDataSource.getRepository(CartItem).remove(cartItem);
    return res.json("Cart item deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getCartItems = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { cartId } = req.params;

  const cartItemRepository = myDataSource.getRepository(CartItem);

  try {
    const cartItems = await cartItemRepository.find({
      where: {
        cart: { id: cartId },
      },
    });

    return res.json(cartItems);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const incrementCartItemQuantity = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { cartId } = req.body;
  const { cartItemId } = req.params;

  const cart = await myDataSource.getRepository(Cart).findOne({
    where: {
      id: cartId,
    },
  });

  try {
    const cartItemRepository = myDataSource.getRepository(CartItem);
    const cartItem = await cartItemRepository.findOne({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem) {
      return res.status(404).json("Cart item not found");
    }

    const newQuantity = cartItem.quantity + 1;

    await cartItemRepository.update(cartItemId, { quantity: newQuantity });

    return res.json({
      message: "Cart item quantity incremented successfully",
      newQuantity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const decrementCartItemQuantity = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { cartId } = req.body;
  const { cartItemId } = req.params;

  const cart = await myDataSource.getRepository(Cart).findOne({
    where: {
      id: cartId,
    },
  });

  try {
    const cartItemRepository = myDataSource.getRepository(CartItem);
    const cartItem = await cartItemRepository.findOne({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem) {
      return res.status(404).json("Cart item not found");
    }

    let newQuantity = cartItem.quantity - 1;
    if (newQuantity < 0) {
      return res.status(400).json("Quantity cannot be less than zero");
    }

    await cartItemRepository.update(cartItemId, { quantity: newQuantity });

    return res.json({
      message: "Cart item quantity decremented successfully",
      newQuantity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
export const deleteCartItems = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { cartId } = req.body;

  try {
    const cartItems = await myDataSource.getRepository(CartItem).find({
      where: {
        cart: {
          id: cartId,
        },
      },
    });
    await Promise.all(
      cartItems.map(async (cartItem) => {
        await myDataSource.getRepository(CartItem).remove(cartItem);
      })
    );

    return res.json("Cart items deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItems,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  deleteCartItems,
};
