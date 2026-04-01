export const sumCartItemMrpPrice = (cartItems = []) => {
  return cartItems.reduce((total, item) => total + (item.mrpPrice || 0), 0);
};

export const sumCartItemSellingPrice = (cartItems = []) => {
  return cartItems.reduce((total, item) => total + (item.sellingPrice || 0), 0);
};
