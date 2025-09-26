import Sidebar from "@/components/Sidebar";
import { WEB_TITLE } from "@/lib/constantes";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex p-3 min-h-[100vh] bg-amber-50 dark:bg-[#171717]">
      <div className="w-1/6 sticky top-5 h-fit min-h-[100vh]">
        <Sidebar />
      </div>
      <div className="w-[100%] bg-[#ddd] rounded-xl dark:bg-content-section">
        <footer className="p-3 border-b-background border-b-2 flex-center justify-between">
          <div className="text-2xl font-bold mask-radial-from-5% font-mono">{WEB_TITLE}</div>
          <div>
            <button className="py-1 mx-2">+ income</button>
            <button className="py-1 mx-2">+ expense</button>
          </div>
        </footer>
        <main className="p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
