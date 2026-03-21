type Props = {
    open: boolean;
  };
  
  export default function Hamburger({ open }: Props) {
    return (
      <div className="relative flex flex-col justify-center items-end w-8 h-8">
        {/* Top line */}
        <span
          className={`block h-px w-6 rounded bg-secondary transition-all duration-500 ${
            open ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        {/* Middle line */}
        <span
          className={`block h-px w-6 rounded bg-secondary transition-all duration-500 my-1 ${
            open ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
        {/* Bottom line */}
        <span
          className={`block h-px w-3 rounded bg-secondary transition-all duration-500 ${
            open ? "opacity-0" : ""
          }`}
        />
      </div>
    );
  }