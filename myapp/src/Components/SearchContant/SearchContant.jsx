import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch, IoClose, IoArrowForward } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function SearchContent() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const isArabic = i18n.language.startsWith("ar");

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch product suggestions
  useEffect(() => {
    const query = searchValue.trim();

    if (!searchOpen || query.length < 2) {
      setProducts([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_URL}/products`, {
          params: {
            search: query,
            limit: 8,
          },
          signal: controller.signal,
        });

        const result = response.data?.data;
        const productList = Array.isArray(result)
          ? result
          : result?.data || result?.products || [];

        setProducts(productList);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Search error:", error);
          setProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchValue, searchOpen]);

  const getProductName = (product) =>
    isArabic
      ? product.name_ar || product.name_en || product.name
      : product.name_en || product.name || product.name_ar;

  const getProductPrice = (product) =>
    product.effective_price ??
    product.sale_price ??
    product.base_price ??
    0;

  const getProductImage = (product) => {
    if (typeof product.primary_image === "string") {
      return product.primary_image;
    }

    return (
      product.primary_image?.image_url ||
      product.primary_image?.url ||
      product.image_url ||
      product.image ||
      product.images?.[0]?.image_url ||
      ""
    );
  };

  const getProductSlug = (product) =>
    product.slug || product.id;

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    setSearchOpen(false);

    
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        Math.min(current + 1, products.length - 1)
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    if (
      event.key === "Enter" &&
      activeIndex >= 0 &&
      products[activeIndex]
    ) {
      event.preventDefault();

      navigate(`/home/${getProductSlug(products[activeIndex])}`);
      setSearchOpen(false);
    }

    if (event.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const openSearch = () => {
    setSearchOpen((previous) => {
      if (!previous) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }

      return !previous;
    });
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Icon */}
      <button
        type="button"
        onClick={openSearch}
        aria-label={searchOpen ? "Close search" : "Open search"}
        aria-expanded={searchOpen}
        className="flex items-center justify-center rounded-full p-2 text-[#302218] transition hover:bg-[#f0e6d9]"
      >
     
          <IoSearch size={23} />
      </button>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-60 bg-black/30">
          <div className="absolute left-1/2 top-25 w-3/4 -translate-x-1/2 overflow-hidden rounded-2xl border border-[#eee4d8] bg-white shadow-2xl">
            {/* Search Input */}
            <div className="border-b border-[#eee4d8] p-5 sm:p-6">
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3"
              >
                <IoSearch
                  size={24}
                  className="shrink-0 text-[#8b6848]"
                />

                <input
                  ref={inputRef}
                  type="search"
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isArabic
                      ? "ابحثي عن عطرك المفضل..."
                      : "Search for your favorite fragrance..."
                  }
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={products.length > 0}
                  className="min-w-0 flex-1 bg-transparent py-3 text-base text-[#302218] outline-none placeholder:text-gray-400 sm:text-lg"
                />

                {searchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                  >
                  </button>
                )}

                <button
                  type="submit"
                  className="rounded-lg bg-[#302218] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8b6848]"
                >
                  {isArabic ? "بحث" : "Search"}
                </button>
              </form>

              <p className="mt-2 text-xs text-gray-400">
                {isArabic
                  ? "اكتبي حرفين على الأقل لعرض اقتراحات المنتجات"
                  : "Type at least 2 characters to see product suggestions"}
              </p>
            </div>

            {/* Autocomplete Results */}
            <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
              {loading && (
                <p className="py-8 text-center text-sm text-gray-500">
                  {isArabic ? "جاري البحث..." : "Searching products..."}
                </p>
              )}

              {!loading &&
                searchValue.trim().length >= 2 &&
                products.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">
                    {isArabic
                      ? "لم يتم العثور على منتجات"
                      : "No products found"}
                  </p>
                )}

              {!loading && products.length > 0 && (
                <>
                  <h3 className="mb-4 text-sm font-semibold text-[#302218]">
                    {isArabic ? "المنتجات المقترحة" : "Suggested Products"}
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, index) => (
                      <Link
                        key={product.id || product.slug}
                        to={`/home/${getProductSlug(product)}`}
                        onClick={() => setSearchOpen(false)}
                        className={`flex items-center gap-4 rounded-xl border p-3 transition ${
                          activeIndex === index
                            ? "border-[#8b6848] bg-[#f8f3ed]"
                            : "border-[#eee4d8] hover:border-[#c6a582] hover:bg-[#faf7f3]"
                        }`}
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f7f2ec]">
                          {getProductImage(product) ? (
                            <img
                              src={getProductImage(product)}
                              alt={getProductName(product)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <IoSearch
                                size={24}
                                className="text-[#b9a28a]"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-sm font-semibold text-[#302218]">
                            {getProductName(product)}
                          </h4>

                          {product.brand_name_en && (
                            <p className="mt-1 text-xs text-gray-500">
                              {product.brand_name_en}
                            </p>
                          )}

                          <p className="mt-2 text-sm font-bold text-[#8b6848]">
                            {Number(getProductPrice(product)).toLocaleString(
                              isArabic ? "ar-EG" : "en-US"
                            )}{" "}
                            {isArabic ? "ج.م" : "EGP"}
                          </p>
                        </div>

                        <IoArrowForward
                          size={18}
                          className="shrink-0 text-[#8b6848]"
                        />
                      </Link>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#e5d8ca] py-3 text-sm font-medium text-[#302218] transition hover:bg-[#f8f3ed]"
                  >
                    {isArabic ? "عرض كل النتائج" : "View all results"}
                    <IoArrowForward size={17} />
                  </button>
                </>
              )}

              {!loading && searchValue.trim().length < 2 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#302218]">
                    {isArabic ? "اكتشفي عطورنا" : "Discover our fragrances"}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { en: "Oud", ar: "عود" },
                      { en: "Musk", ar: "مسك" },
                      { en: "Rose", ar: "ورد" },
                      { en: "Perfume", ar: "عطور" },
                    ].map((item) => (
                      <button
                        key={item.en}
                        type="button"
                        onClick={() => setSearchValue(isArabic ? item.ar : item.en)}
                        className="rounded-full border border-[#e5d8ca] px-4 py-2 text-sm text-[#6d513b] transition hover:border-[#8b6848] hover:bg-[#f8f3ed]"
                      >
                        {isArabic ? item.ar : item.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Close by clicking the backdrop */}
          <button
            type="button"
            aria-label="Close search overlay"
            onClick={() => setSearchOpen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/90 p-2 text-[#302218] shadow-md transition hover:bg-white"
          >
            <IoClose size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
