import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import ProductCard from '../components/ProductCard';

export default function JewelleryScreen() {
  const { products } = useNavigation();

  // Filter Jewellery & Mukut products
  const jewelleryProducts = products.filter(
    (p) => p.category === 'Mukut & Jewellery' || p.id === 'p2' || p.id === 'p5'
  );

  return (
    <main className="min-h-screen bg-[#fbf9f4] pt-20 pb-28 md:pb-16">
      {/* Banner */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden flex items-center justify-center">
        <img
          src="https://lh3.googleusercontent.com/aida/AEtjO1USSgO_u9Y5UTOuCkzXRtYMyzXk3bcg2wWvBQ99cZGx7qhlWZegaGPd8_68BUfd0CsiIt2-G9N-PpEHGjd_mveiiB6vwxn_zhc7ZcN7B8kHJG8khDFdTg2kg-hQ_V5te9XZ9Et-Q_6Xb7FUotAVg3U18TuDf5Gto7Y6Nvvfn0i3vTN5UWATiRtwGxCyTmrGxz6ZCWC5PxKvVDh_VzY43-ts6hqsgFgwHp8fVblKbpa2VCGp-2Aunib0UdY"
          alt="Mukut and Jewellery Adornments"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#00151b]/70 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
          <span className="text-xs font-bold text-[#fed65b] uppercase tracking-[0.2em] mb-2">
            Royal Shringar Ornaments
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">
            Mukut & Jewellery - Adornments
          </h1>
          <p className="text-xs md:text-sm text-[#a7ccda] mt-2 max-w-lg">
            Peacock Mukut, Gem Crowns, Pearl Haar, Kundal, and Carved Flutes.
          </p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 md:px-16 py-10">
        {/* Jewellery Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['All Ornaments', 'Mor-Pankh Mukut', 'Pearl Haar & Necklaces', 'Bansuri & Accessories'].map(
            (tab, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  i === 0
                    ? 'bg-[#735c00] text-white'
                    : 'bg-white text-[#00151b] border border-[#c1c7cb] hover:bg-[#fed65b]/20'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jewelleryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
