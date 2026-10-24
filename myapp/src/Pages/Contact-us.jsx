import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const API_URL =
  "https://oud-elite.shaarapp.com/api/v1/pages/contact";

// Extract a field from Markdown content
function extractField(content, labels) {
  if (!content) return "";

  const escapedLabels = labels
    .map((label) =>
      label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )
    .join("|");

  const regex = new RegExp(
    `(?:\\*\\*)?(?:${escapedLabels})(?:\\*\\*)?\\s*:\\s*(.+)`,
    "im"
  );

  return content.match(regex)?.[1]?.trim() || "";
}

export default function ContactUs() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const getContactData = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(API_URL, {
          signal: controller.signal,
        });

        if (response.data?.success && response.data?.data) {
          setContact(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        console.error("Error fetching contact data:", err);
        setError(true);
        toast.error(t("contactPage.loadError"));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getContactData();

    return () => controller.abort();
  }, [t]);

  if (loading) {
    return (
      <div
        dir={direction}
        className="flex min-h-[50vh] items-center justify-center"
        aria-label={t("contactPage.loading")}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#8b6848]" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div
        dir={direction}
        className="flex min-h-[40vh] flex-col items-center justify-center gap-4 bg-[#fcfaf7] px-4 text-center"
      >
        <p className="text-gray-600">
          {t("contactPage.loadError")}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#302218] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#60442f]"
        >
          {t("contactPage.retry")}
        </button>
      </div>
    );
  }

  const content = isArabic
    ? contact.content_ar || contact.content_en || ""
    : contact.content_en || contact.content_ar || "";

  const phone = extractField(content, [
    "Phone & WhatsApp",
    "Phone",
    "الهاتف والواتساب",
    "الهاتف",
    "رقم الهاتف",
    "واتساب",
  ]);

  const email = extractField(content, [
    "Email",
    "البريد الإلكتروني",
    "البريد الالكتروني",
    "الإيميل",
  ]);

  const workingHours = extractField(content, [
    "Working Hours",
    "Business Hours",
    "ساعات العمل",
    "مواعيد العمل",
  ]);

  const address = extractField(content, [
    "Address",
    "العنوان",
  ]);

  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const whatsappPhone = phone.replace(/\D/g, "");

  const contactItems = [
    {
      key: "phone",
      title: t("contactPage.phone"),
      value: phone,
      icon: FaPhoneAlt,
      href: cleanPhone ? `tel:${cleanPhone}` : null,
    },
    {
      key: "whatsapp",
      title: "WhatsApp",
      value: phone,
      icon: FaWhatsapp,
      href: whatsappPhone
        ? `https://wa.me/${whatsappPhone}`
        : null,
      external: true,
    },
    {
      key: "email",
      title: t("contactPage.email"),
      value: email,
      icon: FaEnvelope,
      href: email ? `mailto:${email}` : null,
    },
    {
      key: "hours",
      title: t("contactPage.workingHours"),
      value: workingHours,
      icon: FaClock,
    },
    {
      key: "address",
      title: t("contactPage.address"),
      value: address,
      icon: FaMapMarkerAlt,
    },
  ].filter((item) => item.value);

  return (
    <main
      dir={direction}
      className="min-h-screen bg-[#fcfaf7] px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* Page heading */}
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-bold tracking-wide text-[#302218] sm:text-3xl">
            {t("contactPage.title")}
          </h1>
        </header>

        {/* Contact information */}
        <section
          aria-label={t("contactPage.title")}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {contactItems.length > 0 ? (
            contactItems.map((item) => {
              const Icon = item.icon;

              const cardContent = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0e6d9] text-[#8b6848] transition group-hover:bg-[#e8d5bf]">
                    <Icon size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 font-semibold text-[#302218]">
                      {item.title}
                    </h2>

                    <p
                      dir={
                        ["phone", "whatsapp", "email"].includes(item.key)
                          ? "ltr"
                          : direction
                      }
                      className="wrap-break-words text-sm leading-6 text-gray-600"
                    >
                      {item.value}
                    </p>
                  </div>
                </>
              );

              return item.href ? (
                <a
                  key={item.key}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={
                    item.external
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex min-w-0 items-start gap-3 rounded-2xl border border-[#eee4d8] bg-white p-4 transition duration-200 hover:border-[#d8c1a7] hover:shadow-md sm:p-5"
                >
                  {cardContent}
                </a>
              ) : (
                <>
                <div
                  key={item.key}
                  className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#eee4d8] bg-white p-4 sm:p-5"
                >
                  {cardContent}
                  
                </div>
                
                </>
              );
            })
          ) : (
            <p className="col-span-full rounded-xl border border-[#eee4d8] bg-white p-5 text-center text-sm text-gray-500">
              {t("contactPage.noDetails")}
            </p>
          )}
        </section>
                 {/* Link to ContactMessage page */}
        <section className="mx-auto mt-12 w-full max-w-3xl text-center">
          <Link
            to="/contact-message"
            dir={direction}
            className="inline-block rounded-xl  px-7 py-3 text-lg font-semibold"
          >
            {isArabic
              ? "هل لديك أي استفسار؟"
              : "Have any questions?"}
          </Link>
        </section>
    
      </div>
    </main>
  );
}
