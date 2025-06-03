"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Types for About Us data
interface TeamMember {
  name: string;
  role: string;
}
interface AboutData {
  mission: string;
  story: string;
  team: TeamMember[];
  technology: string;
}

// Mock API fetch function
async function fetchAboutData(): Promise<AboutData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mission:
          "To empower individuals and communities with direct financial access by removing traditional barriers, fees, and intermediaries through a trustless system.",
        story: `TrustBridge was born in 2024 when a group of friends passionate about blockchain technologies came together with a common vision: to create a bridge of trust between capital and opportunity.\n\nBuilt on the Stellar blockchain, we chose this technology for its speed, low cost, and focus on financial inclusion, values that are at the core of our identity.`,
        team: [
          {
            name: "Josué Brenes",
            role: "Founder & FullStack Developer",
          },
          {
            name: "Yuliana Gonzáles",
            role: "CO-Founder & BackEnd Developer",
          },
          {
            name: "Daniel Coto",
            role: "CO-Founder & FrontEnd Developer",
          },
        ],
        technology:
          "We use the Stellar blockchain to provide fast, secure, and low-cost transactions. Our platform is designed to be accessible to both experienced cryptocurrency users and those new to this technology.",
      });
    }, 800);
  });
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-black/95 py-8 px-2">
      <div className="max-w-6xl w-full">
        <Link href="/" passHref legacyBehavior>
          <a className="inline-block mb-6 px-4 py-2 rounded-md border border-emerald-700 text-emerald-400 font-medium transition-colors duration-200 hover:bg-emerald-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
            &larr; Back to Home
          </a>
        </Link>
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">About Us</h1>
        {loading ? (
          <div className="text-emerald-300 text-lg py-16 text-center">
            Loading...
          </div>
        ) : data ? (
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
                    <div className="w-16 h-16 rounded-full bg-emerald-600 mb-2" />
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
        ) : null}
      </div>
    </div>
  );
}
