import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Luggage,
  Activity,
  MapPin,
  TrendingUp,
  RefreshCw,
  Clock,
  Compass,
  ArrowUpRight,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const data = await api.get("/admin/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      setError(err.message || "Failed to load platform analytics. Ensure you have administrator privileges.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalUsers = stats?.totalUsers || 0;
  const totalTrips = stats?.totalTrips || 0;
  const activeUsers = stats?.activeUsersLast7Days || 0;
  const avgTripsPerUser = totalUsers > 0 ? (totalTrips / totalUsers).toFixed(1) : 0;
  const topCities = stats?.topCities || [];
  const topActivities = stats?.topActivities || [];

  const maxCityCount = topCities.length > 0 ? Math.max(...topCities.map((c) => c.count)) : 1;
  const maxActivityCount = topActivities.length > 0 ? Math.max(...topActivities.map((a) => a.count)) : 1;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Platform Admin Console</h1>
              <span className="text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Live Metrics
              </span>
            </div>
            <p className="text-sm text-slate-500 font-normal">
              Monitor real-time user registrations, itinerary creation volume, and destination discovery trends.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadStats(true)}
              disabled={loading || refreshing}
              className="gap-2 text-xs rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
            </Button>

            <Button
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-xs rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-xs cursor-pointer"
            >
              Go to App
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Analytics KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Total Users
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-3xl font-semibold text-slate-900">{loading ? "-" : totalUsers}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Registered travel planners</span>
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Total Itineraries
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Luggage className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-3xl font-semibold text-slate-900">{loading ? "-" : totalTrips}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Multi-city journeys created</span>
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Active (7 Days)
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-3xl font-semibold text-slate-900">{loading ? "-" : activeUsers}</h3>
              <p className="text-xs text-slate-500">
                Active travelers in the past week
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Avg Trips / User
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-3xl font-semibold text-slate-900">{loading ? "-" : avgTripsPerUser}</h3>
              <p className="text-xs text-slate-500">
                High platform engagement index
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Rankings Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Destination Cities */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-sky-500" />
                <h3 className="text-lg font-semibold text-slate-900">Top Destination Cities</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">By stop occurrence</span>
            </div>

            {loading ? (
              <div className="space-y-3 py-2 animate-pulse">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-10 bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : topCities.length > 0 ? (
              <div className="space-y-4">
                {topCities.map((city, idx) => {
                  const percentage = Math.round((city.count / maxCityCount) * 100);
                  return (
                    <div key={city.cityName} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600 font-semibold">
                            {idx + 1}
                          </span>
                          <span className="text-slate-900 font-medium">{city.cityName}</span>
                        </div>
                        <span className="text-slate-500 font-normal">{city.count} {city.count === 1 ? "Stop" : "Stops"}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No stop data collected yet.</p>
            )}
          </div>

          {/* Top Activities */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-sky-500" />
                <h3 className="text-lg font-semibold text-slate-900">Popular Sights & Activities</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">By bookings/adds</span>
            </div>

            {loading ? (
              <div className="space-y-3 py-2 animate-pulse">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-10 bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : topActivities.length > 0 ? (
              <div className="space-y-4">
                {topActivities.map((act, idx) => {
                  const percentage = Math.round((act.count / maxActivityCount) * 100);
                  return (
                    <div key={act.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600 font-semibold">
                            {idx + 1}
                          </span>
                          <span className="text-slate-900 font-medium truncate max-w-[200px]">{act.name}</span>
                        </div>
                        <span className="text-slate-500 font-normal">{act.count} {act.count === 1 ? "Add" : "Adds"}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No activity data collected yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}