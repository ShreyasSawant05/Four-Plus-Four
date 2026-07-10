export interface Outfit {
  id: number;
  name: string;
  price: string;
  description: string;
  modelImage: string;
  cardImage: string;
  garmentImage: string;
  accentColor: string;
  accentGlow: string;
}

export const outfits: Outfit[] = [
  {
    id: 1,
    name: 'Shadow Drape Hoodie',
    price: '₹2,999',
    description:
      'An oversized silhouette in matte black, engineered with techwear-grade fabric. Hidden utility pockets and adjustable drawcords deliver function without compromising the clean, minimal aesthetic.',
    modelImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
    garmentImage: '/outfits/garments/garment-1.png',
    accentColor: '#6b6b6b',
    accentGlow: 'rgba(107, 107, 107, 0.3)',
  },
  {
    id: 2,
    name: 'Ivory Cargo Set',
    price: '₹3,499',
    description:
      'Cream-on-cream sophistication. A cropped structured jacket pairs with relaxed cargo trousers — both in heavyweight cotton with a soft brushed finish. Tonal hardware keeps the palette unbroken.',
    modelImage: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop&q=80',
    garmentImage: '/outfits/garments/garment-2.png',
    accentColor: '#d4c5a0',
    accentGlow: 'rgba(212, 197, 160, 0.3)',
  },
  {
    id: 3,
    name: 'Neon Pulse Tracksuit',
    price: '₹2,799',
    description:
      'Electric gradient that shifts from deep ocean blue to violet under light. Performance mesh panels and raglan sleeves make this as functional as it is loud. Reflective piping for night visibility.',
    modelImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    garmentImage: '/outfits/garments/garment-3.png',
    accentColor: '#7c5ce7',
    accentGlow: 'rgba(124, 92, 231, 0.3)',
  },
  {
    id: 4,
    name: 'Stone Wash Denim Duo',
    price: '₹2,899',
    description:
      'Vintage-processed Japanese selvedge denim, washed to a lived-in softness. The oversized trucker jacket and straight-leg jean deliver classic Americana through a modern, relaxed lens.',
    modelImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
    garmentImage: '/outfits/garments/garment-4.png',
    accentColor: '#8fa4b8',
    accentGlow: 'rgba(143, 164, 184, 0.3)',
  },
  {
    id: 5,
    name: 'Midnight Silk Bomber',
    price: '₹4,599',
    description:
      'Liquid silk charmeuse with hand-applied gold thread embroidery. Ribbed cuffs, hem, and collar ground the luxury in streetwear DNA. Fully lined with a custom jacquard interior.',
    modelImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
    garmentImage: '/outfits/garments/garment-5.png',
    accentColor: '#c9a96e',
    accentGlow: 'rgba(201, 169, 110, 0.3)',
  },
];
