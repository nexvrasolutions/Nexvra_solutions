"use client";
import { Card } from "../ui/card";

const Challenges = ({ project }: { project: any }) => {
  return (
    <section className="w-full bg-[#f5f5f5] text-black px-5 md:px-10 xl:px-[5.5%] py-10 md:py-[5%] ">
      <div className="space-y-5 xl:space-y-10">

        {/* Highlight Text */}
        <h1 className="w-full xl:max-w-6xl font-primary text-[28px] md:text-[30px] lg:text-[35px] xl:text-[40px] font-bold leading-tight tracking-tight">
          <span className="text-[#BFBFBF]">
            {project.highlight.split(" ").slice(0, 6).join(" ")}{" "}
          </span>
          <span className="text-black">
            {project.highlight.split(" ").slice(6).join(" ")}
          </span>
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5 xl:pt-10">
          {project.cards.map((item: any, index: number) => (
            <Card key={index} course={item} isCourse={false} />
          ))}
        </div>
      </div>

      {/* MEDIA */}
      <div className="pt-10 xl:pt-20">
        <img
          src={ project.challengeImg ||"/images/vido.gif"}
          alt="gif-video"
          className="w-full object-cover h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px]"
        />
      </div>
    </section>
  );
};

export default Challenges;