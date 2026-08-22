import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Compass,
  Heart,
  Plus,
  Scale,
  Sparkles,
  SlidersHorizontal,
  X,
  Check,
  Calendar,
  IndianRupee,
  Utensils,
  Landmark,
  Layers,
  Thermometer,
  ArrowRight,
  TrendingUp,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import useLanguageStore from "@/store/languageStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Comprehensive Indian Destinations Knowledgebase
const INDIAN_CITIES_KNOWLEDGEBASE = {
  // ── North India ──────────────────────────────────────────────────────────
  delhi: {
    cityName: "Delhi",
    country: "India",
    region: "North India",
    costIndex: 65.0,
    popularity: 98,
    dailyBudget: 2800,
    bestSeason: "Oct – Mar",
    climate: "Subtropical",
    vibes: ["Historic & Cultural", "Foodie & Culinary", "Shopping", "Futuristic & Modern"],
    image: "https://images.pexels.com/photos/28678222/pexels-photo-28678222.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The historic capital of India, bridging Mughal grandeur with bustling bazaars, embassies, and legendary street cuisine.",
    landmarks: ["Qutub Minar", "Red Fort", "Humayun's Tomb", "India Gate", "Lotus Temple"],
    cuisine: ["Butter Chicken", "Chole Bhature", "Parathas", "Chaat", "Nihari"],
    neighborhoods: [
      { name: "Chandni Chowk", vibe: "Mughal alleys, spice markets, legendary street food" },
      { name: "Hauz Khas Village", vibe: "Medieval reservoir ruins, indie cafes, rooftop bars" },
      { name: "Connaught Place", vibe: "Colonial colonnades, shopping plazas, and dining" },
    ],
  },
  jaipur: {
    cityName: "Jaipur",
    country: "India",
    region: "North India",
    costIndex: 70.0,
    popularity: 97,
    dailyBudget: 2500,
    bestSeason: "Oct – Mar",
    climate: "Hot semi-arid",
    vibes: ["Historic & Cultural", "Romantic", "Art & Architecture"],
    image: "https://images.pexels.com/photos/32261804/pexels-photo-32261804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The Pink City famous for royal palaces, hilltop forts, bustling gemstone bazaars, and Rajasthani heritage.",
    landmarks: ["Hawa Mahal", "Amer Fort", "City Palace", "Jantar Mantar", "Nahargarh Fort"],
    cuisine: ["Dal Baati Churma", "Laal Maas", "Ghevar", "Pyaaz Kachori", "Lassi"],
    neighborhoods: [
      { name: "Walled Pink City", vibe: "Historical gates, pink terracotta buildings, bazaars" },
      { name: "C-Scheme", vibe: "Modern cafes, upscale dining, boutique shopping" },
    ],
  },
  agra: {
    cityName: "Agra",
    country: "India",
    region: "North India",
    costIndex: 60.0,
    popularity: 99,
    dailyBudget: 2000,
    bestSeason: "Oct – Mar",
    climate: "Semi-arid",
    vibes: ["Historic & Cultural", "Romantic"],
    image: "https://images.pexels.com/photos/28119116/pexels-photo-28119116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Home to the Taj Mahal, Agra offers an unforgettable journey into the architectural wonder of the Mughal Empire.",
    landmarks: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
    cuisine: ["Agra Petha", "Bedmi Poori", "Mughlai Korma", "Dalmoth"],
    neighborhoods: [
      { name: "Taj Ganj", vibe: "Rooftop view cafes directly overlooking the Taj Mahal" },
      { name: "Sadar Bazaar", vibe: "Street food, marble inlay handicrafts, leather markets" },
    ],
  },
  varanasi: {
    cityName: "Varanasi",
    country: "India",
    region: "North India",
    costIndex: 45.0,
    popularity: 96,
    dailyBudget: 1600,
    bestSeason: "Oct – Mar",
    climate: "Humid subtropical",
    vibes: ["Historic & Cultural", "Spiritual & Wellness", "Budget Friendly"],
    image: "https://images.pexels.com/photos/18728098/pexels-photo-18728098.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The spiritual heart of India, featuring timeless morning boat rides and evening Ganga Aarti along ancient sacred ghats.",
    landmarks: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Assi Ghat"],
    cuisine: ["Banarasi Paan", "Malaiyyo", "Kachori Jalebi", "Blue Lassi"],
    neighborhoods: [
      { name: "Ghats Waterfront", vibe: "Spiritual chanting, evening aarti, holy boat rides" },
      { name: "Assi & Lanka", vibe: "Yoga retreats, university quarter, rooftop cafes" },
    ],
  },
  srinagar: {
    cityName: "Srinagar",
    country: "India",
    region: "North India",
    costIndex: 75.0,
    popularity: 95,
    dailyBudget: 3200,
    bestSeason: "Apr – Oct",
    climate: "Subtropical highland",
    vibes: ["Nature & Adventure", "Romantic", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/17764447/pexels-photo-17764447.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Paradise on Earth, celebrated for its wooden houseboats on Dal Lake, shikara rides, and vibrant Mughal gardens.",
    landmarks: ["Dal Lake", "Shalimar Bagh", "Nishat Bagh", "Shankaracharya Temple"],
    cuisine: ["Kashmiri Wazwan", "Rogan Josh", "Kahwa Tea", "Gushtaba"],
    neighborhoods: [
      { name: "Dal Lake Boulevard", vibe: "Floating vegetable markets, cedar houseboats, shikaras" },
      { name: "Old Srinagar", vibe: "Wooden heritage shrines, copperware bazaars, Jamia Masjid" },
    ],
  },
  amritsar: {
    cityName: "Amritsar",
    country: "India",
    region: "North India",
    costIndex: 55.0,
    popularity: 96,
    dailyBudget: 1900,
    bestSeason: "Oct – Mar",
    climate: "Semi-arid",
    vibes: ["Historic & Cultural", "Foodie & Culinary", "Spiritual & Wellness"],
    image: "https://images.pexels.com/photos/18275890/pexels-photo-18275890.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Home to the glistening Golden Temple, representing peace, community langar service, and rich Punjabi heritage.",
    landmarks: ["Golden Temple", "Jallianwala Bagh", "Wagah Border", "Partition Museum"],
    cuisine: ["Amritsari Kulcha", "Langar Thali", "Lassi", "Pinni", "Amritsari Fish"],
    neighborhoods: [
      { name: "Heritage Street", vibe: "Pedestrianized illuminated promenade leading to the temple" },
      { name: "Lawrence Road", vibe: "Popular street food vendors, sweets, and shopping" },
    ],
  },
  rishikesh: {
    cityName: "Rishikesh",
    country: "India",
    region: "North India",
    costIndex: 50.0,
    popularity: 94,
    dailyBudget: 1800,
    bestSeason: "Sep – Apr",
    climate: "Subtropical",
    vibes: ["Nature & Adventure", "Spiritual & Wellness", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/19041828/pexels-photo-19041828.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The Yoga Capital of the World, where the emerald Ganga flows past Himalayan foothills and rafting camps.",
    landmarks: ["Laxman Jhula", "Ram Jhula", "Beatles Ashram", "Triveni Ghat Aarti"],
    cuisine: ["Ayurvedic Thali", "Masala Chai", "Vegan Smoothie Bowls", "Wood-fired Pizza"],
    neighborhoods: [
      { name: "Tapovan", vibe: "Yoga ashrams, international cafes, meditation centers" },
      { name: "Swarg Ashram", vibe: "Peaceful riverside temples, ghats, and Sanskrit schools" },
    ],
  },
  manali: {
    cityName: "Manali",
    country: "India",
    region: "North India",
    costIndex: 68.0,
    popularity: 95,
    dailyBudget: 2600,
    bestSeason: "Oct – Jun",
    climate: "Alpine highland",
    vibes: ["Nature & Adventure", "Romantic", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/28738431/pexels-photo-28738431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "A popular Himalayan resort town surrounded by pine forests, roaring river rapids, and snow-capped peaks.",
    landmarks: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Old Manali", "Jogini Falls"],
    cuisine: ["Siddu", "Trout Fish", "Thukpa", "Himachali Dham", "Apple Pie"],
    neighborhoods: [
      { name: "Old Manali", vibe: "Wooden apple orchards, live music cafes, bohemian charm" },
      { name: "Mall Road", vibe: "Woolen bazaars, souvenir stalls, local diners" },
    ],
  },
  leh: {
    cityName: "Leh Ladakh",
    country: "India",
    region: "North India",
    costIndex: 80.0,
    popularity: 97,
    dailyBudget: 3500,
    bestSeason: "May – Sep",
    climate: "Cold desert",
    vibes: ["Nature & Adventure", "Spiritual & Wellness", "Romantic"],
    image: "https://images.pexels.com/photos/38087449/pexels-photo-38087449.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "High-altitude desert wonderland featuring crystal blue lakes, mountain passes, and ancient Buddhist gompas.",
    landmarks: ["Pangong Lake", "Nubra Valley", "Khardung La Pass", "Thiksey Monastery", "Shanti Stupa"],
    cuisine: ["Skyu", "Thukpa", "Butter Tea", "Tigmo", "Yak Cheese"],
    neighborhoods: [
      { name: "Leh Old Town", vibe: "Tibetan prayer flags, mudbrick stupas, Leh Palace" },
      { name: "Changspa", vibe: "Garden bakeries, trekking gear shops, cozy cafes" },
    ],
  },

  // ── West India ───────────────────────────────────────────────────────────
  mumbai: {
    cityName: "Mumbai",
    country: "India",
    region: "West India",
    costIndex: 85.0,
    popularity: 99,
    dailyBudget: 4500,
    bestSeason: "Nov – Feb",
    climate: "Tropical wet and dry",
    vibes: ["Futuristic & Modern", "Coastal & Beach", "Nightlife", "Historic & Cultural"],
    image: "https://images.pexels.com/photos/5414582/pexels-photo-5414582.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The city of dreams, home to Bollywood, grand Victorian architecture, and street food markets along the Arabian Sea.",
    landmarks: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Colaba Causeway", "CST Station"],
    cuisine: ["Vada Pav", "Pav Bhaji", "Bombay Sandwich", "Irani Bun Maska", "Koli Seafood"],
    neighborhoods: [
      { name: "Bandra West", vibe: "Sea links, celebrity homes, fashionable indie cafes" },
      { name: "Colaba & Fort", vibe: "Victorian Gothic architecture, art galleries, seaside views" },
    ],
  },
  goa: {
    cityName: "Goa",
    country: "India",
    region: "West India",
    costIndex: 75.0,
    popularity: 99,
    dailyBudget: 3000,
    bestSeason: "Nov – Feb",
    climate: "Tropical monsoon",
    vibes: ["Coastal & Beach", "Nightlife", "Nature & Adventure", "Romantic"],
    image: "https://images.pexels.com/photos/11438923/pexels-photo-11438923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "India's pocket-sized beach paradise with golden sands, Portuguese colonial forts, vibrant parties, and relaxed susegad.",
    landmarks: ["Baga Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fort Aguada", "Anjuna Market"],
    cuisine: ["Goan Fish Curry", "Pork Vindaloo", "Bebinca", "Prawn Balchao", "Feni"],
    neighborhoods: [
      { name: "North Goa", vibe: "Sunset cliff bars, beach parties, flea markets, watersports" },
      { name: "South Goa", vibe: "Quiet white sands, luxury heritage resorts, backwaters" },
    ],
  },
  udaipur: {
    cityName: "Udaipur",
    country: "India",
    region: "West India",
    costIndex: 85.0,
    popularity: 97,
    dailyBudget: 3500,
    bestSeason: "Sep – Mar",
    climate: "Hot semi-arid",
    vibes: ["Romantic", "Historic & Cultural", "Art & Architecture"],
    image: "https://images.pexels.com/photos/33658452/pexels-photo-33658452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The City of Lakes, considered India's most romantic destination with floating marble palaces and boat cruises.",
    landmarks: ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon Ki Bari", "Fateh Sagar Lake"],
    cuisine: ["Dal Baati Churma", "Ker Sangri", "Gatte Ki Sabzi", "Mawa Kachori"],
    neighborhoods: [
      { name: "Lal Ghat & Chandpole", vibe: "Rooftop lakefront restaurants, heritage havelis" },
      { name: "Fateh Sagar", vibe: "Evening promenade, boating, sunset street food" },
    ],
  },
  jodhpur: {
    cityName: "Jodhpur",
    country: "India",
    region: "West India",
    costIndex: 65.0,
    popularity: 93,
    dailyBudget: 2200,
    bestSeason: "Oct – Mar",
    climate: "Hot arid",
    vibes: ["Historic & Cultural", "Romantic", "Art & Architecture"],
    image: "https://images.pexels.com/photos/27992777/pexels-photo-27992777.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The Blue City, crowned by the towering Mehrangarh Fort rising above a sea of vibrant indigo-painted houses.",
    landmarks: ["Mehrangarh Fort", "Jaswant Thada", "Umaid Bhawan Palace", "Toorji Stepwell"],
    cuisine: ["Mirchi Vada", "Mawa Kachori", "Pyaaz Kachori", "Gulab Jamun Sabzi"],
    neighborhoods: [
      { name: "Navchokiya", vibe: "Cobblestone alleys with vibrant blue Brahmin houses" },
      { name: "Sardar Market", vibe: "Clock tower, spice bazaars, handcrafted textiles" },
    ],
  },
  jaisalmer: {
    cityName: "Jaisalmer",
    country: "India",
    region: "West India",
    costIndex: 72.0,
    popularity: 94,
    dailyBudget: 2600,
    bestSeason: "Oct – Mar",
    climate: "Desert arid",
    vibes: ["Historic & Cultural", "Nature & Adventure", "Romantic"],
    image: "https://images.pexels.com/photos/35130760/pexels-photo-35130760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The Golden City, famous for its living golden sandstone fort, desert dunes, camel safaris, and merchant havelis.",
    landmarks: ["Jaisalmer Fort", "Sam Sand Dunes", "Patwon Ki Haveli", "Gadisar Lake"],
    cuisine: ["Ker Sangri", "Laal Maas", "Gatte Ki Khichdi", "Bhutte Ka Kees"],
    neighborhoods: [
      { name: "Sonar Qila", vibe: "Living medieval fort, Jain temples, rooftop cafes" },
      { name: "Sam Dunes", vibe: "Desert glamping, folk dances, starry campfires" },
    ],
  },
  pune: {
    cityName: "Pune",
    country: "India",
    region: "West India",
    costIndex: 68.0,
    popularity: 91,
    dailyBudget: 2400,
    bestSeason: "Oct – Mar",
    climate: "Semi-arid",
    vibes: ["Historic & Cultural", "Foodie & Culinary", "Nightlife"],
    image: "https://images.pexels.com/photos/14466391/pexels-photo-14466391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The cultural capital of Maharashtra, known for Maratha forts, educational institutions, and craft breweries.",
    landmarks: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Osho Ashram"],
    cuisine: ["Misal Pav", "Puneri Poha", "Bhakarwadi", "Mango Mastani"],
    neighborhoods: [
      { name: "Koregaon Park", vibe: "Lush banyan avenues, European bakeries, microbreweries" },
      { name: "FC Road", vibe: "Student hub, bookstores, Irani cafes, vibrant shopping" },
    ],
  },
  ahmedabad: {
    cityName: "Ahmedabad",
    country: "India",
    region: "West India",
    costIndex: 60.0,
    popularity: 91,
    dailyBudget: 2100,
    bestSeason: "Oct – Mar",
    climate: "Semi-arid",
    vibes: ["Historic & Cultural", "Foodie & Culinary", "Shopping"],
    image: "https://images.pexels.com/photos/38319031/pexels-photo-38319031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "UNESCO World Heritage City celebrated for intricately carved pols, Sabarmati Ashram, and vegetarian food culture.",
    landmarks: ["Sabarmati Ashram", "Adalaj Stepwell", "Sidi Saiyyed Mosque", "Riverfront"],
    cuisine: ["Gujarati Thali", "Khaman Dhokla", "Khandvi", "Fafda Jalebi"],
    neighborhoods: [
      { name: "Old Walled City", vibe: "Traditional wooden pols, secret courtyards, night food market" },
      { name: "SG Highway", vibe: "Modern malls, high-end Gujarati thalis, boutique cafes" },
    ],
  },

  // ── South India ──────────────────────────────────────────────────────────
  bengaluru: {
    cityName: "Bengaluru",
    country: "India",
    region: "South India",
    costIndex: 82.0,
    popularity: 96,
    dailyBudget: 3200,
    bestSeason: "Oct – Mar",
    climate: "Tropical savanna",
    vibes: ["Futuristic & Modern", "Foodie & Culinary", "Nightlife"],
    image: "https://images.pexels.com/photos/14845309/pexels-photo-14845309.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The Garden City and Silicon Valley of India, celebrated for microbreweries, leafy parks, and South Indian tiffin culture.",
    landmarks: ["Lalbagh Botanical Garden", "Cubbon Park", "Bangalore Palace", "Tipu Sultan's Palace"],
    cuisine: ["Filter Coffee", "Crispy Masala Dosa", "Craft IPA Beer", "Bisi Bele Bath"],
    neighborhoods: [
      { name: "Indiranagar", vibe: "Microbreweries, high-end boutiques, artisan brunch cafes" },
      { name: "Koramangala", vibe: "Startup offices, nightlife hotspots, global dining" },
    ],
  },
  kochi: {
    cityName: "Kochi",
    country: "India",
    region: "South India",
    costIndex: 65.0,
    popularity: 95,
    dailyBudget: 2200,
    bestSeason: "Sep – Mar",
    climate: "Tropical monsoon",
    vibes: ["Coastal & Beach", "Nature & Adventure", "Historic & Cultural"],
    image: "https://images.pexels.com/photos/36874163/pexels-photo-36874163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Kerala's Queen of the Arabian Sea with Chinese fishing nets, colonial Portuguese villas, spice warehouses, and Kathakali.",
    landmarks: ["Chinese Fishing Nets", "Fort Kochi", "Mattancherry Palace", "Jew Town Synagogue"],
    cuisine: ["Karimeen Pollichathu", "Appam with Stew", "Puttu & Kadala", "Kerala Parotta"],
    neighborhoods: [
      { name: "Fort Kochi", vibe: "Art cafes, colonial churches, seaside promenades, Biennale art" },
      { name: "Jew Town", vibe: "Antique shops, aromatic spice stores, handmade perfumes" },
    ],
  },
  munnar: {
    cityName: "Munnar",
    country: "India",
    region: "South India",
    costIndex: 62.0,
    popularity: 96,
    dailyBudget: 2400,
    bestSeason: "Sep – May",
    climate: "Subtropical highland",
    vibes: ["Nature & Adventure", "Romantic", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/12530868/pexels-photo-12530868.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Misty hill station in Kerala enveloped by rolling tea plantations, exotic Neelakurinji blooms, and cascading waterfalls.",
    landmarks: ["Eravikulam National Park", "Mattupetty Dam", "Anamudi Peak", "Tea Museum"],
    cuisine: ["Cardamom Spiced Tea", "Kerala Sadhya", "Appam", "Banana Fritters"],
    neighborhoods: [
      { name: "Tea Plantations Valley", vibe: "Lush tea estates, estate bungalows, mountain views" },
      { name: "Old Munnar Town", vibe: "Spice bazaars, chocolate shops, local tea stalls" },
    ],
  },
  alleppey: {
    cityName: "Alleppey",
    country: "India",
    region: "South India",
    costIndex: 68.0,
    popularity: 96,
    dailyBudget: 2800,
    bestSeason: "Sep – Mar",
    climate: "Tropical monsoon",
    vibes: ["Coastal & Beach", "Romantic", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/31746351/pexels-photo-31746351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Venice of the East, famed for traditional thatched houseboat cruises cruising through tranquil palm-fringed backwaters.",
    landmarks: ["Vembanad Lake", "Alappuzha Beach", "Marari Beach", "Kuttanad Rice Paddies"],
    cuisine: ["Backwater Fish Fry", "Duck Roast", "Kappa & Meen Curry", "Toddy Shop Delicacies"],
    neighborhoods: [
      { name: "Punnamada Backwaters", vibe: "Houseboat docks, snake boat race venue, serene canals" },
      { name: "Marari Coast", vibe: "Tranquil sandy beaches, coconut groves, eco-resorts" },
    ],
  },
  mysore: {
    cityName: "Mysore",
    country: "India",
    region: "South India",
    costIndex: 58.0,
    popularity: 93,
    dailyBudget: 2000,
    bestSeason: "Oct – Mar",
    climate: "Tropical savanna",
    vibes: ["Historic & Cultural", "Foodie & Culinary", "Romantic"],
    image: "https://images.pexels.com/photos/34962788/pexels-photo-34962788.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The Heritage City of Karnataka, famous for the illuminated Mysore Palace, sandalwood craft, silk, and Dasara festival.",
    landmarks: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens", "St. Philomena's Cathedral"],
    cuisine: ["Mysore Pak", "Mysore Masala Dosa", "Mylari Dosa", "Filter Coffee"],
    neighborhoods: [
      { name: "Palace Environs", vibe: "Illuminated arches, tonga horse carriage rides, royal gates" },
      { name: "Devaraja Market", vibe: "Fresh flowers, incense, sandalwood oils, colorful pyramids" },
    ],
  },
  chennai: {
    cityName: "Chennai",
    country: "India",
    region: "South India",
    costIndex: 68.0,
    popularity: 92,
    dailyBudget: 2300,
    bestSeason: "Nov – Feb",
    climate: "Tropical wet and dry",
    vibes: ["Historic & Cultural", "Coastal & Beach", "Foodie & Culinary"],
    image: "https://images.pexels.com/photos/9432498/pexels-photo-9432498.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Cultural capital of South India, renowned for classical Carnatic music, Dravidian temples, and long Marina Beach.",
    landmarks: ["Kapaleeshwarar Temple", "Marina Beach", "San Thome Cathedral", "DakshinaChitra"],
    cuisine: ["Filter Coffee", "Chettinad Chicken", "Ghee Roast Dosa", "Idli Vada Sambar"],
    neighborhoods: [
      { name: "Mylapore", vibe: "Ancient Dravidian temples, silk saree shops, Carnatic sabhas" },
      { name: "Besant Nagar", vibe: "Promenade beach, breezy sunset cafes, seafood snack stalls" },
    ],
  },
  hyderabad: {
    cityName: "Hyderabad",
    country: "India",
    region: "South India",
    costIndex: 70.0,
    popularity: 95,
    dailyBudget: 2500,
    bestSeason: "Oct – Mar",
    climate: "Tropical wet and dry",
    vibes: ["Historic & Cultural", "Foodie & Culinary", "Futuristic & Modern"],
    image: "https://images.pexels.com/photos/30383863/pexels-photo-30383863.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The City of Pearls, where Nizami grandeur and aromatic Dum Biryani meet the bustling tech skyline of HITEC City.",
    landmarks: ["Charminar", "Golconda Fort", "Chowmahalla Palace", "Hussain Sagar Lake"],
    cuisine: ["Hyderabadi Dum Biryani", "Haleem", "Double Ka Meetha", "Irani Chai with Osmania Biscuits"],
    neighborhoods: [
      { name: "Old City (Charminar)", vibe: "Pearl bazaars, lacquer bangles, historic biryani restaurants" },
      { name: "Jubilee Hills", vibe: "Upscale breweries, gourmet restaurants, contemporary lounges" },
    ],
  },
  pondicherry: {
    cityName: "Pondicherry",
    country: "India",
    region: "South India",
    costIndex: 65.0,
    popularity: 94,
    dailyBudget: 2200,
    bestSeason: "Oct – Mar",
    climate: "Tropical wet and dry",
    vibes: ["Romantic", "Coastal & Beach", "Zen & Relaxation", "Historic & Cultural"],
    image: "https://images.pexels.com/photos/38199872/pexels-photo-38199872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "French Riviera of the East, characterized by mustard-yellow colonial villas, seaside boulevards, and Auroville.",
    landmarks: ["Promenade Beach", "Auroville & Matrimandir", "Sri Aurobindo Ashram", "French White Town"],
    cuisine: ["French Croissants", "Crepes", "South Indian Seafood", "Wood-fired Pizza"],
    neighborhoods: [
      { name: "White Town", vibe: "Bicycle-friendly colonial French streets, boutique cafes" },
      { name: "Auroville", vibe: "Universal spiritual township, forest retreats, organic bakeries" },
    ],
  },
  ooty: {
    cityName: "Ooty",
    country: "India",
    region: "South India",
    costIndex: 62.0,
    popularity: 92,
    dailyBudget: 2300,
    bestSeason: "Mar – Jun & Sep – Nov",
    climate: "Subtropical highland",
    vibes: ["Nature & Adventure", "Romantic", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/35866210/pexels-photo-35866210.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Queen of Nilgiris featuring misty eucalyptus hills, botanical rose gardens, Nilgiri Mountain Toy Train, and tea estates.",
    landmarks: ["Ooty Lake", "Nilgiri Mountain Railway", "Doddabetta Peak", "Botanical Gardens"],
    cuisine: ["Homemade Chocolates", "Nilgiri Tea", "Varkey", "South Indian Meals"],
    neighborhoods: [
      { name: "Charing Cross", vibe: "Town center, chocolate shops, bakeries, woolen stalls" },
      { name: "Fernhill & Lovedale", vibe: "Quiet tea estates, heritage bungalows, scenic walks" },
    ],
  },
  hampi: {
    cityName: "Hampi",
    country: "India",
    region: "South India",
    costIndex: 48.0,
    popularity: 94,
    dailyBudget: 1700,
    bestSeason: "Oct – Mar",
    climate: "Hot semi-arid",
    vibes: ["Historic & Cultural", "Nature & Adventure", "Budget Friendly"],
    image: "https://images.pexels.com/photos/31468455/pexels-photo-31468455.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "UNESCO World Heritage Site with mesmerizing boulder-strewn landscapes and magnificent ruins of the Vijayanagara Empire.",
    landmarks: ["Virupaksha Temple", "Vijaya Vittala Stone Chariot", "Matanga Hill Sunrise", "Lotus Mahal"],
    cuisine: ["South Indian Thali", "Filter Coffee", "Mango Lassi", "Wood-fired Pizza"],
    neighborhoods: [
      { name: "Hampi Bazaar", vibe: "Ancient market colonnade, temple chants, river crossings" },
      { name: "Hippie Island", vibe: "Paddy fields, boulder climbing, riverside chill cafes" },
    ],
  },

  // ── East & Northeast India ────────────────────────────────────────────────
  kolkata: {
    cityName: "Kolkata",
    country: "India",
    region: "East India",
    costIndex: 58.0,
    popularity: 95,
    dailyBudget: 2000,
    bestSeason: "Oct – Mar",
    climate: "Tropical wet and dry",
    vibes: ["Historic & Cultural", "Foodie & Culinary", "Art & Architecture", "Budget Friendly"],
    image: "https://images.pexels.com/photos/30731597/pexels-photo-30731597.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The City of Joy and cultural capital of India, filled with grand colonial monuments, vintage trams, and legendary sweets.",
    landmarks: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Kali Temple", "Park Street"],
    cuisine: ["Kolkata Kathi Roll", "Hilsa Fish Curry", "Rosogolla", "Mishti Doi", "Puchka"],
    neighborhoods: [
      { name: "College Street", vibe: "World's largest book market, Indian Coffee House, heritage" },
      { name: "Park Street", vibe: "Iconic colonial dining, live music pubs, nightlife" },
    ],
  },
  darjeeling: {
    cityName: "Darjeeling",
    country: "India",
    region: "East India",
    costIndex: 65.0,
    popularity: 94,
    dailyBudget: 2200,
    bestSeason: "Mar – May & Sep – Nov",
    climate: "Subtropical highland",
    vibes: ["Nature & Adventure", "Romantic", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/10440716/pexels-photo-10440716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Himalayan hill town renowned for its UNESCO Toy Train, sloping tea gardens, and panoramas of Mount Kangchenjunga.",
    landmarks: ["Tiger Hill", "Batasia Loop", "Peace Pagoda", "Happy Valley Tea Estate"],
    cuisine: ["Steamed Momos", "Thukpa", "Darjeeling Tea", "Churpee Cheese"],
    neighborhoods: [
      { name: "The Mall", vibe: "Pedestrian promenade, colonial bakeries, horse rides" },
      { name: "Happy Valley", vibe: "Lush terraced tea gardens and heritage processing walks" },
    ],
  },
  shillong: {
    cityName: "Shillong",
    country: "India",
    region: "East & Northeast",
    costIndex: 60.0,
    popularity: 92,
    dailyBudget: 2100,
    bestSeason: "Sep – May",
    climate: "Subtropical highland",
    vibes: ["Nature & Adventure", "Romantic", "Zen & Relaxation"],
    image: "https://images.pexels.com/photos/35079186/pexels-photo-35079186.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Scotland of the East, featuring pine-covered rolling hills, cascading waterfalls, live rock music, and crystal clear lakes.",
    landmarks: ["Elephant Falls", "Umiam Lake", "Shillong Peak", "Laitlum Canyons"],
    cuisine: ["Jadoh", "Dohneiiong", "Momos", "Tungrymbai"],
    neighborhoods: [
      { name: "Police Bazar", vibe: "Bustling retail center with Khasi traditional handlooms" },
      { name: "Laitumkhrah", vibe: "College quarter, rock music diners, indie coffee joints" },
    ],
  },
  gangtok: {
    cityName: "Gangtok",
    country: "India",
    region: "East & Northeast",
    costIndex: 68.0,
    popularity: 93,
    dailyBudget: 2400,
    bestSeason: "Mar – Jun & Sep – Dec",
    climate: "Subtropical highland",
    vibes: ["Nature & Adventure", "Spiritual & Wellness", "Romantic"],
    image: "https://images.pexels.com/photos/14916663/pexels-photo-14916663.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Clean, scenic capital of Sikkim perched on cloud-wrapped ridges overlooking Mount Kanchenjunga.",
    landmarks: ["Rumtek Monastery", "Tsomgo Lake", "Nathula Pass", "MG Marg"],
    cuisine: ["Sikkimese Momos", "Thukpa", "Phagshapa", "Tongba Millet Drink"],
    neighborhoods: [
      { name: "MG Marg", vibe: "Pedestrianized European-style flower-lined promenade" },
      { name: "Rumtek Valley", vibe: "Ancient Buddhist monasteries with chanting monks" },
    ],
  },
  puri: {
    cityName: "Puri",
    country: "India",
    region: "East India",
    costIndex: 50.0,
    popularity: 91,
    dailyBudget: 1700,
    bestSeason: "Oct – Mar",
    climate: "Tropical",
    vibes: ["Historic & Cultural", "Spiritual & Wellness", "Coastal & Beach"],
    image: "https://images.pexels.com/photos/33518945/pexels-photo-33518945.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Holy coastal city on the Bay of Bengal, home to the sacred Jagannath Temple, golden beaches, and the Konark Sun Temple nearby.",
    landmarks: ["Jagannath Temple", "Golden Beach", "Konark Sun Temple", "Chilika Lake"],
    cuisine: ["Mahaprasad", "Khaja", "Chhena Poda", "Crab & Prawn Curry"],
    neighborhoods: [
      { name: "Grand Road", vibe: "Temple procession street, sacred souvenir markets" },
      { name: "Marine Drive Coast", vibe: "Golden sandy beaches, lighthouse, sunrise viewpoints" },
    ],
  },

  // ── Central India ────────────────────────────────────────────────────────
  khajuraho: {
    cityName: "Khajuraho",
    country: "India",
    region: "Central India",
    costIndex: 55.0,
    popularity: 93,
    dailyBudget: 1900,
    bestSeason: "Oct – Mar",
    climate: "Subtropical",
    vibes: ["Historic & Cultural", "Art & Architecture", "Romantic"],
    image: "https://images.pexels.com/photos/36558371/pexels-photo-36558371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "UNESCO World Heritage Site famed for magnificent medieval Chandela temple complexes and exquisite stone sculptures.",
    landmarks: ["Kandariya Mahadeva Temple", "Western Group of Temples", "Raneh Falls", "Panna National Park"],
    cuisine: ["Dal Bafla", "Jalebi Rabdi", "Bhutte Ka Kees", "Malpua"],
    neighborhoods: [
      { name: "Western Temple Enclave", vibe: "Sculptured monument parks, evening sound and light show" },
      { name: "Old Village", vibe: "Rural stone houses, handicrafts, local clay art studios" },
    ],
  },
  bhopal: {
    cityName: "Bhopal",
    country: "India",
    region: "Central India",
    costIndex: 52.0,
    popularity: 89,
    dailyBudget: 1800,
    bestSeason: "Oct – Mar",
    climate: "Humid subtropical",
    vibes: ["Historic & Cultural", "Nature & Adventure", "Foodie & Culinary"],
    image: "https://images.pexels.com/photos/35424480/pexels-photo-35424480.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "The City of Lakes in Madhya Pradesh, with twin artificial lakes, grand mosques, and Sanchi Stupa nearby.",
    landmarks: ["Upper Lake (Bada Talab)", "Taj-ul-Masajid", "Sanchi Stupa", "Bhimbetka Caves"],
    cuisine: ["Bhopali Gosht Korma", "Poha Jalebi", "Biryani", "Sulaimani Chai"],
    neighborhoods: [
      { name: "Upper Lake Drive", vibe: "Lakefront boat club, tranquil sunset promenades" },
      { name: "Old City Chowk", vibe: "Mughal mosques, antique silver jewelry, street food" },
    ],
  },
};

const ALL_INDIAN_DESTINATIONS = Object.values(INDIAN_CITIES_KNOWLEDGEBASE);

const REGIONS = [
  "All India",
  "North India",
  "West India",
  "South India",
  "East & Northeast",
  "Central India",
];

const VIBES = [
  "All Vibes",
  "Historic & Cultural",
  "Romantic",
  "Coastal & Beach",
  "Nature & Adventure",
  "Foodie & Culinary",
  "Spiritual & Wellness",
  "Zen & Relaxation",
  "Futuristic & Modern",
  "Budget Friendly",
];

const COST_FILTERS = [
  { label: "All Budgets", value: "all" },
  { label: "Budget (₹1.5k–2k)", value: "budget", max: 55 },
  { label: "Moderate (₹2k–3k)", value: "moderate", min: 55, max: 75 },
  { label: "Upscale (₹3k–4k)", value: "upscale", min: 75, max: 85 },
  { label: "Luxury (₹4k+)", value: "luxury", min: 85 },
];

function enrichCityData(rawCity) {
  const cleanName = (rawCity.cityName || "").trim().toLowerCase();
  const matchedKb = INDIAN_CITIES_KNOWLEDGEBASE[cleanName];

  // Default region derivation for Indian spots
  let region = rawCity.region || matchedKb?.region;
  if (!region || region === "India" || region === "International") {
    if (/mumbai|goa|udaipur|jodhpur|jaisalmer|ahmedabad|surat|pune|alibaug|lonavala|mahabaleshwar/.test(cleanName)) region = "West India";
    else if (/delhi|jaipur|agra|varanasi|srinagar|amritsar|rishikesh|manali|leh|shimla|haridwar|mussoorie|nainital|dharamshala/.test(cleanName)) region = "North India";
    else if (/bengaluru|kochi|munnar|chennai|hyderabad|pondicherry|mysore|ooty|hampi|alleppey|coorg|wayanad|kanyakumari|madurai|gokarna|varkala/.test(cleanName)) region = "South India";
    else if (/kolkata|darjeeling|shillong|gangtok|puri|bhubaneswar|cherrapunji|tawang|kaziranga/.test(cleanName)) region = "East & Northeast";
    else if (/khajuraho|bhopal|indore|gwalior|ujjain|pachmarhi/.test(cleanName)) region = "Central India";
    else region = "North India";
  }

  const costIndex = rawCity.costIndex || matchedKb?.costIndex || 60;
  const dailyBudget = matchedKb?.dailyBudget || Math.round(costIndex * 38);

  return {
    id: rawCity.id || cleanName,
    cityName: matchedKb?.cityName || rawCity.cityName,
    country: "India",
    region,
    latitude: rawCity.latitude || matchedKb?.latitude || 0,
    longitude: rawCity.longitude || matchedKb?.longitude || 0,
    costIndex,
    popularity: rawCity.popularity || matchedKb?.popularity || 92,
    dailyBudget,
    bestSeason: rawCity.bestSeason || matchedKb?.bestSeason || "Oct – Mar",
    climate: rawCity.climate || matchedKb?.climate || "Tropical / Subtropical",
    vibes: rawCity.vibes || matchedKb?.vibes || ["Historic & Cultural", "Foodie & Culinary"],
    image:
      matchedKb?.image ||
      rawCity.image ||
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&auto=format&fit=crop&q=80",
    description:
      matchedKb?.description ||
      rawCity.description ||
      `Discover the magnificent culture, spiritual heritage, and local flavors of ${rawCity.cityName}, India.`,
    landmarks: matchedKb?.landmarks || rawCity.landmarks || ["Historic Fort", "Temple Complex", "Local Bazaars"],
    cuisine: matchedKb?.cuisine || rawCity.cuisine || ["Local Thali", "Street Chaat", "Masala Chai"],
    neighborhoods: matchedKb?.neighborhoods || rawCity.neighborhoods || [
      { name: "Old Heritage Quarter", vibe: "Traditional streets, bazaars, and local cuisine" },
      { name: "Civil Lines", vibe: "Peaceful avenues, dining, and scenic promenades" }
    ],
  };
}

export default function CitySearch() {
  const navigate = useNavigate();
  const t = useLanguageStore((state) => state.t);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All India");
  const [selectedVibe, setSelectedVibe] = useState("All Vibes");
  const [selectedCost, setSelectedCost] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  // Comparison State (Max 3 cities)
  const [comparisonList, setComparisonList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Detail Modal State
  const [activeCityDetail, setActiveCityDetail] = useState(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState(new Set());

  // Dynamic Cities from API / Knowledgebase
  const [apiCities, setApiCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Cities dynamically from backend
  useEffect(() => {
    let isCancelled = false;
    const fetchCities = async () => {
      if (!searchQuery.trim()) {
        setApiCities(ALL_INDIAN_DESTINATIONS);
        return;
      }

      setLoading(true);
      try {
        const queryParam = `?q=${encodeURIComponent(searchQuery.trim())}`;
        const data = await api.get(`/cities/search${queryParam}`);
        if (!isCancelled) {
          const list = Array.isArray(data) && data.length > 0 ? data : [];
          setApiCities(list);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("City search error:", err);
          // Fallback to local filter
          const q = searchQuery.toLowerCase();
          const matched = ALL_INDIAN_DESTINATIONS.filter(
            (c) =>
              c.cityName.toLowerCase().includes(q) ||
              c.region.toLowerCase().includes(q) ||
              c.vibes.some((v) => v.toLowerCase().includes(q))
          );
          setApiCities(matched);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    const timer = setTimeout(fetchCities, searchQuery ? 250 : 0);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Load saved wishlist destinations
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await api.get("/users/me/saved-destinations");
        if (Array.isArray(data)) {
          const names = new Set(data.map((d) => d.cityName.toLowerCase()));
          setWishlist(names);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      }
    };
    fetchWishlist();
  }, []);

  const toggleWishlist = async (e, cityName) => {
    e.stopPropagation();
    const cityKey = cityName.toLowerCase();
    const isSaved = wishlist.has(cityKey);

    const updated = new Set(wishlist);
    if (isSaved) updated.delete(cityKey);
    else updated.add(cityKey);
    setWishlist(updated);

    try {
      if (isSaved) {
        const data = await api.get("/users/me/saved-destinations");
        const found = data.find((d) => d.cityName.toLowerCase() === cityKey);
        if (found) await api.delete(`/users/me/saved-destinations/${found.id}`);
      } else {
        await api.post("/users/me/saved-destinations", { cityName });
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  const toggleCompare = (e, city) => {
    e.stopPropagation();
    const cityId = city.id || city.cityName;
    if (comparisonList.some((c) => (c.id || c.cityName) === cityId)) {
      setComparisonList(comparisonList.filter((c) => (c.id || c.cityName) !== cityId));
    } else {
      if (comparisonList.length >= 3) {
        alert("You can compare up to 3 destinations simultaneously.");
        return;
      }
      setComparisonList([...comparisonList, city]);
    }
  };

  // Enriched Indian Cities
  const enrichedCities = useMemo(() => {
    const sourceList = apiCities.length > 0 ? apiCities : ALL_INDIAN_DESTINATIONS;
    return sourceList.map(enrichCityData);
  }, [apiCities]);

  // Filter & Sort Computation
  const filteredCities = useMemo(() => {
    return enrichedCities
      .filter((city) => {
        // Region Filter
        if (selectedRegion !== "All India") {
          if (city.region !== selectedRegion && !city.region.includes(selectedRegion)) {
            return false;
          }
        }

        // Vibe Filter
        if (selectedVibe !== "All Vibes") {
          const vibes = city.vibes || [];
          if (!vibes.some((v) => v.toLowerCase().includes(selectedVibe.toLowerCase()))) {
            return false;
          }
        }

        // Cost Filter
        const costIndex = city.costIndex || 50;
        if (selectedCost !== "all") {
          const conf = COST_FILTERS.find((c) => c.value === selectedCost);
          if (conf?.min && costIndex < conf.min) return false;
          if (conf?.max && costIndex > conf.max) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popularity") return (b.popularity || 0) - (a.popularity || 0);
        if (sortBy === "cost-asc") return (a.dailyBudget || 0) - (b.dailyBudget || 0);
        if (sortBy === "cost-desc") return (b.dailyBudget || 0) - (a.dailyBudget || 0);
        if (sortBy === "name") return (a.cityName || "").localeCompare(b.cityName || "");
        return 0;
      });
  }, [enrichedCities, selectedRegion, selectedVibe, selectedCost, sortBy]);

  const getCostTier = (costIndex = 50) => {
    if (costIndex < 55) return { label: "₹", name: "Budget-Friendly", color: "text-emerald-500" };
    if (costIndex < 75) return { label: "₹₹", name: "Moderate", color: "text-blue-500" };
    if (costIndex < 85) return { label: "₹₹₹", name: "Upscale", color: "text-amber-500" };
    return { label: "₹₹₹₹", name: "Luxury Tier", color: "text-purple-500" };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-24 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Discovery Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
<<<<<<< HEAD
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Incredible India</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("destinationsInIndia")} 🇮🇳
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {t("discoverIndiaSub")}
            </p>

            {/* Global Search Bar */}
            <div className="relative max-w-xl pt-2">
              <Search className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder={t("searchDestinationsPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-9 h-12 bg-background/90 text-sm shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
=======
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-medium text-sky-700">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Explore Top Destinations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
              Explore & Compare Cities 🌍
            </h1>

            <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-normal">
              Discover your next destination across India and beyond. Filter by regional climate, estimated daily budget, and cultural landmarks to plan your perfect trip.
            </p>

            {/* High Contrast Prominent Search Bar */}
            <div className="pt-2 max-w-2xl">
              <div className="relative flex items-center bg-slate-50 hover:bg-white focus-within:bg-white border-2 border-slate-200 focus-within:border-sky-500 rounded-2xl shadow-xs transition-all">
                <Search className="w-5 h-5 text-sky-500 absolute left-4 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by city, state, vibe (e.g. 'Jaipur', 'temples', 'beaches')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 h-14 bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 border-none outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
            </div>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-5">
          {/* Row 1: Region Tabs & Sort */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Region Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
                Region:
              </span>
              {REGIONS.map((region) => {
                const active = selectedRegion === region;
                const regionLabel =
                  region === "All India"
                    ? t("allIndia")
                    : region === "North India"
                    ? t("northIndia")
                    : region === "West India"
                    ? t("westIndia")
                    : region === "South India"
                    ? t("southIndia")
                    : region === "East & Northeast"
                    ? t("eastIndia")
                    : region === "Central India"
                    ? t("centralIndia")
                    : region;
                return (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
<<<<<<< HEAD
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
=======
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 cursor-pointer ${
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                      active
                        ? "bg-sky-500 text-white font-medium shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {regionLabel}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto">
<<<<<<< HEAD
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t("filters")}:
=======
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-sky-500" />
                Sort:
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="popularity">Popularity (High to Low)</option>
                <option value="cost-asc">Daily Cost (Budget First)</option>
                <option value="cost-desc">Daily Cost (Luxury First)</option>
                <option value="name">City Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Vibe Filter Chips */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Vibes:
            </span>
            {VIBES.map((vibe) => {
              const active = selectedVibe === vibe;
              return (
                <button
                  key={vibe}
                  onClick={() => setSelectedVibe(vibe)}
<<<<<<< HEAD
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
=======
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                    active
                      ? "bg-slate-900 text-white font-medium shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>

          {/* Row 3: Cost Level Filter */}
<<<<<<< HEAD
          <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              {t("budgetPerDay")}:
=======
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-sm">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-sky-500" />
              Cost Tier:
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
            </span>
            <div className="flex items-center gap-2 overflow-x-auto">
              {COST_FILTERS.map((cost) => (
                <button
                  key={cost.value}
                  onClick={() => setSelectedCost(cost.value)}
<<<<<<< HEAD
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
=======
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                    selectedCost === cost.value
                      ? "bg-sky-50 text-sky-700 border border-sky-300 font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cost.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
<<<<<<< HEAD
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">{t("destinationsInIndia")}</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {filteredCities.length} {t("matchingResults")}
=======
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Available Destinations</h2>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              {filteredCities.length} {filteredCities.length === 1 ? "City" : "Cities"}
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
            </span>
          </div>

          {(searchQuery || selectedRegion !== "All India" || selectedVibe !== "All Vibes" || selectedCost !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("All India");
                setSelectedVibe("All Vibes");
                setSelectedCost("all");
              }}
<<<<<<< HEAD
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
=======
              className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
            >
              {t("clearAll")}
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground font-medium">{t("searchDestinationsPlaceholder")}</p>
          </div>
        ) : filteredCities.length > 0 ? (
          /* City Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => {
              const cityKey = (city.cityName || "").toLowerCase();
              const isWishlisted = wishlist.has(cityKey);
              const isCompared = comparisonList.some((c) => (c.id || c.cityName) === (city.id || city.cityName));
              const costTier = getCostTier(city.costIndex);
              const displayBudget = `~₹${(city.dailyBudget || 2500).toLocaleString("en-IN")}/day`;

              return (
<<<<<<< HEAD
                <Card
                  key={city.id || city.cityName}
=======
                <div
                  key={city.id}
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                  onClick={() => setActiveCityDetail(city)}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Banner */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <img
                        src={city.image}
                        alt={city.cityName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
<<<<<<< HEAD
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20">
                          {city.popularity || 92}% {t("travelerMatch")}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => toggleWishlist(e, city.cityName)}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                              isWishlisted
                                ? "bg-rose-500 text-white border-rose-400 scale-110 shadow-xs"
                                : "bg-black/40 text-white border-white/20 hover:bg-black/60"
                            }`}
                            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                          </button>
                        </div>
=======
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/50 text-white border border-white/20">
                          {city.popularity}% Match
                        </span>

                        <button
                          onClick={(e) => toggleWishlist(e, city.cityName)}
                          className={`p-2 rounded-full border transition-all cursor-pointer ${
                            isWishlisted
                              ? "bg-rose-500 text-white border-rose-400 scale-110 shadow-xs"
                              : "bg-black/50 text-white border-white/20 hover:bg-black/70"
                          }`}
                          title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                        </button>
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                      </div>

                      {/* Bottom Banner City Identity */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-2xl tracking-tight leading-none">
                            {city.cityName}
                          </h3>
<<<<<<< HEAD
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 ${costTier.color}`}>
                            {displayBudget}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span>{city.region}, India</span>
=======
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 border border-white/20 ${costTier.color}`}>
                            ~₹{city.dailyBudget}/day
                          </span>
                        </div>
                        <p className="text-xs text-white/90 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <span>{city.country} • {city.region}</span>
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                        </p>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3.5">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {city.description}
                      </p>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {(city.vibes || ["Historic & Cultural", "Foodie"]).slice(0, 3).map((v) => (
                          <span
                            key={v}
                            className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700"
                          >
                            {v}
                          </span>
                        ))}
                      </div>

                      {/* Landmarks Mini-list */}
<<<<<<< HEAD
                      {city.landmarks && city.landmarks.length > 0 && (
                        <div className="pt-2 border-t border-border/40 text-xs space-y-1">
                          <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Landmark className="w-3 h-3 text-primary" />
                            {t("topSights")}:
                          </span>
                          <p className="text-xs font-medium text-foreground/90 truncate">
                            {city.landmarks.join(" • ")}
                          </p>
                        </div>
                      )}
                    </CardContent>
=======
                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Landmark className="w-3.5 h-3.5 text-sky-500" />
                          Iconic Sights:
                        </span>
                        <p className="text-xs font-medium text-slate-800 truncate">
                          {city.landmarks.join(" • ")}
                        </p>
                      </div>
                    </div>
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0 mt-1 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => toggleCompare(e, city)}
<<<<<<< HEAD
                      className={`text-xs gap-1.5 shrink-0 cursor-pointer ${isCompared ? "border-primary text-primary" : ""}`}
=======
                      className={`text-xs gap-1.5 shrink-0 rounded-lg cursor-pointer ${
                        isCompared ? "border-sky-500 text-sky-600 bg-sky-50" : "border-slate-200 text-slate-700"
                      }`}
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isCompared ? t("comparing") : t("compare")}</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trips/new?name=${encodeURIComponent("Explore " + city.cityName)}&city=${encodeURIComponent(city.cityName)}`);
                      }}
<<<<<<< HEAD
                      className="flex-1 text-xs gap-1 cursor-pointer"
=======
                      className="flex-1 text-xs gap-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium cursor-pointer shadow-xs"
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
                    >
                      <span>{t("planTrip")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty / No Match State */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
<<<<<<< HEAD
              <h3 className="font-bold text-lg">{t("noDestinationsFound")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("tryResettingFilters")}
=======
              <h3 className="font-semibold text-lg text-slate-900">No destinations match your filters</h3>
              <p className="text-xs text-slate-500">
                Try widening your cost tier, switching region tabs, or clearing your keyword search.
>>>>>>> 3235c71 (feat(ui): enhance Explore Cities search and filters, enlarge dashboard popular destinations, and improve font hierarchy)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("All India");
                setSelectedVibe("All Vibes");
                setSelectedCost("all");
              }}
              className="rounded-xl border-slate-200 text-slate-700 font-medium cursor-pointer"
            >
              {t("clearAll")}
            </Button>
          </div>
        )}
      </main>

      {/* Floating Comparison Drawer Indicator */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/95 border border-primary/40 shadow-2xl backdrop-blur-md rounded-2xl p-3 sm:px-6 flex items-center gap-4 animate-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground">
              Comparing ({comparisonList.length}/3 Indian Destinations)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {comparisonList.map((c) => (
              <span
                key={c.id || c.cityName}
                className="text-[11px] font-semibold bg-secondary px-2.5 py-1 rounded-lg border border-border flex items-center gap-1.5"
              >
                <span>{c.cityName}</span>
                <button
                  onClick={(e) => toggleCompare(e, c)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setShowCompareModal(true)}
            className="text-xs shadow-xs font-semibold cursor-pointer ml-1"
          >
            Compare Matrix
          </Button>
        </div>
      )}

      {/* Comparison Modal View */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight">Side-by-Side Destination Comparison</h3>
                <p className="text-xs text-muted-foreground">Compare estimated travel costs, best seasons, local dishes, and iconic sights in INR</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCompareModal(false)}
                className="rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Comparison Grid Table */}
            <div className={`grid grid-cols-1 md:grid-cols-${comparisonList.length} gap-6`}>
              {comparisonList.map((city) => (
                <div key={city.id || city.cityName} className="space-y-4 border border-border/60 p-4 rounded-2xl bg-secondary/30">
                  {/* City Card Image */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden">
                    <img src={city.image} alt={city.cityName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white">
                      <h4 className="font-bold text-lg">{city.cityName}</h4>
                      <p className="text-xs text-white/80">{city.region}, India</p>
                    </div>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Estimated Budget</span>
                      <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        ~₹{(city.dailyBudget || 2500).toLocaleString("en-IN")} / day (Index {city.costIndex}/100)
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Best Season</span>
                      <p className="font-medium text-foreground">{city.bestSeason || "Oct – Mar"}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Primary Vibes</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(city.vibes || ["Historic & Cultural"]).map((v) => (
                          <span key={v} className="text-[10px] px-2 py-0.5 rounded bg-background border border-border">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Top Landmark</span>
                      <p className="font-medium text-foreground">{(city.landmarks && city.landmarks[0]) || "Heritage Fort"}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Signature Dishes</span>
                      <p className="font-medium text-foreground">{(city.cuisine && city.cuisine.slice(0, 2).join(", ")) || "Local Specialties"}</p>
                    </div>
                  </div>

                  {/* Plan CTA */}
                  <Button
                    size="sm"
                    className="w-full text-xs gap-1 pt-2 cursor-pointer"
                    onClick={() => {
                      setShowCompareModal(false);
                      navigate(`/trips/new?name=${encodeURIComponent("Explore " + city.cityName)}&city=${encodeURIComponent(city.cityName)}`);
                    }}
                  >
                    <span>Plan {city.cityName} Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* City Detail Modal View */}
      {activeCityDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-muted">
              <img
                src={activeCityDetail.image}
                alt={activeCityDetail.cityName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <button
                onClick={() => setActiveCityDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-black">{activeCityDetail.cityName}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                    {activeCityDetail.popularity || 92}% Match
                  </span>
                </div>
                <p className="text-xs text-white/80">
                  {activeCityDetail.region}, India
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeCityDetail.description}
            </p>

            {/* Travel Logistics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                  {t("estimatedDailyBudget")}
                </span>
                <p className="font-bold text-sm text-foreground">
                  ~₹{(activeCityDetail.dailyBudget || 2500).toLocaleString("en-IN")} / day
                </p>
                <p className="text-[10px] text-muted-foreground">{t("costIndex")}: {activeCityDetail.costIndex}/100</p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 space-y-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {t("bestSeason")}
                </span>
                <p className="font-bold text-xs text-foreground">{activeCityDetail.bestSeason || "Oct – Mar"}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  {t("climateWeather")}
                </span>
                <p className="font-medium text-xs text-foreground">{activeCityDetail.climate || "Subtropical"}</p>
              </div>
            </div>

            {/* Top Landmarks & Food */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
                <h4 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                  <Landmark className="w-4 h-4 text-primary" />
                  {t("iconicLandmarks")}
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  {(activeCityDetail.landmarks || ["Historic Fort", "Temple Complex"]).map((lm) => (
                    <li key={lm} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{lm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
                <h4 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                  <Utensils className="w-4 h-4 text-amber-500" />
                  {t("localFlavors")}
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  {(activeCityDetail.cuisine || ["Regional Specialties", "Street Food"]).map((food) => (
                    <li key={food} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Neighborhoods Guide */}
            {activeCityDetail.neighborhoods && activeCityDetail.neighborhoods.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-500" />
                  {t("neighborhoods")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {activeCityDetail.neighborhoods.map((nh) => (
                    <div key={nh.name} className="p-3 rounded-xl bg-secondary/40 border border-border/60 space-y-1">
                      <p className="font-bold text-foreground">{nh.name}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{nh.vibe}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <button
                onClick={(e) => toggleWishlist(e, activeCityDetail.cityName)}
                className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${wishlist.has(activeCityDetail.cityName.toLowerCase()) ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{wishlist.has(activeCityDetail.cityName.toLowerCase()) ? t("savedWishlist") : t("addCityButton")}</span>
              </button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveCityDetail(null)} className="cursor-pointer">
                  {t("close")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate(`/trips/new?name=${encodeURIComponent("Explore " + activeCityDetail.cityName)}&city=${encodeURIComponent(activeCityDetail.cityName)}`);
                  }}
                  className="gap-1.5 cursor-pointer"
                >
                  <span>{t("planTrip")} ({activeCityDetail.cityName})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}