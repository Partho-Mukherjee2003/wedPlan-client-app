import Service, { ServiceType } from "@/app/Components/service";

export default async function BrowseServicesPage() {
  const res = await fetch("http://localhost:5000/services", {
    cache: "no-store",
  });
  const servicesData: ServiceType[] = await res.json();

  // PDF rule: only approved services will show on Browse page
  const approvedServices = servicesData.filter(
    (service) => service.status === "approved",
  );

  return (
    <section className="bg-[#FFF9F5] py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
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
          <p className="mt-2 text-sm font-medium text-[#A08D84]">
            {approvedServices.length} services available
          </p>
        </div>

        {approvedServices.length === 0 ? (
          <div className="mt-12 rounded-[20px] border border-[#F0DCD5] bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl font-bold text-[#241A17]">
              No services found
            </p>
            <p className="mt-2 text-sm text-[#6F5E56]">
              Please try again later, new services are coming soon.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {approvedServices.map((service) => (
              <Service key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
