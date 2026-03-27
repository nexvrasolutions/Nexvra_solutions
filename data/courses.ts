export type CourseType = {
    title: string;
    level: string;
    duration: string;
    batch: string;
    mode: string;
    description: string;
    overview: string;
    learn: string[];
    why: { title: string; desc: string }[];
    ctaText: string;
  };

  export const courses : Record<string, CourseType>= {
    "ai-powered-product-design": {
      title: "AI-Powered Product Design",
      level: "Beginner to Advanced",
      duration: "3 Months",
      batch: "10 Students Max",
      mode: "Offline / Online",
      description:
        "Design complete digital products using modern UX UI methods and AI tools.",
      overview:
        "Learn how to design digital products from idea to execution using UX, UI, and AI workflows.",
      learn: [
        "Design Thinking",
        "UX Research",
        "UI Design Systems",
        "AI Tools in Design",
        "Prototyping",
        "Product Case Study",
      ],
      why: [
        { title: "Product-Focused Learning", desc: "Work on real product ideas." },
        { title: "Hands-On Projects", desc: "Practical design experience." },
        { title: "Mentor Support", desc: "Learn with guidance." },
        { title: "Portfolio Ready", desc: "Build strong case studies." },
      ],
      ctaText: "Start your product design journey.",
    },
  
    "ux-design": {
      title: "UX Design",
      level: "Beginner to Advanced",
      duration: "2 Months",
      batch: "10 Students Max",
      mode: "Offline / Online",
      description:
        "Learn how to design user-friendly experiences that solve real problems.",
      overview:
        "Understand user behavior and create meaningful digital experiences.",
      learn: [
        "User Research",
        "Wireframing",
        "User Flows",
        "Usability Testing",
        "Problem Solving",
        "UX Case Study",
      ],
      why: [
        { title: "Real Case Studies", desc: "Work on real UX problems." },
        { title: "Structured Learning", desc: "Step-by-step approach." },
        { title: "Practical Exercises", desc: "Hands-on tasks." },
        { title: "Portfolio Support", desc: "Build UX projects." },
      ],
      ctaText: "Design better user experiences.",
    },
  
    "ui-design": {
      title: "UI Design",
      level: "Beginner to Advanced",
      duration: "2 Months",
      batch: "10 Students Max",
      mode: "Offline / Online",
      description:
        "Create clean, modern, and visually appealing user interfaces.",
      overview:
        "Learn visual design principles and create stunning UI designs.",
      learn: [
        "Layout & Spacing",
        "Typography",
        "Color Systems",
        "Design Components",
        "High-Fidelity Design",
        "UI Portfolio",
      ],
      why: [
        { title: "Visual Design Skills", desc: "Learn modern UI styles." },
        { title: "Real Projects", desc: "Design real interfaces." },
        { title: "Tool Mastery", desc: "Use industry tools." },
        { title: "Portfolio Ready", desc: "Create UI projects." },
      ],
      ctaText: "Create stunning interfaces.",
    },
  
    "digital-marketing-mastery": {
      title: "Digital Marketing Mastery",
      level: "Beginner to Advanced",
      duration: "2 Months",
      batch: "10 Students Max",
      mode: "Online / Offline",
      description:
        "Grow businesses online with powerful marketing strategies.",
      overview:
        "Learn how to build brand presence and generate leads online.",
      learn: [
        "Social Media Marketing",
        "SEO Basics",
        "Paid Ads",
        "Content Strategy",
        "Analytics",
        "Lead Generation",
      ],
      why: [
        { title: "Live Campaigns", desc: "Work on real ads." },
        { title: "Strategy Learning", desc: "Focus on results." },
        { title: "Tools & Analytics", desc: "Learn industry tools." },
        { title: "Career Support", desc: "Job & freelance help." },
      ],
      ctaText: "Start growing brands today.",
    },
  
    "branding-graphic-design": {
      title: "Branding & Graphic Design",
      level: "Beginner to Advanced",
      duration: "2–3 Months",
      batch: "10 Students Max",
      mode: "Offline / Online",
      description:
        "Build strong visual identities and creative designs.",
      overview:
        "Learn how to create logos, brand identity, and visual content.",
      learn: [
        "Logo Design",
        "Brand Identity",
        "Typography",
        "Color Theory",
        "Social Media Design",
        "Portfolio",
      ],
      why: [
        { title: "Creative Thinking", desc: "Improve design mindset." },
        { title: "Hands-On Work", desc: "Real design tasks." },
        { title: "Tool Skills", desc: "Learn design tools." },
        { title: "Portfolio Ready", desc: "Build strong work." },
      ],
      ctaText: "Start your creative journey.",
    },
  
    "front-end-development": {
      title: "Front-End Development",
      level: "Beginner to Advanced",
      duration: "3 Months",
      batch: "10 Students Max",
      mode: "Offline / Online",
      description:
        "Build modern and responsive websites.",
      overview:
        "Learn to convert designs into real websites.",
      learn: [
        "HTML, CSS",
        "JavaScript",
        "Responsive Design",
        "UI Implementation",
        "React Basics",
        "Deployment",
      ],
      why: [
        { title: "Real Coding", desc: "Build live websites." },
        { title: "Modern Tools", desc: "Latest tech." },
        { title: "Projects", desc: "Hands-on learning." },
        { title: "Career Support", desc: "Job guidance." },
      ],
      ctaText: "Start building websites.",
    },
  
    "back-end-development": {
      title: "Back-End Development",
      level: "Beginner to Advanced",
      duration: "3 Months",
      batch: "10 Students Max",
      mode: "Offline / Online",
      description:
        "Build powerful backend systems and APIs.",
      overview:
        "Learn how applications work behind the scenes.",
      learn: [
        "Node.js",
        "APIs",
        "Databases",
        "Authentication",
        "Server Logic",
        "Deployment",
      ],
      why: [
        { title: "Core Logic", desc: "Learn backend basics." },
        { title: "Real Projects", desc: "Build APIs." },
        { title: "Database Skills", desc: "Work with data." },
        { title: "Best Practices", desc: "Industry methods." },
      ],
      ctaText: "Build powerful systems.",
    },
  
    "mobile-app-development": {
      title: "Mobile App Development",
      level: "Beginner to Advanced",
      duration: "3 Months",
      batch: "10 Students Max",
      mode: "Offline / Online",
      description:
        "Create mobile apps for Android and iOS.",
      overview:
        "Learn to build scalable and user-friendly apps.",
      learn: [
        "Flutter / React Native",
        "UI for Apps",
        "API Integration",
        "Navigation",
        "Optimization",
        "Deployment",
      ],
      why: [
        { title: "Cross-Platform", desc: "Build for both platforms." },
        { title: "Real Apps", desc: "Practical projects." },
        { title: "Modern Tools", desc: "Latest frameworks." },
        { title: "Career Support", desc: "Job guidance." },
      ],
      ctaText: "Start building apps today.",
    },
  };