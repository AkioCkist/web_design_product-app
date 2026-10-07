require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('../models/product');

const products = [
  {
    name: 'Arc Table Lamp', sku: 'NES-LGT-001', price: 2390000, quantity: 14,
    category: 'Lighting', summary: 'Soft light held in a sculptural silhouette.',
    description: 'Arc creates a warm, balanced pool of light for a bedside table or reading corner. Its pleated shade diffuses light evenly, while the matte ceramic base adds a quiet, crafted presence.',
    material: 'Matte ceramic, pleated paper', color: 'Warm ivory', dimensions: 'Ø 38 × H 42 cm',
    image: '/uploads/nesta-arc-lamp.png', featured: true
  },
  {
    name: 'Pour Coffee Set', sku: 'NES-KIT-002', price: 1490000, quantity: 22,
    category: 'Kitchen', summary: 'A slower coffee ritual, refined in steel and glass.',
    description: 'The Pour set pairs a stainless steel dripper with a heat-resistant glass carafe. Its precise form creates a consistent flow and cleans easily, making it useful enough to keep on display.',
    material: 'Stainless steel, borosilicate glass', color: 'Brushed silver', dimensions: 'Ø 14 × H 26 cm',
    image: '/uploads/nesta-pour-coffee.png', featured: true
  },
  {
    name: 'Dune Vases', sku: 'NES-DEC-003', price: 1190000, quantity: 9,
    category: 'Decor', summary: 'A pair of organic forms with a fine, sand-like finish.',
    description: 'The Dune vases are shaped to look complete with or without flowers. Their neutral tone, matte surface, and intentional variations bring a calm focal point to a shelf or console.',
    material: 'Hand-finished stoneware', color: 'Natural sand', dimensions: 'H 34 cm & H 20 cm',
    image: '/uploads/nesta-dune-vases.png', featured: true
  },
  {
    name: 'Nook Lounge Chair', sku: 'NES-FUR-004', price: 8990000, quantity: 5,
    category: 'Furniture', summary: 'A low, generous seat made for quiet corners.',
    description: 'A solid oak frame holds deeply cushioned bouclé upholstery. The low profile and softly angled back support relaxed sitting without adding visual weight to the room.',
    material: 'Solid oak, bouclé upholstery', color: 'Natural cream', dimensions: 'W 72 × D 76 × H 70 cm',
    image: '/uploads/nesta-nook-chair.png', featured: true
  },
  {
    name: 'Mono Wall Clock', sku: 'NES-DEC-005', price: 890000, quantity: 18,
    category: 'Decor', summary: 'Time reduced to its clearest expression.',
    description: 'Mono removes every unnecessary mark, leaving a deep face and slender hands. Its silent sweep movement makes it equally suited to bedrooms and focused workspaces.',
    material: 'Powder-coated aluminium', color: 'Charcoal black', dimensions: 'Ø 32 × D 4 cm',
    image: '/uploads/nesta-mono-clock.png', featured: false
  },
  {
    name: 'Ember Portable Lamp', sku: 'NES-LGT-006', price: 2890000, quantity: 11,
    category: 'Lighting', summary: 'A warm pool of light that moves wherever you need it.',
    description: 'Ember is a cordless lamp with three brightness levels and up to 12 hours of battery life. Smoked glass softens the inner glow for an atmosphere that feels warm and contemporary.',
    material: 'Smoked glass, anodised aluminium', color: 'Smoked amber', dimensions: 'Ø 22 × H 26 cm',
    image: '/uploads/nesta-ember-lamp.png', featured: false
  }
];

async function seed() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from .env');
  await mongoose.connect(process.env.MONGO_URI);
  const operations = products.map((product) => ({
    updateOne: {
      filter: { sku: product.sku },
      update: { $set: product },
      upsert: true
    }
  }));
  await Product.bulkWrite(operations);
  console.log(`Upserted ${products.length} sample products into MongoDB.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
