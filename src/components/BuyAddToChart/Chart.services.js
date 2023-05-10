// In service.js

const { Material, Review }  = require('../materialsAndReview/materilas.module');
const Cart = require('./Chart.module');
const userModel = require ("../users/user.modules");


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

  module.exports.checkout = async (req, res) => {
    try {
      // Find the user's cart
      const cart = await Cart.findOne({ user: req.params.userId }).populate('items.material');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      // Calculate the total cost of the order
      const totalCost = cart.items.reduce((total, item) => {
        return total + (item.material.price * item.quantity);
      }, 0);
      
      // Check that the user has enough funds to complete the order
      const user = await userModel.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.balance < totalCost) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }
      
      // Deduct the total cost from the user's balance
      user.balance -= totalCost;
      await user.save();
      
      // Decrease the stock of each material in the cart
      for (const item of cart.items) {
        const material = item.material;
        const updatedStock = material.stock - item.quantity;
        if (updatedStock < 0) {
          return res.status(400).json({ message: 'Not enough stock' });
        }
        material.stock = updatedStock;
        await material.save();
      }
      
      // Clear the user's cart
      cart.items = [];
      await cart.save();
      
      return res.json({ message: 'Order completed successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
