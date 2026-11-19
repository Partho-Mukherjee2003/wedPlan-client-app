import Link from "next/link";
import ServiceDetails from "@/app/Components/ServiceDetails";
import { ServiceType } from "@/app/Components/Service";
export const dynamic = "force-dynamic";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`http://localhost:5000/services/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <section className="bg-[#FFF9F5] py-20">
        <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
          <h1 className="font-serif text-3xl font-bold text-[#241A17]">
            Service Not Found
          </h1>
          <p className="mt-3 text-[#6F5E56]">
            This service does not exist or has been removed.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-block rounded-full bg-[#C75B5B] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#B04A4A]"
          >
            ← Back to Services
          </Link>
        </div>
      </section>
    );
  }

  const service: ServiceType = await res.json();

  return <ServiceDetails service={service} />;
}
