"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const locations = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

type UserType = {
  id: string;
  subscriptionPlan: "free" | "premium";
};

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as UserType | undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const uploadToImgBB = async (file: File): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      const message = "ImgBB API key not found. Check your .env.local file.";
      setError(message);
      toast.error(message);
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data?.data?.url) {
      const message =
        data?.error?.message || "Image upload failed. Please try again.";
      setError(message);
      toast.error(message);
      return null;
    }

    toast.success("Image uploaded successfully");
    return data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get("image") as File;

    try {
      if (!imageFile || imageFile.size === 0) {
        const message = "Please select a service image.";
        setError(message);
        toast.error(message);
        return;
      }

      const imageUrl = await uploadToImgBB(imageFile);
      if (!imageUrl) return;

      const serviceData = {
        vendorId: user?.id,
        subscriptionPlan: user?.subscriptionPlan || "free",
        serviceName: String(formData.get("serviceName")),
        category: String(formData.get("category")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        location: String(formData.get("location")),
        images: [imageUrl],
      };

      const res = await fetch(
        `${process.env.SERVER_URL || "http://localhost:5000"}/services`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || "Could not add service.";
        setError(message);
        toast.error(message);
        return;
      }

      setSuccess("Service submitted! It will be visible after admin approval.");
      toast.success(
        `Service '${serviceData.serviceName}' submitted for approval 💍`,
      );
      form.reset();
      setImagePreview(null);
      setTimeout(() => router.push("/dashboard/vendor/my-services"), 1500);
    } catch {
      const message = "Could not connect to the server.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#E8D5CE] px-4 py-3.5 text-sm outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20";
  const labelClass = "mb-1.5 block text-sm font-semibold text-[#241A17]";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-[#241A17] sm:text-4xl">
          Add <span className="italic text-[#C75B5B]">Service</span>
        </h1>
        <p className="mt-2 text-[#6F5E56]">
          New services will be pending until admin approval.
        </p>
      </div>

      {error && (
        <p className="mt-5 rounded-xl bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-5 rounded-xl bg-[#E6F4EC] px-4 py-3 text-sm font-medium text-[#2E7D5B]">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-6 rounded-[24px] border border-[#F0DCD5] bg-white p-6 shadow-[0_8px_30px_rgba(90,40,30,0.06)] sm:p-8"
      >
        <div>
          <label className={labelClass}>Service Name</label>
          <input
            name="serviceName"
            type="text"
            required
            placeholder="e.g. Premium Wedding Photography"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Service Category</label>
            <select name="category" required className={inputClass}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <select name="location" required className={inputClass}>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Describe your service..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Price (BDT)</label>
          <input
            name="price"
            type="number"
            required
            min={1}
            placeholder="e.g. 50000"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Service Image</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mb-3 h-52 w-full rounded-xl object-cover"
            />
          )}
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            className="w-full rounded-xl border border-[#E8D5CE] px-3 py-2.5 text-sm text-[#6F5E56] file:mr-3 file:rounded-full file:border-0 file:bg-[#FDECEA] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#C75B5B]"
          />
          <p className="mt-1.5 text-xs text-[#A08D84]">
            Image will be uploaded with ImgBB.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#C75B5B] py-4 text-sm font-semibold text-white transition hover:bg-[#B04A4A] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Submitting..." : "Submit Service"}
        </button>
      </form>
    </div>
  );
}
