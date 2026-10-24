import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FaBox, FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function OrderDetails() {
  const { order_number } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrderDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          isArabic
            ? "يرجى تسجيل الدخول لعرض تفاصيل الطلب"
            : "Please login to view order details"
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(
          `${API_URL}/orders/${encodeURIComponent(order_number)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        setOrder(data?.data ?? data?.order ?? data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          (isArabic
            ? "حدث خطأ أثناء تحميل تفاصيل الطلب"
            : "Failed to load order details");

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (order_number) {
      getOrderDetails();
    } else {
      setError(isArabic ? "رقم الطلب غير موجود" : "Order number is missing");
      setLoading(false);
    }
  }, [order_number, isArabic]);

const formatPrice = (value) => {
  const number = Number(value);

  if (value === null || value === undefined || value === "") {
    return "0.00";
  }

  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
};



  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <ClipLoader color="#302218" size={45} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="mx-auto max-w-3xl px-4 py-16 text-center"
      >
        <FaBox className="mx-auto mb-4 text-5xl text-gray-300" />
        <h2 className="mb-3 text-xl font-bold text-[#302218]">
          {error ||
            (isArabic ? "لم يتم العثور على الطلب" : "Order not found")}
        </h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#302218] px-5 py-3 text-white transition hover:bg-[#493625]"
        >
          <FaArrowLeft />
          {isArabic ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    );
  }

  const items = order.items || order.order_items || [];

  const status = order.status || order.order_status || "pending";

  const statusLabels = {
    pending: isArabic ? "قيد الانتظار" : "Pending",
    processing: isArabic ? "قيد التجهيز" : "Processing",
    confirmed: isArabic ? "تم التأكيد" : "Confirmed",
    shipped: isArabic ? "تم الشحن" : "Shipped",
    delivered: isArabic ? "تم التسليم" : "Delivered",
    completed: isArabic ? "مكتمل" : "Completed",
    cancelled: isArabic ? "ملغي" : "Cancelled",
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#faf9f6] px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#665548] hover:text-[#302218]"
        >
          <FaArrowLeft />
          {isArabic ? "العودة للرئيسية" : "Back to Home"}
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#302218] sm:text-3xl">
              {isArabic ? "تفاصيل الطلب" : "Order Details"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {isArabic ? "رقم الطلب:" : "Order Number:"}{" "}
              <span className="font-semibold text-[#302218]">
                {order.order_number || order_number}
              </span>
            </p>
          </div>

          <span className="rounded-full bg-[#efe7dc] px-4 py-2 text-sm font-semibold text-[#302218]">
            {statusLabels[status] || status}
          </span>
        </div>

        {/* Order Items */}
        <div className="overflow-hidden rounded-2xl border border-[#eee7df] bg-white shadow-sm">
          <div className="border-b border-[#eee7df] px-5 py-4 sm:px-6">
            <h2 className="flex items-center gap-2 font-bold text-[#302218]">
              <FaShoppingBag />
              {isArabic ? "المنتجات المطلوبة" : "Ordered Products"}
            </h2>
          </div>

          {items.length > 0 ? (
            <div className="divide-y divide-[#eee7df]">
              {items.map((item, index) => {
                const product = item.product || {};
                const name = isArabic
                  ? product.name_ar || item.name_ar
                  : product.name_en || item.name_en;

                const image =
                  item.image ||
                  item.image_url ||
                  product.primary_image ||
                  product.image_url;

                const quantity = Number(item.quantity) || 1;
                const unitPrice = Number(
                  item.unit_price ?? item.price ?? 0
                );

                return (
                  <div
                    key={item.id || index}
                    className="flex flex-wrap items-center gap-4 p-5 sm:flex-nowrap sm:px-6"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={name || "Product"}
                        className="h-20 w-20 rounded-xl border border-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#f5f0e9]">
                        <FaShoppingBag className="text-2xl text-[#8c7763]" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#302218]">
                        {name ||
                          item.product_name ||
                          (isArabic ? "منتج" : "Product")}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {isArabic ? "الكمية:" : "Quantity:"} {quantity}
                      </p>
                    </div>

                    <div className="text-end">
                      <p className="font-bold text-[#302218]">
                        {formatPrice(unitPrice * quantity)} {t("sar")}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {isArabic ? "سعر القطعة:" : "Unit price:"}{" "}
                        {formatPrice(unitPrice)} {t("sar")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="p-6 text-center text-gray-500">
              {isArabic
                ? "لا توجد تفاصيل للمنتجات في بيانات الطلب"
                : "No order items were found in the response"}
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-6 rounded-2xl border border-[#eee7df] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-bold text-[#302218]">
            {isArabic ? "ملخص الطلب" : "Order Summary"}
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                {isArabic ? "المجموع الفرعي" : "Subtotal"}
              </span>
              <span className="font-medium text-[#302218]">
                {formatPrice(order.subtotal)} {t("sar")}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                {isArabic ? "الضريبة" : "Tax"}
              </span>
              <span className="font-medium text-[#302218]">
                {formatPrice(order.tax_amount ?? order.tax)} {t("sar")}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">
                {isArabic ? "الشحن" : "Shipping"}
              </span>
              <span className="font-medium text-[#302218]">
                {formatPrice(order.shipping_amount ?? order.shipping_cost)}{" "}
                {t("sar")}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-[#eee7df] pt-4 text-base">
              <span className="font-bold text-[#302218]">
                {isArabic ? "الإجمالي" : "Total"}
              </span>
              <span className="font-bold text-[#302218]">
                {formatPrice(order.total_amount ?? order.total)} {t("sar")}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {(order.shipping_address || order.address) && (
          <div className="mt-6 rounded-2xl border border-[#eee7df] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 font-bold text-[#302218]">
              {isArabic ? "عنوان التوصيل" : "Shipping Address"}
            </h2>
            <p className="text-sm leading-7 text-gray-600">
              {typeof (order.shipping_address || order.address) === "string"
                ? order.shipping_address || order.address
                : [
                    (order.shipping_address || order.address)?.full_name,
                    (order.shipping_address || order.address)?.phone,
                    (order.shipping_address || order.address)?.city,
                    (order.shipping_address || order.address)?.district,
                    (order.shipping_address || order.address)?.street,
                    (order.shipping_address || order.address)?.building,
                    (order.shipping_address || order.address)?.flat,
                  ]
                    .filter(Boolean)
                    .join("، ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
