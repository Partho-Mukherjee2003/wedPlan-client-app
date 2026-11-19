
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // WedPlan custom fields - PDF onujayi
  role: "admin" | "vendor" | "customer";
  isBlocked: boolean;
  businessName?: string | null;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt?: Date | string | null;
};



function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="20" cy="10" rx="6" ry="9" fill="currentColor" transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#C9A86A" />
    </svg>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const user = session?.user as UserType | undefined;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // Empty function for you - add ImgBB upload here later
  const uploadToImgBB = async (file: File) => {
    // Add your ImgBB upload functionality here
    // Return the image URL after upload
    return null;
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name"));
    const imageFile = formData.get("image") as File;

    try {
      let imageUrl = user?.image || "";

      // Jodi notun image select kore, ImgBB te upload hobe
      if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadToImgBB(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const { error: updateError } = await authClient.updateUser({
        name,
        image: imageUrl,
      });

      if (updateError) {
        setError(updateError.message ?? "Profile update failed.");
        return;
      }

      setSuccess("Profile updated successfully!");
      setShowForm(false);
      setImagePreview(null);
    } catch {
      setError("Could not connect to the authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isPending) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#FFF9F5]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
          <p className="mt-4 text-sm font-medium text-[#6F5E56]">Loading profile...</p>
        </div>
      </section>
    );
  }

  // Login na thakle
  if (!user) {
    return (
      <section className="bg-[#FFF9F5] py-20">
        <div className="mx-auto w-full max-w-md px-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-[#241A17]">Please Sign In</h1>
          <p className="mt-3 text-[#6F5E56]">You need to sign in to view your profile.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#FFF9F5] py-12 sm:py-16">
      <Flower className="absolute -left-6 top-10 h-24 w-24 text-[#FDECEA]" />
      <Flower className="absolute -right-6 bottom-10 h-28 w-28 text-[#FDECEA]" />

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
            ✿ MY PROFILE
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
            Profile <span className="italic text-[#C75B5B]">Settings</span>
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 overflow-hidden rounded-[28px] border border-[#F0DCD5] bg-white shadow-[0_8px_30px_rgba(90,40,30,0.06)]"
        >
          {/* Top banner */}
          <div className="h-24 bg-gradient-to-r from-[#FDECEA] via-[#F9DCDC] to-[#EADFC6] sm:h-28" />

          <div className="px-6 pb-8 sm:px-10">
            {/* Avatar + Name */}
            <div className="-mt-12 flex flex-col items-center text-center sm:-mt-14">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src={imagePreview || user.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
                alt={user.name}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md sm:h-28 sm:w-28"
              />
              <h2 className="mt-4 font-serif text-2xl font-bold text-[#241A17] sm:text-3xl">
                {user.name}
              </h2>
              <p className="mt-1 text-sm text-[#6F5E56]">{user.email}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-full bg-[#FDECEA] px-3 py-1 text-xs font-bold capitalize text-[#C75B5B]">
                  {user.role || "Customer"}
                </span>
                <span className="rounded-full bg-[#EADFC6] px-3 py-1 text-xs font-bold capitalize text-[#A8864A]">
                  {user.subscriptionPlan || "Free"} Plan
                </span>
              </div>
            </div>

            {/* Info grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs font-bold tracking-widest text-[#A08D84]">FULL NAME</p>
                <p className="mt-1 font-semibold text-[#241A17]">{user.name}</p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs font-bold tracking-widest text-[#A08D84]">EMAIL</p>
                <p className="mt-1 font-semibold text-[#241A17]">{user.email}</p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs font-bold tracking-widest text-[#A08D84]">ROLE</p>
                <p className="mt-1 font-semibold capitalize text-[#241A17]">{user.role || "Customer"}</p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-4">
                <p className="text-xs font-bold tracking-widest text-[#A08D84]">SUBSCRIPTION</p>
                <p className="mt-1 font-semibold capitalize text-[#241A17]">{user.subscriptionPlan || "Free"}</p>
              </div>
            </div>

            {/* Success / Error */}
            {error && (
              <p className="mt-5 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">{error}</p>
            )}
            {success && (
              <p className="mt-5 rounded-xl bg-[#E6F4EC] px-4 py-3 text-sm font-medium text-[#2E7D5B]">{success}</p>
            )}

            {/* Update Button */}
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(!showForm)}
                className="rounded-full bg-[#C75B5B] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
              >
                {showForm ? "Cancel" : "✎ Update Profile"}
              </motion.button>
            </div>

            {/* Update Form - click korlei ashbe */}
            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleUpdate}
                  className="overflow-hidden"
                >
                  <div className="mt-8 flex flex-col gap-5 border-t border-[#F7E8E2] pt-8">

                    <div>
                      <label htmlFor="name" className="mb-1 block text-sm font-semibold text-[#241A17]">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={user.name}
                        required
                        className="w-full rounded-xl border border-[#E8D5CE] px-4 py-3 text-sm outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="image" className="mb-1 block text-sm font-semibold text-[#241A17]">
                        Profile Image
                      </label>
                      <div className="flex items-center gap-3">
                        {imagePreview && (
                          <img src={imagePreview} alt="Preview" className="h-12 w-12 rounded-full object-cover ring-2 ring-[#F0DCD5]" />
                        )}
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full rounded-xl border border-[#E8D5CE] px-3 py-2 text-sm text-[#6F5E56] file:mr-3 file:rounded-full file:border-0 file:bg-[#FDECEA] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#C75B5B]"
                        />
                      </div>
                      <p className="mt-1 text-xs text-[#A08D84]">Image will be uploaded with ImgBB.</p>
                    </div>

                    {/* Email, Role, Plan - change kora jabe na, PDF rule */}
                    <div className="rounded-xl bg-[#FFF9F5] px-4 py-3 text-xs text-[#A08D84]">
                      Email, Role and Subscription Plan cannot be changed from here.
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-full bg-[#C75B5B] py-3.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? "Updating..." : "Save Changes"}
                    </button>

                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
