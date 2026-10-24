import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Link } from "react-router-dom";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import CardComponent from "../CardComponent/CardComponent";
import { getWomenFragrancesData } from "../../Services/AllFragrancesApi";
import PrevButton from "../Swiper/Prevbtnswiper";
import NextButton from "../Swiper/Nextbtnswiper";

export default function WomanFragrances() {
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  const text = (en, ar) => (isArabic ? ar : en);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mainSwiperRef = useRef(null);
  const secondarySwiperRef = useRef(null);

  // ================= GET WOMEN'S FRAGRANCES =================
  async function getWomenFragrances() {
    try {
      setLoading(true);
      setError("");

      const data = await getWomenFragrancesData();

      const womenProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.products)
        ? data.data.products
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(womenProducts);
    } catch (err) {
      console.error("Error fetching women's fragrances:", err);

      setError(
        text(
          "Unable to load women's fragrances. Please try again.",
          "تعذر تحميل العطور النسائية. حاولي مرة أخرى."
        )
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getWomenFragrances();
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
            <div className="mt-5 h-1 w-40 animate-pulse rounded bg-gray-200" />
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
        {/* ================= TITLE ================= */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#2d241d] md:text-5xl">
            {text("Trending for Women", "الأكثر رواجًا للنساء")}
          </h2>

          <div className="mx-auto mb-16 mt-5 flex w-fit items-center justify-center gap-2">
            <div className="h-0.5 w-20 bg-black" />
            <div className="size-5 rounded-full border-2 border-black" />
            <div className="h-0.5 w-20 bg-black" />
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error ? (
          <div className="py-12 text-center">
            <p className="mb-5 text-lg text-red-600">{error}</p>

            <button
              type="button"
              onClick={getWomenFragrances}
              className="rounded-xl bg-[#2d241d] px-6 py-3 font-semibold text-white transition hover:bg-[#a67c52]"
            >
              {text("Try Again", "حاولي مرة أخرى")}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              {text(
                "No women's fragrances available right now.",
                "لا توجد عطور نسائية متاحة حاليًا."
              )}
            </p>
          </div>
        ) : (
          <>
            {/* ================= MAIN SWIPER ================= */}
            <div className="flex items-center gap-2">
              <PrevButton swiperRef={mainSwiperRef} />

              <Swiper
                key={direction}
                dir={direction}
                onSwiper={(swiper) => {
                  mainSwiperRef.current = swiper;
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

              <NextButton swiperRef={mainSwiperRef} />
            </div>

            {/* ================= VIEW ALL ================= */}
            <div className="my-8 flex justify-center">
              <Link
                to="/womanfrag"
                className="flex w-fit items-center gap-3 rounded-xl border-2 border-[#2d241d] p-3 text-base font-semibold text-[#2d241d] transition hover:bg-[#2d241d] hover:text-white"
              >
                <span>{text("View All", "عرض الكل")}</span>

                {isArabic ? (
                  <FaArrowLeftLong />
                ) : (
                  <FaArrowRightLong />
                )}
              </Link>
            </div>

            {/* ================= FEATURE + PRODUCTS ================= */}
            <div className="mt-12 grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
              {/* Feature Image */}
              <div className="relative overflow-hidden rounded-3xl lg:col-span-1">
                <img
                  className="h-125 w-full object-cover"
                  src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80&auto=format&fit=crop"
                  alt={text(
                    "Luxury perfume collection",
                    "مجموعة عطور فاخرة"
                  )}
                  loading="lazy"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 p-6">
                  <div className="max-w-md text-center text-white">
                    <h3 className="mb-3 text-2xl font-bold">
                      {text("Be Exceptional", "كوني استثنائية")}
                    </h3>

                    <p className="mb-5 text-sm leading-7">
                      {text(
                        "Discover distinctive fragrances crafted to leave a memorable impression.",
                        "اكتشفي عطورًا مميزة بتركيبات فريدة تترك انطباعًا لا يُنسى."
                      )}
                    </p>

                    <Link
                      to="category/womens-collection"
                      className="inline-block border border-white px-6 py-2 text-sm font-medium transition duration-300 hover:bg-white hover:text-gray-900"
                    >
                      {text("Explore More", "اكتشفي المزيد")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Secondary Products Slider */}
              <div className="min-w-0 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <PrevButton swiperRef={secondarySwiperRef} />

                  <Swiper
                    key={`secondary-${direction}`}
                    dir={direction}
                    onSwiper={(swiper) => {
                      secondarySwiperRef.current = swiper;
                    }}
                    modules={[Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    autoplay={{
                      delay: 3500,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 2,
                      },
                      1280: {
                        slidesPerView: 3,
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

                  <NextButton swiperRef={secondarySwiperRef} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
