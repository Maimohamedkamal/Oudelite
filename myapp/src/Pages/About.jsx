import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  useEffect(() => {
    const getAboutData = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(
          "https://oud-elite.shaarapp.com/api/v1/pages/about"
        );

        if (data.success && data.data) {
          setAbout(data.data);
        } else {
          setError(
            isArabic
              ? "تعذر تحميل معلومات من نحن."
              : "Failed to load About Us information."
          );
        }
      } catch (err) {
        console.error("Error fetching About Us:", err);

        setError(
          isArabic
            ? "حدث خطأ أثناء تحميل المعلومات."
            : "Failed to load About Us information."
        );
      } finally {
        setLoading(false);
      }
    };

    getAboutData();
  }, [isArabic]);

  if (loading) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-60 items-center justify-center"
      >
        <p className="text-gray-500">
          {isArabic ? "جاري التحميل..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (error || !about) {
    return (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="px-5 py-10 text-center text-red-500"
      >
        {error ||
          (isArabic
            ? "معلومات من نحن غير متاحة."
            : "About Us information is unavailable.")}
      </div>
    );
  }

  const title = isArabic
    ? about.title_ar || about.title_en
    : about.title_en || about.title_ar;

  const content = isArabic
    ? about.content_ar || about.content_en
    : about.content_en || about.content_ar;

  const paragraphs = (content || "")
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim());

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white px-5 py-16 sm:px-10 lg:px-20"
    >
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-[#8b6848] sm:text-4xl">
          {title || (isArabic ? "من نحن" : "About Us")}
        </h1>

        <div className="space-y-6 text-base leading-8 text-gray-600 sm:text-lg">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph.trim()}
              </p>
            ))
          ) : (
            <p className="text-center text-gray-400">
              {isArabic
                ? "لا توجد معلومات متاحة حاليًا."
                : "No information available."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
