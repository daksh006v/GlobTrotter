import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft, Loader2, AlertCircle, ChevronDown, ChevronRight,
  GripVertical, Calendar, MapPin, Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import DraggableActivity from "../components/trip/DraggableActivity";
import useTripStore from "../store/tripStore";
import Navbar from "../components/Navbar";

export default function Timeline() {
  const { id: tripId } = useParams();
  const { currentTrip, loading, error, fetchTrip, reorderStops, reorderActivities } = useTripStore();
  const [expandedStops, setExpandedStops] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (tripId) fetchTrip(tripId);
  }, [tripId, fetchTrip]);

  useEffect(() => {
    if (currentTrip?.stops) {
      const ex = {};
      currentTrip.stops.forEach((s) => (ex[s.id] = true));
      setExpandedStops(ex);
    }
  }, [currentTrip?.stops?.length]);

  const toggleStop = (id) => setExpandedStops((p) => ({ ...p, [id]: !p[id] }));

  // ── Stop reorder ─────────────────────────────────────────
  const handleStopDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !currentTrip) return;

      const stops = currentTrip.stops || [];
      const oldIdx = stops.findIndex((s) => s.id === active.id);
      const newIdx = stops.findIndex((s) => s.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return;

      const reordered = arrayMove(stops, oldIdx, newIdx);
      // Optimistic update
      useTripStore.setState((state) => ({
        currentTrip: { ...state.currentTrip, stops: reordered },
      }));
      try {
        await reorderStops(tripId, reordered.map((s) => s.id));
      } catch (err) {
        console.error(err);
      }
    },
    [currentTrip, tripId, reorderStops]
  );

  // ── Activity reorder (within a stop) ─────────────────────
  const handleActivityDragEnd = useCallback(
    (stopId) => async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !currentTrip) return;

      const stop = currentTrip.stops?.find((s) => s.id === stopId);
      if (!stop) return;

      const activities = stop.activities || [];
      const oldIdx = activities.findIndex((a) => a.id === active.id);
      const newIdx = activities.findIndex((a) => a.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return;

      const reordered = arrayMove(activities, oldIdx, newIdx);
      // Optimistic update
      useTripStore.setState((state) => ({
        currentTrip: {
          ...state.currentTrip,
          stops: state.currentTrip.stops.map((s) =>
            s.id === stopId ? { ...s, activities: reordered } : s
          ),
        },
      }));
      try {
        await reorderActivities(stopId, reordered.map((a) => a.id));
      } catch (err) {
        console.error(err);
      }
    },
    [currentTrip, reorderActivities]
  );

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  // ── Loading / Error ──────────────────────────────────────
  if (loading && !currentTrip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-sky-500" /> Loading timeline…
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

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <Link
              to={`/trips/${tripId}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{currentTrip.name} — Timeline</h1>
            <p className="text-sm text-slate-500 font-normal">
              Drag stops to reorder your route. Drag activities within a stop to reschedule.
            </p>
          </div>
        </div>

        {stops.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <p className="text-sm text-slate-500">No stops scheduled to display on timeline.</p>
          </div>
        )}

        {/* ── Sortable Stops ──────────────────────────────── */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStopDragEnd}>
          <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {stops.map((stop, idx) => (
                <SortableStop
                  key={stop.id}
                  stop={stop}
                  index={idx}
                  expanded={!!expandedStops[stop.id]}
                  onToggle={() => toggleStop(stop.id)}
                  formatDate={formatDate}
                  sensors={sensors}
                  onActivityDragEnd={handleActivityDragEnd(stop.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
}

// ── SortableStop sub-component ────────────────────────────
function SortableStop({ stop, index, expanded, onToggle, formatDate, sensors, onActivityDragEnd }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const activities = stop.activities || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-3xl border bg-white overflow-hidden shadow-xs transition-all ${
        isDragging ? "shadow-xl ring-2 ring-sky-500 border-sky-500" : "border-slate-200"
      }`}
    >
      {/* Stop Header */}
      <div className="flex items-center gap-3 p-4 sm:p-5">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-lg cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 hover:bg-slate-100 touch-none transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs">
          {index + 1}
        </div>

        <button onClick={onToggle} className="flex-1 flex items-center justify-between gap-2 text-left min-w-0 cursor-pointer">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-slate-900 truncate">{stop.cityName}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{stop.country || "India"}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {formatDate(stop.startDate)} – {formatDate(stop.endDate)} • {activities.length} activities
            </div>
          </div>
          <div className="p-1 text-slate-400">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* Expanded: Sortable Activities */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
          {activities.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 italic">No activities planned</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onActivityDragEnd}>
              <SortableContext items={activities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 pt-2">
                  {activities.map((act) => (
                    <DraggableActivity key={act.id} activity={act} id={act.id} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </div>
  );
}