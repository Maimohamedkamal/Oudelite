import type { RefObject } from "react";
import type SwiperInstance from "swiper";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

export interface SwiperButtonProps {
  swiperRef: RefObject<SwiperInstance | null>;
}

export default function NextButton({ swiperRef }: SwiperButtonProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  return (
    <button
      type="button"
      onClick={() => swiperRef.current?.slideNext()}
      aria-label={isArabic ? "الشريحة التالية" : "Next slide"}
      title={isArabic ? "التالي" : "Next"}
      className="shrink-0 transition-transform duration-200 hover:scale-110"
    >
      <IoIosArrowDroprightCircle
        className={`size-10 cursor-pointer text-[#2d241d] transition-colors hover:text-[#a67c52] ${
          isArabic ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
