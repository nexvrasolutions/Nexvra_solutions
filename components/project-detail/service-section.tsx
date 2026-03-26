import React from "react";

const services = [
  {
    title: "UI/UX Design & Branding",
    description:
      "Creating seamless digital experiences that connect with people. From brand identity to user interfaces, we ensure every design speaks clarity, creativity, and purpose. Creating seamless digital experiences that connect with people. From brand identity to user interfaces, we ensure every design speaks clarity, creativity, and purpose.",
  },
  {
    title: "UI/UX Design & Branding",
    description:
      "Creating seamless digital experiences that connect with people. From brand identity to user interfaces, we ensure every design speaks clarity, creativity, and purpose. Creating seamless digital experiences that connect with people. From brand identity to user interfaces, we ensure every design speaks clarity, creativity, and purpose.",
  },
  {
    title: "UI/UX Design & Branding",
    description:
      "Creating seamless digital experiences that connect with people. From brand identity to user interfaces, we ensure every design speaks clarity, creativity, and purpose. Creating seamless digital experiences that connect with people. From brand identity to user interfaces, we ensure every design speaks clarity, creativity, and purpose.",
  },
];

const ServicesSection = () => {
  return (
    <section className="w-full bg-[#f5f5f5] px-[5%] py-8">
      <div className="w-full">
        {services.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-b border-gray-300"
          >
            {/* Left - Title */}
            <div>
              <h2 className="text-xl md:text-3xl font-primary font-semibold text-tertiary">
                {item.title}
              </h2>
            </div>

            {/* Right - Description */}
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