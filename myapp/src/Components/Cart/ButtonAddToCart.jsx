


import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CartCount } from "../CartCount";
import { ClipLoader } from "react-spinners";
export default function ButtonAddToCart({
  product,
  quantity = 1,
  variantId,
}) {
  const cartContext = useContext(CartCount) || {};
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  const isArabic = i18n.language.startsWith("ar");

  const AddToCart = async () => {
    if (loading) return;

    if (!product?.id && !product?.product_id) {
      toast.error(isArabic ? "بيانات المنتج غير متاحة" : "Product data is unavailable");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          isArabic
            ? "سجّلي الدخول أولًا لإضافة المنتج إلى السلة"
            : "Please log in to add this product to your cart"
        );
        return;
      }

      setLoading(true);

      const response = await axios.post(
        "https://oud-elite.shaarapp.com/api/v1/cart/items",
        {
          product_id: product.id ?? product.product_id,
          variant_id: variantId ?? product.variant_id ?? null,
          quantity: Number(quantity) || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updateCount = cartContext.SetCount || cartContext.setCount;

      if (typeof updateCount === "function") {
        updateCount((prev) => Number(prev || 0) + (Number(quantity) || 1));
      }

      toast.success(
        response?.data?.message ||
          (isArabic
            ? "تمت إضافة المنتج إلى السلة بنجاح"
            : "Product added successfully")
      );
    } catch (error) {
      console.error("Failed to add product:", error);

      toast.error(
        error.response?.data?.message ||
          (isArabic
            ? "تعذرت إضافة المنتج إلى السلة"
            : "Failed to add product to cart")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={AddToCart}
      disabled={loading}
      dir={isArabic ? "rtl" : "ltr"}
      className="
       
      "
    >
      {loading ? (
        <>
          <span>
          <ClipLoader color="#0e0d0d7c" size={18} />

</span>
        </>
      ) : (
        t("addToCart", {
          defaultValue: isArabic ? "أضف إلى السلة" : "Add to Cart",
        })
      )}
    </button>
  );
}


