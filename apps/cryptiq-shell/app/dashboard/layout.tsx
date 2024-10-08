// File: apps/web/app/(dashboard)/layout.tsx

import { Sidebar } from "../../shared/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">{children}</div>
    </div>
  )
}
