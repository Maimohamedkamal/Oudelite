import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingBag,
  FaEye,
} from "react-icons/fa";


const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function MyOrders() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);

  const translate = (key, en, ar) =>
    t(key, { defaultValue: isArabic ? ar : en });

  const currency = translate("currency", "SAR", "ر.س");

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

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatus = (status) => {
    const statuses = {
      pending: {
        en: "Pending",
        ar: "قيد الانتظار",
        className: "bg-amber-100 text-amber-700",
      },
      confirmed: {
        en: "Confirmed",
        ar: "تم التأكيد",
        className: "bg-blue-100 text-blue-700",
      },
      processing: {
        en: "Processing",
        ar: "قيد التجهيز",
        className: "bg-indigo-100 text-indigo-700",
      },
      shipped: {
        en: "Shipped",
        ar: "تم الشحن",
        className: "bg-purple-100 text-purple-700",
      },
      delivered: {
        en: "Delivered",
        ar: "تم التوصيل",
        className: "bg-green-100 text-green-700",
      },
      completed: {
        en: "Completed",
        ar: "مكتمل",
        className: "bg-green-100 text-green-700",
      },
      cancelled: {
        en: "Cancelled",
        ar: "ملغي",
        className: "bg-red-100 text-red-700",
      },
      canceled: {
        en: "Cancelled",
        ar: "ملغي",
        className: "bg-red-100 text-red-700",
      },
    };

    const key = String(status || "pending").toLowerCase();

    return (
      statuses[key] || {
        en: status || "Unknown",
        ar: status || "غير معروف",
        className: "bg-gray-100 text-gray-700",
      }
    );
  };

  const fetchOrders = useCallback(
    async (page = 1) => {
      const token = localStorage.getItem("token");

      if (!token) {
        setOrders([]);
        setLoading(false);
        toast.error(
          translate(
            "loginRequired",
            "Please log in first.",
            "سجّلي الدخول أولًا."
          )
        );
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}/orders/my`, {
          params: {
            page,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data?.success === false) {
          throw new Error(
            response.data.message || "Failed to load orders."
          );
        }

        const result = response.data?.data;
        const orderList = Array.isArray(result?.orders)
          ? result.orders
          : [];

        setOrders(orderList);

        setPagination(
          result?.pagination || {
            total: orderList.length,
            page,
            limit: 10,
            pages: 1,
          }
        );
      } catch (error) {
        console.error(
          "GET ORDERS ERROR:",
          error.response?.data || error
        );

        toast.error(
          error.response?.data?.message ||
            error.message ||
            translate(
              "ordersLoadError",
              "Failed to load your orders.",
              "فشل تحميل طلباتك."
            )
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [isArabic]
  );

  useEffect(() => {
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#faf9f7] py-10 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#302218] md:text-4xl">
              {translate("myOrders", "My Orders", "طلباتي")}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {translate(
                "myOrdersDescription",
                "View and track your orders.",
                "استعرضي طلباتك وتابعي حالتها."
              )}
            </p>
          </div>

        
        </header>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#a67c52]" />

            <p className="text-gray-500">
              {translate(
                "loadingOrders",
                "Loading orders...",
                "جارٍ تحميل الطلبات..."
              )}
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <section className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0e9e1]">
              <FaBoxOpen className="text-3xl text-[#a67c52]" />
            </div>

            <h2 className="text-2xl font-semibold text-[#302218]">
              {translate("noOrders", "No orders yet", "لا توجد طلبات حتى الآن")}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
              {translate(
                "noOrdersDescription",
                "Your orders will appear here after you complete checkout.",
                "ستظهر طلباتك هنا بعد إتمام عملية الشراء."
              )}
            </p>

            <Link
              to="/home"
              className="mt-6 inline-flex rounded-full bg-[#302218] px-7 py-3 font-medium text-white transition hover:bg-[#a67c52]"
            >
              {translate("startShopping", "Start Shopping", "ابدئي التسوق")}
            </Link>
          </section>
        ) : (
          <>
            {/* Total Orders */}
            <div className="mb-5 flex items-center justify-between text-sm text-gray-500">
              <span>
                {translate("totalOrders", "Total orders", "إجمالي الطلبات")}:{" "}
                <strong className="text-[#302218]">
                  {pagination.total}
                </strong>
              </span>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order, index) => {
                const orderId = order.id ?? order.order_id;

                const orderNumber =
                  order.order_number ?? order.order_code;

                const status = getStatus(order.status);

                return (
                  <article
                    key={orderId ?? orderNumber ?? index}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs text-gray-400">
                          {translate(
                            "orderNumber",
                            "Order Number",
                            "رقم الطلب"
                          )}
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-[#302218]">
                          #{orderNumber ?? orderId ?? "—"}
                        </h2>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                      >
                        {isArabic ? status.ar : status.en}
                      </span>
                    </div>

                    {/* Order Information */}
                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                      <div className="flex items-start gap-3">
                        <FaCalendarAlt className="mt-1 text-[#a67c52]" />

                        <div>
                          <p className="text-xs text-gray-400">
                            {translate(
                              "orderDate",
                              "Order Date",
                              "تاريخ الطلب"
                            )}
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {formatDate(
                              order.created_at ?? order.order_date
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          {translate(
                            "paymentMethod",
                            "Payment Method",
                            "طريقة الدفع"
                          )}
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {String(order.payment_method || "").toLowerCase() ===
                          "cod"
                            ? translate(
                                "cashOnDelivery",
                                "Cash on Delivery",
                                "الدفع عند الاستلام"
                              )
                            : order.payment_method || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          {translate("total", "Total", "الإجمالي")}
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#a67c52]">
                          {formatPrice(
                            order.total ??
                              order.total_amount ??
                              order.grand_total
                          )}{" "}
                          {currency}
                        </p>
                      </div>
                    </div>

                    {/* View Order Details */}
                    {orderNumber != null && (
                      <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
                        <Link
                          to={`/orders/${encodeURIComponent(orderNumber)}`}
                          className="inline-flex items-center gap-2 rounded-full border border-[#302218] px-5 py-2.5 text-sm font-medium text-[#302218] transition hover:bg-[#302218] hover:text-white"
                        >
                          <FaEye />

                          {translate(
                            "viewOrder",
                            "View Order",
                            "عرض الطلب"
                          )}
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => fetchOrders(pagination.page - 1)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm disabled:opacity-40"
                >
                  {isArabic ? <FaChevronRight /> : <FaChevronLeft />}

                  {translate("previous", "Previous", "السابق")}
                </button>

                <span className="text-sm text-gray-600">
                  {pagination.page} / {pagination.pages}
                </span>

                <button
                  type="button"
                  disabled={
                    pagination.page >= pagination.pages || loading
                  }
                  onClick={() => fetchOrders(pagination.page + 1)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm disabled:opacity-40"
                >
                  {translate("next", "Next", "التالي")}

                  {isArabic ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
