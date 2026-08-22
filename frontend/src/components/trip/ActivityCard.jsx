import { Clock, IndianRupee, Pencil, Trash2, Eye } from "lucide-react";

const CATEGORY_COLORS = {
  transport: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  stay: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  activity: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  meal: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const CATEGORY_ICONS = { transport: "🚗", stay: "🏨", activity: "🎯", meal: "🍽️" };

export default function ActivityCard({ activity, onEdit, onRemove, onQuickView, compact = false }) {
  const { id, name, type, category, cost, duration, imageUrl } = activity;
  const catStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.activity;
  const catIcon = CATEGORY_ICONS[category] || "📌";

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background border border-border/40 hover:border-border transition-colors group">
        <span className="text-base">{catIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{name}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>₹{cost}</span>
            {duration > 0 && <span>• {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60 ? (duration % 60) + "m" : ""}` : `${duration}m`}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={() => onEdit(activity)} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground" title="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onRemove && (
            <button onClick={() => onRemove(id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Remove">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/40 hover:border-border hover:shadow-sm transition-all group">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 text-2xl">
          {catIcon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">{name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${catStyle}`}>
                {catIcon} {category}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                {type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {onQuickView && (
              <button onClick={() => onQuickView(activity)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground" title="Quick view">
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            {onEdit && (
              <button onClick={() => onEdit(activity)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onRemove && (
              <button onClick={() => onRemove(id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Remove">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />₹{cost}
          </span>
          {duration > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60 ? (duration % 60) + "m" : ""}` : `${duration}m`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
