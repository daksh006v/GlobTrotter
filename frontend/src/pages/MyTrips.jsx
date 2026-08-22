import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Luggage,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Compass,
  AlertTriangle,
  Loader2,
  X,
  Plane,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import TripCard from "@/components/TripCard";
import useTripStore from "@/store/tripStore";
import { Button } from "@/components/ui/button";
import SelectDropdown from "@/components/ui/SelectDropdown";

const TRIP_SORT_OPTIONS = [
  { value: "departure-asc", label: "Departure Date (Earliest First)" },
  { value: "departure-desc", label: "Departure Date (Latest First)" },
  { value: "created-desc", label: "Recently Created" },
  { value: "stops-desc", label: "Most Stops" },
];

export default function MyTrips() {
  const navigate = useNavigate();
  const { trips, fetchTrips, deleteTrip, loading } = useTripStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("departure-asc");
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTrips().catch((err) => console.error("Error fetching trips:", err));
  }, [fetchTrips]);

  const getStatus = (start, end) => {
    if (!start || !end) return "upcoming";
    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "inprogress";
    return "completed";
  };

  const counts = useMemo(() => {
    const res = { all: trips.length, upcoming: 0, inprogress: 0, completed: 0 };
    trips.forEach((t) => {
      const st = getStatus(t.startDate, t.endDate);
      if (res[st] !== undefined) res[st]++;
    });
    return res;
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        if (statusFilter !== "all") {
          const st = getStatus(trip.startDate, trip.endDate);
          if (st !== statusFilter) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = trip.name?.toLowerCase().includes(q);
          const descMatch = trip.description?.toLowerCase().includes(q);
          if (!nameMatch && !descMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "departure-asc") {
          return new Date(a.startDate || 0) - new Date(b.startDate || 0);
        }
        if (sortBy === "departure-desc") {
          return new Date(b.startDate || 0) - new Date(a.startDate || 0);
        }
        if (sortBy === "created-desc") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "stops-desc") {
          return (b.stopCount || 0) - (a.stopCount || 0);
        }
        return 0;
      });
  }, [trips, statusFilter, searchQuery, sortBy]);

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTrip(tripToDelete.id);
      setTripToDelete(null);
    } catch (err) {
      console.error("Failed to delete trip:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                My Trips
              </h1>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-normal">
              Review, edit, and organize all your upcoming and past journeys.
            </p>
          </div>

          <Button
            onClick={() => navigate("/trips/new")}
            className="h-11 px-5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </Button>
        </div>

        {/* Search, Filter Tabs & Sort Controls */}
        <div className="subtle-card p-5 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trips by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 h-11 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-sky-500" />
                Sort:
              </span>
              <SelectDropdown
                options={TRIP_SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
                className="h-11 px-3.5 rounded-xl border-slate-200"
                align="right"
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100">
            {[
              { id: "all", label: "All Itineraries", count: counts.all },
              { id: "upcoming", label: "Upcoming", count: counts.upcoming },
              { id: "inprogress", label: "In Progress", count: counts.inprogress },
              { id: "completed", label: "Past Journeys", count: counts.completed },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    active
                      ? "bg-sky-500 text-white font-medium shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-white/20 text-white font-semibold"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trips Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse rounded-3xl bg-white border border-slate-200 h-64" />
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={(id) => navigate(`/trips/${id}`)}
                onEdit={(id) => navigate(`/trips/${id}/edit`)}
                onDelete={() => setTripToDelete(trip)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <Plane className="w-8 h-8 -rotate-45" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-semibold text-xl text-slate-900">
                {searchQuery || statusFilter !== "all" ? "No matching trips found" : "No trips created yet"}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search terms or filter settings to find what you're looking for."
                  : "Start planning your next dream adventure! Add cities, discover activities, and keep track of your travel budget."}
              </p>
            </div>

            <div className="pt-2">
              {searchQuery || statusFilter !== "all" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="rounded-xl border-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  Reset Filters
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/trips/new")}
                  className="h-11 px-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Trip
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Delete Trip</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900">&ldquo;{tripToDelete.name}&rdquo;</strong>? This will remove all
              associated stops, activities, and budget records.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTripToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-xl gap-1.5 cursor-pointer bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? "Deleting..." : "Delete Trip"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
