import { Calendar, Home, Inbox, Plus, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Portfolio",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Analysis",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Trade",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      } = useSidebar()

    return (
        <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                        <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
            <SidebarGroupLabel>Wallets</SidebarGroupLabel>
                <SidebarGroupAction>
                    <Plus /> <span className="sr-only">Add Wallet</span>
                </SidebarGroupAction>
                <SidebarGroupContent></SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
            <SidebarGroupLabel>Exchanges</SidebarGroupLabel>
                <SidebarGroupAction>
                    <Plus /> <span className="sr-only">Add Exchange</span>
                </SidebarGroupAction>
                <SidebarGroupContent></SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        </Sidebar>
    ) 
}
