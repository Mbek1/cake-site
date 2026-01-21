import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your backend URL

export const submitOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    // First try to get products from localStorage (admin-managed)
    const storedProducts = localStorage.getItem('bakery-products');
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
    
    // Fallback to API if available
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data if API is not available
    return getMockProducts();
  }
};

// Cake types for the bakery
export const getMockProducts = () => {
  return [
    { id: 1, name: 'Classic Vanilla Cake', price: 35.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', description: 'Fluffy vanilla sponge cake - a timeless favorite' },
    { id: 2, name: 'Rich Chocolate Cake', price: 40.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=chocolate', description: 'Decadent chocolate cake perfect for chocolate lovers' },
    { id: 3, name: 'Strawberry Shortcake', price: 38.00, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f1f8dbb?w=400&h=400&fit=crop', description: 'Light sponge with fresh strawberries and cream' },
    { id: 4, name: 'Red Velvet Cake', price: 42.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&color=red', description: 'Elegant red velvet with cream cheese frosting' },
    { id: 5, name: 'Carrot Cake', price: 36.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&color=orange', description: 'Moist carrot cake with cream cheese icing' },
    { id: 6, name: 'Lemon Drizzle Cake', price: 37.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&color=yellow', description: 'Zesty lemon cake with tangy glaze' },
    { id: 7, name: 'Cheesecake', price: 45.00, image: 'https://images.unsplash.com/photo-1535628066927-ab7c9ab60908?w=400&h=400&fit=crop', description: 'Creamy New York style cheesecake' },
    { id: 8, name: 'Black Forest Cake', price: 48.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&color=dark', description: 'Chocolate cake with cherries and cream layers' },
  ];
};

// Customization options
export const getCakeSizes = () => {
  return [
    { id: 1, size: '6 inch', servings: '6-8', basePrice: 0 },
    { id: 2, size: '8 inch', servings: '10-12', basePrice: 10 },
    { id: 3, size: '10 inch', servings: '15-20', basePrice: 20 },
    { id: 4, size: '12 inch', servings: '25-30', basePrice: 35 },
  ];
};

export const getCakeFlavors = () => {
  return [
    'Vanilla',
    'Chocolate',
    'Strawberry',
    'Carrot',
    'Red Velvet',
    'Lemon',
    'Cheesecake',
    'Coffee',
    'Almond',
    'Coconut'
  ];
};

export const getCakeColors = () => {
  return [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Pink', hex: '#FFB6C1' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Chocolate Brown', hex: '#3E2723' },
    { name: 'Purple', hex: '#9370DB' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Green', hex: '#228B22' },
    { name: 'Yellow', hex: '#FFD700' },
    { name: 'Black', hex: '#000000' },
  ];
};
