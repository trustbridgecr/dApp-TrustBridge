import { Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardFooter() {
  return (
    <footer className="bg-white dark:bg-[#18181B] text-black dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 sm:flex-row sm:gap-6">
            <p className="text-center text-sm leading-loose text-gray-600 dark:text-gray-400">
              Built by{" "}
              <a
                href="https://trust-bridge-cr.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                TrustBridge
              </a>
              . The source code is available on{" "}
              <a
                href="https://github.com/TrustBridgeCR"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-black dark:text-white" 
            onClick={() => window.open("https://github.com/TrustBridgeCR", "_blank")}>
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-black dark:text-white"
            onClick={() => window.open("https://x.com/TrustBridgecr", "_blank")}>
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
