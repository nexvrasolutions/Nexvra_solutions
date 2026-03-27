import React from "react";

const ServicesSection = ({ project }: { project: any }) => {
  const data = [
    {
      title: "Overview",
      description: project.details.overview,
    },
    {
      title: "What We Did",
      description: project.details.work,
    },
    {
      title: "Result",
      description: project.details.result,
    },
  ];

  return (
    <section className="w-full bg-[#f5f5f5] px-5 md:px-10 xl:px-[5%] pb-8 md:py-8">
      <div className="w-full">
        {data.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 py-5 md:py-10 border-b border-gray-300"
          >
            <div>
              <h2 className="text-xl md:text-3xl font-primary font-semibold text-tertiary">
                {item.title}
              </h2>
            </div>

            <div>
              <p className="text-gray-600 text-xl font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;