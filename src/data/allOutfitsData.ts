import { OUTFIT_IMAGES } from './outfitImages';

export interface OutfitItem {
  id: string;
  title: string;
  gender: 'men' | 'women';
  category: string;
  folderName: string;
  image: string;
  price: string;
  description: string;
  tags: string[];
}

const CATEGORY_NAMES: Record<string, { category: string; gender: 'men' | 'women' }> = {
  "Boho Men": { category: "Boho", gender: "men" },
  "Boho Women": { category: "Boho", gender: "women" },
  "Clean Girl": { category: "Clean Girl", gender: "women" },
  "Coquette": { category: "Coquette", gender: "women" },
  "Cottage Core Men": { category: "Cottage Core", gender: "men" },
  "Cottage Core Women": { category: "Cottage Core", gender: "women" },
  "Dark Academia Men": { category: "Dark Academia", gender: "men" },
  "Dark Academia Women": { category: "Dark Academia", gender: "women" },
  "Old Money Men": { category: "Old Money", gender: "men" },
  "Old Money Women": { category: "Old Money", gender: "women" },
  "Streetwear Men": { category: "Streetwear", gender: "men" },
  "Streetwear Women": { category: "Streetwear", gender: "women" },
  "Y2K Men": { category: "Y2K", gender: "men" },
  "Y2K Women": { category: "Y2K", gender: "women" }
};

const PRICE_TIERS = [
  "₹2,499", "₹2,899", "₹3,299", "₹3,799", "₹4,199", 
  "₹4,599", "₹4,999", "₹5,299", "₹5,699", "₹5,999"
];

const DESCRIPTIONS: Record<string, string[]> = {
  "Boho": [
    "Earthy tones with relaxed linen silhouettes and textured layering.",
    "Free-spirited aesthetic featuring organic fabrics and subtle fringe details.",
    "Artisanal summer ensemble with breathable cotton and relaxed fitting.",
    "Bohemian charm with handcrafted feel and neutral botanical undertones."
  ],
  "Clean Girl": [
    "Sleek minimalist tailoring with glowing neutral tones and refined lines.",
    "Effortless capsule wardrobing featuring understated monochrome chic.",
    "Polished everyday sophistication with clean cuts and luxury basic finishes.",
    "Timeless modern minimalist aesthetic for an effortless high-end look."
  ],
  "Coquette": [
    "Delicate hyper-feminine look with romantic lace accents and soft pastel palettes.",
    "Playful vintage elegance with dainty bow accents and graceful silhouettes.",
    "Dreamy romantic outfit styled with soft textures and sweet vintage accents.",
    "Charming coquette aesthetic featuring soft ruffles and delicate embroidery."
  ],
  "Cottage Core": [
    "Rustic countryside charm crafted with floral cottons and natural linen textures.",
    "Vintage pastoral ensemble featuring warm muted tones and soft romantic cuts.",
    "Nostalgic nature-inspired look with breezy layers and cozy organic fabrics.",
    "Whimsical rustic attire perfect for outdoor tranquility and relaxed elegance."
  ],
  "Dark Academia": [
    "Scholarly vintage tailormade outfit with heavy wools, tweed, and deep espresso tones.",
    "Intellectual gothic sophistication styled with classic houndstooth and pleated trousers.",
    "Oxford-inspired autumnal layers featuring rich leather accents and structured coats.",
    "Moody literary aesthetic with deep mahogany tones and tailored vintage silhouette."
  ],
  "Old Money": [
    "Quiet luxury aesthetic with refined cashmere, polo collar, and immaculate tailoring.",
    "Hampton yacht club vibes styled with crisp whites, beige knitwear, and classic loafers.",
    "Heritage equestrian tailoring emphasizing understated high-end materials.",
    "Preppy aristocratic elegance with neutral palette and tailored blazer silhouette."
  ],
  "Streetwear": [
    "Bold urban statement fit with oversized silhouette and contemporary edge.",
    "High-street trendsetter ensemble featuring heavy jersey cotton and utility details.",
    "Avant-garde casualwear blending graphic accents with relaxed oversized drops.",
    "Edgy city aesthetic with utilitarian pockets and modern silhouette dynamics."
  ],
  "Y2K": [
    "Millennial nostalgia fit with metallic accents, low-rise cuts, and cyber flair.",
    "Retro futuristic ensemble featuring bold contrast stitching and vibrant textures.",
    "Early 2000s streetwear revival with denim layering and pop-culture energy.",
    "Playful Y2K aesthetic with metallic hardware and eye-catching trend accents."
  ]
};

function generateAllOutfits(): OutfitItem[] {
  const items: OutfitItem[] = [];

  Object.entries(OUTFIT_IMAGES).forEach(([folderName, images]) => {
    const meta = CATEGORY_NAMES[folderName];
    if (!meta) return;

    images.forEach((imgUrl, idx) => {
      const id = `${folderName.toLowerCase().replace(/\s+/g, '-')}-${idx + 1}`;
      const descList = DESCRIPTIONS[meta.category] || DESCRIPTIONS["Clean Girl"];
      const desc = descList[idx % descList.length];
      const price = PRICE_TIERS[(idx + folderName.length) % PRICE_TIERS.length];
      
      const title = `${meta.category} ${meta.gender === 'men' ? "Men's" : "Women's"} Look ${idx + 1}`;
      
      items.push({
        id,
        title,
        gender: meta.gender,
        category: meta.category,
        folderName,
        image: imgUrl,
        price,
        description: desc,
        tags: [meta.category, meta.gender, "Trending", "Featured"]
      });
    });
  });

  return items;
}

export const ALL_OUTFITS: OutfitItem[] = generateAllOutfits();

// Fisher-Yates shuffle function for randomizing array
export function shuffleOutfits(array: OutfitItem[]): OutfitItem[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
