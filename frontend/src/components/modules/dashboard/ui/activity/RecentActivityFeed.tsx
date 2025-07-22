"use client";

import ActivityItem from "./AtivityItem";

const activityData = [
  {
    type: "supplied",
    description: "Supplied to Main Pool",
    amount: "15 000",
    token: "USDC",
    timestamp: "Jan 21, 04:30 AM",
  },
  {
    type: "borrowed",
    description: "Borrowed against XLM collateral",
    amount: "5 000",
    token: "USDC",
    timestamp: "Jan 21, 03:15 AM",
  },
  {
    type: "collateral",
    description: "Collateral deposited",
    amount: "25 000",
    token: "XLM",
    timestamp: "Jan 20, 10:45 AM",
  },
  {
    type: "trbt_updated",
    description: "Score updated: 750 → 780",
    token: "TBRG",
    timestamp: "Jan 20, 08:20 AM",
  },
  {
    type: "repaid",
    description: "Repaid loan for USDC",
    amount: "2 000",
    token: "USDC",
    timestamp: "Jan 19, 06:00 PM",
  },
  {
    type: "backstop_claim",
    description: "Claimed backstop funds",
    amount: "100",
    token: "USDC",
    timestamp: "Jan 18, 02:00 PM",
  },
];

export default function RecentActivityFeed() {
  return (
    <div className="card p-6 mb-8">
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Actividad Reciente
      </h2>
      <div className="h-72 overflow-y-auto pr-2 custom-scrollbar">
        {" "}
        {activityData.map((activity, index) => (
          <ActivityItem
            key={index}
            type={
              activity.type as
                | "supplied"
                | "borrowed"
                | "repaid"
                | "collateral"
                | "trbt_updated"
                | "backstop_claim"
                | "frozen_pool"
                | "loan_defaulted"
            }
            description={activity.description}
            amount={activity.amount}
            token={activity.token}
            timestamp={activity.timestamp}
          />
        ))}
      </div>
    </div>
  );
}
