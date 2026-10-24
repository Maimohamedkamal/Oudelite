import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import CardComponent from "../CardComponent/CardComponent";
import { getUnisexFragrancesData } from "../../Services/AllFragrancesApi";

export default function UnisexFragmanceRoute() {
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  const text = (en, ar) => (isArabic ? ar : en);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUnisexFragrancesData();

      const unisexProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.products)
        ? data.data.products
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(unisexProducts);
    } catch (err) {
      console.error("Error fetching unisex fragrances:", err);

      setError(
        text(
          "Unable to load unisex fragrances. Please try again.",
          "تعذر تحميل عطور الجنسين. حاولي مرة أخرى."
        )
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  /* ================= Loading ================= */

  if (loading) {
    return (
      <section
        dir={direction}
        className="min-h-screen bg-[#f8f5ef] py-16"
      >
        <div className="w-[90%] mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="mb-10 flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
          </div>

          {/* Products Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-[#eee5d8] bg-white"
              >
                <div className="h-83 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="h-3 w-3 animate-pulse rounded-full bg-gray-200"
                      />
                    ))}
                  </div>

                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={direction}
      className="min-h-screen bg-[#f8f5ef] py-16"
    >
      <div className="mx-auto w-[90%]">
        {/* ================= Breadcrumb ================= */}

        <div className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <Link
            to="/"
            className="transition-colors hover:text-[#a67c52]"
          >
            {text("Home", "الرئيسية")}
          </Link>

         

          <span>/</span>

          <span className="font-medium text-gray-700">
            {text("Unisex Fragrances", "عطور للجنسين")}
          </span>
        </div>

        {/* ================= Error ================= */}

        {error ? (
          <div className="py-20 text-center">
            <p className="mb-5 text-lg text-red-600">{error}</p>

            <button
              type="button"
              onClick={getProducts}
              className="rounded-xl bg-[#2d241d] px-6 py-3 font-semibold text-white transition hover:bg-[#a67c52]"
            >
              {text("Try Again", "حاول مرة أخرى")}
            </button>
          </div>
        ) : products.length === 0 ? (
          /* ================= Empty State ================= */

          <div className="py-20 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-[#2d241d]">
              {text(
                "No Unisex Fragrances Found",
                "لا توجد عطور للجنسين"
              )}
            </h2>

            <p className="text-gray-500">
              {text(
                "There are no unisex fragrances available right now.",
                "لا توجد عطور للجنسين متاحة حاليًا."
              )}
            </p>

            <Link
              to="/fragrances"
              className="mt-6 inline-block rounded-xl bg-[#2d241d] px-6 py-3 font-semibold text-white transition hover:bg-[#a67c52]"
            >
              {text("Explore All Fragrances", "اكتشفي جميع العطور")}
            </Link>
          </div>
        ) : (
          /* ================= Products Grid ================= */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <CardComponent
                key={product.id ?? product.uuid ?? product.slug}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
