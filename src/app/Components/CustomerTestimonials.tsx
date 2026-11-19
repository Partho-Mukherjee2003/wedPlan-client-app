"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Samiul Karim",
    role: "Groom • Dhaka",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    service: "Royal Wedding Photography",
    date: "Dec 20, 2026",
    quote:
      "WedPlan made our wedding so easy. We found our photographer in one day, and the photos are beyond beautiful. Every moment was captured perfectly.",
    featured: true,
  },
  {
    name: "Farhana Akter",
    role: "Bride • Dhaka",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    service: "Royal Palace Grand Hall",
    date: "Jan 15, 2027",
    quote:
      "The venue was exactly like the photos — even more beautiful in real life. Booking was so simple, no stress at all.",
    featured: false,
  },
  {
    name: "Arif Hossain",
    role: "Groom • Chattogram",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    service: "Dream Stage Decoration",
    date: "Dec 25, 2026",
    quote:
      "Our stage looked like a dream. Pink and white flowers everywhere, guests are still talking about it.",
    featured: false,
  },
];

export default function CustomerTestimonials() {
  return (
    <section className="relative overflow-hidden bg-[#FDECEA] py-16 sm:py-24">
      {/* Big soft quote in background */}
      <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none font-serif text-[180px] leading-none text-[#C75B5B]/10 sm:text-[260px]">
        &ldquo;
      </span>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="rounded-full bg-white px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
            ❤ REAL STORIES
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl lg:text-5xl">
            Loved by{" "}
            <span className="italic text-[#C75B5B]">Happy Couples</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#6F5E56]">
            1200+ couples planned their dream wedding with WedPlan. Here is what
            they say about us.
          </p>

          {/* Overall rating */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#241A17] shadow-sm">
            <span className="text-[#C9A86A]">★★★★★</span>
            4.9 / 5.0 — from 1200+ reviews
          </div>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{
                y: -8,
                rotate: index === 1 ? 0 : index === 0 ? -0.5 : 0.5,
              }}
              className={`relative rounded-[28px] border p-8 shadow-[0_8px_30px_rgba(90,40,30,0.06)] ${
                t.featured
                  ? "border-[#C75B5B]/30 bg-[#241A17] text-white lg:-translate-y-4"
                  : "border-[#F0DCD5] bg-white"
              }`}
            >
              {/* Quote mark */}
              <span
                className={`font-serif text-5xl leading-none ${t.featured ? "text-[#C75B5B]" : "text-[#F9DCDC]"}`}
              >
                &ldquo;
              </span>

              {/* Stars */}
              <p className="mt-2 text-[#C9A86A] tracking-widest">★★★★★</p>

              <p
                className={`mt-3 leading-relaxed ${t.featured ? "text-white/90" : "text-[#6F5E56]"}`}
              >
                {t.quote}
              </p>

              {/* Service tag */}
              <span
                className={`mt-5 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  t.featured
                    ? "bg-[#C75B5B] text-white"
                    : "bg-[#FDECEA] text-[#C75B5B]"
                }`}
              >
                {t.service} • {t.date}
              </span>

              {/* Person */}
              <div className="mt-6 flex items-center gap-3 border-t border-current/10 pt-5">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#C9A86A]"
                />
                <div>
                  <p
                    className={`font-semibold ${t.featured ? "text-white" : "text-[#241A17]"}`}
                  >
                    {t.name}
                  </p>
                  <p
                    className={`text-xs ${t.featured ? "text-white/60" : "text-[#A08D84]"}`}
                  >
                    {t.role}
                  </p>
                </div>
                <span className="ml-auto text-xl">❤</span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-8 text-center text-sm text-[#6F5E56]"
        >
          <p>
            <b className="font-serif text-xl text-[#241A17]">1200+</b> Happy
            Couples
          </p>
          <p>
            <b className="font-serif text-xl text-[#241A17]">500+</b> Trusted
            Vendors
          </p>
          <p>
            <b className="font-serif text-xl text-[#241A17]">98%</b> Would
            Recommend Us
          </p>
        </motion.div>
      </div>
    </section>
  );
}
