import { useWebSocket } from "@/hooks/useWebSocket";
import { Notifications } from "../components/notifications/Notifications";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useWebSocket(); // Initialize WebSocket connection

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">TrustBridge</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Notifications />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
