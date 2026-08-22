import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Plane,
  MapPin,
  Calendar,
  IndianRupee,
  PlusCircle,
  ArrowRight,
  ChevronRight,
  Luggage,
  Plus,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import useTripStore from "@/store/tripStore";
import { Button } from "@/components/ui/button";
import SelectDropdown from "@/components/ui/SelectDropdown";

const VIBE_OPTIONS = [
  { value: "All", label: "All Experiences" },
  { value: "Heritage", label: "Palaces & Forts" },
  { value: "Beach", label: "Beaches & Coastal" },
  { value: "Mountains", label: "Himalayas & Trek" },
  { value: "Backwaters", label: "Backwaters & Nature" },
];

/* ── Hero Slides with Verified Authentic Indian Destinations ─── */
const HERO_SLIDES = [
  {
    id: "tajmahal",
    city: "Agra, Uttar Pradesh",
    title: "Timeless Wonder, The Monument of Eternal Love",
    description:
      "Witness the ethereal marble beauty of the Taj Mahal at dawn and explore the Mughal citadel of Agra Fort.",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "jaipur",
    city: "Jaipur, Rajasthan",
    title: "Fuel Your Wanderlust Across the Royal Pink City",
    description:
      "Explore heritage palaces, majestic forts, and rich royal culture across Rajasthan's historic capital.",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "kerala",
    city: "Alleppey, Kerala",
    title: "Drift Through Backwaters & Emerald Hills",
    description:
      "Cruise on tranquil houseboats, savor fragrant tea estates, and design effortless tropical getaways.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "ladakh",
    city: "Leh & Pangong, Ladakh",
    title: "Conquer Majestic Peaks & Crystal Lakes",
    description:
      "Experience high-altitude serenity, vibrant monasteries, and starlit Himalayan nights.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "varanasi",
    city: "Varanasi, Uttar Pradesh",
    title: "Immerse in Timeless Ghats & Ganga Aarti",
    description:
      "Witness mesmerizing evening rituals along the sacred Ganges and navigate ancient spiritual lanes.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "goa",
    city: "North & South Goa",
    title: "Golden Coastlines & Vibrant Seaside Nights",
    description:
      "From serene palm-fringed coves to pulsating seaside cafes, plan your ideal coastal escape.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "udaipur",
    city: "Udaipur, Rajasthan",
    title: "The City of Lakes Awaits Your Footsteps",
    description:
      "Discover floating palaces, serene Lake Pichola sunsets, and the romantic heart of Mewar.",
    image:
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "hampi",
    city: "Hampi, Karnataka",
    title: "Walk Among the Ruins of a Forgotten Empire",
    description:
      "Explore boulder-strewn landscapes, ancient Vijayanagara temples, and Tungabhadra riverbanks.",
    image:
      "https://images.unsplash.com/photo-1600100397608-f010f444f434?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "amritsar",
    city: "Amritsar, Punjab",
    title: "The Golden Sanctuary of Peace & Devotion",
    description:
      "Experience the serene waters of the Harmandir Sahib and the legendary hospitality of Punjab.",
    image:
      "https://images.unsplash.com/photo-1588096344356-9b48a0f074a3?q=85&w=2400&auto=format&fit=crop",
  },
  {
    id: "rishikesh",
    city: "Rishikesh, Uttarakhand",
    title: "Adventure Meets Serenity in the Yoga Capital",
    description:
      "Raft through rapids, meditate by the holy Ganges, and experience the spiritual Himalayan gateway.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=85&w=2400&auto=format&fit=crop",
  },
];

/* ── Popular Destinations Grid (Enlarged Cards) ──────────── */
const POPULAR_DESTINATIONS = [
  {
    name: "Agra",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
    cost: "₹₹",
    budgetPerDay: "₹2,000 / day",
    tag: "Taj Mahal & Heritage",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    budgetPerDay: "₹2,800 / day",
    tag: "Palaces & Forts",
  },
  {
    name: "Kerala",
    state: "Alleppey",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
    cost: "₹₹",
    budgetPerDay: "₹2,200 / day",
    tag: "Backwaters & Tea",
  },
  {
    name: "Ladakh",
    state: "Leh",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    cost: "₹₹₹",
    budgetPerDay: "₹3,500 / day",
    tag: "Mountains & Lakes",
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    cost: "₹",
    budgetPerDay: "₹1,400 / day",
    tag: "Ghats & Heritage",
  },
  {
    name: "Goa",
    state: "West Coast",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    cost: "₹₹",
    budgetPerDay: "₹2,400 / day",
    tag: "Beaches & Sunsets",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { trips, fetchTrips, loading } = useTripStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchCity, setSearchCity] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("All");

  useEffect(() => {
    fetchTrips().catch((err) => console.error("Error loading trips:", err));
  }, [fetchTrips]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const getDurationDays = (start, end) => {
    if (!start || !end) return 1;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const safeTrips = Array.isArray(trips) ? trips : [];
  const totalTrips = safeTrips.length;
  const totalStops = safeTrips.reduce((acc, t) => acc + (t.stopCount || 0), 0);
  const totalDays = safeTrips.reduce((acc, t) => acc + getDurationDays(t.startDate, t.endDate), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const currentHero = HERO_SLIDES[currentSlide];

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/cities?search=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate("/cities");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar transparent={true} />

      {/* ══════════════════════════════════════════════════════════
          HERO — 100% Full Window Viewport Height
         ══════════════════════════════════════════════════════════ */}
      <section className="relative -mt-16 w-full min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-in-out ${
                index === currentSlide ? "opacity-75" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${slide.image}')`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
        </div>

        <div className="h-20" />

        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/90 text-white text-xs font-medium shadow-xs">
              <MapPin className="w-3.5 h-3.5" />
              {currentHero.city}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-${currentSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl space-y-4"
            >
              <h1
                className="text-4xl sm:text-5xl lg:text-[56px] font-semibold text-white leading-[1.12] tracking-tight"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
              >
                {currentHero.title}
              </h1>
              <p
                className="text-white/90 text-base sm:text-lg font-normal leading-relaxed max-w-2xl"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
              >
                {getGreeting()}, <span className="font-medium text-sky-300">{user?.name ? user.name.split(" ")[0] : "Daksh"}</span>. {currentHero.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            <Button
              onClick={() => navigate("/trips/new")}
              className="h-11 px-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Plan a New Journey
            </Button>

            <Button
              onClick={() => navigate("/cities")}
              className="h-11 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm gap-2 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-600" />
              Explore Destinations
            </Button>
          </div>
        </div>

        {/* ── Search Bar Card (Clearly visible at base of Hero) ── */}
        <div className="relative z-20 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <form
            onSubmit={handleQuickSearch}
            className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200/90 text-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
          >
            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Destination</label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Where to? (Agra, Jaipur...)"
                  className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none p-0"
                />
              </div>
            </div>

            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Holiday Vibe</label>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-500 shrink-0" />
                <SelectDropdown
                  options={VIBE_OPTIONS}
                  value={selectedVibe}
                  onChange={setSelectedVibe}
                  className="w-full border-none shadow-none p-0 text-sm font-medium text-slate-800 bg-transparent hover:bg-transparent h-auto"
                  align="left"
                />
              </div>
            </div>

            <div className="space-y-1 sm:border-r sm:border-slate-200 sm:pr-4">
              <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Budget Tier</label>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="text-sm font-medium text-slate-800">₹1,500 – ₹8,000+ / day</span>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4" />
              Search Cities
            </Button>
          </form>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MAIN BODY — Clean Modern Layout
         ══════════════════════════════════════════════════════════ */}
      <main className="flex-1 bg-slate-50 pt-12 pb-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Planned Trips", value: totalTrips, icon: Luggage },
              { label: "Total Stops",   value: totalStops, icon: MapPin },
              { label: "Travel Days",   value: totalDays,  icon: Calendar },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="subtle-card rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{loading ? "–" : stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Upcoming Itineraries ──────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Your Upcoming Itineraries</h2>
                <p className="text-sm text-slate-500 mt-0.5 font-normal">Manage and track your personalized journeys</p>
              </div>
              {safeTrips.length > 0 && (
                <Link to="/trips" className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1">
                  View all ({safeTrips.length})
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse subtle-card rounded-3xl h-64" />
                ))}
              </div>
            ) : safeTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeTrips.map((trip) => {
                  const duration = getDurationDays(trip.startDate, trip.endDate);
                  return (
                    <div
                      key={trip.id}
                      className="subtle-card rounded-3xl overflow-hidden flex flex-col group"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={trip.coverPhoto || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"}
                          alt={trip.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-500 text-white shadow-xs">
                          {duration}d
                        </span>
                        <span className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/50 text-white border border-white/20">
                          {trip.stopCount || 0} stops
                        </span>
                      </div>

                      <div className="p-5 flex-1 space-y-2">
                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                          {trip.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
                        </div>
                        {trip.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{trip.description}</p>
                        )}
                      </div>

                      <div className="px-5 pb-5 pt-2 flex items-center gap-2 border-t border-slate-100">
                        <Button
                          size="sm"
                          className="flex-1 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium gap-1 cursor-pointer shadow-xs"
                          onClick={() => navigate(`/trips/${trip.id}`)}
                        >
                          View Itinerary <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3.5 rounded-xl border-slate-200 text-slate-700 text-xs font-medium cursor-pointer hover:bg-slate-50"
                          onClick={() => navigate(`/trips/${trip.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                  <Plane className="w-8 h-8 -rotate-45" />
                </div>
                <h3 className="font-semibold text-xl text-slate-900">Your Travel Passport is Empty</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Start crafting your multi-city Indian adventure. Pick destinations, organize stops, and track budgets in ₹.
                </p>
                <Button
                  onClick={() => navigate("/trips/new")}
                  className="h-11 px-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Trip
                </Button>
              </div>
            )}
          </div>

          {/* ── Popular Destinations (Enlarged Cards) ─────────── */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Popular Destinations Across India</h2>
                <p className="text-sm text-slate-500 mt-0.5 font-normal">Handpicked traveler-favorite cities for your next journey</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/cities")}
                className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 gap-1 rounded-xl cursor-pointer"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {POPULAR_DESTINATIONS.map((dest) => (
                <div
                  key={dest.name}
                  className="subtle-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between"
                  onClick={() =>
                    navigate(`/trips/new?name=${encodeURIComponent(dest.name + " Gateway")}&city=${encodeURIComponent(dest.name)}`)
                  }
                >
                  <div>
                    <div className="h-56 w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white border border-white/20">
                          {dest.cost}
                        </span>
                      </div>

                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                        <h4 className="font-semibold text-2xl tracking-tight leading-none mb-1">
                          {dest.name}
                        </h4>
                        <p className="text-xs text-white/90 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <span>{dest.state} • {dest.tag}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Estimated Budget</span>
                        <span className="text-base font-semibold text-sky-600">{dest.budgetPerDay}</span>
                      </div>

                      <Button
                        size="sm"
                        className="h-10 px-5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Plan Trip
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
