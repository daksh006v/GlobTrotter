import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Clock, IndianRupee, Pencil, ArrowLeft,
  Loader2, AlertCircle, BarChart3, Share2, ChevronRight,
  Luggage, Plus, Sparkles, CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import useTripStore from "../store/tripStore";
import ActivityCard from "../components/trip/ActivityCard";
import Navbar from "../components/Navbar";

export default function ItineraryView() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const { currentTrip, loading, error, fetchTrip } = useTripStore();
  const [viewMode, setViewMode] = useState("timeline"); // "timeline" | "summary"

  useEffect(() => {
    if (tripId) fetchTrip(tripId);
  }, [tripId, fetchTrip]);

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  const formatDateFull = (d) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  const getDayCount = (s, e) => Math.max(1, Math.ceil((new Date(e) - new Date(s)) / 86400000));

  // Group activities by day within each stop
  function getStopDays(stop) {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const days = [];
    const current = new Date(start);
    while (current < end) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayActivities = (stop.activities || []).filter((a) => {
        if (!a.scheduledAt) return false;
        return a.scheduledAt.slice(0, 10) === dateStr;
      });
      days.push({ date: new Date(current), dateStr, activities: dayActivities });
      current.setDate(current.getDate() + 1);
    }
    // Add any activities without a matching day to the first day
    const assignedIds = new Set(days.flatMap((d) => d.activities.map((a) => a.id)));
    const unassigned = (stop.activities || []).filter((a) => !assignedIds.has(a.id));
    if (unassigned.length > 0 && days.length > 0) {
      days[0].activities.push(...unassigned);
    }
    return days;
  }

  // ── Loading / Error / Empty ─────────────────────────────
  if (loading && !currentTrip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-sky-500" /> Loading itinerary…
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
  const totalActivities = stops.reduce((sum, s) => sum + (s.activities || []).length, 0);
  const totalCost = stops.reduce((sum, s) => sum + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);
  const durationDays = getDayCount(currentTrip.startDate, currentTrip.endDate);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* ── Navigation Breadcrumb ────────────────────────── */}
        <div className="flex items-center justify-between">
          <Link
            to="/trips"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Trips
          </Link>

          <div className="flex items-center gap-2">
            <Link to={`/trips/${tripId}/edit`}>
              <Button
                size="sm"
                className="h-10 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs gap-1.5 shadow-xs cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Trip
              </Button>
            </Link>
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
            {currentTrip.isPublic && currentTrip.shareId && (
              <Link to={`/share/${currentTrip.shareId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-3.5 rounded-xl border-slate-200 text-slate-700 font-medium text-xs gap-1.5 cursor-pointer bg-white hover:bg-slate-50"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-500" /> Share
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Trip Hero Banner ─────────────────────────────── */}
        <div className="subtle-card rounded-3xl overflow-hidden">
          {currentTrip.coverPhoto ? (
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
              <img
                src={currentTrip.coverPhoto}
                alt={currentTrip.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/50 border border-white/20">
                  {durationDays} Days Indian Journey
                </span>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
                  {currentTrip.name}
                </h1>
                {currentTrip.description && (
                  <p className="text-sm text-white/90 max-w-3xl line-clamp-2 leading-relaxed">
                    {currentTrip.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 border-b border-slate-100 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{currentTrip.name}</h1>
              {currentTrip.description && (
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{currentTrip.description}</p>
              )}
            </div>
          )}

          {/* Quick Stats Strip */}
          <div className="p-6 bg-white grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500" /> Travel Dates
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {formatDate(currentTrip.startDate)} – {formatDate(currentTrip.endDate)}
              </p>
            </div>

            <div className="space-y-1 sm:pl-4">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500" /> Stops
              </span>
              <p className="text-sm font-semibold text-slate-800">{stops.length} Cities</p>
            </div>

            <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Activities
              </span>
              <p className="text-sm font-semibold text-slate-800">{totalActivities} Experiences</p>
            </div>

            <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-sky-500" /> Total Cost
              </span>
              <p className="text-sm font-semibold text-sky-600">₹{totalCost.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* ── Day-wise Itinerary ───────────────────────────── */}
        {stops.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-xl text-slate-900">No stops planned yet</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add your starting city, travel destinations, and activities to build your custom itinerary.
              </p>
            </div>
            <div className="pt-2">
              <Link to={`/trips/${tripId}/edit`}>
                <Button className="h-11 px-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-xs cursor-pointer">
                  <Pencil className="w-4 h-4" /> Start Planning Stops
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Day-by-Day Journey</h2>
                <p className="text-sm text-slate-500 font-normal">Detailed schedule and scheduled activities per stop</p>
              </div>
            </div>

            <div className="space-y-10">
              {stops.map((stop, stopIdx) => {
                const days = getStopDays(stop);
                return (
                  <div key={stop.id || stopIdx} className="subtle-card rounded-3xl p-6 sm:p-8 space-y-6">
                    {/* Stop Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-semibold text-base shrink-0 shadow-xs">
                          {stopIdx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-slate-900">{stop.cityName}</h3>
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {stop.country || "India"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-sky-500" />
                            <span>{formatDate(stop.startDate)} – {formatDate(stop.endDate)}</span>
                            <span>• {getDayCount(stop.startDate, stop.endDate)} days</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-xs font-medium px-3 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                          {days.flatMap((d) => d.activities).length} Activities
                        </span>
                      </div>
                    </div>

                    {/* Days within Stop */}
                    <div className="space-y-6 pl-2 sm:pl-4">
                      {days.map((day, dayIdx) => (
                        <div key={day.dateStr} className="space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                            <h4 className="text-sm font-semibold text-slate-900">
                              Day {stopIdx > 0 ? getDaysBefore(stops, stopIdx) + dayIdx + 1 : dayIdx + 1}
                              <span className="font-normal text-slate-500 ml-2">({formatDateFull(day.date)})</span>
                            </h4>
                          </div>

                          {day.activities.length === 0 ? (
                            <p className="text-xs text-slate-400 italic pl-5">No activities scheduled for this day</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-5">
                              {day.activities.map((act) => (
                                <ActivityCard key={act.id} activity={act} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getDaysBefore(stops, currentIdx) {
  let total = 0;
  for (let i = 0; i < currentIdx; i++) {
    total += Math.max(1, Math.ceil((new Date(stops[i].endDate) - new Date(stops[i].startDate)) / 86400000));
  }
  return total;
}