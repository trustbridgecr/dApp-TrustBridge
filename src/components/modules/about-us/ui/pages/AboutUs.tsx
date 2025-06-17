"use client";
import Link from "next/link";
import { TeamMember, useAboutData } from "../../hooks/useAbout.hook";

export default function AboutPage() {
  const { data, loading, error } = useAboutData();

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-2">
      <div className="max-w-6xl w-full">
        <Link
          href="/"
          className="inline-block mb-6 px-4 py-2 rounded-md border border-emerald-700 text-emerald-400 font-medium transition-colors duration-200 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">About Us</h1>

        {loading && (
          <div className="text-emerald-300 text-lg py-16 text-center">
            Loading...
          </div>
        )}

        {error && (
          <div className="text-red-400 text-lg py-16 text-center">{error}</div>
        )}

        {data && (
          <>
            <section className="mb-6 rounded-xl border border-emerald-900 bg-black/80 p-6">
              <h2 className="text-2xl font-semibold text-emerald-300 mb-2">
                Our Mission
              </h2>
              <p className="text-white/90">{data.mission}</p>
            </section>

            <section className="mb-6 rounded-xl border border-emerald-900 bg-black/80 p-6">
              <h2 className="text-2xl font-semibold text-emerald-300 mb-2">
                Our Story
              </h2>
              <p className="text-white/90" style={{ whiteSpace: "pre-line" }}>
                {data.story}
              </p>
            </section>

            <section className="mb-6 rounded-xl border border-emerald-900 bg-black/80 p-6">
              <h2 className="text-2xl font-semibold text-emerald-300 mb-4">
                Our Team
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                {data.team.map((member: TeamMember) => (
                  <div className="flex flex-col items-center" key={member.name}>
                    <div
                      className="w-16 h-16 rounded-full bg-emerald-600 mb-2"
                      role="img"
                      aria-label={`${member.name} avatar placeholder`}
                    />
                    <span className="text-white font-semibold">
                      {member.name}
                    </span>
                    <span className="text-emerald-300 text-sm">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-emerald-900 bg-black/80 p-6">
              <h2 className="text-2xl font-semibold text-emerald-300 mb-2">
                Blockchain Technology
              </h2>
              <p className="text-white/90">{data.technology}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
