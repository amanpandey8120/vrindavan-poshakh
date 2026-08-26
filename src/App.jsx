import React from 'react';
import { NavigationProvider, useNavigation, SCREENS } from './context/NavigationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNavBar from './components/BottomNavBar';

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

// Screens that have their own back-button header (match Stitch design)
const SCREENS_WITH_OWN_HEADER = [SCREENS.CART, SCREENS.PRODUCT_DETAIL];
const SCREENS_WITHOUT_FOOTER = [SCREENS.CART, SCREENS.PRODUCT_DETAIL, SCREENS.FIT_ASSISTANT];

function MainAppContent() {
  const { activeScreen, navigateTo } = useNavigation();

  const showMainHeader = !SCREENS_WITH_OWN_HEADER.includes(activeScreen);
  const showFooter = !SCREENS_WITHOUT_FOOTER.includes(activeScreen);

  const renderScreen = () => {
    switch (activeScreen) {
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
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex flex-col font-sans text-[#1b1c19]">
      {/* Cart screen uses its own "Shopping Bag" header; ProductDetail uses back-button header */}
      {showMainHeader && <Header />}

      {/* Cart screen needs pt-16 for its own header, screens with main Header handle their own pt */}
      {activeScreen === SCREENS.CART && (
        // Cart header — matches Stitch: arrow_back + "Shopping Bag" centered
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
          <div className="w-6" /> {/* Spacer for centering */}
        </header>
      )}

      <div className="flex-1">{renderScreen()}</div>

      {showFooter && <Footer />}
      <BottomNavBar />
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
