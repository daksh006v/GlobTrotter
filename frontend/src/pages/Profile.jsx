import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Languages,
  Camera,
  Upload,
  Loader2,
  Check,
  Save,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Shield,
  Compass,
  LogOut,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import useAuthStore from "@/store/authStore";
import useLanguageStore from "@/store/languageStore";
import { LANGUAGES_LIST } from "@/lib/i18n";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectDropdown from "@/components/ui/SelectDropdown";

const LANGUAGE_OPTIONS = LANGUAGES_LIST.map((lang) => ({
  value: lang.code,
  label: `${lang.name} (${lang.nativeName || lang.name})`,
}));

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  language: z.string().min(1, "Please select a language"),
  photoUrl: z.string().optional().or(z.literal("")),
});

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const { language: currentLang, setLanguage, t } = useLanguageStore();

  const [avatarPreview, setAvatarPreview] = useState(user?.photoUrl || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Saved Destinations State
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [newCityName, setNewCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);

  // Delete Account Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteModalError, setDeleteModalError] = useState("");

  const openDeleteModal = () => {
    setDeletePassword("");
    setDeleteModalError("");
    setShowDeletePassword(false);
    setShowDeleteModal(true);
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      language: user?.language || currentLang || "en",
      photoUrl: user?.photoUrl || "",
    },
  });

  // Sync initial user state
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        language: user.language || currentLang || "en",
        photoUrl: user.photoUrl || "",
      });
      setAvatarPreview(user.photoUrl || "");
    }
  }, [user, reset, currentLang]);

  // Load Saved Wishlist Destinations
  const loadSavedDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const data = await api.get("/users/me/destinations");
      setSavedDestinations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load saved destinations:", err);
    } finally {
      setLoadingDestinations(false);
    }
  };

  useEffect(() => {
    loadSavedDestinations();
  }, []);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setServerError("Photo must be smaller than 5MB");
      return;
    }

    setUploadingAvatar(true);
    setServerError("");

    try {
      const uploaded = await api.upload(file);
      const url = uploaded.url || uploaded.path;
      setAvatarPreview(url);
      setValue("photoUrl", url);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setServerError(err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmit = async (formData) => {
    setServerError("");
    setSaveSuccess(false);

    try {
      const updated = await api.put("/users/me", formData);
      updateUser(updated);
      if (formData.language) {
        setLanguage(formData.language);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setServerError(err.message || "Failed to update profile");
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    setAddingCity(true);
    try {
      const newDest = await api.post("/users/me/destinations", {
        cityName: newCityName.trim(),
        country: "India",
      });
      setSavedDestinations((prev) => [newDest, ...prev]);
      setNewCityName("");
    } catch (err) {
      console.error("Failed to add destination:", err);
    } finally {
      setAddingCity(false);
    }
  };

  const handleRemoveDestination = async (id) => {
    try {
      await api.delete(`/users/me/destinations/${id}`);
      setSavedDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to remove destination:", err);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword.trim()) return;

    setIsDeletingAccount(true);
    setDeleteModalError("");
    try {
      await api.delete("/users/me", { password: deletePassword });
      setShowDeleteModal(false);
      logout();
      navigate("/signup");
    } catch (err) {
      console.error("Account deletion failed:", err);
      setDeleteModalError(err.message || "Incorrect password. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        {/* Header Strip */}
        <div className="border-b border-slate-200 pb-6 space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{t ? t("profileTitle") : "Account & Profile"}</h1>
          <p className="text-sm text-slate-500 font-normal">
            {t ? t("profileSubtitle") : "Manage your traveler identity, avatar, and preferred destinations."}
          </p>
        </div>

        {serverError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>{t ? t("profileUpdated") : "Profile updated successfully!"}</span>
          </div>
        )}

        {/* Profile Card & Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Quick Info Summary */}
          <div className="subtle-card rounded-3xl p-6 flex flex-col items-center text-center space-y-4 h-fit">
            {/* Avatar with Upload Badge */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-sky-200 bg-slate-100 shadow-sm flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-sky-50 text-sky-600 font-bold text-3xl flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
                  </div>
                )}
              </div>

              <label
                htmlFor="avatar-file"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-sky-600 transition-colors"
                title="Upload profile photo"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
              <input
                id="avatar-file"
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
                disabled={uploadingAvatar}
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-xl text-slate-900">{user?.name || "Daksh"}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {user?.isAdmin ? "Administrator" : "GlobeTrotter"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 subtle-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-sky-500" />
                {t ? t("personalInfo") : "Personal Information"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{t ? t("personalInfoDesc") : "Update your profile details and settings."}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700">{t ? t("fullName") : "Full Name"} *</Label>
                <Input
                  id="name"
                  placeholder={t ? t("fullNamePlaceholder") : "Your Full Name"}
                  {...register("name")}
                  className={`h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>{t ? t("emailAddress") : "Email Address"}</span>
                  <span className="text-[11px] text-slate-400 font-normal">{t ? t("registeredAccount") : "Registered account"}</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled
                  className="h-11 rounded-xl bg-slate-100 border-slate-200 text-sm font-medium cursor-not-allowed opacity-80"
                />
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-sky-500" />
                  {t ? t("preferredLanguage") : "Preferred Language"}
                </Label>
                <SelectDropdown
                  options={LANGUAGE_OPTIONS}
                  value={watch("language")}
                  onChange={(val) => setValue("language", val, { shouldValidate: true })}
                  className="w-full h-11 rounded-xl bg-slate-50 border-slate-200 text-slate-800"
                  align="left"
                />
              </div>

              {/* Photo URL */}
              <div className="space-y-1.5">
                <Label htmlFor="photoUrl" className="text-xs font-semibold text-slate-700">Avatar Photo URL</Label>
                <Input
                  id="photoUrl"
                  placeholder="https://images.unsplash.com/..."
                  {...register("photoUrl")}
                  onChange={(e) => setAvatarPreview(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium"
                />
                <p className="text-[11px] text-slate-400">
                  Direct image link or upload using the camera button on avatar.
                </p>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm gap-2 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? (t ? t("saving") : "Saving...") : (t ? t("saveChanges") : "Save Changes")}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Saved Wishlist Destinations */}
        <div className="subtle-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-500" />
              {t ? t("savedWishlist") : "Wishlist & Saved Destinations"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t ? t("savedWishlistDesc") : "Quickly access saved destinations to plan upcoming itineraries."}
            </p>
          </div>

          <div className="space-y-5">
            {/* Add Destination Form */}
            <form onSubmit={handleAddDestination} className="flex gap-2 max-w-md">
              <Input
                placeholder={t ? t("addCityPlaceholder") : "Add a city (e.g. Udaipur, Munnar)..."}
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                disabled={addingCity}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium"
              />
              <Button
                type="submit"
                size="sm"
                disabled={addingCity || !newCityName.trim()}
                className="h-11 px-5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                {addingCity ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{t ? t("addCityButton") : "Add City"}</span>
              </Button>
            </form>

            {/* Destination Badges / List */}
            {loadingDestinations ? (
              <div className="flex gap-2 animate-pulse py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-9 w-28 bg-slate-100 rounded-full" />
                ))}
              </div>
            ) : savedDestinations.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium group hover:border-sky-300 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-slate-800">{dest.cityName}</span>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/trips/new?name=${encodeURIComponent("Explore " + dest.cityName)}&city=${encodeURIComponent(
                            dest.cityName
                          )}`
                        )
                      }
                      className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold ml-1 cursor-pointer"
                      title="Plan a trip to this city"
                    >
                      Plan →
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(dest.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors ml-0.5 cursor-pointer"
                      title="Remove from saved wishlist"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-1.5">
                <Compass className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-medium text-slate-600">{t ? t("noSavedWishlist") : "No saved destinations yet"}</p>
                <p className="text-[11px] text-slate-400">
                  {t ? t("noSavedWishlistHint") : "Bookmark cities on the Explore page or add them above."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t ? t("dangerZone") : "Danger Zone"}
            </h3>
            <p className="text-xs text-slate-500">
              {t ? t("dangerZoneDesc") : "Permanently remove your account and all associated itineraries."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              {t ? t("dangerZoneWarning") : "Once deleted, your profile data, trips, and saved activities cannot be recovered."}
            </p>

            <Button
              variant="destructive"
              size="sm"
              onClick={openDeleteModal}
              className="h-10 px-5 rounded-xl font-medium text-xs shrink-0 cursor-pointer bg-red-600 hover:bg-red-700 text-white shadow-xs"
            >
              {t ? t("deleteAccount") : "Delete Account"}
            </Button>
          </div>
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">{t ? t("deleteModalTitle") : "Delete Account"}</h3>
                <p className="text-xs text-slate-500">{t ? t("deleteModalSubtitle") : "This action cannot be undone"}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t ? t("deleteModalDesc") : "Please enter your password to confirm permanent account deletion."}
            </p>

            {deleteModalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                <span>{deleteModalError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="delete-password-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t ? t("currentPassword") : "Password"}</span>
                </Label>
                <div className="relative">
                  <Input
                    id="delete-password-input"
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      if (deleteModalError) setDeleteModalError("");
                    }}
                    placeholder={t ? t("passwordPlaceholder") : "Enter your password"}
                    className="pr-10 text-xs h-10 rounded-xl bg-slate-50 border-slate-200"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeletingAccount}
                  className="rounded-xl border-slate-200 text-slate-700 cursor-pointer"
                >
                  {t ? t("cancel") : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={isDeletingAccount || !deletePassword.trim()}
                  className="rounded-xl gap-1.5 cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isDeletingAccount ? (t ? t("deleting") : "Deleting...") : (t ? t("confirmDelete") : "Confirm Delete")}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}