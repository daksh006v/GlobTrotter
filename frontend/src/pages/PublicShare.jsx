import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Clock, IndianRupee, Copy, ExternalLink,
  Loader2, AlertCircle, Globe, ChevronRight, LogIn, Sparkles, Check,
} from "lucide-react";
import { Button } from "../components/ui/button";
import ActivityCard from "../components/trip/ActivityCard";
import useAuthStore from "../store/authStore";
import api from "../lib/api";
import Logo from "../components/Logo";

export default function PublicShare() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    fetchPublicTrip();
  }, [shareId]);

  const fetchPublicTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/trips/public/${shareId}`);
      setTrip(data);
    } catch (err) {
      setError(err.message || "Trip not found or not public");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setCopying(true);
    try {
      const copied = await api.post(`/trips/${trip.id}/copy`);
      setCopySuccess(true);
      setTimeout(() => navigate(`/trips/${copied.id}`), 1500);
    } catch (err) {
      console.error("Copy trip failed:", err);
      alert(err.message || "Failed to copy trip");
    } finally {
      setCopying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  const formatDateFull = (d) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  const getDayCount = (s, e) => Math.max(1, Math.ceil((new Date(e) - new Date(s)) / 86400000));

  function getStopDays(stop) {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const days = [];
    const current = new Date(start);
    while (current < end) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayActivities = (stop.activities || []).filter(
        (a) => a.scheduledAt && a.scheduledAt.slice(0, 10) === dateStr
      );
      days.push({ date: new Date(current), dateStr, activities: dayActivities });
      current.setDate(current.getDate() + 1);
    }
    const assignedIds = new Set(days.flatMap((d) => d.activities.map((a) => a.id)));
    const unassigned = (stop.activities || []).filter((a) => !assignedIds.has(a.id));
    if (unassigned.length > 0 && days.length > 0) days[0].activities.push(...unassigned);
    return days;
  }

  // ── Loading / Error ──────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-sky-500" /> Loading shared itinerary…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-4 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
          <Globe className="w-8 h-8" />
        </div>
        <p className="text-base font-semibold text-slate-900">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchPublicTrip} className="rounded-xl">
          Retry
        </Button>
        <Link to="/login" className="text-xs text-sky-600 hover:underline">← Go to Login</Link>
      </div>
    );
  }

  if (!trip) return null;

  const stops = trip.stops || [];
  const totalActivities = stops.reduce((sum, s) => sum + (s.activities || []).length, 0);
  const totalCost = stops.reduce((sum, s) => sum + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);
  const durationDays = getDayCount(trip.startDate, trip.endDate);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Public Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" theme="dark" to="/" />
            <span className="text-xs font-medium px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
              Shared Itinerary
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs rounded-xl border-slate-200 text-slate-700 cursor-pointer hover:bg-slate-50"
              onClick={handleCopyLink}
            >
              {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5 text-sky-500" />}
              <span>{linkCopied ? "Link Copied!" : "Share Link"}</span>
            </Button>

            {token ? (
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-xs cursor-pointer"
                onClick={handleCopyTrip}
                disabled={copying || copySuccess}
              >
                {copySuccess ? "✓ Copied to My Trips!" : copying ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Copying…</> : <><Copy className="w-3.5 h-3.5" /> Duplicate Trip</>}
              </Button>
            ) : (
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-xs cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <LogIn className="w-3.5 h-3.5" /> Login to Save
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* Trip Banner */}
        <div className="subtle-card rounded-3xl overflow-hidden">
          {trip.coverPhoto ? (
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
              <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/50 border border-white/20">
                  {durationDays} Days Travel Itinerary
                </span>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
                  {trip.name}
                </h1>
                {trip.description && (
                  <p className="text-sm text-white/90 max-w-3xl line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 border-b border-slate-100 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{trip.name}</h1>
              {trip.description && (
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{trip.description}</p>
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
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
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
                <IndianRupee className="w-3.5 h-3.5 text-sky-500" /> Estimated Cost
              </span>
              <p className="text-sm font-semibold text-sky-600">₹{totalCost.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Day-by-Day Journey List */}
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-semibold text-slate-900">Itinerary Schedule</h2>
            <p className="text-sm text-slate-500 font-normal">Cities, destinations, and scheduled activities</p>
          </div>

          <div className="space-y-8">
            {stops.map((stop, stopIdx) => {
              const days = getStopDays(stop);
              return (
                <div key={stop.id || stopIdx} className="subtle-card rounded-3xl p-6 sm:p-8 space-y-6">
                  {/* Stop Header */}
                  <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
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

                  {/* Days */}
                  <div className="space-y-6 pl-2 sm:pl-4">
                    {days.map((day) => (
                      <div key={day.dateStr} className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                          <h4 className="text-sm font-semibold text-slate-900">
                            {formatDateFull(day.date)}
                          </h4>
                        </div>

                        {day.activities.length === 0 ? (
                          <p className="text-xs text-slate-400 italic pl-5">Free exploration day</p>
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
      </main>
    </div>
  );
}