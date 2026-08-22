import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Plus, Calendar, ChevronDown, ChevronUp,
  Trash2, Pencil, ArrowLeft, Loader2, AlertCircle, BarChart3, Clock, Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import useTripStore from "../store/tripStore";
import CitySearchModal from "../components/trip/CitySearchModal";
import ActivitySearchModal from "../components/trip/ActivitySearchModal";
import StopForm from "../components/trip/StopForm";
import ActivityCard from "../components/trip/ActivityCard";
import Navbar from "../components/Navbar";

export default function ItineraryBuilder() {
  const { id: tripId } = useParams();
  const { currentTrip, loading, error, fetchTrip, addStop, deleteStop, addActivity, deleteActivity } = useTripStore();

  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopFormOpen, setStopFormOpen] = useState(false);
  const [activitySearchOpen, setActivitySearchOpen] = useState(false);
  const [activeStopId, setActiveStopId] = useState(null);
  const [expandedStops, setExpandedStops] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (tripId) fetchTrip(tripId);
  }, [tripId, fetchTrip]);

  // Expand all stops by default when trip loads
  useEffect(() => {
    if (currentTrip?.stops) {
      const expanded = {};
      currentTrip.stops.forEach((s) => (expanded[s.id] = true));
      setExpandedStops(expanded);
    }
  }, [currentTrip?.stops?.length]);

  const toggleStop = (stopId) => setExpandedStops((p) => ({ ...p, [stopId]: !p[stopId] }));

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCitySearchOpen(false);
    setStopFormOpen(true);
  };

  const handleAddStop = async (stopData) => {
    setStopFormOpen(false);
    setActionLoading("addStop");
    try {
      await addStop(tripId, stopData);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
    setSelectedCity(null);
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm("Delete this stop and all its activities?")) return;
    setActionLoading(stopId);
    try {
      await deleteStop(stopId);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleOpenActivitySearch = (stopId) => {
    setActiveStopId(stopId);
    setActivitySearchOpen(true);
  };

  const handleAddActivity = async (suggestion) => {
    if (!activeStopId) return;
    setActivitySearchOpen(false);
    setActionLoading("addAct-" + activeStopId);
    try {
      await addActivity(activeStopId, {
        name: suggestion.name,
        type: suggestion.type,
        category: "activity",
        cost: suggestion.estimatedCost || 0,
        duration: 0,
        description: suggestion.description || "",
        imageUrl: suggestion.imageUrl || "",
      });
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const handleDeleteActivity = async (activityId) => {
    setActionLoading(activityId);
    try {
      await deleteActivity(activityId);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  const getDayCount = (s, e) => Math.max(1, Math.ceil((new Date(e) - new Date(s)) / 86400000));

  // ── Loading / Error / Empty states ────────────────────────
  if (loading && !currentTrip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-sky-500" /> Loading trip details…
          </div>
        </div>
      </div>
    );
  }

  if (error && !currentTrip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-sm font-medium text-slate-700">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchTrip(tripId)} className="rounded-xl">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!currentTrip) return null;

  const stops = currentTrip.stops || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* ── Top Header Strip ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <Link
              to={`/trips/${tripId}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary Overview
            </Link>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{currentTrip.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-normal">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                {formatDate(currentTrip.startDate)} – {formatDate(currentTrip.endDate)}
              </span>
              <span>• {getDayCount(currentTrip.startDate, currentTrip.endDate)} days</span>
              <span>• {stops.length} stops</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/trips/${tripId}/budget`}>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3.5 rounded-xl border-slate-200 text-slate-700 font-medium text-xs gap-1.5 cursor-pointer bg-white hover:bg-slate-50"
              >
                <BarChart3 className="w-3.5 h-3.5 text-sky-500" /> Budget
              </Button>
            </Link>
            <Link to={`/trips/${tripId}/timeline`}>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3.5 rounded-xl border-slate-200 text-slate-700 font-medium text-xs gap-1.5 cursor-pointer bg-white hover:bg-slate-50"
              >
                <Clock className="w-3.5 h-3.5 text-sky-500" /> Timeline
              </Button>
            </Link>
            <Button
              onClick={() => setCitySearchOpen(true)}
              className="h-10 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs gap-1.5 shadow-xs cursor-pointer"
              disabled={actionLoading === "addStop"}
            >
              {actionLoading === "addStop" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Add Stop</span>
            </Button>
          </div>
        </div>

        {/* ── Stops List ───────────────────────────────────── */}
        <div className="space-y-4">
          {stops.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-xl text-slate-900">No stops added yet</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Start building your itinerary by selecting cities, destinations, and dates.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => setCitySearchOpen(true)}
                  className="h-11 px-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add First Stop
                </Button>
              </div>
            </div>
          )}

          {stops.map((stop, idx) => (
            <div key={stop.id} className="subtle-card rounded-3xl overflow-hidden">
              {/* Stop Header */}
              <div
                onClick={() => toggleStop(stop.id)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-sm font-semibold shrink-0 shadow-xs">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-slate-900 truncate">{stop.cityName}</h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {stop.country || "India"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{formatDate(stop.startDate)} – {formatDate(stop.endDate)}</span>
                      <span>• {getDayCount(stop.startDate, stop.endDate)} days</span>
                      <span>• {(stop.activities || []).length} activities</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStop(stop.id);
                    }}
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete stop"
                    disabled={actionLoading === stop.id}
                  >
                    {actionLoading === stop.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>

                  <div className="p-1.5 rounded-xl text-slate-400">
                    {expandedStops[stop.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Activities */}
              {expandedStops[stop.id] && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled Activities</h4>
                    <span className="text-xs font-medium text-slate-500">{(stop.activities || []).length} total</span>
                  </div>

                  <div className="space-y-2.5">
                    {(stop.activities || []).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                        No activities scheduled for {stop.cityName}. Click below to explore & add sights!
                      </p>
                    ) : (
                      (stop.activities || []).map((act) => (
                        <ActivityCard
                          key={act.id}
                          activity={act}
                          compact
                          onRemove={() => handleDeleteActivity(act.id)}
                        />
                      ))
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-11 rounded-2xl gap-2 border-dashed border-slate-300 text-slate-700 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 font-medium text-xs cursor-pointer"
                    onClick={() => handleOpenActivitySearch(stop.id)}
                    disabled={actionLoading === "addAct-" + stop.id}
                  >
                    {actionLoading === "addAct-" + stop.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-sky-500" />
                    )}
                    <span>Explore & Add Activity to {stop.cityName}</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Add Stop Footer Action ──────────────────────── */}
        {stops.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setCitySearchOpen(true)}
              className="h-11 px-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-xs cursor-pointer"
              disabled={actionLoading === "addStop"}
            >
              {actionLoading === "addStop" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Add Another Destination</span>
            </Button>
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────── */}
      <CitySearchModal open={citySearchOpen} onClose={() => setCitySearchOpen(false)} onSelect={handleCitySelect} />
      <StopForm open={stopFormOpen} onCancel={() => { setStopFormOpen(false); setSelectedCity(null); }} onSubmit={handleAddStop} initialCity={selectedCity} />
      <ActivitySearchModal
        open={activitySearchOpen}
        onClose={() => setActivitySearchOpen(false)}
        cityName={stops.find((s) => s.id === activeStopId)?.cityName || ""}
        onAdd={handleAddActivity}
      />
    </div>
  );
}