import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CardComponent from "../CardComponent/CardComponent";
import { getWomenFragrancesData } from "../../Services/AllFragrancesApi";

export default function WomansFragmanceRoute() {
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
  };

  useEffect(() => {
    getProducts();
  }, []);

  // LOADING
  if (loading) {
    return (
      <section
        dir={direction}
        className="min-h-screen bg-[#f8f5ef] py-16"
      >
        <div className="mx-auto w-[90%]">
          {/* Breadcrumb Skeleton */}
          <div className="mb-10 flex items-center gap-2">
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Products Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-[#eee5d8] bg-white"
              >
                <div className="h-82 animate-pulse bg-gray-200" />

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
        {/* BREADCRUMB */}
        <div className="mb-10 flex items-center gap-2 text-sm text-gray-400">
          <Link
            to="/"
            className="transition-colors hover:text-[#a67c52]"
          >
            {text("Home", "الرئيسية")}
          </Link>

          <span>/</span>

        


          <span className="text-gray-700">
            {text("Women's Fragrances", "عطور نسائية")}
          </span>
        </div>

        {/* ERROR */}
        {error ? (
          <div className="py-20 text-center">
            <p className="text-lg text-red-500">{error}</p>

            <button
              type="button"
              onClick={getProducts}
              className="mt-5 rounded-full bg-[#2d241d] px-6 py-3 text-white transition hover:bg-[#b08d57]"
            >
              {text("Try Again", "حاولي مرة أخرى")}
            </button>
          </div>
        ) : products.length === 0 ? (
          /* NO PRODUCTS */
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {text(
                "No Women's Fragrances Found",
                "لا توجد عطور نسائية"
              )}
            </h2>

            <p className="mt-3 text-gray-500">
              {text(
                "No women's fragrances are available right now.",
                "لا توجد عطور نسائية متاحة حاليًا."
              )}
            </p>
          </div>
        ) : (
          /* PRODUCTS GRID */
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
