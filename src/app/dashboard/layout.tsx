import { SidebarProvider } from "@/components/ui/sidebar";
import { TrustBridgeSidebar } from "@/components/layouts/sidebar/Sidebar";
import { Header } from "@/components/layouts/header/Header";
import { ScrollArea } from "@/components/ui/scroll-area";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <TrustBridgeSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <ScrollArea className="flex-1">{children}</ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
