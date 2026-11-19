"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Photography & Videography",
    text: "Capture every beautiful moment",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Wedding Venues",
    text: "Halls and gardens for your day",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Decoration & Florist",
    text: "Stages, flowers and lights",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Catering Services",
    text: "Delicious food for your guests",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Makeup & Styling",
    text: "Bridal makeup and hairstyling",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Wedding Fashion",
    text: "Lehenga, saree and bridal wear",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=800&auto=format&fit=crop",
  },
];

export default function WeddingCategories() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="rounded-full bg-[#FDECEA] px-4 py-1 text-xs font-bold tracking-widest text-[#C75B5B]">
            ✿ CATEGORIES
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#241A17] sm:text-4xl lg:text-5xl">
            Explore by <span className="italic text-[#C75B5B]">Category</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[#6F5E56]">
            Choose a category and find the perfect service for your wedding.
          </p>
        </motion.div>

        {/* Category cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Link
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group block overflow-hidden rounded-[24px] border border-[#F0DCD5] bg-white shadow-[0_8px_30px_rgba(90,40,30,0.05)] transition hover:shadow-[0_16px_40px_rgba(199,91,91,0.14)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#C75B5B] backdrop-blur">
                    Explore →
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[#241A17] group-hover:text-[#C75B5B]">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#6F5E56]">{category.text}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
