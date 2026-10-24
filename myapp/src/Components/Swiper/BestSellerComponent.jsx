import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Link } from "react-router-dom";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import PrevButton from "./Prevbtnswiper";
import NextButton from "./Nextbtnswiper";
import { getBestsellerData } from "../../Services/BestsellerApi";
import CardComponent from "../CardComponent/CardComponent";

export default function BestSellerComponent() {
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  const text = (en, ar) => (isArabic ? ar : en);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const swiperRef = useRef(null);

  // ================= GET BEST SELLERS =================
  async function getBestSellers() {
    try {
      setLoading(true);
      setError("");

      const data = await getBestsellerData();

      const bestSellerProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.data?.products)
        ? data.data.products
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(bestSellerProducts);
    } catch (err) {
      console.error("Error fetching best sellers:", err);

      setError(
        text(
          "Unable to load best sellers. Please try again.",
          "تعذر تحميل المنتجات الأكثر مبيعًا. حاولي مرة أخرى."
        )
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBestSellers();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <section
        dir={direction}
        className="min-h-75 bg-[#f8f5ef] py-16"
      >
        <div className="mx-auto w-[90%] max-w-7xl">
          <div className="mb-10 flex flex-col items-center">
            <div className="h-10 w-72 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-5 h-5 w-48 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-112.5 animate-pulse rounded-3xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ================= UI =================
  return (
    <section
      dir={direction}
      className="relative w-full overflow-hidden bg-[#f8f5ef] py-16"
    >
      <div className="mx-auto w-[90%] max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="mb-12 flex items-end justify-between">
            <div className="w-full text-center">
              <h2 className="text-center text-3xl font-semibold text-[#1d1d1d] md:text-5xl">
                {text(
                  "Find Your New Favourite Fragrance",
                  "اكتشفي عطرك المفضل الجديد"
                )}
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-7 text-gray-600">
                {text(
                  "Our newest fragrances quickly become bestsellers and join our favourite collections.",
                  "عطورنا الجديدة سرعان ما تصبح من الأكثر مبيعًا وتنضم إلى مجموعات العطور المفضلة لديكم."
                )}
              </p>
            </div>
          </div>

          <h3 className="text-center text-4xl font-bold text-[#2d241d] md:text-5xl">
            {text("Best Sellers", "الأكثر مبيعًا")}
          </h3>

          <div className="mx-auto mb-16 mt-5 flex w-fit items-center justify-center gap-2">
            <div className="h-0.5 w-20 bg-black" />
            <div className="size-5 rounded-full border-2 border-black" />
            <div className="h-0.5 w-20 bg-black" />
          </div>
        </div>

        {/* ================= ERROR / EMPTY STATE ================= */}
        {error ? (
          <div className="py-12 text-center">
            <p className="mb-5 text-lg text-red-600">{error}</p>

            <button
              type="button"
              onClick={getBestSellers}
              className="rounded-xl bg-[#2d241d] px-6 py-3 font-semibold text-white transition hover:bg-[#a67c52]"
            >
              {text("Try Again", "حاولي مرة أخرى")}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              {text(
                "No best-selling products available right now.",
                "لا توجد منتجات متاحة ضمن الأكثر مبيعًا حاليًا."
              )}
            </p>
          </div>
        ) : (
          /* ================= SWIPER ================= */
          <div className="flex items-center gap-2">
            <PrevButton swiperRef={swiperRef} />

            <Swiper
              key={direction}
              dir={direction}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
              }}
              className="w-full"
            >
              {products.map((product) => (
                <SwiperSlide
                  key={product.id ?? product.uuid ?? product.slug}
                >
                  <CardComponent product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            <NextButton swiperRef={swiperRef} />
          </div>
        )}

        {/* ================= VIEW ALL ================= */}
        <div className="my-8 flex justify-center">
          <Link
            to="/category/best-sellers"
            className="flex w-fit items-center gap-3 rounded-xl border-2 border-[#2d241d] p-3 text-base font-semibold text-[#2d241d] transition hover:bg-[#2d241d] hover:text-white"
          >
            <span>{text("View All", "عرض الكل")}</span>

            {isArabic ? <FaArrowLeftLong /> : <FaArrowRightLong />}
          </Link>
        </div>
      </div>
    </section>
  );
}
