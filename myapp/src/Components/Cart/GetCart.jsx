import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartCount } from "../CartCount";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function GetCart() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");
  const navigate = useNavigate();

  const cartContext = useContext(CartCount);
  const setCount = cartContext?.setCount || cartContext?.SetCount;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);

  const token = localStorage.getItem("token");
  const items = cart?.items || [];

  const translate = (key, en, ar) =>
    t(key, { defaultValue: isArabic ? ar : en });

  useEffect(() => {
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  const getCart = useCallback(
    async (showError = true) => {
      try {
        if (!token) {
          setCart({ items: [], items_count: 0 });
          setCount?.(0);
          localStorage.setItem("count", "0");
          return;
        }

        const response = await axios.get(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = response.data?.data;

        setCart(data || { items: [], items_count: 0 });
      } catch (error) {
        console.error("GET CART ERROR:", error.response?.data || error);

        if (showError) {
          toast.error(
            error.response?.data?.message ||
              translate(
                "cartLoadError",
                "Failed to load cart",
                "فشل تحميل السلة"
              )
          );
        }

        setCart(null);
      } finally {
        setLoading(false);
      }
    },
    [token, setCount, isArabic]
  );

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    if (!cart) return;

    const count = Number(
      cart.items_count ??
        items.reduce(
          (total, item) => total + Number(item.quantity || 0),
          0
        )
    );

    setCount?.(count);
    localStorage.setItem("count", String(count));
  }, [cart, setCount]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1 || updatingItem !== null || clearingCart) return;

    if (!token) {
      toast.error(
        translate("loginRequired", "Please log in first", "سجّلي الدخول أولًا")
      );
      return;
    }

    const item = items.find(
      (cartItem) => String(cartItem.id) === String(itemId)
    );

    if (!item) return;

    const stock = Number(item.stock_qty ?? 0);

    if (stock > 0 && newQuantity > stock) {
      toast.error(
        translate(
          "maxStock",
          "Quantity exceeds available stock",
          "الكمية أكبر من المخزون المتاح"
        )
      );
      return;
    }

    try {
      setUpdatingItem(itemId);

      const response = await axios.patch(
        `${API_URL}/cart/items/${itemId}`,
        { quantity: Number(newQuantity) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast.success(
        response.data?.message ||
          translate(
            "cartUpdated",
            "Cart updated successfully",
            "تم تحديث السلة بنجاح"
          )
      );

      await getCart(false);
    } catch (error) {
      console.error("UPDATE CART ERROR:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          translate(
            "updateError",
            "Failed to update cart",
            "فشل تحديث السلة"
          )
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const deleteCartItem = async (itemId) => {
    if (updatingItem !== null || clearingCart) return;

    if (!token) {
      toast.error(
        translate("loginRequired", "Please log in first", "سجّلي الدخول أولًا")
      );
      return;
    }

    try {
      setUpdatingItem(itemId);

      const response = await axios.delete(
        `${API_URL}/cart/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      toast.success(
        response.data?.message ||
          translate(
            "itemRemoved",
            "Item removed from cart",
            "تم حذف المنتج من السلة"
          )
      );

      await getCart(false);
    } catch (error) {
      console.error("DELETE ITEM ERROR:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          translate(
            "removeError",
            "Failed to remove item",
            "فشل حذف المنتج"
          )
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const deleteCart = async () => {
    if (clearingCart || updatingItem !== null) return;

    if (!token) {
      toast.error(
        translate("loginRequired", "Please log in first", "سجّلي الدخول أولًا")
      );
      return;
    }

    try {
      setClearingCart(true);

      const response = await axios.delete(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setCart({ items: [], items_count: 0 });
      setCount?.(0);
      localStorage.setItem("count", "0");

      toast.success(
        response.data?.message ||
          translate(
            "cartCleared",
            "Cart cleared successfully",
            "تم إفراغ السلة بنجاح"
          )
      );

      await getCart(false);
    } catch (error) {
      console.error("CLEAR CART ERROR:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          translate(
            "clearError",
            "Failed to clear cart",
            "فشل إفراغ السلة"
          )
      );
    } finally {
      setClearingCart(false);
    }
  };

  const formatPrice = (value) => {
    const number = Number(value ?? 0);

    return (Number.isFinite(number) ? number : 0).toLocaleString(
      isArabic ? "ar-EG" : "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const currency = translate("currency", "SAR", "ر.س");

  const getVariantLabel = (item) => {
    const variantName = isArabic
      ? item.variant_name_ar || item.variant_name_en
      : item.variant_name_en || item.variant_name_ar;

    if (variantName && String(variantName).trim()) {
      return variantName;
    }

    const volume = item.volume_ml ?? item.product?.volume_ml;

    if (volume !== null && volume !== undefined && volume !== "") {
      return `${volume} ${isArabic ? "مل" : "ml"}`;
    }

    return null;
  };

  if (loading) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#a67c52]" />
          <p className="text-gray-500">
            {translate("loading", "Loading cart...", "جارٍ تحميل السلة...")}
          </p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <p className="text-gray-500">
          {translate(
            "noCart",
            "Unable to load your cart.",
            "تعذر تحميل السلة."
          )}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            getCart();
          }}
          className="rounded-full bg-[#1d1d1d] px-6 py-3 text-white transition hover:bg-[#a67c52]"
        >
          {translate("retry", "Try Again", "إعادة المحاولة")}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0e9e1]">
          <FaTrash className="text-2xl text-[#a67c52]" />
        </div>

        <h1 className="mb-3 text-2xl font-semibold text-[#1d1d1d]">
          {translate("emptyCart", "Your cart is empty", "سلة التسوق فارغة")}
        </h1>

        <p className="mb-6 text-gray-500">
          {translate(
            "emptyCartMessage",
            "Add some products to your cart.",
            "أضيفي بعض المنتجات إلى سلة التسوق."
          )}
        </p>

        <Link
          to="/home"
          className="rounded-full bg-[#1d1d1d] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#a67c52]"
        >
          {translate(
            "continueShopping",
            "Continue Shopping",
            "متابعة التسوق"
          )}
        </Link>
      </div>
    );
  }

  const itemCount = Number(
    cart.items_count ??
      items.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      )
  );

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#faf9f7] py-10 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-8 md:mb-10">
         
          <p className="mt-2  text-gray-800">
            {itemCount}{" "}
            {isArabic
              ? "منتج في سلة التسوق"
              : itemCount === 1
              ? "item in your cart"
              : "items in your cart"}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-10">
          <section className="lg:col-span-2">
            {items.map((item) => {
              const itemName = isArabic
                ? item.name_ar || item.name_en || item.product?.name_ar
                : item.name_en || item.name_ar || item.product?.name_en;

              const variantLabel = getVariantLabel(item);
              const isUpdating = updatingItem === item.id;
              const stock = Number(item.stock_qty ?? 0);

              const image =
                item.image ||
                item.primary_image ||
                item.product?.primary_image ||
                item.product?.image ||
                "";

              const unitPrice = Number(item.unit_price ?? item.price ?? 0);
              const quantity = Number(item.quantity ?? 1);

              return (
                <article
                  key={item.id}
                  className="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:gap-5 sm:p-5"
                >
                  <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#f7f5f2] sm:h-36 sm:w-32">
                    {image ? (
                      <img
                        src={image}
                        alt={itemName || "Product"}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        {translate("noImage", "No image", "لا توجد صورة")}
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-[#1d1d1d] md:text-xl">
                          {itemName ||
                            translate("product", "Product", "منتج")}
                        </h2>

                        {variantLabel && (
                          <p className="mt-2 text-sm text-gray-500">
                            {variantLabel}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={isUpdating || clearingCart}
                        onClick={() => deleteCartItem(item.id)}
                        aria-label={translate(
                          "removeItem",
                          "Remove item",
                          "حذف المنتج"
                        )}
                        className="flex shrink-0 items-center justify-center rounded-full p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <TiDelete className="text-2xl" />
                      </button>
                    </div>

                    <p className="mt-3 text-lg font-bold text-[#1d1d1d]">
                      {formatPrice(unitPrice)} {currency}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                      <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-200 bg-white">
                        <button
                          type="button"
                          disabled={
                            quantity <= 1 || isUpdating || clearingCart
                          }
                          onClick={() =>
                            updateQuantity(item.id, quantity - 1)
                          }
                          aria-label={translate(
                            "decreaseQuantity",
                            "Decrease quantity",
                            "تقليل الكمية"
                          )}
                          className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FaMinus size={11} />
                        </button>

                        <span
                          aria-live="polite"
                          className="flex h-10 min-w-10 items-center justify-center border-x border-gray-200 px-2 text-sm font-semibold"
                        >
                          {isUpdating ? "..." : quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            clearingCart ||
                            (stock > 0 && quantity >= stock)
                          }
                          onClick={() =>
                            updateQuantity(item.id, quantity + 1)
                          }
                          aria-label={translate(
                            "increaseQuantity",
                            "Increase quantity",
                            "زيادة الكمية"
                          )}
                          className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FaPlus size={11} />
                        </button>
                      </div>

                      <p className="text-sm text-gray-500">
                        {translate("subtotal", "Subtotal", "المجموع الفرعي")}:{" "}
                        <span className="font-semibold text-[#302218]">
                          {formatPrice(unitPrice * quantity)} {currency}
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/home"
                className="text-sm font-medium text-gray-600 transition hover:text-[#a67c52]"
              >
                {translate(
                  "continueShopping",
                  "Continue Shopping",
                  "متابعة التسوق"
                )}
              </Link>

              <button
                type="button"
                disabled={clearingCart || updatingItem !== null}
                onClick={deleteCart}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaTrash size={12} />
                {clearingCart
                  ? translate("clearing", "Clearing...", "جارٍ الإفراغ...")
                  : translate("clearCart", "Clear Cart", "إفراغ السلة")}
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-6 text-xl font-bold text-[#1d1d1d]">
              {translate("orderSummary", "Order Summary", "ملخص الطلب")}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">
                  {translate("subtotal", "Subtotal", "المجموع الفرعي")}
                </span>
                <span className="text-sm font-medium">
                  {formatPrice(cart.subtotal)} {currency}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">
                  {translate("discount", "Discount", "الخصم")}
                </span>
                <span className="text-sm font-medium">
                  {formatPrice(cart.discount)} {currency}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">
                  {translate("shipping", "Shipping", "الشحن")}
                </span>
                <span className="text-sm font-medium">
                  {formatPrice(cart.shipping)} {currency}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">
                  {translate("tax", "Tax", "الضريبة")}
                </span>
                <span className="text-sm font-medium">
                  {formatPrice(cart.tax)} {currency}
                </span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-bold">
                  {translate("total", "Total", "الإجمالي")}
                </span>
                <span className="text-xl font-bold text-[#a67c52]">
                  {formatPrice(cart.total)} {currency}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!token) {
                  toast.error(
                    translate(
                      "loginRequired",
                      "Please log in first",
                      "سجّلي الدخول أولًا"
                    )
                  );
                  navigate("/login");
                  return;
                }

                navigate("/checkout");
              }}
              className="mt-7 w-full rounded-full bg-[#1d1d1d] px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#a67c52]"
            >
              {translate(
                "proceedCheckout",
                "Proceed to Checkout",
                "إتمام الطلب"
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-gray-400">
              {translate(
                "secureCheckout",
                "Shipping and final charges are confirmed at checkout.",
                "يتم تأكيد الشحن والتكاليف النهائية عند إتمام الطلب."
              )}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
