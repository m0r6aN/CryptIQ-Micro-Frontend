// apps/cryptiq-shell/features/dashboard/page.tsx

import React from 'react';

const DashboardPage = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Cryptocurrency Dashboard</h2>
      <button className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700 mb-4">
        Refresh Data
      </button>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" className="border border-gray-300 p-2 rounded" placeholder="BTC, SOL, ETH" />
        <input type="text" className="border border-gray-300 p-2 rounded" placeholder="USDT" />
        <button className="col-span-2 bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600">
          Fetch Data
        </button>
      </div>
    </section>
  );
};

export default DashboardPage;
