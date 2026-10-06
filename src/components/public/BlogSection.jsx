import React from "react";
import { ArrowUpRight } from "lucide-react";
import { BLOG_POSTS } from "../../data/publicContent";
import FallbackImage from "./FallbackImage";

export default function BlogSection() {
  return (
    <section id="blog" className="section-offset bg-black py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Blog</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-wide text-white sm:text-5xl">
            FITNESS TIPS &amp; GUIDES
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-surface transition-transform hover:-translate-y-1"
            >
              <FallbackImage
                src={post.image}
                alt={post.title}
                className="h-48 w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ember">
                  {post.category}
                </span>
                <h3 className="mt-2 font-display text-xl leading-tight tracking-wide text-white">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-white/45">{post.desc}</p>
                <a
                  href="#contact"
                  className="section-offset mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/70 hover:text-ember"
                >
                  Read More <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
