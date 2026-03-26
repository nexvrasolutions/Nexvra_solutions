import Navbar from "./navbar";

type Props = {
  children: React.ReactNode;
};

export default function HeroLayout({ children }: Props) {
  return (
    // <section className="relative min-h-screen bg-black overflow-hidden">

    //   {/* Grid Lines */}
    //   <div className="absolute left-[5%] top-0 h-full w-px bg-grid" />
    //   <div className="absolute left-[32%] top-0 h-full w-px bg-grid" />
    //   <div className="absolute right-[40%] top-0 h-full w-px bg-grid" />
    //   <div className="absolute right-[5%] top-0 h-full w-px bg-grid" />

    //   {/* Top Gradient */}
    //   <div className="absolute top-0 left-0 w-full h-[30vh] bg-linear-to-t from-transparent to-[rgba(164,255,0,0.3)]" />

    //   {/* Navbar */}
    //   <Navbar />

    //   {/* Page Content */}
    //   {children}

    // </section>
    <section className="relative min-h-screen bg-black overflow-hidden">

      {/* Grid Lines - hide on mobile */}
      <div className="hidden lg:block absolute left-[5%] top-0 h-full w-px bg-grid" />
      <div className="hidden lg:block absolute left-[32%] top-0 h-full w-px bg-grid" />
      <div className="hidden lg:block absolute right-[40%] top-0 h-full w-px bg-grid" />
      <div className="hidden lg:block absolute right-[5%] top-0 h-full w-px bg-grid" />

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-[20vh] lg:h-[30vh] bg-linear-to-t from-transparent to-[rgba(164,255,0,0.3)] " />

      <Navbar />
      {children}
    </section>
  );
}

