import Link from "next/link";

// Simple flower for decoration
function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="10"
          rx="6"
          ry="9"
          fill="currentColor"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#C9A86A" />
    </svg>
  );
}

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F5]">
      {/* Light animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(10deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(70vh) rotate(180deg); opacity: 0; }
        }
        .float-slow { animation: float 5s ease-in-out infinite; }
        .float-slower { animation: float 7s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.8s ease both; }
        .fade-up-1 { animation: fadeUp 0.8s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.8s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.8s ease 0.3s both; }
        .fall { animation: fall 9s linear infinite; }
      `}</style>

      {/* Falling petals - whole banner */}
      <span className="fall absolute left-[15%] top-0 text-lg text-[#C75B5B]">
        ❤
      </span>
      <span
        className="fall absolute left-[45%] top-0 text-sm text-[#C9A86A]"
        style={{ animationDelay: "3s" }}
      >
        ✿
      </span>
      <span
        className="fall absolute left-[80%] top-0 text-lg text-[#C75B5B]"
        style={{ animationDelay: "5s" }}
      >
        ❤
      </span>

      {/* Corner flowers */}
      <Flower className="float-slow absolute -left-6 top-10 h-24 w-24 text-[#F9DCDC]" />
      <Flower className="float-slower absolute -right-6 bottom-10 h-28 w-28 text-[#FDECEA]" />

      {/* Container - content only */}
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        {/* Left - Text */}
        <div className="text-center lg:text-left">
          <span className="fade-up inline-flex items-center gap-2 rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
            ✿ PREMIUM WEDDING PLANNING PLATFORM
          </span>

          <h1 className="fade-up-1 mt-6 font-serif text-4xl font-bold leading-tight text-[#241A17] sm:text-5xl lg:text-6xl">
            Plan Your{" "}
            <span className="italic text-[#C75B5B]">Dream Wedding</span>
            <br />
            Beautifully & Easily
          </h1>

          <p className="fade-up-2 mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#6F5E56] lg:mx-0">
            Find trusted venues, photographers, caterers and decorators — all in
            one place. Book your perfect wedding services and make your special
            day truly unforgettable.
          </p>

          <div className="fade-up-3 mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center">
            <Link
              href="/services"
              className="rounded-full bg-[#C75B5B] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#B04A4A] hover:shadow-[0_12px_32px_rgba(199,91,91,0.16)] active:bg-[#9E3D3D]"
            >
              Explore Wedding Services →
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-[#E3C9BE] bg-white px-8 py-3.5 text-sm font-semibold text-[#241A17] transition hover:border-[#C75B5B] hover:bg-[#FFF0EB] hover:text-[#A93F3F]"
            >
              Become a Vendor
            </Link>
          </div>

          {/* Small stats */}
          <div className="fade-up-3 mt-10 flex items-center justify-center gap-8 lg:justify-start">
            <div>
              <p className="font-serif text-2xl font-bold text-[#241A17]">
                500+
              </p>
              <p className="text-xs text-[#A08D84]">Trusted Vendors</p>
            </div>
            <div className="h-10 w-px bg-[#F0DCD5]" />
            <div>
              <p className="font-serif text-2xl font-bold text-[#241A17]">
                1200+
              </p>
              <p className="text-xs text-[#A08D84]">Happy Couples</p>
            </div>
            <div className="h-10 w-px bg-[#F0DCD5]" />
            <div>
              <p className="font-serif text-2xl font-bold text-[#241A17]">
                50+
              </p>
              <p className="text-xs text-[#A08D84]">Venues</p>
            </div>
          </div>
        </div>

        {/* Right - Image */}
        <div className="fade-up-2 relative mx-auto w-full max-w-lg">
          {/* Main wedding image */}
          <div className="overflow-hidden rounded-[28px] border-4 border-white shadow-[0_16px_40px_rgba(90,40,30,0.12)]">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
              alt="Happy wedding couple"
              className="h-[380px] w-full object-cover sm:h-[460px]"
            />
          </div>

          {/* Floating flower */}
          <Flower className="float-slow absolute -left-6 -top-6 h-16 w-16 text-[#C75B5B]" />
          <Flower className="float-slower absolute -bottom-5 -right-4 h-14 w-14 text-[#C9A86A]" />

          {/* Floating card - Rating */}
          <div className="float-slow absolute -left-3 bottom-16 rounded-2xl border border-[#F0DCD5] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(90,40,30,0.08)] sm:-left-8">
            <p className="text-sm font-bold text-[#241A17]">⭐ 4.9 / 5.0</p>
            <p className="text-xs text-[#A08D84]">1200+ happy couples</p>
          </div>

          {/* Floating card - Booking */}
          <div className="float-slower absolute -right-2 top-8 rounded-2xl border border-[#F0DCD5] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(90,40,30,0.08)] sm:-right-6">
            <p className="text-sm font-bold text-[#C75B5B]">
              ❤ Booking Confirmed
            </p>
            <p className="text-xs text-[#A08D84]">Royal Palace Hall • Dec 20</p>
          </div>
        </div>
      </div>
    </section>
  );
}
