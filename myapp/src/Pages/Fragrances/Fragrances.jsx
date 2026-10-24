
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllFragrancesData } from "../../Services/AllFragrancesApi";
import CardComponent from "../../Components/CardComponent/CardComponent";

export default function Fragrances() {
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  const text = (en, ar) => (isArabic ? ar : en);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAllFragrances = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllFragrancesData();

      const fragranceProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.products)
        ? data.data.products
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(fragranceProducts);
    } catch (err) {
      console.error("Error fetching fragrances:", err);

      setError(
        text(
          "Unable to load fragrances. Please try again.",
          "تعذر تحميل العطور. حاولي مرة أخرى."
        )
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFragrances();
  }, []);

  // LOADING
  if (loading) {
    return (
      <section
        dir={direction}
        className="min-h-screen bg-[#f8f5ef] py-16"
      >
        <div className="mx-auto w-[90%]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[450px] animate-pulse rounded-3xl bg-gray-200"
              />
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
            {text("All Fragrances", "جميع العطور")}
          </span>
        </div>

        {/* CATEGORY LINKS */}
        <div className="mx-auto my-5 flex w-fit max-w-full flex-wrap justify-center gap-3 p-5">
          <Link
            to="/womanfrag"
            className="rounded-md bg-[#2d241d] px-5 py-3 text-center text-white transition hover:bg-[#b08d57]"
          >
            {text("Women's Fragrances", "عطور نسائية")}
          </Link>

          <Link
            to="/manfrag"
            className="rounded-md bg-[#2d241d] px-5 py-3 text-center text-white transition hover:bg-[#b08d57]"
          >
            {text("Men's Fragrances", "عطور رجالية")}
          </Link>

          <Link
            to="/unisexfrag"
            className="rounded-md bg-[#2d241d] px-5 py-3 text-center text-white transition hover:bg-[#b08d57]"
          >
            {text("Unisex Fragrances", "عطور للجنسين")}
          </Link>
        </div>

        {/* ERROR */}
        {error ? (
          <div className="py-20 text-center">
            <p className="text-lg text-red-500">{error}</p>

            <button
              type="button"
              onClick={getAllFragrances}
              className="mt-5 rounded-full bg-[#2d241d] px-6 py-3 text-white transition hover:bg-[#b08d57]"
            >
              {text("Try Again", "حاولي مرة أخرى")}
            </button>
          </div>
        ) : products.length === 0 ? (
          /* NO PRODUCTS */
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {text("No Fragrances Found", "لا توجد عطور")}
            </h2>

            <p className="mt-3 text-gray-500">
              {text(
                "No fragrances are available right now.",
                "لا توجد عطور متاحة حاليًا."
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
