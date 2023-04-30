// In service.js

const { Material, Review }  = require('../materialsAndReview/materilas.module');
const Cart = require('./Chart.module');

module.exports.addToCart = async (userId, materialId, quantity) => {
    const material = await Material.findOne({ _id: materialId });
    if (!material) {
      throw new Error('Material not found');
    }
    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      const cart = new Cart({
        user: userId,
        items: [{ material: material._id, quantity }],
      });
      return await cart.save();
    }
    const existingCartItem = userCart.items.find((item) => item.material.equals(material._id));
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await userCart.save();
      return userCart;
    } else {
      userCart.items.push({ material: material._id, quantity });
      await userCart.save();
      return userCart;
    }
  };
  

module.exports.BuyMaterila= async (req, res) => {
    const { userId, materialId, quantity } = req.body;
    try {
      const cart = await this.addToCart(userId, materialId, quantity);
      res.json({ message: 'Item added to cart', cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  module.exports.CanceldChart=async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      
      const existingCartItemIndex = cart.items.findIndex((item) => item._id.equals(id));
      if (existingCartItemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }
      
      cart.items.splice(existingCartItemIndex, 1);
      await cart.save();
      
      return res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
