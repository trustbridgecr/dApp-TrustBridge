import { CircleCheck, CircleDollarSign, Circle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItemProps {
  type:
    | "supplied"
    | "borrowed"
    | "repaid"
    | "collateral"
    | "trbt_updated"
    | "backstop_claim"
    | "frozen_pool"
    | "loan_defaulted"
  description: string
  amount?: string
  token?: string
  timestamp: string
}

const iconMap = {
  supplied: { icon: CircleCheck, color: "text-green-400", borderColor: "border-green-400" },
  borrowed: { icon: CircleDollarSign, color: "text-blue-400", borderColor: "border-blue-400" },
  repaid: { icon: CircleCheck, color: "text-green-400", borderColor: "border-green-400" }, // Reusing for repay
  collateral: { icon: Circle, color: "text-yellow-400", borderColor: "border-yellow-400" },
  trbt_updated: { icon: TrendingUp, color: "text-teal-400", borderColor: "border-teal-400" },
  backstop_claim: { icon: CircleCheck, color: "text-purple-400", borderColor: "border-purple-400" }, // Example color
  frozen_pool: { icon: Circle, color: "text-red-400", borderColor: "border-red-400" }, // Example color
  loan_defaulted: { icon: CircleDollarSign, color: "text-red-400", borderColor: "border-red-400" }, // Example color
}

export default function ActivityItem({ type, description, amount, token, timestamp }: ActivityItemProps) {
  const { icon: Icon, color, borderColor } = iconMap[type]
  const titleMap = {
    supplied: "Supplied",
    borrowed: "Borrowed",
    repaid: "Repaid Loan",
    collateral: "Collateral",
    trbt_updated: "TRBT Updated",
    backstop_claim: "Claimed Backstop",
    frozen_pool: "Participated in Frozen Pool",
    loan_defaulted: "Loan Defaulted",
  }

  return (
    <div className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-800 transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            color,
            borderColor,
            "border",
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="font-medium text-gray-100">{titleMap[type]}</div>
          <div className="text-sm text-gray-400">{description}</div>
          {(amount || token) && (
            <div className="flex gap-2 mt-1">
              {amount && <span className="bg-gray-700 text-gray-200 text-xs px-2 py-0.5 rounded-full">{amount}</span>}
              {token && <span className="bg-gray-700 text-gray-200 text-xs px-2 py-0.5 rounded-full">{token}</span>}
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 flex-shrink-0">{timestamp}</div>
    </div>
  )
}
