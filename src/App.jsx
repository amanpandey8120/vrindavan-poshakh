import React from 'react';
import { NavigationProvider, useNavigation, SCREENS } from './context/NavigationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavBar from './components/BottomNavBar';

// Customer Storefront Pages
import HomeScreen from './pages/HomeScreen';
import CategoriesScreen from './pages/CategoriesScreen';
import ShopScreen from './pages/ShopScreen';
import KrishnaCollectionScreen from './pages/KrishnaCollectionScreen';
import JewelleryScreen from './pages/JewelleryScreen';
import ShringarBundlesScreen from './pages/ShringarBundlesScreen';
import ProductDetailScreen from './pages/ProductDetailScreen';
import FitAssistantScreen from './pages/FitAssistantScreen';
import CartScreen from './pages/CartScreen';
import SearchResultsScreen from './pages/SearchResultsScreen';
import AccountScreen from './pages/AccountScreen';

// Admin Portal Pages (Imported from Stitch)
import AdminLoginScreen from './pages/admin/AdminLoginScreen';
import AdminAnalyticsScreen from './pages/admin/AdminAnalyticsScreen';
import AdminProductsScreen from './pages/admin/AdminProductsScreen';
import AdminAddProductScreen from './pages/admin/AdminAddProductScreen';
import AdminOrdersScreen from './pages/admin/AdminOrdersScreen';
import AdminOrderDetailsScreen from './pages/admin/AdminOrderDetailsScreen';
import AdminCustomersScreen from './pages/admin/AdminCustomersScreen';

// Admin screens check
const ADMIN_SCREENS = [
  SCREENS.ADMIN_LOGIN,
  SCREENS.ADMIN_ANALYTICS,
  SCREENS.ADMIN_PRODUCTS,
  SCREENS.ADMIN_ADD_PRODUCT,
  SCREENS.ADMIN_ORDERS,
  SCREENS.ADMIN_ORDER_DETAILS,
  SCREENS.ADMIN_CUSTOMERS,
];

// Customer screens with their own custom header
const SCREENS_WITH_OWN_HEADER = [SCREENS.CART, SCREENS.PRODUCT_DETAIL, ...ADMIN_SCREENS];
const SCREENS_WITHOUT_FOOTER = [SCREENS.CART, SCREENS.PRODUCT_DETAIL, SCREENS.FIT_ASSISTANT, ...ADMIN_SCREENS];
const SCREENS_WITHOUT_BOTTOM_NAV = [...ADMIN_SCREENS];

function MainAppContent() {
  const { activeScreen, navigateTo } = useNavigation();

  const isAdmin = ADMIN_SCREENS.includes(activeScreen);
  const showMainHeader = !SCREENS_WITH_OWN_HEADER.includes(activeScreen);
  const showFooter = !SCREENS_WITHOUT_FOOTER.includes(activeScreen);
  const showBottomNav = !SCREENS_WITHOUT_BOTTOM_NAV.includes(activeScreen);

  const renderScreen = () => {
    switch (activeScreen) {
      // Customer Storefront
      case SCREENS.HOME:
      case SCREENS.HOME_DESKTOP:
        return <HomeScreen />;
      case SCREENS.CATEGORIES:
        return <CategoriesScreen />;
      case SCREENS.SHOP:
      case SCREENS.SHOP_DESKTOP:
        return <ShopScreen />;
      case SCREENS.KRISHNA_COLLECTION:
        return <KrishnaCollectionScreen />;
      case SCREENS.JEWELLERY:
        return <JewelleryScreen />;
      case SCREENS.SHRINGAR_BUNDLES:
        return <ShringarBundlesScreen />;
      case SCREENS.PRODUCT_DETAIL:
        return <ProductDetailScreen />;
      case SCREENS.FIT_ASSISTANT:
        return <FitAssistantScreen />;
      case SCREENS.CART:
        return <CartScreen />;
      case SCREENS.SEARCH:
        return <SearchResultsScreen />;
      case SCREENS.ACCOUNT:
        return <AccountScreen />;

      // Admin Portal (Stitch imported)
      case SCREENS.ADMIN_LOGIN:
        return <AdminLoginScreen />;
      case SCREENS.ADMIN_ANALYTICS:
        return <AdminAnalyticsScreen />;
      case SCREENS.ADMIN_PRODUCTS:
        return <AdminProductsScreen />;
      case SCREENS.ADMIN_ADD_PRODUCT:
        return <AdminAddProductScreen />;
      case SCREENS.ADMIN_ORDERS:
        return <AdminOrdersScreen />;
      case SCREENS.ADMIN_ORDER_DETAILS:
        return <AdminOrderDetailsScreen />;
      case SCREENS.ADMIN_CUSTOMERS:
        return <AdminCustomersScreen />;

      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex flex-col font-sans text-[#1b1c19]">
      {/* Customer Store Header */}
      {showMainHeader && <Header />}

      {/* Cart custom header per Stitch design */}
      {activeScreen === SCREENS.CART && (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 h-16 bg-[#fbf9f4]/90 backdrop-blur-md border-b border-[#c1c7cb]/30">
          <button
            onClick={() => navigateTo(SCREENS.HOME)}
            className="text-[#00151b] hover:text-[#735c00] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-xl md:text-2xl font-serif font-bold uppercase tracking-widest text-[#00151b] text-center flex-1">
            Shopping Bag
          </h1>
          <div className="w-6" />
        </header>
      )}

      {/* Main Screen Content */}
      <div className="flex-1">{renderScreen()}</div>

      {/* Footer & Bottom Navigation */}
      {showFooter && <Footer />}
      {showBottomNav && <BottomNavBar />}
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <MainAppContent />
    </NavigationProvider>
  );
}
