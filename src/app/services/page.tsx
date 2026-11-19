"use client";

import { useEffect, useState } from "react";
import Service, { ServiceType } from "@/app/Components/Service";

const categories = [
  "All Categories",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const locations = [
  "All Locations",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

export default function BrowseServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  // Load services from backend
  useEffect(() => {
    // URL theke category poro - jemon /services?category=Wedding%20Venues
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get("category");
    if (categoryFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(categoryFromUrl);
    }

    const loadServices = async () => {
      try {
        const res = await fetch(`${process.env.SERVER_URL || "http://localhost:5000"}/services`);
        const data = await res.json();
        // PDF rule: only approved services
        setServices(
          Array.isArray(data)
            ? data.filter(
                (service: ServiceType) => service.status === "approved",
              )
            : [],
        );
      } catch {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  // Search + Filter - simple chain
  const filteredServices = services.filter((service) => {
    const matchSearch = service.serviceName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory =
      category === "All Categories" || service.category === category;
    const matchLocation =
      location === "All Locations" || service.location === location;

    return matchSearch && matchCategory && matchLocation;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("All Locations");
  };

  return (
    <section className="bg-[#FFF9F5] py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
            ✿ BROWSE SERVICES
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl lg:text-5xl">
            Explore Wedding{" "}
            <span className="italic text-[#C75B5B]">Services</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[#6F5E56]">
            Find the perfect venue, photographer, caterer and more for your
            special day.
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="mt-10 rounded-[24px] border border-[#F0DCD5] bg-white p-4 shadow-[0_8px_30px_rgba(90,40,30,0.06)] sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {/* Search by Name */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold tracking-widest text-[#A08D84]">
                SEARCH
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services by name..."
                className="w-full rounded-full border border-[#E8D5CE] bg-[#FFF9F5] px-5 py-3 text-sm outline-none placeholder:text-[#B8A89F] focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-1 block text-xs font-bold tracking-widest text-[#A08D84]">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-full border border-[#E8D5CE] bg-[#FFF9F5] px-4 py-3 text-sm text-[#241A17] outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="mb-1 block text-xs font-bold tracking-widest text-[#A08D84]">
                LOCATION
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-full border border-[#E8D5CE] bg-[#FFF9F5] px-4 py-3 text-sm text-[#241A17] outline-none focus:border-[#C75B5B] focus:ring-2 focus:ring-[#C75B5B]/20"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result count + Clear */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="font-medium text-[#6F5E56]">
              <span className="font-bold text-[#C75B5B]">
                {filteredServices.length}
              </span>{" "}
              services found
            </p>
            {(search ||
              category !== "All Categories" ||
              location !== "All Locations") && (
              <button
                onClick={clearFilters}
                className="rounded-full bg-[#FDECEA] px-4 py-1.5 text-xs font-semibold text-[#C75B5B] transition hover:bg-[#F9DCDC]"
              >
                Clear all filters ✕
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="mt-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#F3D9D0] border-t-[#C75B5B]" />
            <p className="mt-4 text-sm font-medium text-[#6F5E56]">
              Loading services...
            </p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="mt-12 rounded-[20px] border border-[#F0DCD5] bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl font-bold text-[#241A17]">
              No services found
            </p>
            <p className="mt-2 text-sm text-[#6F5E56]">
              Try a different search, category or location.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-full bg-[#C75B5B] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <Service key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
