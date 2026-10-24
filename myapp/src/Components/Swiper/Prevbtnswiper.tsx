import { useTranslation } from "react-i18next";
import type { SwiperButtonProps } from "./Nextbtnswiper";
import { IoIosArrowDropleftCircle } from "react-icons/io";

export default function PrevButton({ swiperRef }: SwiperButtonProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  return (
    <button
      type="button"
      onClick={() => swiperRef.current?.slidePrev()}
      aria-label={isArabic ? "الشريحة السابقة" : "Previous slide"}
      title={isArabic ? "السابق" : "Previous"}
      className="shrink-0 transition-transform duration-200 hover:scale-110"
    >
      <IoIosArrowDropleftCircle
        className={`size-10 cursor-pointer text-[#2d241d] transition-colors hover:text-[#a67c52] ${
          isArabic ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
