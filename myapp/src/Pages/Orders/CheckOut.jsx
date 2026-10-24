
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaBox,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaCheckCircle,
  FaTrashAlt,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function CheckOut() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const isArabic = i18n.language?.startsWith("ar");
  const token = localStorage.getItem("token");
  const currency = isArabic ? "ر.س" : "SAR";

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [order, setOrder] = useState(null);

  const text = (en, ar) => (isArabic ? ar : en);

  const formatPrice = (value) => {
    const amount = Number(value ?? 0);

    return (Number.isFinite(amount) ? amount : 0).toLocaleString(
      isArabic ? "ar-EG" : "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const getAddressId = (address) =>
    address.id ?? address.address_id;

  const getItemId = (item) =>
    item.cart_item_id ?? item.id;

  const getProduct = (item) =>
    item.product ?? item;

  const getProductName = (item) => {
    const product = getProduct(item);

    return isArabic
      ? product.name_ar ??
          product.name_en ??
          product.name ??
          "منتج"
      : product.name_en ??
          product.name ??
          product.name_ar ??
          "Product";
  };

  const getProductImage = (item) => {
    const product = getProduct(item);

    const image =
      item.image_url ??
      item.primary_image ??
      product.primary_image ??
      product.image_url ??
      product.image ??
      product.images?.[0]?.image_url;

    return typeof image === "string" ? image : "";
  };

  const getItemPrice = (item) => {
    const product = getProduct(item);

    const price =
      item.unit_price ??
      item.price ??
      item.unitPrice ??
      product.effective_price ??
      product.sale_price ??
      product.base_price ??
      0;

    const amount = Number(price);

    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
  };

  const calculateItemsTotal = (items) =>
    items.reduce((sum, item) => {
      const quantity = Number(item.quantity ?? 1);

      return (
        sum +
        getItemPrice(item) *
          (Number.isFinite(quantity) && quantity > 0 ? quantity : 1)
      );
    }, 0);

  const loadCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      setCartTotal(0);
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true);

    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Failed to load cart."
        );
      }

      const result = response.data?.data ?? response.data;
      const cart = result?.cart ?? result;

      const items = Array.isArray(result?.items)
        ? result.items
        : Array.isArray(cart?.items)
        ? cart.items
        : Array.isArray(result)
        ? result
        : [];

      setCartItems(items);

      const apiTotal =
        cart?.total ??
        cart?.total_amount ??
        cart?.subtotal ??
        result?.total ??
        result?.total_amount ??
        result?.subtotal;

      const numericTotal = Number(apiTotal);

      setCartTotal(
        apiTotal !== undefined &&
          apiTotal !== null &&
          Number.isFinite(numericTotal)
          ? numericTotal
          : calculateItemsTotal(items)
      );
    } catch (error) {
      console.error(
        "GET CART ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          text("Failed to load cart.", "فشل تحميل السلة.")
      );

      setCartItems([]);
      setCartTotal(0);
    } finally {
      setLoadingCart(false);
    }
  }, [token, isArabic]);

  const loadAddresses = useCallback(async () => {
    if (!token) {
      setAddresses([]);
      setLoadingAddresses(false);
      return;
    }

    setLoadingAddresses(true);

    try {
      const response = await axios.get(
        `${API_URL}/users/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Failed to load addresses."
        );
      }

      const result = response.data?.data;

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.addresses)
        ? result.addresses
        : Array.isArray(response.data?.addresses)
        ? response.data.addresses
        : [];

      setAddresses(list);

      const defaultAddress =
        list.find(
          (address) =>
            address.is_default === true ||
            address.is_default === 1 ||
            address.is_default === "1"
        ) ?? list[0];

      setAddressId(
        defaultAddress && getAddressId(defaultAddress) != null
          ? String(getAddressId(defaultAddress))
          : ""
      );
    } catch (error) {
      console.error(
        "GET ADDRESSES ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          text(
            "Failed to load addresses.",
            "فشل تحميل العناوين."
          )
      );
    } finally {
      setLoadingAddresses(false);
    }
  }, [token, isArabic]);

  useEffect(() => {
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  useEffect(() => {
    if (!token) {
      toast.error(
        text("Please log in first.", "سجّلي الدخول أولًا.")
      );

      setLoadingCart(false);
      setLoadingAddresses(false);
      return;
    }

    loadCart();
    loadAddresses();
  }, [token, loadCart, loadAddresses]);

  const updateQuantity = async (item, nextQuantity) => {
    const itemId = getItemId(item);

    if (!itemId || updatingItem !== null) return;

    if (nextQuantity < 1) {
      await removeItem(item);
      return;
    }

    setUpdatingItem(itemId);

    try {
      const response = await axios.patch(
        `${API_URL}/cart/items/${itemId}`,
        { quantity: nextQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Failed to update quantity."
        );
      }

      await loadCart();
    } catch (error) {
      console.error(
        "UPDATE CART ITEM ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          text(
            "Failed to update quantity.",
            "فشل تحديث الكمية."
          )
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (item) => {
    const itemId = getItemId(item);

    if (!itemId || updatingItem !== null) return;

    setUpdatingItem(itemId);

    try {
      const response = await axios.delete(
        `${API_URL}/cart/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Failed to remove item."
        );
      }

      toast.success(
        text(
          "Product removed from cart.",
          "تم حذف المنتج من السلة."
        )
      );

      await loadCart();
    } catch (error) {
      console.error(
        "REMOVE CART ITEM ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          text(
            "Failed to remove product.",
            "فشل حذف المنتج."
          )
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (submitting) return;

    if (!token) {
      toast.error(
        text("Please log in first.", "سجّلي الدخول أولًا.")
      );
      navigate("/login");
      return;
    }

    if (loadingCart || loadingAddresses) {
      toast.error(
        text(
          "Please wait for the page to load.",
          "انتظري حتى يكتمل التحميل."
        )
      );
      return;
    }

    if (cartItems.length === 0) {
      toast.error(
        text("Your cart is empty.", "السلة فارغة.")
      );
      return;
    }

    const numericAddressId = Number(addressId);

    if (
      !addressId ||
      !Number.isInteger(numericAddressId) ||
      numericAddressId <= 0
    ) {
      toast.error(
        text(
          "Please select a valid delivery address.",
          "اختاري عنوان توصيل صحيحًا."
        )
      );
      return;
    }

    if (updatingItem !== null) {
      toast.error(
        text(
          "Please wait until cart updates finish.",
          "انتظري حتى ينتهي تحديث السلة."
        )
      );
      return;
    }

    setSubmitting(true);
    setOrder(null);

    try {
      // Build a normal JavaScript object.
      // Axios serializes this object to JSON automatically.
      const payload = {
        address_id: numericAddressId,
        payment_method: paymentMethod,
        notes: notes.trim(),
      };

      // Diagnostic logs: inspect the payload in DevTools Console.
      console.log("ORDER PAYLOAD:", payload);
      console.log("ORDER PAYLOAD JSON:", JSON.stringify(payload));

      const response = await axios.post(
        `${API_URL}/orders`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message ||
            text(
              "Failed to place order.",
              "فشل إنشاء الطلب."
            )
        );
      }

      const result = response.data?.data ?? response.data;

      setOrder(result);

      toast.success(
        response.data?.message ||
          text(
            "Order placed successfully.",
            "تم إنشاء الطلب بنجاح."
          )
      );

      // Refresh the cart after a successful order.
      await loadCart();
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error.response?.data || error
      );

      console.error(
        "ORDER HTTP STATUS:",
        error.response?.status
      );

      console.error(
        "ORDER REQUEST DATA:",
        error.config?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          text(
            "An error occurred while placing your order.",
            "حدث خطأ أثناء إنشاء الطلب."
          )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f8f5f1] px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#302218]">
            {text("Checkout", "إتمام الطلب")}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {text(
              "Review your cart, select your address and confirm your order.",
              "راجعي منتجات السلة واختاري عنوان التوصيل ثم أكدي طلبك."
            )}
          </p>
        </header>

        {order ? (
          <section className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <FaCheckCircle className="mx-auto mb-4 text-5xl text-green-600" />

            <h2 className="text-2xl font-bold text-[#302218]">
              {text(
                "Your order was placed successfully!",
                "تم إنشاء طلبك بنجاح!"
              )}
            </h2>

            {(order.order_number ||
              order.order_id ||
              order.id) && (
              <p className="mt-3 text-gray-600">
                {text("Order number: ", "رقم الطلب: ")}
                <strong>
                  {order.order_number ||
                    order.order_id ||
                    order.id}
                </strong>
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/orders/my"
                className="rounded-xl bg-[#302218] px-6 py-3 font-semibold text-white transition hover:bg-[#493525]"
              >
                {text("View My Orders", "عرض طلباتي")}
              </Link>

              <Link
                to="/home"
                className="rounded-xl border border-[#302218] px-6 py-3 font-semibold text-[#302218] transition hover:bg-[#faf7f3]"
              >
                {text("Continue Shopping", "متابعة التسوق")}
              </Link>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.3fr_0.9fr]"
          >
            <div className="space-y-6">
              {/* Cart products */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#302218]">
                    <FaShoppingBag />
                    {text("Your Cart", "سلة التسوق")}
                  </h2>

                  <Link
                    to="/cart"
                    className="text-sm font-medium text-[#a67c52] hover:underline"
                  >
                    {text("Edit Cart", "تعديل السلة")}
                  </Link>
                </div>

                {loadingCart ? (
                  <div className="flex justify-center py-10">
                    <ClipLoader color="#302218" size={30} />
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <FaShoppingBag className="mx-auto mb-4 text-4xl text-gray-300" />

                    <p className="text-gray-600">
                      {text("Your cart is empty.", "السلة فارغة.")}
                    </p>

                    <Link
                      to="/home"
                      className="mt-4 inline-block rounded-xl bg-[#302218] px-5 py-3 font-semibold text-white"
                    >
                      {text("Start Shopping", "ابدئي التسوق")}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => {
                      const itemId = getItemId(item);
                      const rawQuantity = Number(item.quantity ?? 1);
                      const quantity =
                        Number.isFinite(rawQuantity) && rawQuantity > 0
                          ? rawQuantity
                          : 1;

                      const unitPrice = getItemPrice(item);
                      const image = getProductImage(item);
                      const product = getProduct(item);

                      return (
                        <article
                          key={itemId ?? product.id ?? index}
                          className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 sm:gap-4"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={getProductName(item)}
                              className="h-24 w-20 shrink-0 rounded-xl bg-[#f8f5f1] object-cover sm:h-28 sm:w-24"
                            />
                          ) : (
                            <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-[#f8f5f1] sm:h-28 sm:w-24">
                              <FaBox className="text-2xl text-[#a67c52]" />
                            </div>
                          )}

                          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-[#302218]">
                                {getProductName(item)}
                              </h3>

                              {(item.variant?.name_en ||
                                item.variant?.name_ar ||
                                item.variant_name) && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {isArabic
                                    ? item.variant?.name_ar ??
                                      item.variant_name ??
                                      item.variant?.name_en
                                    : item.variant?.name_en ??
                                      item.variant_name ??
                                      item.variant?.name_ar}
                                </p>
                              )}

                              <p className="mt-1 text-sm text-gray-500">
                                {formatPrice(unitPrice)} {currency}{" "}
                                {text("each", "للقطعة")}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-2 py-1.5">
                                <button
                                  type="button"
                                  disabled={updatingItem !== null}
                                  onClick={() =>
                                    updateQuantity(item, quantity - 1)
                                  }
                                  aria-label={text(
                                    "Decrease quantity",
                                    "تقليل الكمية"
                                  )}
                                  className="p-1 text-[#302218] disabled:opacity-40"
                                >
                                  <FaMinus size={11} />
                                </button>

                                <span className="min-w-5 text-center text-sm font-semibold">
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  disabled={updatingItem !== null}
                                  onClick={() =>
                                    updateQuantity(item, quantity + 1)
                                  }
                                  aria-label={text(
                                    "Increase quantity",
                                    "زيادة الكمية"
                                  )}
                                  className="p-1 text-[#302218] disabled:opacity-40"
                                >
                                  <FaPlus size={11} />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <p className="font-bold text-[#a67c52]">
                                  {formatPrice(unitPrice * quantity)}{" "}
                                  {currency}
                                </p>

                                <button
                                  type="button"
                                  disabled={updatingItem !== null}
                                  onClick={() => removeItem(item)}
                                  aria-label={text(
                                    "Remove product",
                                    "حذف المنتج"
                                  )}
                                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-40"
                                >
                                  {updatingItem === itemId ? (
                                    <ClipLoader
                                      color="#ef4444"
                                      size={15}
                                    />
                                  ) : (
                                    <FaTrashAlt size={14} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Delivery address */}
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#302218]">
                  <FaMapMarkerAlt />
                  {text("Delivery Address", "عنوان التوصيل")}
                </h2>

                {loadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <ClipLoader color="#302218" size={28} />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-xl bg-[#f8f5f1] p-4">
                    <p className="text-sm text-gray-600">
                      {text(
                        "No saved addresses. Please add an address first.",
                        "لا توجد عناوين محفوظة. أضيفي عنوانًا أولًا."
                      )}
                    </p>

                    <Link
                      to="/addresses"
                      className="mt-3 inline-block font-semibold text-[#a67c52] hover:underline"
                    >
                      {text("Add Address", "إضافة عنوان")}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => {
                      const id = getAddressId(address);
                      const selected =
                        String(addressId) === String(id);

                      return (
                        <label
                          key={id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                            selected
                              ? "border-[#302218] bg-[#faf7f3]"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address_id"
                            value={id}
                            checked={selected}
                            onChange={(event) =>
                              setAddressId(event.target.value)
                            }
                            className="mt-1 accent-[#302218]"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-[#302218]">
                                {address.label === "work"
                                  ? text("Work", "العمل")
                                  : address.label === "home"
                                  ? text("Home", "المنزل")
                                  : address.label ||
                                    text("Address", "العنوان")}
                              </span>

                              {(address.is_default === true ||
                                address.is_default === 1 ||
                                address.is_default === "1") && (
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                  {text("Default", "افتراضي")}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm text-gray-700">
                              {address.full_name}
                            </p>

                            <p className="mt-1 text-sm leading-6 text-gray-500">
                              {[
                                address.street,
                                address.building,
                                address.flat,
                                address.district,
                                address.city,
                                address.emirate,
                                address.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>

                            {address.phone && (
                              <p className="mt-1 text-sm text-gray-500">
                                {address.phone}
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Payment and order total */}
            <aside className="space-y-6 lg:sticky lg:top-6">
              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#302218]">
                  <FaBox />
                  {text("Payment Method", "طريقة الدفع")}
                </h2>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#302218] bg-[#faf7f3] p-4">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    className="accent-[#302218]"
                  />

                  <span className="font-medium text-[#302218]">
                    {text("Cash on Delivery", "الدفع عند الاستلام")}
                  </span>
                </label>

                <label
                  htmlFor="order-notes"
                  className="mb-2 mt-6 block font-semibold text-[#302218]"
                >
                  {text(
                    "Order Notes (Optional)",
                    "ملاحظات الطلب (اختياري)"
                  )}
                </label>

                <textarea
                  id="order-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder={text(
                    "Please wrap the order as a gift",
                    "يرجى تغليف الطلب كهدية"
                  )}
                  className="w-full resize-y rounded-xl border border-gray-200 p-3 outline-none transition placeholder:text-gray-400 focus:border-[#302218]"
                />
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <h2 className="mb-5 text-lg font-semibold text-[#302218]">
                  {text("Order Total", "ملخص الحساب")}
                </h2>

                <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                  <span>
                    {text("Products", "المنتجات")} (
                    {cartItems.reduce(
                      (sum, item) => {
                        const quantity = Number(item.quantity ?? 1);

                        return (
                          sum +
                          (Number.isFinite(quantity) && quantity > 0
                            ? quantity
                            : 1)
                        );
                      },
                      0
                    )}
                    )
                  </span>

                  <span className="font-medium text-[#302218]">
                    {loadingCart
                      ? "—"
                      : `${formatPrice(
                          calculateItemsTotal(cartItems)
                        )} ${currency}`}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <span className="font-semibold text-[#302218]">
                    {text("Total", "الإجمالي")}
                  </span>

                  <span className="text-xl font-bold text-[#a67c52]">
                    {loadingCart
                      ? "—"
                      : `${formatPrice(cartTotal)} ${currency}`}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-gray-500">
                  {text(
                    "The final amount is confirmed by the server when your order is created.",
                    "يتم تأكيد المبلغ النهائي من الخادم عند إنشاء الطلب."
                  )}
                </p>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    loadingAddresses ||
                    loadingCart ||
                    addresses.length === 0 ||
                    !addressId ||
                    cartItems.length === 0 ||
                    updatingItem !== null
                  }
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#302218] px-5 py-4 font-semibold text-white transition hover:bg-[#493525] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <ClipLoader color="#ffffff" size={19} />
                      {text("Placing Order...", "جارٍ إنشاء الطلب...")}
                    </>
                  ) : (
                    text("Place Order", "تأكيد الطلب")
                  )}
                </button>

                <Link
                  to="/cart"
                  className="mt-4 block text-center text-sm text-gray-500 transition hover:text-[#302218]"
                >
                  {text("Return to Cart", "العودة إلى السلة")}
                </Link>
              </section>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
