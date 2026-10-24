
import React, { useEffect, useState } from "react";
import { IoArrowUp } from "react-icons/io5";

export default function Arrow() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Scroll to top"
      className={`fixed bottom-5 left-5 z-50 flex size-12 items-center justify-center rounded-full bg-white text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white ${
        isVisible
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-3 opacity-0"
      }`}
      style={{
        background: `conic-gradient(
          from 0deg,
          #302218 ${scrollProgress}%,
          #e5e5e5 ${scrollProgress}% 100%
        )`,
      }}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-white transition-colors duration-200 hover:bg-gray-500">
        <IoArrowUp className="text-xl text-[#302218] hover:text-white" />
      </span>
    </button>
  );
}
