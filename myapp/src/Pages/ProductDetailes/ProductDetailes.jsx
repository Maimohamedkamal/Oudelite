



import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar, FaCheck } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ButtonAddToCart from "../../Components/Cart/ButtonAddToCart";
import ToggleWishlist from "../../Components/Wishlist/ToggleWishlist";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function ProductDetails() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const text = (en, ar) => {
    return isArabic ? ar || en : en || ar;
  };

  useEffect(() => {
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  useEffect(() => {
    let cancelled = false;

    async function getProduct() {
      try {
        setLoading(true);
        setProduct(null);
        setSelectedVariant(null);
        setSelectedImage("");
        setQuantity(1);

        const response = await axios.get(
          `${API_URL}/products/${slug}`
        );

        if (cancelled) return;

        const data = response.data?.data;

        if (!data) {
          setProduct(null);
          return;
        }

        setProduct(data);

        const images = data.images || [];
        const primaryImage =
          images.find((image) => image.is_primary) || images[0];

        setSelectedImage(
          primaryImage?.image_url || data.primary_image || ""
        );

        const variants = data.variants || [];

        if (variants.length > 0) {
          const availableVariant = variants.find(
            (variant) => Number(variant.stock_qty ?? 0) > 0
          );

          setSelectedVariant(availableVariant || variants[0]);
        } else {
          setSelectedVariant(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching product:", error);
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      getProduct();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#a67c52]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <p className="text-gray-500">
          {t("productNotFound", {
            defaultValue: isArabic
              ? "المنتج غير موجود"
              : "Product not found",
          })}
        </p>
      </div>
    );
  }

  const images = product.images || [];
  const variants = product.variants || [];
  const reviews = product.reviews || [];

  const stockValue = selectedVariant
    ? selectedVariant.stock_qty
    : product.stock_qty;

  const currentStock = Number.isFinite(Number(stockValue))
    ? Math.max(0, Number(stockValue))
    : 0;

  const isOutOfStock = currentStock <= 0;

  const currentPrice = selectedVariant
    ? selectedVariant.sale_price ??
      selectedVariant.price ??
      product.effective_price ??
      product.sale_price ??
      product.base_price
    : product.effective_price ??
      product.sale_price ??
      product.base_price;

  const oldPrice = selectedVariant
    ? selectedVariant.sale_price != null &&
      selectedVariant.price != null &&
      Number(selectedVariant.sale_price) <
        Number(selectedVariant.price)
      ? selectedVariant.price
      : null
    : product.sale_price != null &&
      product.base_price != null &&
      Number(product.sale_price) < Number(product.base_price)
    ? product.base_price
    : null;

  const productName = text(product.name_en, product.name_ar);

  const productDescription = text(
    product.description_en || product.short_desc_en,
    product.description_ar || product.short_desc_ar
  );


  const handleVariantChange = (variant) => {
    if (Number(variant.stock_qty ?? 0) <= 0) return;

    setSelectedVariant(variant);
    setQuantity(1);
  };

  return (
    <main
      className="bg-[#faf9f7] py-12 md:py-20 "
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto w-[92%] max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <Link
            to="/home"
            className="transition-colors hover:text-[#a67c52]"
          >
            {t("home", {
              defaultValue: isArabic ? "الرئيسية" : "Home",
            })}
          </Link>

          <span>/</span>

          <span className="text-gray-700">{productName}</span>
        </div>

        {/* Product */}
        <div className="grid lg:grid-cols-2 ">
          {/* Product Images */}
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row ">
            {images.length > 0 && (
              <div className="flex w-full shrink-0 flex-row gap-3 overflow-x-auto sm:w-20 sm:flex-col">
                {images.map((image, index) => (
                  <button
                    key={image.id ?? image.image_url ?? index}
                    type="button"
                    onClick={() => setSelectedImage(image.image_url)}
                    aria-label={t("selectImage", {
                      defaultValue: isArabic
                        ? "اختيار الصورة"
                        : "Select image",
                    })}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      selectedImage === image.image_url
                        ? "border-[#a67c52]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={
                        text(image.alt_en, image.alt_ar) ||
                        productName
                      }
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="relative min-w-0 flex-1 overflow-hidden rounded-[18px] ">
              <img
                src={selectedImage || product.primary_image}
                alt={productName}
                className="h-100 w-9/10 rounded-[28px] object-cover transition-transform duration-700 hover:scale-105 "
              />

              {Number(product.discount_pct) > 0 && (
                <span className="absolute start-s-5 top-5 rounded-full bg-[#1d1d1d] px-4 py-2 text-sm text-white">
                  -{product.discount_pct}%
                </span>
              )}

              <div className="absolute end-e-40 top-5">
                <ToggleWishlist productId={product.id} />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center ">
            <p className="mb-3 text-sm uppercase tracking-[4px] text-[#a67c52]">
              {text(
                product.brand_name_en,
                product.brand_name_ar
              )}
            </p>

            <h1 className="text-4xl font-semibold leading-tight text-[#1d1d1d] md:text-5xl">
              {productName}
            </h1>

            {/* Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={
                      star <=
                      Math.round(Number(product.rating_avg || 0))
                        ? "text-[#c49a6c]"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-gray-500">
                {product.rating_avg ?? 0} (
                {product.rating_count ?? 0}{" "}
                {t("reviews", {
                  defaultValue: isArabic ? "تقييمات" : "reviews",
                })}
                )
              </span>
            </div>

            {/* Short Description */}
            {productDescription && (
              <p className="mt-2 leading-7 text-gray-500">
                {productDescription}
              </p>
            )}

            {/* Price */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold text-[#1d1d1d]">
                {currentPrice ?? "-"}{" "}
                {t("currency", {
                  defaultValue: isArabic ? "ر.س" : "SAR",
                })}
              </span>

              {oldPrice != null && (
                <span className="text-lg text-gray-400 line-through">
                  {oldPrice}{" "}
                  {t("currency", {
                    defaultValue: isArabic ? "ر.س" : "SAR",
                  })}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-3 flex items-center gap-2">
              {!isOutOfStock ? (
                <>
                  <FaCheck className="text-green-600" />

                  <span className="text-sm text-green-700">
                    {t("inStock", {
                      defaultValue: isArabic
                        ? "متوفر في المخزون"
                        : "In Stock",
                    })}
                  </span>
                </>
              ) : (
                <span className="text-sm text-red-500">
                  {t("outOfStock", {
                    defaultValue: isArabic
                      ? "نفد من المخزون"
                      : "Out of Stock",
                  })}
                </span>
              )}
            </div>

            {/* Variants / Sizes */}
            {variants.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 font-medium text-[#222]">
                  {t("size", {
                    defaultValue: isArabic ? "الحجم" : "Size",
                  })}
                </p>

                <div className="flex flex-wrap gap-3">
                  {variants.map((variant) => {
                    const active =
                      selectedVariant?.id === variant.id;

                    const disabled =
                      Number(variant.stock_qty ?? 0) <= 0;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleVariantChange(variant)}
                        className={`rounded-full border px-6 py-3 text-sm transition-all duration-300 ${
                          active
                            ? "border-[#a67c52] bg-[#a67c52] text-white"
                            : "border-gray-300 bg-white hover:border-[#a67c52] hover:text-[#a67c52]"
                        } ${
                          disabled
                            ? "cursor-not-allowed opacity-40"
                            : ""
                        }`}
                      >
                        {text(variant.name_en, variant.name_ar) ||
                          (variant.volume_ml
                            ? `${variant.volume_ml} ml`
                            : variant.id)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          
            {/* Add to Cart */}
            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-full bg-gray-300 px-6 py-4 text-sm font-medium text-gray-500"
              >
                {t("outOfStock", {
                  defaultValue: isArabic
                    ? "نفد من المخزون"
                    : "Out of Stock",
                })}
              </button>
            ) : (
              <div className="my-3 text-center rounded-full border w-100 border-black p-4 text-sm font-semibold transition-colors text-white bg-black hover:bg-white hover:text-black">
                <ButtonAddToCart
                  product={{
                    ...product,
                    variant_id: selectedVariant?.id,
                  }}
                  variantId={selectedVariant?.id}
                  quantity={quantity}
                />
              </div>
            )}

            {/* Product Details */}
            <div className="mt-10 grid grid-cols-2 gap-5 border-t border-gray-200 pt-7">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  {t("concentration", {
                    defaultValue: isArabic
                      ? "تركيز العطر"
                      : "Concentration",
                  })}
                </p>

                <p className="mt-1 font-medium uppercase">
                  {product.concentration || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  {t("volume", {
                    defaultValue: isArabic ? "الحجم" : "Volume",
                  })}
                </p>

                <p className="mt-1 font-medium">
                  {selectedVariant?.volume_ml ||
                    product.volume_ml ||
                    "-"}{" "}
                  {t("ml", { defaultValue: "ml" })}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  {t("gender", {
                    defaultValue: isArabic ? "الفئة" : "Gender",
                  })}
                </p>

                <p className="mt-1 font-medium capitalize">
                  {text(
                    product.gender === "male"
                      ? "Men"
                      : product.gender === "female"
                      ? "Women"
                      : product.gender,
                    product.gender === "male"
                      ? "رجالي"
                      : product.gender === "female"
                      ? "نسائي"
                      : product.gender
                  ) || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  SKU
                </p>

                <p className="mt-1 font-medium">
                  {selectedVariant?.sku || product.sku || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fragrance Notes */}
        <section className="mt-24 rounded-[30px] bg-white p-8 shadow-sm md:p-12">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[4px] text-[#a67c52]">
              {t("fragrance", {
                defaultValue: isArabic ? "العطر" : "Fragrance",
              })}
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              {t("fragranceNotes", {
                defaultValue: isArabic
                  ? "مكونات العطر"
                  : "Fragrance Notes",
              })}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["topNotes", product.top_notes_en, product.top_notes_ar],
              [
                "heartNotes",
                product.heart_notes_en,
                product.heart_notes_ar,
              ],
              ["baseNotes", product.base_notes_en, product.base_notes_ar],
            ].map(([key, en, ar]) => (
              <div
                key={key}
                className="rounded-2xl bg-[#faf9f7] p-7"
              >
                <span className="text-sm text-[#a67c52]">
                  {t(key, {
                    defaultValue: isArabic
                      ? key === "topNotes"
                        ? "المكونات العليا"
                        : key === "heartNotes"
                        ? "مكونات القلب"
                        : "المكونات الأساسية"
                      : key === "topNotes"
                      ? "Top Notes"
                      : key === "heartNotes"
                      ? "Heart Notes"
                      : "Base Notes",
                  })}
                </span>

                <p className="mt-3 leading-7 text-gray-600">
                  {text(en, ar) ||
                    t("notAvailable", {
                      defaultValue: isArabic
                        ? "غير متوفر"
                        : "Not available",
                    })}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="mt-12 rounded-[30px] bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm uppercase tracking-[4px] text-[#a67c52]">
            {t("aboutFragrance", {
              defaultValue: isArabic
                ? "عن العطر"
                : "About the Fragrance",
            })}
          </p>

          <h2 className="mt-2 text-3xl font-semibold">
            {t("description", {
              defaultValue: isArabic ? "الوصف" : "Description",
            })}
          </h2>

          <p className="mt-6 max-w-4xl leading-8 text-gray-600">
            {productDescription ||
              t("noDescription", {
                defaultValue: isArabic
                  ? "لا يوجد وصف متاح لهذا المنتج."
                  : "No description available for this product.",
              })}
          </p>
        </section>

        {/* Customer Reviews */}
        <section className="mt-12">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[4px] text-[#a67c52]">
              {t("customerReviews", {
                defaultValue: isArabic
                  ? "آراء العملاء"
                  : "Customer Reviews",
              })}
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              {t("whatCustomersSay", {
                defaultValue: isArabic
                  ? "ماذا يقول عملاؤنا"
                  : "What Customers Say",
              })}
            </h2>
          </div>

          {reviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl bg-white p-7 shadow-sm"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= Number(review.rating || 0)
                            ? "text-[#c49a6c]"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>

                  {(review.title_en || review.title_ar) && (
                    <h3 className="mt-5 font-semibold">
                      {text(review.title_en, review.title_ar)}
                    </h3>
                  )}

                  <p className="mt-3 leading-7 text-gray-500">
                    {text(review.body_en, review.body_ar) ||
                      (isArabic
                        ? "لا يوجد تعليق مكتوب."
                        : "No written comment.")}
                  </p>

                  <p className="mt-5 text-sm font-medium text-[#a67c52]">
                    {review.reviewer_name ||
                      (isArabic ? "عميل" : "Customer")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">
                {t("noReviews", {
                  defaultValue: isArabic
                    ? "لا توجد تقييمات لهذا المنتج حتى الآن."
                    : "No reviews for this product yet.",
                })}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}