import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext(null);

export const SCREENS = {
  HOME: 'home',
  HOME_DESKTOP: 'home-desktop',
  CATEGORIES: 'categories',
  SHOP: 'shop',
  SHOP_DESKTOP: 'shop-desktop',
  KRISHNA_COLLECTION: 'krishna-collection',
  JEWELLERY: 'jewellery',
  SHRINGAR_BUNDLES: 'shringar-bundles',
  PRODUCT_DETAIL: 'product-detail',
  FIT_ASSISTANT: 'fit-assistant',
  CART: 'cart',
  SEARCH: 'search'
};

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    title: 'Divine Zardozi Silk Poshakh - Midnight Krishna',
    category: 'Krishna Poshakh',
    price: 3499,
    originalPrice: 4290,
    rating: 4.9,
    reviewsCount: 48,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJhjdCw8ciLoxMtgvJ592S5dYPacuWLMeo6Q-IGLkQVGfUdh84426ZPksVvBmDrXyiWeFQYKr1xQEb-MRjOnTCoFxW3kzE1XPk0VkBNgLOSx7wAFBQKgY6IrAKhdszsYfZLYzQBzq5aAgfjVsEdzWANMElvNlNkeoPxuGzuHCpQXcs2WD_B4de8Fuu6j30aPAJI1wY_AO7wbtRbuzNzl6W2t1PfLNkh18GW7rUypH9LYFQdHCyjATmfw',
    tag: 'Bestseller',
    tagColor: 'gold',
    sizes: ['No. 0', 'No. 1', 'No. 2', 'No. 3', 'No. 4', 'No. 5', 'No. 6'],
    colors: ['Krishna Navy', 'Emerald Green', 'Royal Crimson'],
    description: 'Handcrafted with fine silk threads, 24k gold zardozi embroidery, and delicate Kundan border work. Specially tailored for Laddu Gopal & Krishna deities.'
  },
  {
    id: 'p2',
    title: 'Mor-Pankh Mukut & Chandrika Set',
    category: 'Mukut & Jewellery',
    price: 1850,
    originalPrice: 2200,
    rating: 4.8,
    reviewsCount: 32,
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1USSgO_u9Y5UTOuCkzXRtYMyzXk3bcg2wWvBQ99cZGx7qhlWZegaGPd8_68BUfd0CsiIt2-G9N-PpEHGjd_mveiiB6vwxn_zhc7ZcN7B8kHJG8khDFdTg2kg-hQ_V5te9XZ9Et-Q_6Xb7FUotAVg3U18TuDf5Gto7Y6Nvvfn0i3vTN5UWATiRtwGxCyTmrGxz6ZCWC5PxKvVDh_VzY43-ts6hqsgFgwHp8fVblKbpa2VCGp-2Aunib0UdY',
    tag: 'New Arrival',
    tagColor: 'pink',
    sizes: ['Small (No. 0-2)', 'Medium (No. 3-4)', 'Large (No. 5-6)'],
    colors: ['Gold & Peacock Green', 'Gold & Ruby Red'],
    description: 'Authentic peacock feather embedded crown set with real pearl beads and brass filigree accents.'
  },
  {
    id: 'p3',
    title: 'Complete Vrindavan Shringar Kit - 11 Pcs',
    category: 'Shringar Bundles',
    price: 5999,
    originalPrice: 7500,
    rating: 5.0,
    reviewsCount: 64,
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1URuKw5fosuS0K_1h608p0e9ie-YkwurlaQ81ABAb3ukhxC4I2liy9x1hxkEO-kdoKUrdMVHcF-NtPX6dQ9qWlpHWdFfbSDqcbCvYYxOzaZM8OpcVFBbYVrfEEPy0TWU7bfpS4pjId17FcfnGf-XIZu1A47ko77CdGH25jJHWLiuUkJRBgdt3hA7nKHx6jOcsZxrHML0PHIUe7tfLvh7X3WV8FlBLseFAK0UMA6hXfiX0TtER2AurYore_Z',
    tag: 'Complete Set',
    tagColor: 'gold',
    sizes: ['No. 2', 'No. 3', 'No. 4', 'No. 5'],
    colors: ['Full Shringar Set'],
    description: 'Includes Silk Poshakh, Peacock Mukut, Pearl Haar, Bansuri, Kundal, Payal, and Chandan Paste.'
  },
  {
    id: 'p4',
    title: 'Floral Velvet Autumn Poshakh - Lotus Pink',
    category: 'Krishna Poshakh',
    price: 2890,
    originalPrice: 3400,
    rating: 4.7,
    reviewsCount: 29,
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1WDRQL7kV4sefxeZs0c6H2eLQO-P0Ief684zKjgK-QAAz30F50V7hZZAnZVA5OXSEx2Fr0AXkcb8WOJA9uEJ2VUTjkctG6D_XjInVXxQrz0uPo-mI1EaGrtb7HQC7WI9IC-0s2koj0eRXWvYhqc58nYfXp8hY801lgb3E1ri9CwAnZTbyrEzmSaqu8CV2h1tDKA6wj-dHSs19_RQGERSMXX0kjlzgA87I5qDhZSMHSbc5FMW21VXoSNoyVt',
    tag: 'Seasonal',
    tagColor: 'pink',
    sizes: ['No. 1', 'No. 2', 'No. 3', 'No. 4'],
    colors: ['Lotus Pink', 'Temple Gold'],
    description: 'Soft velvet base with silver zari lotus motif embroidery and satin lining for utmost deity comfort.'
  },
  {
    id: 'p5',
    title: 'Carved Brass Bansuri with Pearl Tassel',
    category: 'Mukut & Jewellery',
    price: 890,
    originalPrice: 1100,
    rating: 4.9,
    reviewsCount: 51,
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UoTBK6kJlWjX_3xcpwXGN3P_hFi0kMCCT-lwy8WA5Qq9hSkyKojYs4MtgBhiYayOQh3ngS2XkgR4jwP1vxpCCY2KjU4uDAI7Plhu8GXye-Vnb3Wgy4IUVbQ3nQ_OK-dYtWq3KGe0vX175WaOwmgRL6RUJGbAjIO0usd4RwupBZdBca1d9VgqzEbYO-CdfZ5g1d-Dt0E8paNqtXddMx3MBqCGzwodFEafBIvxV1vor82Rd4QEB4o5LO5qk',
    tag: 'Essential',
    tagColor: 'gold',
    sizes: ['2 inch', '3 inch', '4 inch'],
    colors: ['Brass Gold'],
    description: 'Intricately etched divine flute adorned with natural pearls and miniature turquoise beads.'
  }
];

export const NavigationProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState(SCREENS.HOME);
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');


  const [cart, setCart] = useState([
    {
      product: INITIAL_PRODUCTS[0],
      selectedSize: 'No. 3',
      selectedColor: 'Krishna Navy',
      quantity: 1
    },
    {
      product: INITIAL_PRODUCTS[1],
      selectedSize: 'Medium (No. 3-4)',
      selectedColor: 'Gold & Peacock Green',
      quantity: 1
    }
  ]);

  const [wishlist, setWishlist] = useState(['p1', 'p3']);

  const navigateTo = (screen, extraData = null) => {
    if (extraData?.product) {
      setSelectedProduct(extraData.product);
    }
    if (extraData?.query) {
      setSearchQuery(extraData.query);
    }
    if (extraData?.category) {
      setSelectedCategory(extraData.category);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product, size = 'No. 3', color = 'Krishna Navy', qty = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
    });
  };

  const updateCartQty = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <NavigationContext.Provider
      value={{
        activeScreen,
        SCREENS,
        navigateTo,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSize,
        setSelectedSize,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQty,
        removeFromCart,
        wishlist,
        toggleWishlist,
        products: INITIAL_PRODUCTS
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
