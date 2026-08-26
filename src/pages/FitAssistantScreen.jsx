import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

// Size options matching Stitch's Find Your Fit screen exactly
const SIZE_OPTIONS = [
  {
    label: '0–2 inch',
    sublabel: 'Bal Gopal',
    circleSize: 'w-24 h-24',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALzlxXoVjUAKuMkwTfa7zkXSQomyCwT6puZ6ZpSEGEhErilBmZC0wEkCxbA9Ga_MID90993WPkUVWSqPJfhfh_zs9qwDpPQerr57357wUSHPVKCakCEMgw7fAdtyKowjVeJ0yXSXStft7OvpvONcp6XkcXBfkzU6TlUsq1KtR0mWFoI0SUPQG5HRe8DeslafcH-8FPWDFbNm1QaEywBBrLzRrKU7oeCoA9LhPr4E9wrkBguCpbJuZUNg',
  },
  {
    label: '3–4 inch',
    sublabel: 'Ladoo Gopal',
    circleSize: 'w-28 h-28',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfI4hlrWAsyUxA9X51rHndx7-wN9dNFux6DCk8KLQgBRMznGW3sLVE1h0NzWYE39uhHRAOuNj9Y4ZzMWGu-vi9TTSVzFees7c-CPky0M-jekqmYEQCGJa_X49lNalwKj2wOtb0IuZD9FijpphiT_Ju-D3mcfH2YNl_39laW_MnRz7RLmaoDB-YRc6U6vZMntZA4XCazPXp20sWenB8Nf3_x9M0UFObGzOKaRlsOsFZwtHK0alNY-_0JA',
  },
  {
    label: '5–6 inch',
    sublabel: 'Standard Size',
    circleSize: 'w-32 h-32',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgvRUZZAVv5PxCSDnXdhf6MXurRl0_cErCvB029IdtCt-1g_OLSrF-gakN92A_sFYzJOvmFX6RJ4be8OnCdmx0vKNGpN4tMggnPEIi2h-5WupWlPM-fYooOh6dh8_7drw8D7o4wEMhY0IwXrBiM0MYRFp057UMmRxP0Z8Er9r716pSz6vqrSeok__CPexq20ObU0UxdvOT2fSf4_eyvzjIqY-j1Lo-fqoH2QRGo90ka3Hsv53LqNXNqg',
    defaultSelected: true,
  },
  {
    label: '7–8 inch',
    sublabel: 'Thakurji',
    circleSize: 'w-36 h-36',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF2b3hR3ES-fQ8uAR_yBabdgp6dPw8ZC-qWU_TdFANwZiyoxRxCneHHCT0Ms0O9eH13gHjA50E99SoFQ8j-_vRqsXtRZem5mHE7TV2j_RefWZksOQ1dvl2idgQyrbcVLaQQ9Y2GCU0S938XpiDvO85pPhOqhpC22s41kLMMqcPSlV1pSdlkqX5oPEb_E00F0Sn3Lmtew0fdAbyVIOq5sUFBjrywILIX-yrCpfUtxrd0rGlzh3C6exy-SNyFXQp3T9Ek0bAXzPRQdW-ScNer',
  },
  {
    label: '9–10 inch',
    sublabel: 'Darbar Size',
    circleSize: 'w-40 h-40',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-ZSaRFqeoADWGI_-GsmoxAxVNMacjjJSr7hs21tphgQxExtZWE3fBDcH8_UAON9GA0ZLslHRxTwrvMVhyJZBG2UJQ7u1P0ehOkFGAlvqv6RThRfRG-ajD2uTgX4mF94fHpkNRY1pPamMewroJy3Hod_K5N5IFYh8LWqaHMmKW5d4DvLYB13udamyYASNzGzYQ2QhEkR4wFfETYjYyCl7mPLFPnmm3Sqf4cKrxmWLi88ibkcs486-KA',
  },
  {
    label: 'Custom Size',
    sublabel: 'Enter Measurements',
    circleSize: 'w-24 h-24',
    isCustom: true,
  },
];

export default function FitAssistantScreen() {
  const { navigateTo, setSelectedSize } = useNavigation();
  const [selectedIdx, setSelectedIdx] = useState(2); // 5-6 inch default (selected in Stitch)

  const handleContinue = () => {
    const selectedLabel = SIZE_OPTIONS[selectedIdx].label;
    setSelectedSize(selectedLabel);
    navigateTo(SCREENS.SHOP);
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4] flex flex-col items-center pt-24 pb-32 px-4 md:px-16 w-full relative">
      {/* Ambient Watermark */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] pointer-events-none z-0 opacity-30">
        <span className="material-symbols-outlined text-[400px] text-[#735c00]/5">spa</span>
      </div>

      {/* Progress Indicator — Step 1 of 3 */}
      <div className="w-full max-w-2xl mb-12 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">Step 1: Size</span>
          <span className="text-xs font-bold text-[#41484b] uppercase tracking-widest">Step 2: Style</span>
          <span className="text-xs font-bold text-[#41484b] uppercase tracking-widest">Step 3: Occasion</span>
        </div>
        <div className="w-full h-1 bg-[#e4e2dd] rounded-full overflow-hidden">
          <div className="h-full bg-[#735c00] w-1/3 rounded-full"></div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 max-w-3xl relative z-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#00151b] mb-4">
          What is your Krishna's size?
        </h1>
        <p className="text-base text-[#41484b] leading-relaxed">
          Select the physical size of your deity to help us curate the perfectly fitting divine garments. Measure from base to crown.
        </p>
      </div>

      {/* Size Selection Grid — 2 cols mobile, 3 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl relative z-10">
        {SIZE_OPTIONS.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-[#735c00] ${
                isSelected
                  ? 'border-[#735c00] bg-[#f5f3ee] shadow-[0_8px_30px_rgba(115,92,0,0.15)] -translate-y-1'
                  : 'border-[#c1c7cb] hover:border-[#735c00] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(115,92,0,0.1)]'
              }`}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#735c00] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
              )}

              {/* Deity image circle */}
              <div
                className={`${opt.circleSize} rounded-full overflow-hidden bg-[#f5f3ee] flex items-center justify-center border ${
                  isSelected ? 'border-[#735c00]/50' : 'border-[#c1c7cb]/50 hover:border-[#735c00]/50'
                } ${opt.isCustom ? 'border-dashed' : ''}`}
              >
                {opt.isCustom ? (
                  <span className="material-symbols-outlined text-[48px] text-[#41484b] group-hover:text-[#735c00]" style={{ fontVariationSettings: "'FILL' 0" }}>straighten</span>
                ) : (
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className={`w-full h-full object-cover transition-opacity ${isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                  />
                )}
              </div>

              <span className={`text-base font-semibold transition-colors ${isSelected ? 'text-[#735c00]' : 'text-[#00151b] hover:text-[#735c00]'}`}>
                {opt.label}
              </span>
              <span className="text-xs font-bold text-[#41484b] uppercase tracking-widest">{opt.sublabel}</span>
            </button>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="mt-16 w-full max-w-4xl flex justify-between items-center border-t border-[#c1c7cb]/30 pt-8 relative z-10">
        <button
          onClick={() => navigateTo(SCREENS.HOME)}
          className="text-xs font-bold text-[#41484b] hover:text-[#00151b] uppercase tracking-widest flex items-center gap-2 px-4 py-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          BACK
        </button>
        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-[#e9c349] to-[#735c00] text-[#00151b] px-8 py-3 rounded-full text-base font-bold flex items-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-[0_4px_12px_rgba(115,92,0,0.2)]"
        >
          Continue to Style
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
        </button>
      </div>
    </main>
  );
}
