import chilliPowder from "@/assets/products/chilli-powder.jpg";
import turmericPowder from "@/assets/products/turmeric-powder.jpg";
import corianderPowder from "@/assets/products/coriander-powder.jpg";
import garamMasala from "@/assets/products/garam-masala.jpg";
import cuminPowder from "@/assets/products/cumin-powder.jpg";
import kashmiriChilli from "@/assets/products/kashmiri-chilli.jpg";
import corianderCumin from "@/assets/products/coriander-cumin.jpg";
import blackPepper from "@/assets/products/black-pepper.jpg";

export interface ProductVariant {
  weight: string;
  price: number;
  originalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  longDescription: string;
  highlights: string[];
  isOffer?: boolean;
  badge?: string;
  variants: ProductVariant[];
}

const kgVariant = (price: number): ProductVariant[] => [
  { weight: "1KG", price, originalPrice: Math.round(price * 1.12) },
];

export const products: Product[] = [
  {
    id: "medium-tikhu-marchu",
    name: "Medium Tikhu Marchu",
    image: chilliPowder,
    category: "Basic Spices",
    description: "Balanced chilli powder from Vishal Masala rate card.",
    longDescription: "Daily-use chilli powder with bright color and medium pungency.",
    highlights: ["1 kg pack", "Gujarati market rate", "Trusted local blend"],
    isOffer: true,
    variants: kgVariant(280),
  },
  {
    id: "double-tikhu-marchu",
    name: "Double Tikhu Marchu",
    image: chilliPowder,
    category: "Basic Spices",
    description: "Stronger red chilli profile for spicier cooking.",
    longDescription: "A hotter variation of Tikhu Marchu for bold flavor.",
    highlights: ["1 kg pack", "Higher pungency", "Best for spicy gravies"],
    variants: kgVariant(280),
  },
  {
    id: "double-resham-patti-marchu",
    name: "Double Resham Patti Marchu",
    image: kashmiriChilli,
    category: "Basic Spices",
    description: "Premium resham patti blend from the provided price list.",
    longDescription: "Smooth texture and rich red color for premium dishes.",
    highlights: ["1 kg pack", "Premium grade", "Color rich"],
    variants: kgVariant(400),
  },
  {
    id: "resham-kashmiri-marchu",
    name: "Resham Kashmiri Marchu",
    image: kashmiriChilli,
    category: "Basic Spices",
    description: "Kashmiri style chilli with deep color and mild heat.",
    longDescription: "Ideal for curries where color and aroma are important.",
    highlights: ["1 kg pack", "Kashmiri profile", "Restaurant style color"],
    variants: kgVariant(500),
  },
  {
    id: "kumthi-kashmiri-marchu",
    name: "Kumthi Kashmiri Marchu",
    image: kashmiriChilli,
    category: "Basic Spices",
    description: "Special premium Kashmiri chilli variant.",
    longDescription: "High quality chilli selected for flavor and texture.",
    highlights: ["1 kg pack", "Premium selection", "Color and flavor balance"],
    variants: kgVariant(700),
  },
  {
    id: "selam-haldar",
    name: "Selam Haldar",
    image: turmericPowder,
    category: "Pure Spices",
    description: "Strong turmeric grade for daily cooking.",
    longDescription: "Traditional haldar profile for gravies and pickles.",
    highlights: ["1 kg pack", "Pure spice", "Gujarati market price"],
    variants: kgVariant(300),
  },
  {
    id: "green-dhanajeeru",
    name: "Green Dhanajeeru",
    image: corianderCumin,
    category: "Blended Spices",
    description: "Classic coriander-cumin blend for home kitchens.",
    longDescription: "Balanced blend suitable for sabzi, dal, and farsan.",
    highlights: ["1 kg pack", "Everyday blend", "Fresh aroma"],
    variants: kgVariant(260),
  },
  {
    id: "white-strong-hing",
    name: "White Strong Hing",
    image: blackPepper,
    category: "Asafoetida",
    description: "Strong white hing variant.",
    longDescription: "Aromatic hing for tadka and digestive spice blends.",
    highlights: ["1 kg pack", "Strong aroma", "Premium hing"],
    variants: kgVariant(800),
  },
  {
    id: "black-strong-hing",
    name: "Black Strong Hing",
    image: blackPepper,
    category: "Asafoetida",
    description: "Bold black hing type with intense aroma.",
    longDescription: "Used in authentic Gujarati tadka preparations.",
    highlights: ["1 kg pack", "Intense hing", "Traditional usage"],
    variants: kgVariant(400),
  },
  {
    id: "jini-rai",
    name: "Jini Rai",
    image: cuminPowder,
    category: "Pure Spices",
    description: "Small mustard seed variant.",
    longDescription: "Tempering ingredient for pickles and daily vegetables.",
    highlights: ["1 kg pack", "Pure spice", "Fresh lot"],
    variants: kgVariant(140),
  },
  {
    id: "medium-jeeru",
    name: "Medium Jeeru",
    image: cuminPowder,
    category: "Pure Spices",
    description: "Medium cumin seed quality.",
    longDescription: "Suitable for masala mixes and daily tadka.",
    highlights: ["1 kg pack", "Clean cumin seeds", "Strong aroma"],
    variants: kgVariant(300),
  },
  {
    id: "motu-jeeru",
    name: "Motu Jeeru",
    image: cuminPowder,
    category: "Pure Spices",
    description: "Large-size cumin seed.",
    longDescription: "Preferred for premium spice blends and roasted masala.",
    highlights: ["1 kg pack", "Large seed", "Premium quality"],
    variants: kgVariant(360),
  },
  {
    id: "moti-methi",
    name: "Moti Methi",
    image: corianderPowder,
    category: "Pure Spices",
    description: "Large fenugreek seeds.",
    longDescription: "Ideal for pickles and spice tempering.",
    highlights: ["1 kg pack", "Fresh stock", "Daily kitchen use"],
    variants: kgVariant(140),
  },
  {
    id: "mota-ajma",
    name: "Mota Ajma",
    image: corianderPowder,
    category: "Pure Spices",
    description: "Ajwain seeds for spice and digestion.",
    longDescription: "Useful in snacks, parathas, and traditional remedies.",
    highlights: ["1 kg pack", "Strong aroma", "Clean seeds"],
    variants: kgVariant(400),
  },
  {
    id: "tasty-achar-masala",
    name: "Tasty Achar Masala",
    image: garamMasala,
    category: "Blended Spices",
    description: "Pickle masala as per provided rate card.",
    longDescription: "Ready masala blend for homemade achar recipes.",
    highlights: ["1 kg pack", "Pickle special", "Rich flavor"],
    isOffer: true,
    variants: kgVariant(500),
  },
  {
    id: "green-variyali",
    name: "Green Variyali",
    image: corianderPowder,
    category: "Pure Spices",
    description: "Green fennel seeds.",
    longDescription: "Used in mukhwas, masalas, and sweet-savory dishes.",
    highlights: ["1 kg pack", "Fresh fennel", "Aromatic"],
    variants: kgVariant(350),
  },
  {
    id: "rai-kuriya",
    name: "Rai Kuriya",
    image: cuminPowder,
    category: "Pure Spices",
    description: "Split mustard for pickles and masalas.",
    longDescription: "Classic ingredient in Gujarati pickle preparations.",
    highlights: ["1 kg pack", "Pickle use", "Consistent quality"],
    variants: kgVariant(200),
  },
  {
    id: "methi-kuriya",
    name: "Methi Kuriya",
    image: corianderPowder,
    category: "Pure Spices",
    description: "Split methi for achar and seasoning.",
    longDescription: "Popular in spice mixes for pickles and sambharo.",
    highlights: ["1 kg pack", "Pickle-ready", "Quality sorted"],
    variants: kgVariant(200),
  },
  {
    id: "dhana-kuriya",
    name: "Dhana Kuriya",
    image: corianderPowder,
    category: "Pure Spices",
    description: "Split coriander form for texture-rich masalas.",
    longDescription: "Adds rustic texture and coriander notes.",
    highlights: ["1 kg pack", "Rustic blend", "Fresh coriander profile"],
    variants: kgVariant(200),
  },
  {
    id: "dalchini",
    name: "Dalchini",
    image: blackPepper,
    category: "Exotic Range",
    description: "Cinnamon sticks premium pack.",
    longDescription: "Warm sweet spice for chai, biryani, and garam masala.",
    highlights: ["1 kg pack", "Whole spice", "Premium aroma"],
    variants: kgVariant(800),
  },
  {
    id: "green-elaichi",
    name: "Green Elaichi",
    image: blackPepper,
    category: "Exotic Range",
    description: "Premium green cardamom.",
    longDescription: "High-grade elaichi for sweets, tea, and desserts.",
    highlights: ["1 kg pack", "High aroma", "Top grade"],
    variants: kgVariant(4000),
  },
  {
    id: "laving",
    name: "Laving",
    image: blackPepper,
    category: "Exotic Range",
    description: "Clove whole spice.",
    longDescription: "Strong aromatic clove for spice mixes and tea masala.",
    highlights: ["1 kg pack", "Whole clove", "Intense flavor"],
    variants: kgVariant(1200),
  },
  {
    id: "tikha-mari",
    name: "Tikha (Mari)",
    image: blackPepper,
    category: "Pure Spices",
    description: "Sharp black pepper spice profile.",
    longDescription: "Spicy pepper quality from the shared price chart.",
    highlights: ["1 kg pack", "Strong pungency", "Fresh lot"],
    variants: kgVariant(1200),
  },
  {
    id: "aakhi-sunti-powder",
    name: "Aakhi Sunti (Powder)",
    image: turmericPowder,
    category: "Pure Spices",
    description: "Dry ginger powder.",
    longDescription: "Aromatic sunthi powder used in masala and herbal use.",
    highlights: ["1 kg pack", "Fine powder", "Warm taste"],
    variants: kgVariant(600),
  },
  {
    id: "mota-pipri-mul-powder",
    name: "Mota Pipri Mul (Powder)",
    image: turmericPowder,
    category: "Exotic Range",
    description: "Special long pepper root powder.",
    longDescription: "Traditional spice powder used in premium blends.",
    highlights: ["1 kg pack", "Specialty spice", "Strong medicinal aroma"],
    variants: kgVariant(800),
  },
  {
    id: "white-tal",
    name: "White Tal",
    image: corianderPowder,
    category: "Pure Spices",
    description: "White sesame seeds.",
    longDescription: "Clean white sesame for chutney, sweets, and mixes.",
    highlights: ["1 kg pack", "White sesame", "Sorted quality"],
    variants: kgVariant(220),
  },
  {
    id: "garam-masala",
    name: "Garam Masala",
    image: garamMasala,
    category: "Blended Spices",
    description: "Signature garam masala from Vishal Masala.",
    longDescription: "Strong blended masala for curries and gravies.",
    highlights: ["1 kg pack", "Aromatic blend", "Best seller"],
    isOffer: true,
    variants: kgVariant(600),
  },
  {
    id: "tea-masala",
    name: "Tea Masala",
    image: garamMasala,
    category: "Blended Spices",
    description: "Premium chai masala blend.",
    longDescription: "Fragrant mix for kadak chai and masala tea recipes.",
    highlights: ["1 kg pack", "Tea special", "Premium blend"],
    isOffer: true,
    variants: kgVariant(1400),
  },
];

export const categories = [
  "All",
  "Basic Spices",
  "Blended Spices",
  "Pure Spices",
  "Asafoetida",
  "Exotic Range",
];

export const getProductById = (id: string) => products.find((product) => product.id === id);

export const getRelatedProducts = (productId: string) => {
  const product = getProductById(productId);
  if (!product) return [];
  return products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
};
