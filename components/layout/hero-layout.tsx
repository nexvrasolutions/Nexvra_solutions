import { cn } from "@/lib/utils";
import Navbar from "./navbar";

type Props = {
  isProjectDetail?:boolean
  children: React.ReactNode;
};

export default function HeroLayout({ isProjectDetail=false,children }: Props) {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">

      {/* Grid Lines - hide on mobile */}
      <div className={cn("hidden lg:block absolute left-[3%] xl:left-[5%] top-0 w-px bg-grid", isProjectDetail ? "h-[72%]" : "h-full")} />
      <div className={cn("hidden xl:block absolute left-[32%] top-0 w-px bg-grid", isProjectDetail ? "h-[70%]" : "h-full")} />
      <div className={cn("hidden lg:block absolute right-[40%] top-0 w-px bg-grid", isProjectDetail ? "h-[70%]" : "h-full")} />
      <div className={cn("hidden lg:block absolute right-[3%] xl:right-[5%] top-0 w-px bg-grid", isProjectDetail ? "h-[72%]" : "h-full")} />

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-[20vh] lg:h-[30vh] bg-linear-to-t from-transparent to-[rgba(164,255,0,0.3)] " />

      <Navbar />
      {children}
    </section>
  );
}

