import { DashboardView } from "@/components/dashboard/dashboard-view"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { getManagerContextOrNull } from "@/lib/manager-auth"
import { getDashboard } from "@/services/dashboard.service"
import { getLowStockCount } from "@/services/stock.service"
import type { DashboardDTO } from "@/types/dashboard"

const emptyDashboard = (): DashboardDTO => ({
  today: { sales: 0, orders: 0, aov: 0, tax: 0, discount: 0 },
  yesterdaySales: 0,
  month: { sales: 0, orders: 0, aov: 0, tax: 0, discount: 0 },
  lastMonthSales: 0,
  openNow: { count: 0, value: 0, oldestMinutes: null },
  occupancy: { occupied: 0, total: 0 },
  voidsToday: 0,
  paymentMixToday: [],
  orderTypeToday: [
    { type: "DINE_IN", orders: 0 },
    { type: "TAKEAWAY", orders: 0 },
    { type: "DELIVERY", orders: 0 },
  ],
  trend: [],
  topItemsToday: [],
})

export default async function Page() {
  const ctx = await getManagerContextOrNull()
  if (!ctx) {
    return (
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          title="Dashboard"
          description="Your restaurant at a glance."
        />
        <EmptyState
          title="No restaurant yet"
          description="Ask an admin to onboard your restaurant to start seeing your numbers."
        />
      </div>
    )
  }

  let data = emptyDashboard()
  let lowStock = 0

  try {
    ;[data, lowStock] = await Promise.all([
      getDashboard(ctx.restaurantId),
      getLowStockCount(ctx.restaurantId),
    ])
  } catch (error) {
    console.error("[benchmark-dashboard] Falling back to empty dashboard", error)
  }

  return <DashboardView data={data} lowStock={lowStock} />
}
