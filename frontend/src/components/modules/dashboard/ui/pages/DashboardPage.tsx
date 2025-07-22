"use client";

import Image from "next/image";
import StatCard from "../cards/StatCard";
import RecentActivityFeed from "../activity/RecentActivityFeed";

export default function Dashboard() {
  const handleManagePosition = () => {
    alert(
      "Position management functionality will be implemented in the full version.",
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">
        Bienvenido de vuelta, <span className="text-success">GABU...HE3JH</span>
      </h1>
      <p className="text-gray-400 mb-6">
        Revisa tus posiciones y actividad en un solo lugar
      </p>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Supplied"
          value="$456,289"
          change="+1.8%"
          changeType="positive"
          icon="fas fa-coins"
        />
        <StatCard
          title="Total Borrowed"
          value="$125,750"
          change="+0.5%"
          changeType="positive"
          icon="fas fa-hand-holding-dollar"
        />
        <StatCard
          title="Balance Disponible"
          value="$330,539"
          icon="fas fa-sack-dollar"
        />
        <StatCard
          title="Préstamos Activos"
          value="3"
          icon="fas fa-file-contract"
        />
      </div>

      {/* Activity Chart */}
      <RecentActivityFeed />

      {/* Current Positions Table */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Posiciones Actuales</h2>
        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Activo</th>
                <th>Cantidad</th>
                <th>APY</th>
                <th>Colateral</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {/* USDC Position */}
              <tr>
                <td>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src="/img/tokens/usdc.png"
                        alt="USDC Token"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <div className="font-medium">USDC</div>
                      <div className="text-xs text-gray-400">USD Coin</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="font-medium">120,000</div>
                  <div className="text-xs text-gray-400">$120,000</div>
                </td>
                <td>
                  <div className="text-success font-medium">3.2%</div>
                </td>
                <td>
                  <div className="text-xs">-</div>
                </td>
                <td>
                  <div className="bg-green-900 bg-opacity-20 text-green-400 text-xs inline-block px-2 py-1 rounded">
                    Activo
                  </div>
                </td>
                <td>
                  <button
                    className="btn-secondary text-xs px-2 py-1"
                    onClick={handleManagePosition}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>
              {/* XLM Position */}
              <tr>
                <td>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                      <img
                        src="/img/tokens/xlm.png"
                        alt="XLM"
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium">XLM</div>
                      <div className="text-xs text-gray-400">
                        Stellar Lumens
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="font-medium">550,000</div>
                  <div className="text-xs text-gray-400">$330,000</div>
                </td>
                <td>
                  <div className="text-success font-medium">2.8%</div>
                </td>
                <td>
                  <div className="text-xs">Sí (75%)</div>
                </td>
                <td>
                  <div className="bg-blue-900 bg-opacity-20 text-blue-400 text-xs inline-block px-2 py-1 rounded">
                    Collateral
                  </div>
                </td>
                <td>
                  <button
                    className="btn-secondary text-xs px-2 py-1"
                    onClick={handleManagePosition}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
