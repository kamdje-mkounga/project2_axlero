import { useState, useMemo, useEffect } from 'react'
import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import './App.css'
import './components/filters/filters.css'
import ProductImageUpload from './components/ProductImageUpload'
import CartDrawer from './components/cart/CartDrawer'
import FilterSidebar from './components/filters/FilterSidebar'
import ActiveFilters from './components/filters/ActiveFilters'
import { useCart } from './context'

// Initial mock products for the consumer catalog
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 4999,
    stock: 15,
    status: 'In Stock',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description: 'Immersive sound with active noise cancellation and 40-hour battery life.',
  },
  {
    id: 2,
    name: 'Minimalist Mechanical Keyboard',
    category: 'Electronics',
    price: 3499,
    stock: 8,
    status: 'In Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    description: 'Tactile switches with customizable RGB backlighting and sleek aluminum frame.',
  },
  {
    id: 3,
    name: 'Classic Cotton Oversized Hoodie',
    category: 'Fashion',
    price: 1299,
    stock: 25,
    status: 'In Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60',
    description: 'Premium heavyweight cotton blend designed for maximum comfort and streetwear style.',
  },
  {
    id: 4,
    name: 'Smart Desk LED Lamp with Wireless Charger',
    category: 'Home & Kitchen',
    price: 1899,
    stock: 4,
    status: 'Low Stock',
    rating: 4.2,
    image: 'https://tse1.mm.bing.net/th/id/OIP.o7J7LdvZOlcGZiADlKnQSAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Adjustable color temperatures with integrated Qi fast wireless charging base.',
  },
  {
    id: 5,
    name: 'Ergonomic Memory Foam Lumbar Cushion',
    category: 'Home & Kitchen',
    price: 899,
    stock: 18,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60',
    description: 'Orthopedic memory foam cushion designed to relieve lower back pain during long hours.',
  },
  {
    id: 6,
    name: 'Atomic Habits by James Clear (Hardcover)',
    category: 'Books',
    price: 599,
    stock: 30,
    status: 'In Stock',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60',
    description: 'An easy & proven way to build good habits, break bad ones, and master tiny behaviors.',
  },
  {
    id: 7,
    name: 'Urban Canvas Roll-Top Laptop Backpack',
    category: 'Fashion',
    price: 2499,
    stock: 12,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    description: 'Water-resistant vintage backpack with padded 15.6-inch laptop compartment and USB port.',
  },
  {
    id: 8,
    name: 'Ultra-Wide 4K Gaming Monitor (34-inch)',
    category: 'Electronics',
    price: 8499,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    description: '144Hz refresh rate curved gaming display with HDR600 and FreeSync Premium.',
  },

  {
    id: 9,
    name: 'Smart Fitness Tracking Watch',
    category: 'Electronics',
    price: 2999,
    stock: 20,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    description: 'Track your daily activity, heart rate, sleep, and fitness goals with a sleek smartwatch.'
  },
  {
    id: 10,
    name: 'Portable Bluetooth Speaker',
    category: 'Electronics',
    price: 1799,
    stock: 14,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    description: 'Compact wireless speaker with powerful sound and long-lasting battery.'
  },
  {
    id: 11,
    name: 'Wireless Gaming Mouse',
    category: 'Electronics',
    price: 1499,
    stock: 3,
    status: 'Low Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    description: 'Precision optical sensor with adjustable DPI and ergonomic design.'
  },
  {
    id: 12,
    name: 'USB-C Fast Charging Hub',
    category: 'Electronics',
    price: 999,
    stock: 35,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500',
    description: 'Multiport USB-C hub for connecting displays, storage, and accessories.'
  },
  {
    id: 13,
    name: 'Portable External SSD 1TB',
    category: 'Electronics',
    price: 5499,
    stock: 9,
    status: 'In Stock',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    description: 'Fast portable storage for backups, documents, photos, and videos.'
  },
  {
    id: 14,
    name: '1080p HD Webcam',
    category: 'Electronics',
    price: 2199,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
    description: 'Full HD webcam with clear video quality for meetings and streaming.'
  },
  {
    id: 15,
    name: 'Noise-Isolating Wireless Earbuds',
    category: 'Electronics',
    price: 1899,
    stock: 22,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500',
    description: 'Lightweight earbuds with wireless connectivity and a compact charging case.'
  },
  {
    id: 16,
    name: 'Digital Drawing Tablet',
    category: 'Electronics',
    price: 3999,
    stock: 6,
    status: 'Low Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=500',
    description: 'Responsive drawing surface for digital illustration and creative workflows.'
  },
  {
    id: 17,
    name: 'Smart Home Security Camera',
    category: 'Electronics',
    price: 2499,
    stock: 18,
    status: 'In Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500',
    description: 'Indoor monitoring camera with motion detection and mobile app access.'
  },
  {
    id: 18,
    name: 'Adjustable Laptop Stand',
    category: 'Electronics',
    price: 1199,
    stock: 28,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    description: 'Foldable ergonomic stand that improves laptop positioning and airflow.'
  },
  {
    id: 19,
    name: 'Classic Denim Jacket',
    category: 'Fashion',
    price: 2199,
    stock: 16,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    description: 'Timeless denim jacket suitable for casual everyday outfits.'
  },
  {
    id: 20,
    name: 'Premium Leather Wallet',
    category: 'Fashion',
    price: 899,
    stock: 30,
    status: 'In Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    description: 'Compact wallet with multiple card slots and a minimalist design.'
  },
  {
    id: 21,
    name: 'Classic White Sneakers',
    category: 'Fashion',
    price: 2799,
    stock: 11,
    status: 'In Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    description: 'Versatile everyday sneakers with a comfortable cushioned sole.'
  },
  {
    id: 22,
    name: 'Premium Cotton T-Shirt',
    category: 'Fashion',
    price: 699,
    stock: 42,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    description: 'Soft breathable cotton T-shirt with a comfortable regular fit.'
  },
  {
    id: 23,
    name: 'Classic Analog Wristwatch',
    category: 'Fashion',
    price: 3499,
    stock: 5,
    status: 'Low Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
    description: 'Elegant analog watch with a minimalist dial and premium strap.'
  },
  {
    id: 24,
    name: 'Polarized Sunglasses',
    category: 'Fashion',
    price: 1299,
    stock: 19,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    description: 'Stylish sunglasses with polarized lenses for outdoor comfort.'
  },
  {
    id: 25,
    name: 'Travel Duffel Bag',
    category: 'Fashion',
    price: 1899,
    stock: 13,
    status: 'In Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    description: 'Spacious travel bag with organized compartments and durable fabric.'
  },
  {
    id: 26,
    name: 'Slim Fit Formal Shirt',
    category: 'Fashion',
    price: 1199,
    stock: 24,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500',
    description: 'Smart formal shirt designed for professional and office wear.'
  },
  {
    id: 27,
    name: 'Women Casual Handbag',
    category: 'Fashion',
    price: 1599,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
    description: 'Elegant everyday handbag with practical storage compartments.'
  },
  {
    id: 28,
    name: 'Winter Knit Beanie',
    category: 'Fashion',
    price: 499,
    stock: 38,
    status: 'In Stock',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500',
    description: 'Soft knitted beanie offering warmth and everyday comfort.'
  },
  {
    id: 29,
    name: 'Modern Ceramic Coffee Mug Set',
    category: 'Home & Kitchen',
    price: 799,
    stock: 26,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    description: 'Minimalist ceramic mugs designed for coffee and tea lovers.'
  },
  {
    id: 30,
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Kitchen',
    price: 699,
    stock: 40,
    status: 'In Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    description: 'Reusable insulated bottle designed to keep drinks at the desired temperature.'
  },
  {
    id: 31,
    name: 'Modern Table Clock',
    category: 'Home & Kitchen',
    price: 599,
    stock: 2,
    status: 'Low Stock',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=500',
    description: 'Minimalist decorative clock for desks, bedrooms, and living rooms.'
  },
  {
    id: 32,
    name: 'LED Decorative Floor Lamp',
    category: 'Home & Kitchen',
    price: 2299,
    stock: 10,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    description: 'Modern floor lamp providing ambient lighting for your living space.'
  },
  {
    id: 33,
    name: 'Non-Stick Cookware Set',
    category: 'Home & Kitchen',
    price: 3299,
    stock: 7,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500',
    description: 'Versatile cookware set designed for convenient everyday cooking.'
  },
  {
    id: 34,
    name: 'Cotton Bedsheet Set',
    category: 'Home & Kitchen',
    price: 1499,
    stock: 21,
    status: 'In Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
    description: 'Soft cotton bedding set designed for comfortable sleeping.'
  },
  {
    id: 35,
    name: 'Decorative Indoor Plant Pot',
    category: 'Home & Kitchen',
    price: 399,
    stock: 32,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    description: 'Stylish planter for adding greenery to your home or workspace.'
  },
  {
    id: 36,
    name: 'Digital Kitchen Food Scale',
    category: 'Home & Kitchen',
    price: 549,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500',
    description: 'Compact digital scale for accurate ingredient measurements.'
  },
  {
    id: 37,
    name: 'Modern Wall Art Print',
    category: 'Home & Kitchen',
    price: 899,
    stock: 15,
    status: 'In Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500',
    description: 'Contemporary wall artwork to enhance your interior decoration.'
  },
  {
    id: 38,
    name: 'Electric Hand Blender',
    category: 'Home & Kitchen',
    price: 1299,
    stock: 8,
    status: 'In Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500',
    description: 'Convenient kitchen blender for smoothies, sauces, and soups.'
  },
  {
    id: 39,
    name: 'Deep Work by Cal Newport',
    category: 'Books',
    price: 499,
    stock: 27,
    status: 'In Stock',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    description: 'Learn how to develop focused work habits and improve productivity.'
  },
  {
    id: 40,
    name: 'The Psychology of Money',
    category: 'Books',
    price: 399,
    stock: 33,
    status: 'In Stock',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    description: 'Explore the psychology behind financial decisions, wealth, and investing.'
  },
  {
    id: 41,
    name: 'Clean Code by Robert C. Martin',
    category: 'Books',
    price: 699,
    stock: 12,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    description: 'A practical guide to writing readable and maintainable software.'
  },
  {
    id: 42,
    name: 'Rich Dad Poor Dad',
    category: 'Books',
    price: 349,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500',
    description: 'A popular introduction to financial literacy and wealth-building concepts.'
  },
  {
    id: 43,
    name: 'The 7 Habits of Highly Effective People',
    category: 'Books',
    price: 549,
    stock: 18,
    status: 'In Stock',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500',
    description: 'Develop principles for personal effectiveness and better decision-making.'
  },
  {
    id: 44,
    name: 'Introduction to Algorithms',
    category: 'Books',
    price: 1299,
    stock: 6,
    status: 'Low Stock',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    description: 'Comprehensive reference covering essential computer science algorithms.'
  },
  {
    id: 45,
    name: 'Start With Why by Simon Sinek',
    category: 'Books',
    price: 449,
    stock: 22,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    description: 'Explore how purpose and leadership influence successful organizations.'
  },
  {
    id: 46,
    name: 'Think and Grow Rich',
    category: 'Books',
    price: 299,
    stock: 31,
    status: 'In Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    description: 'A classic personal development book about goals and achievement.'
  },
  {
    id: 47,
    name: 'Atomic Design by Brad Frost',
    category: 'Books',
    price: 799,
    stock: 9,
    status: 'In Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    description: 'A guide to building consistent and reusable user interface systems.'
  },
  {
    id: 48,
    name: 'Professional Yoga Mat',
    category: 'Sports',
    price: 999,
    stock: 25,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500',
    description: 'Non-slip exercise mat for yoga, stretching, and home workouts.'
  },
  {
    id: 49,
    name: 'Adjustable Dumbbell Set',
    category: 'Sports',
    price: 2499,
    stock: 4,
    status: 'Low Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500',
    description: 'Versatile strength-training equipment for home fitness routines.'
  },
  {
    id: 50,
    name: 'Professional Football',
    category: 'Sports',
    price: 899,
    stock: 17,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0c2e?w=500',
    description: 'Durable football suitable for recreational games and training.'
  },
  {
    id: 51,
    name: 'Premium Running Shoes',
    category: 'Sports',
    price: 3199,
    stock: 13,
    status: 'In Stock',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
    description: 'Lightweight running shoes with cushioned support for daily training.'
  },
  {
    id: 52,
    name: 'Stainless Steel Gym Shaker',
    category: 'Sports',
    price: 499,
    stock: 29,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500',
    description: 'Portable shaker bottle for mixing drinks before or after workouts.'
  },
  {
    id: 53,
    name: 'Resistance Bands Set',
    category: 'Sports',
    price: 599,
    stock: 36,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500',
    description: 'Multiple resistance levels for strength training and mobility exercises.'
  },
  {
    id: 54,
    name: 'Professional Badminton Racket',
    category: 'Sports',
    price: 1499,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500',
    description: 'Lightweight racket designed for recreational badminton matches.'
  },
  {
    id: 55,
    name: 'Compact Jump Rope',
    category: 'Sports',
    price: 299,
    stock: 41,
    status: 'In Stock',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
    description: 'Adjustable skipping rope for cardio and endurance training.'
  },
  {
    id: 56,
    name: 'Microfiber Sports Towel',
    category: 'Sports',
    price: 349,
    stock: 23,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500',
    description: 'Quick-drying lightweight towel for gym and outdoor activities.'
  },
  {
    id: 57,
    name: 'Hydrating Facial Cleanser',
    category: 'Beauty',
    price: 399,
    stock: 20,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500',
    description: 'Gentle daily facial cleanser designed to remove dirt and impurities.'
  },
  {
    id: 58,
    name: 'Vitamin C Face Serum',
    category: 'Beauty',
    price: 599,
    stock: 14,
    status: 'In Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500',
    description: 'Lightweight facial serum formulated for everyday skincare routines.'
  },
  {
    id: 59,
    name: 'Moisturizing Body Lotion',
    category: 'Beauty',
    price: 449,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
    description: 'Daily moisturizing lotion for soft and hydrated skin.'
  },
  {
    id: 60,
    name: 'Premium Hair Care Shampoo',
    category: 'Beauty',
    price: 349,
    stock: 26,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
    description: 'Gentle shampoo designed for regular hair cleansing and care.'
  },
  {
    id: 61,
    name: 'Makeup Brush Collection',
    category: 'Beauty',
    price: 799,
    stock: 12,
    status: 'In Stock',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
    description: 'Multi-piece brush collection for precise and convenient makeup application.'
  },
  {
    id: 62,
    name: 'Compact Travel Makeup Mirror',
    category: 'Beauty',
    price: 499,
    stock: 18,
    status: 'In Stock',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
    description: 'Portable mirror with a compact design for everyday grooming.'
  },
  {
    id: 63,
    name: 'Classic Leather Belt',
    category: 'Accessories',
    price: 699,
    stock: 24,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8d4c1c2?w=500',
    description: 'Versatile belt with a timeless design for casual and formal outfits.'
  },
  {
    id: 64,
    name: 'Minimalist Silver Necklace',
    category: 'Accessories',
    price: 999,
    stock: 10,
    status: 'In Stock',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500',
    description: 'Elegant minimalist necklace suitable for everyday styling.'
  },
  {
    id: 65,
    name: 'Premium Travel Organizer',
    category: 'Accessories',
    price: 799,
    stock: 7,
    status: 'Low Stock',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    description: 'Compact organizer for keeping travel essentials neatly arranged.'
  },
  {
    id: 66,
    name: 'Classic Baseball Cap',
    category: 'Accessories',
    price: 399,
    stock: 34,
    status: 'In Stock',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
    description: 'Adjustable everyday cap with a comfortable fit and classic style.'
  },
  {
    id: 67,
    name: 'Premium Keychain Set',
    category: 'Accessories',
    price: 199,
    stock: 50,
    status: 'In Stock',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500',
    description: 'Simple decorative keychains for organizing everyday keys.'
  },
  {
    id: 68,
    name: 'Classic Leather Card Holder',
    category: 'Accessories',
    price: 549,
    stock: 16,
    status: 'In Stock',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    description: 'Slim card holder designed for carrying essential cards and IDs.'
  }
]

// ==========================================
// VENDOR PORTAL COMPONENTS
// ==========================================

function VendorSidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        Axlero<span>.</span>
      </div>

      <p className="sidebar-label">MAIN MENU</p>

      <nav className="sidebar-nav">
        <NavLink to="/vendor/dashboard" className="nav-link">
          <span>▦</span> Dashboard
        </NavLink>
        <NavLink to="/vendor/products" className="nav-link">
          <span>□</span> My Products
        </NavLink>
        <NavLink to="/vendor/products/add" className="nav-link">
          <span>＋</span> Add Product
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <Link to="/" className="switch-portal-btn">
          ← Switch to Storefront
        </Link>
      </div>
    </aside>
  )
}

function VendorLayout() {
  const location = useLocation()
  const titles = {
    '/vendor/dashboard': 'Dashboard',
    '/vendor/products': 'My Products',
    '/vendor/products/add': 'Add Product',
  }

  return (
    <div className="dashboard-layout">
      <VendorSidebar />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            {titles[location.pathname] || 'Vendor Portal'}
          </div>
          <div className="profile">
            <span>Vendor Account</span>
            <div className="avatar">V</div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function VendorDashboard() {
  const [productCount, setProductCount] = useState(INITIAL_PRODUCTS.length)

  useEffect(() => {
    async function loadCount() {
      try {
        let res
        try {
          res = await fetch('/api/products')
        } catch {
          res = await fetch('http://localhost:5000/api/products')
        }
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setProductCount(data.length)
          }
        }
      } catch (err) {
        console.warn('Could not fetch vendor count from DB:', err.message)
      }
    }
    loadCount()
  }, [])

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Welcome, Vendor!</h1>
          <p>Here's an overview of your store performance.</p>
        </div>
        <Link to="/vendor/products/add">
          <button className="primary-btn">+ Add Product</button>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <p className="stat-label">Total Products</p>
          <div className="stat-value">{productCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <p className="stat-label">Total Orders</p>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <p className="stat-label">Total Revenue</p>
          <div className="stat-value">₹45,290</div>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        <p>Your store received 3 new orders today. Keep up the great work!</p>
      </div>
    </>
  )
}

function Products() {
  const [vendorProducts, setVendorProducts] = useState(INITIAL_PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        let res
        try {
          res = await fetch('/api/products')
        } catch {
          res = await fetch('http://localhost:5000/api/products')
        }
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setVendorProducts(data)
          }
        }
      } catch (err) {
        console.warn('Could not load vendor products from DB:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>My Products</h1>
          <p>Manage all products in your store.</p>
        </div>
        <Link to="/vendor/products/add">
          <button className="primary-btn">+ Add Product</button>
        </Link>
      </div>

      <div className="panel">
        <h2>Product List ({vendorProducts.length} items)</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {vendorProducts.map((p) => {
                const pId = p._id || p.id
                return (
                  <tr key={pId}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`status-badge ${p.status === 'In Stock' ? 'success' : 'warning'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function AddProduct() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()
    alert(
      imageFile
        ? `Product saved successfully with image: ${imageFile.name}!`
        : 'Product saved successfully!'
    )
    navigate('/vendor/products')
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Add New Product</h1>
          <p>Enter your product details and upload an image.</p>
        </div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="productName">Product Name *</label>
            <input id="productName" type="text" placeholder="Enter product name" required />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" required defaultValue="">
              <option value="" disabled>Select category</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Kitchen</option>
              <option>Books</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input id="price" type="number" min="0" placeholder="Enter price" required />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input id="stock" type="number" min="0" placeholder="Enter quantity" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Product Description *</label>
          <textarea id="description" rows="4" placeholder="Describe your product..." required />
        </div>

        <ProductImageUpload onImageSelect={setImageFile} />

        <div className="form-actions">
          <button type="submit" className="primary-btn">Save Product</button>
          <button type="button" className="secondary-btn" onClick={() => navigate('/vendor/products')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}


// ==========================================
// CONSUMER STOREFRONT COMPONENTS
// ==========================================

function StorefrontLayout() {
  const { totalItems, toggleCart } = useCart()

  return (
    <div className="storefront-layout">
      {/* Store Header */}
      <header className="store-header">
        <div className="store-brand">
          <Link to="/">Axlero<span>.</span> Store</Link>
        </div>

        <div className="store-nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'store-link active' : 'store-link'}>
            Catalog
          </NavLink>
        </div>

        <div className="store-actions">
          <Link to="/vendor/dashboard" className="vendor-switch-btn">
            Vendor Portal
          </Link>
          <button
            type="button"
            className="cart-badge-wrapper"
            onClick={toggleCart}
            aria-label={`Shopping cart with ${totalItems} items`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              font: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            🛒 <span className="cart-count">{totalItems}</span>
          </button>
        </div>
      </header>

      {/* Main Storefront Content */}
      <main className="store-main">
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
        </Routes>
      </main>

      {/* Store Footer */}
      <footer className="store-footer">
        <p>© 2026 Axlero E-Commerce Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

function ProductCatalog() {
  const { addToCart, openCart } = useCart()

  // Advanced Filtering States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  // Live Database State
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        setLoading(true)

        let response
        try {
          response = await fetch('/api/products')
        } catch {
          response = await fetch('http://localhost:5000/api/products')
        }

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data)
          } else {
            // DB is empty, use initial fallback
            setProducts(INITIAL_PRODUCTS)
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Could not fetch products from backend, falling back to mock data:', err.message)
          setProducts(INITIAL_PRODUCTS)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(() => {
    const defaultCategories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Accessories']
    const productCategories = products.map((p) => p.category).filter(Boolean)
    return Array.from(new Set([...defaultCategories, ...productCategories]))
  }, [products])

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length }
    for (const cat of categories) {
      if (cat !== 'All') {
        counts[cat] = products.filter((p) => p.category === cat).length
      }
    }
    return counts
  }, [categories, products])

  const inStockCount = useMemo(() => {
    return products.filter((p) => p.stock > 0).length
  }, [products])

  // Filtering and Sorting Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    const filtered = products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q))
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !inStockOnly || product.stock > 0
      const matchesRating = minRating === 0 || (product.rating || 0) >= minRating

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStock &&
        matchesRating
      )
    })

    const result = [...filtered]
    switch (sortBy) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price)
      case 'rating-desc':
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return result
    }
  }, [products, searchQuery, selectedCategory, priceRange, inStockOnly, minRating, sortBy])

  // Active filter checks
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedCategory !== 'All' ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    inStockOnly ||
    minRating > 0
  )

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0)

  function handleResetAll() {
    setSearchQuery('')
    setSelectedCategory('All')
    setPriceRange([0, 10000])
    setInStockOnly(false)
    setMinRating(0)
    setSortBy('featured')
  }

  function handleAddToCart(product) {
    if (product.stock === 0) return
    addToCart(product, 1)
    openCart()
  }

  return (
    <div className="catalog-container">
      {/* Hero Banner */}
      <div className="store-hero">
        <h1>Discover Amazing Products</h1>
        <p>Shop top-quality items from verified vendors across India.</p>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search products by title, keyword, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Main 2-Column Filtering & Catalog Layout */}
      <div className="catalog-layout">
        {/* Left Sidebar Filter Panel */}
        <FilterSidebar
          categories={categories}
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          priceRange={priceRange}
          maxDefaultPrice={10000}
          onPriceChange={(newRange) => setPriceRange(newRange)}
          inStockOnly={inStockOnly}
          onToggleInStock={() => setInStockOnly((prev) => !prev)}
          inStockCount={inStockCount}
          minRating={minRating}
          onSelectRating={(r) => setMinRating(r)}
          onResetAll={handleResetAll}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Right Main Catalog Content Area */}
        <div className="catalog-main-area">
          {/* Controls Bar: Results Count, Mobile Filter Trigger, and Sort Dropdown */}
          <div className="catalog-control-bar">
            <div className="catalog-results-count">
              Showing <strong>{filteredAndSortedProducts.length}</strong> of{' '}
              {products.length} products
            </div>

            <div className="catalog-controls-right">
              <button
                type="button"
                className="mobile-filter-trigger"
                onClick={() => setIsMobileDrawerOpen(true)}
              >
                <span> Filters</span>
                {activeFilterCount > 0 && (
                  <span className="mobile-filter-badge">{activeFilterCount}</span>
                )}
              </button>

              <div className="sort-select-wrapper">
                <label htmlFor="sortSelect">Sort by:</label>
                <select
                  id="sortSelect"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Pill Bar */}
          <ActiveFilters
            searchQuery={searchQuery}
            category={selectedCategory}
            priceRange={priceRange}
            maxDefaultPrice={10000}
            inStockOnly={inStockOnly}
            minRating={minRating}
            onClearSearch={() => setSearchQuery('')}
            onClearCategory={() => setSelectedCategory('All')}
            onClearPrice={() => setPriceRange([0, 10000])}
            onClearInStock={() => setInStockOnly(false)}
            onClearRating={() => setMinRating(0)}
            onClearAll={handleResetAll}
          />

          {/* Product Cards Grid */}
          <div className="product-grid">
            {loading ? (
              <div className="catalog-loading">
                <div className="spinner"></div>
                <p>Loading products from database...</p>
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => {
                const productId = product._id || product.id
                const isOutOfStock = product.stock === 0
                const isLowStock = product.stock > 0 && product.stock <= 5

                return (
                  <div
                    key={productId}
                    className={`product-card ${isOutOfStock ? 'is-out-of-stock' : ''}`}
                  >
                    <div className="product-card-img-wrapper">
                      <img src={product.image} alt={product.name} />
                      <span className="product-category-tag">{product.category}</span>
                    </div>

                    <div className="product-card-body">
                      <div className="product-meta-row">
                        <span className="product-rating-badge">
                          ★ {product.rating ? product.rating.toFixed(1) : '4.5'}
                        </span>
                        <span
                          className={`product-stock-tag ${isOutOfStock
                            ? 'out-of-stock'
                            : isLowStock
                              ? 'low-stock'
                              : 'in-stock'
                            }`}
                        >
                          {isOutOfStock
                            ? 'Out of Stock'
                            : isLowStock
                              ? `Only ${product.stock} left`
                              : 'In Stock'}
                        </span>
                      </div>

                      <h3>{product.name}</h3>
                      <p className="product-desc">{product.description}</p>

                      <div className="product-card-footer">
                        <span className="product-price">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          className="primary-btn sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="no-products">
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
                <h3>No matching products found</h3>
                <p>Try adjusting your category, price range, or search criteria.</p>
                <button
                  type="button"
                  className="primary-btn sm"
                  style={{ marginTop: '16px' }}
                  onClick={handleResetAll}
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


// ==========================================
// ROOT APP COMPONENT
// ==========================================

function App() {
  return (
    <>
      <Routes>
        {/* Vendor Portal Routes */}
        <Route path="/vendor/*" element={<VendorLayout />} />

        {/* Consumer Storefront Routes */}
        <Route path="/*" element={<StorefrontLayout />} />
      </Routes>
      <CartDrawer />
    </>
  )
}

export default App