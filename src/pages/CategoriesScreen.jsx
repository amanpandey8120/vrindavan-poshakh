import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import { supabase } from '../lib/supabase';

const GROUP_DEFS = [
  {
    key: 'poshakh',
    title: 'Poshakh & Attire',
    subtitle: 'Silk, Velvet, Zardozi & Daily Wear',
    screen: SCREENS.KRISHNA_COLLECTION,
    match: ['poshakh', 'poshak', 'silk', 'attire', 'outfit', 'dress', 'vestiment'],
    icons: ['apparel', 'strikethrough_s', 'dry_cleaning', 'checkroom']
  },
  {
    key: 'mukut',
    title: 'Mukut & Headwear',
    subtitle: 'Peacock Feather Crowns & Pagdi',
    screen: SCREENS.JEWELLERY,
    match: ['mukut', 'crown', 'pagdi', 'headwear', 'turban'],
    icons: ['workspace_premium', 'diamond', 'military_tech', 'stars']
  },
  {
    key: 'jewellery',
    title: 'Deity Jewellery & Ornament',
    subtitle: 'Pearl Necklaces, Kundal & Anklets',
    screen: SCREENS.JEWELLERY,
    match: ['jewellery', 'jewel', 'ornament', 'necklace', 'kundal', 'anklet', 'haar', 'payal', 'bansuri', 'flute', 'bangles'],
    icons: ['grade', 'auto_awesome', 'join_inner', 'music_note']
  },
  {
    key: 'shringar',
    title: 'Complete Shringar Bundles',
    subtitle: 'All-in-One Sacred Worship Sets',
    screen: SCREENS.SHRINGAR_BUNDLES,
    match: ['shringar', 'bundle', 'special box', 'hamper'],
    icons: ['card_giftcard', 'auto_fix_high', 'redeem']
  }
];

const FALLBACK_ICONS = ['apparel', 'diamond', 'card_giftcard', 'stars'];

export default function CategoriesScreen() {
  const { navigateTo, setSelectedCategory } = useNavigation();
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch categories and product counts from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (catError) throw catError;
        setCategories(catData || []);

        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('category_id')
          .eq('is_published', true);

        if (prodError) throw prodError;

        const countMap = {};
        (prodData || []).forEach((p) => {
          if (!p.category_id) return;
          countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
        });
        setCounts(countMap);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Assign each category to a themed group based on its name
  const grouped = React.useMemo(() => {
    const result = GROUP_DEFS.map((g) => ({ ...g, items: [] }));
    const unmatched = [];

    categories.forEach((cat) => {
      const name = cat.name.toLowerCase();
      const group = GROUP_DEFS.find((g) => g.match.some((kw) => name.includes(kw)));
      if (group) {
        result.find((r) => r.key === group.key).items.push(cat);
      } else {
        unmatched.push(cat);
      }
    });

    const allGroups = result.filter((g) => g.items.length > 0);
    if (unmatched.length > 0) {
      allGroups.push({
        key: 'others',
        title: 'More Collections',
        subtitle: 'Additional categories & offerings',
        screen: SCREENS.SHOP,
        match: [],
        items: unmatched,
        icons: FALLBACK_ICONS
      });
    }
    return allGroups;
  }, [categories]);

  const getIcon = (group, idx) => {
    const pool = group.icons && group.icons.length ? group.icons : FALLBACK_ICONS;
    return pool[idx % pool.length];
  };

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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="material-symbols-outlined text-[40px] text-[#735c00] animate-spin">sync</div>
            <p className="mt-4 text-xs text-[#41484b]">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#e4e2dd]">
            <span className="material-symbols-outlined text-[40px] text-[#735c00] mb-3 block">category</span>
            <p className="text-sm text-[#41484b]">No categories available yet.</p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.key} className="bg-[#ffffff] rounded-2xl p-6 md:p-8 shadow-sm border border-[#e4e2dd]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 border-b border-[#f0eee9] pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-[#00151b]">
                    {group.title}
                  </h2>
                  <p className="text-xs text-[#71787b]">{group.subtitle}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    navigateTo(group.screen);
                  }}
                  className="text-xs font-bold text-[#735c00] uppercase tracking-wider flex items-center gap-1 hover:underline mt-2 sm:mt-0"
                >
                  <span>View Collection</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.items.map((item, itemIdx) => {
                  const count = counts[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedCategory(item.name);
                        navigateTo(group.screen);
                      }}
                      className="group p-4 rounded-xl bg-[#f5f3ee] hover:bg-[#fed65b]/20 border border-[#e4e2dd] hover:border-[#735c00]/40 transition-all cursor-pointer flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#ffffff] shadow-sm flex items-center justify-center text-[#735c00] group-hover:bg-[#fed65b] transition-colors">
                        <span className="material-symbols-outlined text-[24px]">{getIcon(group, itemIdx)}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-serif font-semibold text-[#00151b] group-hover:text-[#735c00] transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-[11px] text-[#71787b]">
                          {count === 0 ? 'No available items yet' : `${count} ${count === 1 ? 'item' : 'items'}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}