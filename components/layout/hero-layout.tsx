import { cn } from "@/lib/utils";
import Navbar from "./navbar";

type Props = {
  isProjectDetail?:boolean
  isCourseDetail?:boolean
  children: React.ReactNode;
};

export default function HeroLayout({ isProjectDetail=false, isCourseDetail=false, children }: Props) {
  return (
    <section data-theme="dark" className="relative h-full md:min-h-screen bg-black overflow-hidden">

      {/* Grid Lines - hide on mobile */}
      <div className={cn("hidden lg:block absolute left-[3%] xl:left-[5%] top-0 w-px bg-grid", isProjectDetail ? "h-[72%]" : "h-full")} />
      <div className={cn("hidden xl:block absolute left-[32%] top-0 w-px bg-grid", isProjectDetail ? "h-[70%]" : "h-full")} />
      <div className={cn("absolute right-[40%] top-0 w-px bg-grid", isProjectDetail && !isCourseDetail ? "h-[70%] hidden lg:block" : "h-full hidden")} />
      <div className={cn("absolute right-[32.5%] top-0 w-px bg-grid", isCourseDetail ? "h-[70%] hidden lg:block" : "h-full hidden")} />
      <div className={cn("hidden lg:block absolute right-[3%] xl:right-[5%] top-0 w-px bg-grid", isProjectDetail ? "h-[72%]" : "h-full")} />

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-[20vh] lg:h-[30vh] bg-linear-to-t from-transparent to-[rgba(164,255,0,0.3)] " />

      <Navbar />
      {children}
    </section>
  );
}

