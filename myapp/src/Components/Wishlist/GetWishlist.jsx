
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import ButtonAddToCart from "../Cart/ButtonAddToCart";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function GetWishlist() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const getWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      setLoading(false);
      setError(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data;

      const items = Array.isArray(data)
        ? data
        : data?.wishlist || data?.items || data?.products || [];

      setWishlist(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(
        "Wishlist error:",
        err.response?.data || err.message
      );

      setError(true);
      setWishlist([]);
      toast.error(t("wishlist.failedLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    getWishlist();
  }, [getWishlist]);

  async function removeFromWishlist(item) {
    const token = localStorage.getItem("token");
    const productId =
      item.product_id ?? item.product?.id ?? item.id;

    if (!token) {
      toast.error(t("wishlist.loginFirst"));
      return;
    }

    if (productId == null) {
      toast.error(t("wishlist.failedRemove"));
      return;
    }

    try {
      setRemovingId(productId);

      await axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist((previous) =>
        previous.filter((entry) => {
          const entryProductId =
            entry.product_id ?? entry.product?.id ?? entry.id;

          return String(entryProductId) !== String(productId);
        })
      );

      toast.success(t("wishlist.removed"));
    } catch (err) {
      console.error(
        "Remove wishlist error:",
        err.response?.data || err.message
      );

      toast.error(
        err.response?.data?.message ||
          t("wishlist.failedRemove")
      );
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        lang={isArabic ? "ar" : "en"}
        className="flex min-h-[65vh] items-center justify-center bg-[#faf8f5]"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e9dfd3] border-t-[#8b6848]" />

          <p className="text-sm tracking-wide text-[#806c59]">
            {t("wishlist.loading")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="min-h-screen bg-[#faf8f5] px-4 py-12 sm:px-8 lg:px-14 lg:py-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 sm:mb-14">
          <h1 className="text-3xl font-semibold tracking-wide text-[#302218] sm:text-4xl">
            {t("wishlist.title")}
          </h1>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            {t("wishlist.description")}
          </p>
        </header>

        {/* Error */}
        {error ? (
          <section className="rounded-2xl border border-[#eee5da] bg-white px-6 py-14 text-center shadow-sm">
            <p className="mb-5 text-gray-600">
              {t("wishlist.failedLoad")}
            </p>

            <button
              type="button"
              onClick={getWishlist}
              className="rounded-md bg-[#302218] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8b6848]"
            >
              {t("wishlist.tryAgain")}
            </button>
          </section>
        ) : wishlist.length === 0 ? (
          /* Empty Wishlist */
          <section className="mx-auto max-w-2xl rounded-3xl border border-[#eee5da] bg-white px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf5ef]">
              <FaRegHeart className="text-3xl text-[#b99a79]" />
            </div>

            <h2 className="text-2xl font-semibold text-[#302218]">
              {t("wishlist.emptyTitle")}
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
              {t("wishlist.emptyMessage")}
            </p>

            <Link
              to="/home"
              className="mt-7 inline-flex items-center justify-center rounded-md bg-[#302218] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8b6848]"
            >
              {t("wishlist.explore")}
            </Link>
          </section>
        ) : (
          /* Wishlist Products */
          <div className="flex flex-col gap-4">
            {wishlist.map((item) => {
              const product = item.product || item;

              const productId =
                item.product_id ?? product.id ?? item.id;

              const name = isArabic
                ? product.name_ar ||
                  product.name_en ||
                  product.name ||
                  t("wishlist.fragrance")
                : product.name_en ||
                  product.name ||
                  product.name_ar ||
                  t("wishlist.fragrance");

              const slug = product.slug;

              const image =
                product.primary_image ||
                product.image ||
                product.image_url ||
                product.thumbnail ||
                "";

              const basePrice = Number(product.base_price || 0);

              const salePrice =
                product.sale_price !== null &&
                product.sale_price !== undefined &&
                product.sale_price !== ""
                  ? Number(product.sale_price)
                  : null;

              const hasDiscount =
                salePrice !== null &&
                Number.isFinite(salePrice) &&
                salePrice > 0 &&
                salePrice < basePrice;

              const price = hasDiscount
                ? salePrice
                : Number(
                    product.effective_price ?? basePrice
                  );

              const formattedPrice = (
                Number.isFinite(price) ? price : 0
              ).toFixed(2);

              return (
                <article
                  key={item.id ?? productId}
                  className="group flex flex-col items-center justify-between gap-4 rounded-[15px] border border-[#eee5da] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row sm:p-6"
                >
                  {/* Product Information */}
                  <div className="flex w-full min-w-0 flex-1 items-center gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f4f0eb]">
                      {image ? (
                        <Link
                          to={slug ? `/home/${slug}` : "/home"}
                          className="block h-full w-full"
                        >
                          <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        </Link>
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#b5a28e]">
                          <FaShoppingBag className="text-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-col justify-center">
                      <Link
                        to={slug ? `/home/${slug}` : "/home"}
                        className="line-clamp-2 text-base font-semibold text-[#302218] transition-colors hover:text-[#a67c52] sm:text-lg"
                      >
                        {name}
                      </Link>

                      {/* Price */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-[#302218] sm:text-lg">
                          {formattedPrice} {t("wishlist.currency")}
                        </span>

                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {basePrice.toFixed(2)}{" "}
                            {t("wishlist.currency")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                    <div className="rounded-md border border-[#302218] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#302218] hover:text-white">
                      <ButtonAddToCart
                        product={{
                          ...product,
                          id: productId,
                          name,
                          price,
                          image,
                        }}
                        productId={productId}
                        quantity={1}
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item)}
                      disabled={removingId === productId}
                      aria-label={`${t("wishlist.remove")} ${name}`}
                      title={t("wishlist.remove")}
                      className="flex shrink-0 items-center justify-center rounded-full p-1 text-red-500 transition hover:scale-110 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === productId ? (
                        <span className="block h-6 w-6 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                      ) : (
                        <TiDelete className="text-3xl" />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
