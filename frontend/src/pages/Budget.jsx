import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, AlertCircle, IndianRupee, TrendingUp, Calendar, PieChart as PieChartIcon, BarChart3,
  ShieldCheck, ArrowUpRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import BudgetChart from "../components/trip/BudgetChart";
import Navbar from "../components/Navbar";
import api from "../lib/api";

export default function Budget() {
  const { id: tripId } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartView, setChartView] = useState("pie"); // "pie" | "bar"

  useEffect(() => {
    fetchBudget();
  }, [tripId]);

  const fetchBudget = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/trips/${tripId}/budget`);
      setBudget(data);
    } catch (err) {
      setError(err.message || "Failed to load budget");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading / Error ──────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-sky-500" /> Loading budget breakdown…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-sm font-medium text-slate-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchBudget} className="rounded-xl">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!budget) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <Link
              to={`/trips/${tripId}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Trip Budget & Expenses</h1>
            <p className="text-sm text-slate-500 font-normal">Track your planned spending by category and day in ₹</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard
            icon={IndianRupee}
            label="Total Planned"
            value={`₹${(budget.totalCost || 0).toLocaleString("en-IN")}`}
            color="text-sky-600 bg-sky-50"
          />
          <SummaryCard
            icon={TrendingUp}
            label="Avg Daily Cost"
            value={`₹${(budget.averagePerDay || 0).toLocaleString("en-IN")}`}
            color="text-emerald-600 bg-emerald-50"
          />
          <SummaryCard
            icon={Calendar}
            label="Total Days"
            value={`${budget.byDay?.length || 1} Days`}
            color="text-purple-600 bg-purple-50"
          />
          <SummaryCard
            icon={AlertCircle}
            label="Daily Threshold"
            value={`₹${(budget.dailyBudgetThreshold || 0).toLocaleString("en-IN")}`}
            color="text-amber-600 bg-amber-50"
          />
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setChartView("pie")}
            className={`gap-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
              chartView === "pie"
                ? "bg-sky-500 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Category Breakdown</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setChartView("bar")}
            className={`gap-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
              chartView === "bar"
                ? "bg-sky-500 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Daily Spending</span>
          </Button>
        </div>

        {/* Chart Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <BudgetChart
            byCategory={budget.byCategory}
            byDay={budget.byDay}
            chartType={chartView}
            dailyBudgetThreshold={budget.dailyBudgetThreshold}
          />
        </div>

        {/* Category Breakdown Table */}
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-base text-slate-900">Category Breakdown</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(budget.byCategory || {}).map(([cat, cost]) => (
              <div key={cat} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-sm font-medium capitalize text-slate-800">{cat}</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">₹{Number(cost).toLocaleString("en-IN")}</div>
                <div className="text-xs font-medium text-slate-500 w-16 text-right">
                  {budget.totalCost > 0 ? ((cost / budget.totalCost) * 100).toFixed(0) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</div>
        <div className="text-xl font-semibold text-slate-900 mt-1">{value}</div>
      </div>
    </div>
  );
}