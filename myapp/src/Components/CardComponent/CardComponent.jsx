import React from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ToggleWishlist from "../Wishlist/ToggleWishlist";
import ButtonAddToCart from "../Cart/ButtonAddToCart";

export default function CardComponent({ product }) {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const productName = isArabic
    ? product.name_ar || product.name_en
    : product.name_en || product.name_ar;

  const productDescription = isArabic
    ? product.short_desc_ar || product.short_desc_en
    : product.short_desc_en || product.short_desc_ar;

  // Define proper variables based on your product prop
  const productId = product.id ?? product.product_id;
  const productPrice =
    product.effective_price ?? product.sale_price ?? product.base_price;
  const productImage = product.primary_image;

  return (
    <div className="group relative h-full">
      <div
        className="
          relative overflow-hidden rounded-[15px]  bg-white
          shadow-sm transition-all duration-500
          hover:-translate-y-2 hover:shadow-2xl
        "
      >
        {/* Product Image */}
        <div className="relative h-62  overflow-hidden bg-[#f1efeb]">
          <img
            src={productImage}
            alt={productName || "Product"}
            className="
              h-full w-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-110
            "
          />

          {/* Hover Overlay */}
          <div
            className="
              absolute inset-0 z-20
               items-center justify-center
              gap-3 bg-black/50
              opacity-0 invisible
              transition-all duration-500
              group-hover:opacity-100
              group-hover:visible
            "
          >
            {/* Actions Wrapper */}
            <div
              className="
                flex flex-row items-center justify-center gap-3
                translate-y-4 opacity-0
                transition-all duration-500 delay-100
                group-hover:translate-y-0
                group-hover:opacity-100
                  absolute top-1/2 bottom-10 w-full
              "
            >
              {/* Wishlist */}
              <ToggleWishlist productId={productId} />

              {/* View Details */}
              <Link
                to={`/home/${product.slug}`}
                aria-label={t("viewDetails")}
                className="
                   flex h-12 w-12 shrink-0
  items-center justify-center
  rounded-full bg-white text-xl text-[#222]
  shadow-lg transition-all  duration-400
  hover:scale-110
                "
              >
                <FaEye />
              </Link>

            
            </div>

              {/* Add To Cart Button */}
              <div className=" absolute bottom-0 text-center rounded-md border w-full border-black px-4 py-2 text-sm font-semibold transition-colors text-white bg-black hover:bg-white hover:text-black">
                <ButtonAddToCart
                  product={{
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                  }}
                  productId={productId}
                  quantity={1}
                />
              </div>




          </div>


          
        </div>

        {/* Product Content */}
        <div className="p-5" dir={isArabic ? "rtl" : "ltr"}>
          <Link to={`/home/${product.slug}`}>
            <h3
              title={productName}
              className="
                line-clamp-1 text-lg font-semibold text-[#222]
                transition-colors duration-300 hover:text-[#a67c52]
              "
            >
              {productName}
            </h3>
          </Link>

          <p
            title={productDescription}
            className="mt-1 line-clamp-1 text-sm text-gray-500"
          >
            {productDescription}
          </p>

          {/* Price */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xl font-bold text-[#1d1d1d]">
              {productPrice}
            </span>

            {product.sale_price &&
              Number(product.sale_price) < Number(product.base_price) && (
                <span className="text-sm text-gray-400 line-through">
                  {product.base_price}
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}