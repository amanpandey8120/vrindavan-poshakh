import React from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

export default function CategoriesScreen() {
  const { navigateTo, setSelectedCategory } = useNavigation();

  const categoryGroups = [
    {
      title: 'Poshakh & Attire',
      subtitle: 'Silk, Velvet, Zardozi & Daily Wear',
      screen: SCREENS.KRISHNA_COLLECTION,
      categoryFilter: 'Krishna Poshakh',
      items: [
        { name: 'Zardozi Heavy Poshakh', count: '42 Designs', icon: 'apparel' },
        { name: 'Silk Festival Sets', count: '38 Designs', icon: 'strikethrough_s' },
        { name: 'Velvet Winter Outfits', count: '24 Designs', icon: 'dry_cleaning' },
        { name: 'Summer Cotton Dress', count: '56 Designs', icon: 'checkroom' }
      ]
    },
    {
      title: 'Mukut & Headwear',
      subtitle: 'Peacock Feather Crowns & Pagdi',
      screen: SCREENS.JEWELLERY,
      categoryFilter: 'Mukut & Jewellery',
      items: [
        { name: 'Mor-Pankh Mukut', count: '31 Designs', icon: 'workspace_premium' },
        { name: 'Brass Gem Crowns', count: '19 Designs', icon: 'diamond' },
        { name: 'Traditional Vrindavan Pagdi', count: '27 Designs', icon: 'military_tech' },
        { name: 'Chandrika & Latkan', count: '15 Designs', icon: 'stars' }
      ]
    },
    {
      title: 'Deity Jewellery & Ornament',
      subtitle: 'Pearl Necklaces, Kundal & Anklets',
      screen: SCREENS.JEWELLERY,
      categoryFilter: 'Mukut & Jewellery',
      items: [
        { name: 'Pearl & Stone Haar', count: '45 Designs', icon: 'grade' },
        { name: 'Earrings / Kundal', count: '33 Designs', icon: 'auto_awesome' },
        { name: 'Silver Payal & Armlets', count: '22 Designs', icon: 'join_inner' },
        { name: 'Divine Bansuri Flutes', count: '29 Designs', icon: 'music_note' }
      ]
    },
    {
      title: 'Complete Shringar Bundles',
      subtitle: 'All-in-One Sacred Worship Sets',
      screen: SCREENS.SHRINGAR_BUNDLES,
      categoryFilter: 'Shringar Bundles',
      items: [
        { name: 'Janmashtami Special Box', count: '12 Bundles', icon: 'card_giftcard' },
        { name: 'Daily Shringar Essentials', count: '18 Bundles', icon: 'auto_fix_high' },
        { name: 'Festive Royal Hamper', count: '8 Bundles', icon: 'redeem' }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto">
      {/* Header Banner */}
      <div className="mb-10 text-center">
        <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest bg-[#fed65b]/30 px-3 py-1 rounded-full border border-[#735c00]/20">
          Sacred Marketplace
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#00151b] mt-3">
          Explore All Categories
        </h1>
        <p className="text-sm md:text-base text-[#41484b] mt-2 max-w-xl mx-auto">
          Filter by deity adornment type, craftsmanship, materials, and complete devotional offerings.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="flex flex-col gap-10">
        {categoryGroups.map((group, idx) => (
          <div key={idx} className="bg-[#ffffff] rounded-2xl p-6 md:p-8 shadow-sm border border-[#e4e2dd]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 border-b border-[#f0eee9] pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#00151b]">
                  {group.title}
                </h2>
                <p className="text-xs text-[#71787b]">{group.subtitle}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory(group.categoryFilter);
                  navigateTo(group.screen);
                }}
                className="text-xs font-bold text-[#735c00] uppercase tracking-wider flex items-center gap-1 hover:underline mt-2 sm:mt-0"
              >
                <span>View Collection</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  onClick={() => {
                    setSelectedCategory(group.categoryFilter);
                    navigateTo(group.screen);
                  }}
                  className="group p-4 rounded-xl bg-[#f5f3ee] hover:bg-[#fed65b]/20 border border-[#e4e2dd] hover:border-[#735c00]/40 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#ffffff] shadow-sm flex items-center justify-center text-[#735c00] group-hover:bg-[#fed65b] transition-colors">
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-semibold text-[#00151b] group-hover:text-[#735c00] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-[#71787b]">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
