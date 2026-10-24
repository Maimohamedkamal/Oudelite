import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CardComponent from "../CardComponent/CardComponent";
import { getPortraitFragrancesData } from "../../Services/AllFragrancesApi";

export default function Portrait() {
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  const text = (en, ar) => (isArabic ? ar : en);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await getPortraitFragrancesData();

      const portraitProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.products)
        ? data.data.products
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(portraitProducts);
    } catch (err) {
      console.error("Error fetching Portrait fragrances:", err);
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <section
      className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-12"
      dir={direction}
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500"
      >
        <Link
          to="/home"
          className="transition-colors hover:text-[#8B6A45]"
        >
          {text("Home", "الرئيسية")}
        </Link>

        <span>/</span>

    

        <Link
          to="/category/portrait"
          className="font-medium text-[#302218] transition-colors hover:text-[#8B6A45]"
          aria-current="page"
        >
                    {text("Portrait", "البورتريه")}

          
        </Link>
      </nav>

  
      {/* Loading State */}
      {loading && (
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label={text("Loading products", "جارٍ تحميل المنتجات")}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-[15px] bg-gray-100"
            >
              <div className="aspect-4/5 bg-gray-200" />

              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-10 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="py-16 text-center">
          <p className="mb-5 text-base text-red-600">
            {text(
              "Unable to load Portrait fragrances. Please try again.",
              "تعذر تحميل عطور البورتريه. يرجى المحاولة مرة أخرى."
            )}
          </p>

          <button
            type="button"
            onClick={getProducts}
            className="rounded-lg bg-[#302218] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#8B6A45]"
          >
            {text("Try Again", "حاولي مرة أخرى")}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="py-16 text-center">
          <h2 className="mb-3 text-xl font-semibold text-[#302218]">
            {text("No Portrait fragrances found", "لا توجد عطور البورتريه")}
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            {text(
              "There are no products available in this collection right now.",
              "لا توجد منتجات متاحة في هذه المجموعة حاليًا."
            )}
          </p>

         
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {products.length}{" "}
              {text(
                products.length === 1 ? "product" : "products",
                products.length === 1 ? "منتج" : "منتجات"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <CardComponent
                key={product.id ?? product.uuid ?? product.slug}
                product={product}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
