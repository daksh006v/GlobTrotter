import { useState, useEffect } from "react";
import { Search, Sparkles, IndianRupee, MapPin, Filter, Plus, Compass, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import api from "../lib/api";
import { Link } from "react-router-dom";

const POPULAR_DESTINATIONS = [
  "Agra", "Jaipur", "Delhi", "Varanasi", "Goa", "Mumbai",
  "Munnar", "Kochi", "Leh", "Hampi", "Amritsar", "Rishikesh"
];

const ACTIVITY_TYPES = [
  { label: "All Experiences", value: "" },
  { label: "Sightseeing & Heritage", value: "sightseeing" },
  { label: "Culinary & Food", value: "food" },
  { label: "Adventure & Outdoors", value: "adventure" },
  { label: "Local Bazaars & Shopping", value: "shopping" },
];

export default function ActivitySearch() {
  const [selectedCity, setSelectedCity] = useState("Jaipur");
  const [cityInput, setCityInput] = useState("Jaipur");
  const [type, setType] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities(selectedCity, type, maxCost);
  }, [selectedCity, type, maxCost]);

  const fetchActivities = async (city, filterType, filterMaxCost) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      let url = `/activities/search?city=${encodeURIComponent(city)}`;
      if (filterType) url += `&type=${encodeURIComponent(filterType)}`;
      if (filterMaxCost) url += `&maxCost=${encodeURIComponent(filterMaxCost)}`;
      const res = await api.get(url);
      setActivities(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || "Failed to load activities");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setSelectedCity(cityInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* Header Banner */}
        <div className="subtle-card relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-medium text-sky-700">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Activity & Tour Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
              Explore Things to Do in <span className="text-sky-600">{selectedCity}</span> 🧭
            </h1>

            <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-normal">
              Discover authentic heritage palace tours, street food walks, sacred river rituals, and exhilarating adventures across India.
            </p>

            {/* Prominent Search Bar */}
            <div className="pt-2 max-w-xl">
              <form onSubmit={handleCitySearch} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500 pointer-events-none" />
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Enter city (e.g. Agra, Jaipur, Varanasi, Goa)..."
                    className="w-full pl-12 pr-4 h-13 rounded-2xl bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-sky-500 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-13 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-xs cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Discover</span>
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Destination Pills */}
        <div className="subtle-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">Popular Cities:</span>
            {POPULAR_DESTINATIONS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCityInput(c);
                  setSelectedCity(c);
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium text-xs cursor-pointer ${
                  selectedCity.toLowerCase() === c.toLowerCase()
                    ? "bg-sky-500 text-white font-medium shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Type & Price Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
                Categories:
              </span>
              {ACTIVITY_TYPES.map((tItem) => (
                <button
                  key={tItem.value}
                  onClick={() => setType(tItem.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    type === tItem.value
                      ? "bg-slate-900 text-white font-medium shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tItem.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-sky-500" />
                Max Cost:
              </span>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                placeholder="e.g. ₹2000"
                className="w-28 h-9 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-sky-500"
              />
              {maxCost && (
                <button
                  onClick={() => setMaxCost("")}
                  className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Activity Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="subtle-card rounded-3xl p-4 space-y-3 animate-pulse h-80" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 space-y-2">
            <p className="font-semibold text-lg">{error}</p>
            <p className="text-sm text-slate-500">Try selecting a popular destination from the list above.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No activities found in {selectedCity}</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any activities matching your filter criteria. Try widening your price range or choosing another city.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act, index) => (
              <div
                key={act.name + index}
                className="subtle-card group rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={act.imageUrl || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80"}
                      alt={act.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white border border-white/20 capitalize">
                      {act.type || "Tour"}
                    </div>

                    <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500 text-white shadow-xs">
                      {act.estimatedCost === 0 ? "Free" : `₹${act.estimatedCost}`}
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <p className="text-xs text-white/90 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{selectedCity}, India</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-semibold text-lg text-slate-900 leading-snug line-clamp-1 group-hover:text-sky-600 transition-colors">
                      {act.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {act.description || "Immerse in this iconic experience and create lifelong memories on your journey."}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 pt-3">
                  <Link to={`/trips/new?name=${encodeURIComponent(act.name + " in " + selectedCity)}&city=${encodeURIComponent(selectedCity)}`}>
                    <Button
                      size="sm"
                      className="w-full h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Plan This Experience
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}