
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBestsellerData } from "../../Services/BestsellerApi";
import CardComponent from "../../Components/CardComponent/CardComponent";

export default function BestSellers() {
  const { t, i18n } = useTranslation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isArabic = i18n.language.startsWith("ar");

  async function getBestSellers() {
    try {
      setLoading(true);
      setError(false);

      const data = await getBestsellerData();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBestSellers();
  }, []);

  // Loading
  if (loading) {
    return (
      <section
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-screen bg-[#f8f5ef] py-16"
      >
        <div className="mx-auto w-[90%] max-w-7xl">
          <div className="mb-10 h-5 w-48 animate-pulse rounded bg-gray-200" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-[450px] animate-pulse rounded-[15px] bg-gray-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f8f5ef] py-16"
    >
      <div className="mx-auto w-[90%] max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-10 flex items-center gap-2 text-sm text-gray-400">
          <Link
            to="/home"
            className="transition-colors hover:text-[#a67c52]"
          >
            {t("general.home")}
          </Link>

          <span>/</span>

          <span className="font-medium text-[#302218]">
            {t("bestSellers.title")}
          </span>
        </div>

        {/* Error */}
        {error ? (
          <div className="py-20 text-center">
            <p className="mb-5 text-lg text-gray-600">
              {t("bestSellers.error")}
            </p>

            <button
              type="button"
              onClick={getBestSellers}
              className="rounded-lg bg-[#302218] px-6 py-3 text-white transition hover:bg-[#a67c52]"
            >
              {t("general.tryAgain")}
            </button>
          </div>
        ) : products.length === 0 ? (
          /* No Products */
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">
              {t("bestSellers.empty")}
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <CardComponent
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
