import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const NavigationContext = createContext(null);

export const SCREENS = {
  // Customer Storefront Screens
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
  SEARCH: 'search',
  ACCOUNT: 'account',

  // Auth Screens
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',

  // Admin Portal Screens (Imported from Stitch)
  ADMIN_LOGIN: 'admin-login',
  ADMIN_ANALYTICS: 'admin-analytics',
  ADMIN_PRODUCTS: 'admin-products',
  ADMIN_ADD_PRODUCT: 'admin-add-product',
  ADMIN_ORDERS: 'admin-orders',
  ADMIN_ORDER_DETAILS: 'admin-order-details',
  ADMIN_CUSTOMERS: 'admin-customers',
  ADMIN_USERS: 'admin-users',
};

export const NavigationProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('reset-password')) {
      return SCREENS.RESET_PASSWORD;
    }
    return SCREENS.HOME;
  });
  const [returnScreen, setReturnScreen] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories (name), product_images (url)')
          .eq('is_published', true);

        if (error) throw error;
        const normalized = (data || []).map((p) => ({
          ...p,
          category: p.categories?.name || '',
          image: p.product_images?.[0]?.url || p.image || null
        }));
        setProducts(normalized);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from Supabase on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');

        if (error) throw error;
        setCategories(data || []);
        if (data && data.length > 0) {
          setSelectedCategory(data[0].name);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Sync user from auth context
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    })();
  }, []);

  // Fetch cart items for the current user from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchCartItems = async () => {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('id, quantity, created_at, products (id, title, price, colors, product_images (url))')
          .eq('user_id', user.id);

        if (error) throw error;
        setCart((data || []).map((item) => ({
          id: item.id,
          product: {
            id: item.products?.id,
            title: item.products?.title || '',
            price: item.products?.price || 0,
            colors: item.products?.colors || [],
            image: item.products?.product_images?.[0]?.url || null
          },
          selectedSize: 'All',
          selectedColor: item.products?.colors?.[0] || 'Default',
          quantity: item.quantity
        })));
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setCart([]);
      }
    };

    fetchCartItems();
  }, [user]);

  // Fetch wishlist items for the current user from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchWishlistItems = async () => {
      try {
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setWishlist(data.map((item) => item.product_id) || []);
      } catch (err) {
        console.error('Error fetching wishlist items:', err);
        setWishlist([]);
      }
    };

    fetchWishlistItems();
  }, [user]);

  const navigateTo = (screen, extraData = null) => {
    if (extraData?.product) {
      setSelectedProduct(extraData.product);
    }
    if (extraData?.orderId) {
      setSelectedOrderId(extraData.orderId);
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

  const addToCart = async (product, size = 'All', qty = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: product.colors?.[0] || 'Default', quantity: qty }];
    });

    // Also save to Supabase cart_items
    if (user) {
      try {
        const { error } = await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: product.id,
          quantity: qty,
        });

        if (error) console.error('Error saving to cart:', error);
      } catch (err) {
        console.error('Error saving to cart:', err);
      }
    }
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

  const toggleWishlist = async (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    // Also sync to Supabase wishlist_items
    if (user) {
      try {
        const alreadyInWishlist = wishlist.includes(productId);

        if (alreadyInWishlist) {
          const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

          if (error) console.error('Error removing from wishlist:', error);
        } else {
          const { error } = await supabase.from('wishlist_items').insert({
            user_id: user.id,
            product_id: productId,
          });

          if (error) console.error('Error adding to wishlist:', error);
        }
      } catch (err) {
        console.error('Error syncing wishlist:', err);
      }
    }
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session) {
        const fetchCartItems = async () => {
          try {
            const { data, error } = await supabase
              .from('cart_items')
              .select('id, quantity, created_at, products (id, title, price, colors, product_images (url))')
              .eq('user_id', session.user.id);

            if (error) throw error;
            setCart((data || []).map((item) => ({
              id: item.id,
              product: {
                id: item.products?.id,
                title: item.products?.title || '',
                price: item.products?.price || 0,
                colors: item.products?.colors || [],
                image: item.products?.product_images?.[0]?.url || null
              },
              selectedSize: 'All',
              selectedColor: item.products?.colors?.[0] || 'Default',
              quantity: item.quantity
            })));
          } catch (err) {
            console.error('Error fetching cart after auth change:', err);
            setCart([]);
          }
        };

        const fetchWishlistItems = async () => {
          try {
            const { data, error } = await supabase
              .from('wishlist_items')
              .select('*')
              .eq('user_id', session.user.id);

            if (error) throw error;
            setWishlist(data.map((item) => item.product_id) || []);
          } catch (err) {
            console.error('Error fetching wishlist after auth change:', err);
            setWishlist([]);
          }
        };

        await fetchCartItems();
        await fetchWishlistItems();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <NavigationContext.Provider
      value={{
        activeScreen,
        SCREENS,
        navigateTo,
        returnScreen,
        setReturnScreen,
        selectedProduct,
        setSelectedProduct,
        selectedOrderId,
        setSelectedOrderId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSize,
        setSelectedSize,
        products,
        setProducts,
        categories,
        setCategories,
        productLoading,
        categoryLoading,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQty,
        removeFromCart,
        wishlist,
        toggleWishlist,
        user,
        userSet: setUser !== undefined
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
