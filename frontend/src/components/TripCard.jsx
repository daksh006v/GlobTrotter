import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Trash2,
  Edit,
  ArrowRight,
  Share2,
  Check,
  IndianRupee,
} from "lucide-react";
import { Button } from "./ui/button";

export default function TripCard({
  trip,
  onView,
  onEdit,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);

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

  const getTripStatus = (start, end) => {
    if (!start || !end) return { label: "Planned", color: "bg-sky-50 text-sky-700 border-sky-200" };
    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) {
      return { label: "Upcoming", color: "bg-sky-500 text-white border-sky-400 font-semibold" };
    } else if (now >= startTime && now <= endTime) {
      return { label: "In Progress", color: "bg-emerald-500 text-white border-emerald-400 font-semibold" };
    } else {
      return { label: "Completed", color: "bg-slate-100 text-slate-600 border-slate-200" };
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/share/${trip.shareId || trip.id}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const duration = getDurationDays(trip?.startDate, trip?.endDate);
  const status = getTripStatus(trip?.startDate, trip?.endDate);

  return (
    <div className="subtle-card group rounded-3xl overflow-hidden flex flex-col justify-between">
      <div>
        {/* Cover Photo Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={
              trip?.coverPhoto ||
              "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"
            }
            alt={trip?.name || "Trip cover"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top Badges & Share Button */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border shadow-xs ${status.color}`}
            >
              {status.label}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white border border-white/20 cursor-pointer"
              title="Copy share link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Bottom Banner Info */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
            <span className="font-semibold px-2.5 py-1 rounded-full bg-black/60 border border-white/20 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-sky-400" />
              {trip?.stopCount || 0} {trip?.stopCount === 1 ? "Stop" : "Stops"}
            </span>

            <span className="font-medium px-2.5 py-0.5 rounded-full bg-sky-500 text-white shadow-xs">
              {duration} {duration === 1 ? "Day" : "Days"}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-3">
          <div className="space-y-1">
            <h3
              onClick={() => onView && onView(trip.id)}
              className="font-semibold text-lg text-slate-900 leading-tight group-hover:text-sky-600 transition-colors cursor-pointer line-clamp-1"
              title={trip?.name}
            >
              {trip?.name || "Untitled Journey"}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>
                {formatDate(trip?.startDate)} – {formatDate(trip?.endDate)}
              </span>
            </div>
          </div>

          {trip?.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          )}

          {trip?.budgetLimit && (
            <div className="pt-1 flex items-center gap-1.5 text-xs text-sky-600 font-semibold">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Budget: ₹{Number(trip.budgetLimit).toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 flex items-center gap-2 border-t border-slate-100 pt-3">
        <Button
          size="sm"
          className="flex-1 text-xs gap-1.5 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-xs cursor-pointer"
          onClick={() => onView && onView(trip.id)}
        >
          <span>View Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
          onClick={() => onEdit && onEdit(trip.id)}
          title="Edit trip details & stops"
        >
          <Edit className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
          onClick={() => onDelete && onDelete(trip.id)}
          title="Delete trip"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
