import Link from "next/link";

// Type for one service - from database
export type ServiceType = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category:
    | "Photography & Videography"
    | "Wedding Venues"
    | "Decoration & Florist"
    | "Catering Services"
    | "Makeup & Styling"
    | "Wedding Fashion";
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "approved" | "pending" | "rejected";
  createdAt: string;
};

// Dummy vendor names - later backend will send real vendor info
const vendorNames: Record<string, string> = {
  user_vendor_01: "Dream Wedding Studio",
  user_vendor_02: "Royal Palace Convention",
  user_vendor_03: "Bloom & Bliss Decor",
  user_vendor_04: "Taste of Dhaka Catering",
  user_vendor_05: "Glamour Bridal Studio",
};

type ServiceProps = {
  service: ServiceType;
};

export default function Service({ service }: ServiceProps) {
  const vendorName = vendorNames[service.vendorId] || "WedPlan Vendor";

  return (
    <div className="group overflow-hidden rounded-[24px] border border-[#F0DCD5] bg-white shadow-[0_8px_30px_rgba(90,40,30,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(199,91,91,0.15)]">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={service.images?.[0]}
          alt={service.serviceName}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category badge on image */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#C75B5B] backdrop-blur">
          {service.category}
        </span>
        {/* Price badge */}
        <span className="absolute bottom-4 right-4 rounded-full bg-[#C75B5B] px-4 py-1.5 text-sm font-bold text-white shadow-md">
          ৳{service.price.toLocaleString()}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-xl font-bold leading-snug text-[#241A17]">
          {service.serviceName}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6F5E56]">
          {service.description}
        </p>

        {/* Location + Vendor */}
        <div className="mt-4 flex items-center justify-between border-t border-[#F7E8E2] pt-4 text-sm">
          <span className="flex items-center gap-1 text-[#6F5E56]">
            📍 {service.location}
          </span>
          <span className="flex items-center gap-2 font-medium text-[#241A17]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FDECEA] text-xs font-bold text-[#C75B5B]">
              {vendorName.charAt(0)}
            </span>
            {vendorName}
          </span>
        </div>

        <Link
          href={`/services/${service._id}`}
          className="mt-5 block w-full rounded-full bg-[#C75B5B] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#B04A4A] active:bg-[#9E3D3D]"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
