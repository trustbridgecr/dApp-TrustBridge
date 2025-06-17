"use client";

import { useEffect, useState } from "react";

// Types for About Us data
export interface TeamMember {
  name: string;
  role: string;
}

export interface AboutData {
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
            role: "CEO & FullStack Developer",
          },
          {
            name: "Yuliana Gonzáles",
            role: "BackEnd Developer",
          },
          {
            name: "Daniel Coto",
            role: "FrontEnd Developer",
          },
        ],
        technology:
          "We use the Stellar blockchain to provide fast, secure, and low-cost transactions. Our platform is designed to be accessible to both experienced cryptocurrency users and those new to this technology.",
      });
    }, 800);
  });
}

export function useAboutData() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch about data:", error);
        setError("Failed to load about data");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
