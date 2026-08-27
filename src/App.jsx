import React, { useEffect } from 'react';
import { NavigationProvider, useNavigation, SCREENS } from './context/NavigationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Auth Pages
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import ResetPasswordScreen from './pages/ResetPasswordScreen';

// Admin Portal Pages
import AdminLoginScreen from './pages/admin/AdminLoginScreen';
import AdminAnalyticsScreen from './pages/admin/AdminAnalyticsScreen';
import AdminProductsScreen from './pages/admin/AdminProductsScreen';
import AdminAddProductScreen from './pages/admin/AdminAddProductScreen';
import AdminOrdersScreen from './pages/admin/AdminOrdersScreen';
import AdminOrderDetailsScreen from './pages/admin/AdminOrderDetailsScreen';
import AdminCustomersScreen from './pages/admin/AdminCustomersScreen';
import AdminUsersScreen from './pages/admin/AdminUsersScreen';

// Auth screens that don't require user session
const AUTH_SCREENS = [
  SCREENS.LOGIN,
  SCREENS.SIGNUP,
  SCREENS.FORGOT_PASSWORD,
  SCREENS.RESET_PASSWORD
];

// Admin screens
const ADMIN_SCREENS = [
  SCREENS.ADMIN_LOGIN,
  SCREENS.ADMIN_ANALYTICS,
  SCREENS.ADMIN_PRODUCTS,
  SCREENS.ADMIN_ADD_PRODUCT,
  SCREENS.ADMIN_ORDERS,
  SCREENS.ADMIN_ORDER_DETAILS,
  SCREENS.ADMIN_CUSTOMERS,
  SCREENS.ADMIN_USERS,
];

// Protected customer screens (require authenticated user session)
const PROTECTED_CUSTOMER_SCREENS = [SCREENS.ACCOUNT];

// Header / Footer layout visibility
const SCREENS_WITH_OWN_HEADER = [SCREENS.CART, SCREENS.PRODUCT_DETAIL, ...ADMIN_SCREENS, ...AUTH_SCREENS];
const SCREENS_WITHOUT_FOOTER = [SCREENS.CART, SCREENS.PRODUCT_DETAIL, SCREENS.FIT_ASSISTANT, ...ADMIN_SCREENS, ...AUTH_SCREENS];
const SCREENS_WITHOUT_BOTTOM_NAV = [...ADMIN_SCREENS, ...AUTH_SCREENS];

function SuspendedAccountScreen() {
  const { signOut } = useAuth();
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-16 bg-[#fbf9f4] relative overflow-hidden">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-lg border border-[#ef4444]/30 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#fee2e2] text-[#991b1b] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[36px]">block</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#00151b]">Account Suspended</h1>
        <p className="text-sm text-[#41484b] mt-3 leading-relaxed">
          Your account has been temporarily suspended by the administrator. Please contact our support team to resolve this issue.
        </p>
        <div className="mt-4 p-3 bg-[#fbf9f4] rounded-lg border border-[#c1c7cb]/40 text-xs text-[#41484b]">
          <p className="font-bold text-[#00151b]">Support Email:</p>
          <a href="mailto:avnimisra7602@gmail.com" className="text-[#735c00] underline font-semibold">
            avnimisra7602@gmail.com
          </a>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={async () => {
              await signOut();
              navigateTo(SCREENS.HOME);
            }}
            className="w-full py-3 bg-[#00151b] text-white rounded-full text-xs font-bold hover:bg-[#735c00] transition-colors"
          >
            Sign Out & Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

function MainAppContent() {
  const { activeScreen, navigateTo, setReturnScreen } = useNavigation();
  const { user, isAdmin, isSuspended, loading: authLoading } = useAuth();

  const isAdminScreen = ADMIN_SCREENS.includes(activeScreen);
  const isAuthScreen = AUTH_SCREENS.includes(activeScreen);
  const isProtectedCustomerScreen = PROTECTED_CUSTOMER_SCREENS.includes(activeScreen);

  const showMainHeader = !SCREENS_WITH_OWN_HEADER.includes(activeScreen);
  const showFooter = !SCREENS_WITHOUT_FOOTER.includes(activeScreen);
  const showBottomNav = !SCREENS_WITHOUT_BOTTOM_NAV.includes(activeScreen);

  // Check URL hash for password recovery on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      if (hash.includes('type=recovery') || hash.includes('reset-password')) {
        navigateTo(SCREENS.RESET_PASSWORD);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigateTo]);

  // Route protection and redirection
  useEffect(() => {
    if (authLoading) return;

    // Customer protected route: unauthenticated access -> redirect to Login with returnScreen
    if (isProtectedCustomerScreen && !user) {
      setReturnScreen(activeScreen);
      navigateTo(SCREENS.LOGIN);
      return;
    }

    // Admin protected routes: require role === 'admin'
    if (isAdminScreen && activeScreen !== SCREENS.ADMIN_LOGIN) {
      if (!user) {
        navigateTo(SCREENS.ADMIN_LOGIN);
        return;
      }
      if (!isAdmin) {
        navigateTo(SCREENS.HOME);
        return;
      }
    }

    // Auth screen redirection: if already logged in (and not reset-password), route to appropriate dashboard
    if (isAuthScreen && user && activeScreen !== SCREENS.RESET_PASSWORD) {
      if (activeScreen === SCREENS.ADMIN_LOGIN && isAdmin) {
        navigateTo(SCREENS.ADMIN_ANALYTICS);
      } else if (activeScreen !== SCREENS.ADMIN_LOGIN) {
        navigateTo(SCREENS.HOME);
      }
    }
  }, [
    authLoading,
    activeScreen,
    user,
    isAdmin,
    isProtectedCustomerScreen,
    isAdminScreen,
    isAuthScreen,
    navigateTo,
    setReturnScreen,
  ]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex flex-col text-[#1b1c19]">
        <div className="flex-1 flex items-center justify-center">
          <div className="material-symbols-outlined text-[48px] text-[#735c00] animate-spin">sync</div>
        </div>
      </div>
    );
  }

  // Display suspended screen if account is suspended
  if (user && isSuspended && isProtectedCustomerScreen) {
    return <SuspendedAccountScreen />;
  }

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

      // Auth Pages
      case SCREENS.LOGIN:
        return <LoginScreen />;
      case SCREENS.SIGNUP:
        return <SignupScreen />;
      case SCREENS.FORGOT_PASSWORD:
        return <ForgotPasswordScreen />;
      case SCREENS.RESET_PASSWORD:
        return <ResetPasswordScreen />;

      // Admin Portal
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
      case SCREENS.ADMIN_USERS:
        return <AdminUsersScreen />;

      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex flex-col text-[#1b1c19]">
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
    <AuthProvider>
      <NavigationProvider>
        <MainAppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}