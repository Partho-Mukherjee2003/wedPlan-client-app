import Link from "next/link";
import Service, { ServiceType } from "@/app/Components/Service";

export function FeaturedServicesFallback() {
  return (
    <section
      aria-label="Featured services loading"
      aria-busy="true"
      className="bg-[#FFF9F5] py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <div className="mx-auto h-4 w-36 animate-pulse rounded-full bg-[#FDECEA]" />
          <div className="mx-auto mt-5 h-10 w-72 max-w-full animate-pulse rounded bg-[#FDECEA]" />
          <div className="mx-auto mt-4 h-4 max-w-xl animate-pulse rounded bg-[#FDECEA]" />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="h-80 animate-pulse rounded-[24px] border border-[#F0DCD5] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function FeaturedServices() {
  const apiUrl = process.env.SERVER_URL || "http://localhost:5000";

  let featuredServices: ServiceType[] = [];

  try {
    const res = await fetch(`${apiUrl}/services`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.status}`);
    }

    const servicesData: ServiceType[] = await res.json();
    if (!Array.isArray(servicesData)) {
      throw new Error("Services API returned an invalid response.");
    }

    // PDF rule: sudhu approved service, prothom 6 ta
    featuredServices = servicesData
      .filter((service) => service.status === "approved")
      .slice(0, 6);
  } catch {
    featuredServices = [];
  }

  return (
    <section className="bg-[#FFF9F5] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
            ✿ FEATURED SERVICES
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl lg:text-5xl">
            Featured Wedding{" "}
            <span className="italic text-[#C75B5B]">Services</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#6F5E56]">
            Handpicked wedding services from our trusted vendors — ready to book
            for your special day.
          </p>
        </div>

        {/* Services grid */}
        {featuredServices.length === 0 ? (
          <div className="mt-12 rounded-[20px] border border-[#F0DCD5] bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl font-bold text-[#241A17]">
              No featured services yet
            </p>
            <p className="mt-2 text-sm text-[#6F5E56]">
              Please check again soon — new services are coming.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <Service key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* View all button */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-block rounded-full border border-[#E3C9BE] bg-white px-8 py-3.5 text-sm font-semibold text-[#241A17] transition hover:border-[#C75B5B] hover:bg-[#FFF0EB] hover:text-[#A93F3F]"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
