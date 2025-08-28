export type Product = {
  id: string;
  name: string;
  image: string;
  priceIndividual: number;
  priceBulk: number;
  blurb?: string;
};

// 9 sample products — plug your real images here
import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import product3 from "../assets/product3.png";

export const PRODUCTS: Product[] = [
  { id: "ethiopia", name: "Ethiopia Roast", image: product1, priceIndividual: 12.5, priceBulk: 10.99, blurb: "Floral • Citrus • Honey" },
  { id: "colombia", name: "Colombia Supremo", image: product2, priceIndividual: 11.75, priceBulk: 9.95, blurb: "Caramel • Nutty • Smooth" },
  { id: "house",    name: "House Blend",    image: product3, priceIndividual: 10.5, priceBulk: 8.99, blurb: "Balanced • Everyday Cup" },
  { id: "sumatra",  name: "Sumatra Dark",   image: product1, priceIndividual: 13.2, priceBulk: 11.25, blurb: "Earthy • Cocoa • Bold" },
  { id: "kenya",    name: "Kenya AA",       image: product2, priceIndividual: 14.0, priceBulk: 12.2,  blurb: "Berry • Bright • Juicy" },
  { id: "brazil",   name: "Brazil Santos",  image: product3, priceIndividual: 10.9, priceBulk: 9.4,   blurb: "Nutty • Chocolate • Smooth" },
  { id: "decaf",    name: "Decaf Swiss",    image: product1, priceIndividual: 11.2, priceBulk: 9.7,   blurb: "Gentle • Clean • Balanced" },
  { id: "guatemala",name: "Guatemala Huehue", image: product2, priceIndividual: 12.1, priceBulk: 10.6, blurb: "Cocoa • Spice • Sweet" },
  { id: "espresso", name: "Espresso Forte", image: product3, priceIndividual: 13.75, priceBulk: 11.95, blurb: "Dense • Caramel • Crema" },
];
