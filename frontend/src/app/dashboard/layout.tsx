import { Header } from "@/components/layouts/header/Header";
import { ScrollArea } from "@/components/ui/scroll-area";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Header />
        <ScrollArea className="flex-1">{children}</ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
