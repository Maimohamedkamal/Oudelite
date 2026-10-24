import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export default function TopNavbar() {
  const { t, i18n } = useTranslation();

  const [languageOpen, setLanguageOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") ||
      (i18n.language?.startsWith("ar") ? "ar" : "en")
  );

  const [country, setCountry] = useState(
    localStorage.getItem("country") || "Egypt"
  );

  const isArabic = i18n.language?.startsWith("ar");

  useEffect(() => {
    setSelectedLanguage(isArabic ? "ar" : "en");

    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  const handleLanguageConfirm = async () => {
    try {
      await i18n.changeLanguage(selectedLanguage);

      localStorage.setItem("language", selectedLanguage);

      document.documentElement.lang = selectedLanguage;
      document.documentElement.dir =
        selectedLanguage === "ar" ? "rtl" : "ltr";

      setLanguageOpen(false);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const countries = [
    {
      value: "Egypt",
      label: isArabic ? "مصر" : "Egypt",
    },
    {
      value: "Saudi Arabia",
      label: isArabic ? "السعودية" : "Saudi Arabia",
    },
    {
      value: "UAE",
      label: isArabic ? "الإمارات" : "UAE",
    },
  ];

  const handleCountryChange = (value) => {
    setCountry(value);
    localStorage.setItem("country", value);
    setCountryOpen(false);
  };

  const getTranslation = (key, english, arabic) =>
    t(key, {
      defaultValue: isArabic ? arabic : english,
    });

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full bg-black p-3 text-gray-200"
    >
      <div
        className="
          mx-auto flex max-w-7xl items-center justify-between
          gap-2 px-2 py-2 sm:px-4 lg:px-6
        "
      >
        {/* NAVIGATION LINKS */}
        <nav
          className="
            hidden lg:flex items-center gap-10
            whitespace-nowrap text-md
          "
        >
          <Link
            to="/about-us"
            className="transition hover:text-gray-300"
          >
            {getTranslation("about", "About Us", "من نحن")}
          </Link>

          <Link
            to="/find-store"
            className="transition hover:text-gray-300"
          >
            {getTranslation("Find Store", "Find Store", "أقرب فرع")}
          </Link>

          <Link
            to="/contact-us"
            className="transition hover:text-gray-300"
          >
            {getTranslation("contact", "Contact Us", "اتصل بنا")}
          </Link>
        </nav>

        {/* LANGUAGE, COUNTRY AND EMAIL */}
        <div
          className="
            flex w-full items-center justify-between gap-2
            whitespace-nowrap text-sm sm:gap-4
            lg:w-fit lg:gap-5 lg:text-base
          "
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* LANGUAGE SELECTOR */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={languageOpen}
                aria-label={getTranslation(
                  "Select Language",
                  "Select Language",
                  "اختيار اللغة"
                )}
                onClick={() => {
                  setLanguageOpen((prev) => !prev);
                  setCountryOpen(false);
                  setSelectedLanguage(isArabic ? "ar" : "en");
                }}
                className="
                  flex items-center gap-1
                  transition hover:text-gray-300 sm:gap-2
                "
              >
                <FaGlobe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

                <span>{isArabic ? "العربية" : "English"}</span>

                <FaChevronDown
                  className={`h-2 w-2 transition-transform duration-300 ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageOpen && (
                <div
                  dir={isArabic ? "rtl" : "ltr"}
                  className="
                    absolute end-e-0 top-7 z-100 w-64
                    rounded-xl bg-white p-3 text-black shadow-xl
                    sm:top-8 sm:w-80
                  "
                >
                  <p className="mb-2 px-2 text-sm font-semibold">
                    {getTranslation(
                      "Select Language",
                      "Select Language",
                      "اختاري اللغة"
                    )}
                  </p>

                  <label
                    className="
                      flex cursor-pointer items-center gap-3
                      rounded-lg px-3 py-3 transition hover:bg-gray-100
                    "
                  >
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={selectedLanguage === "en"}
                      onChange={() => setSelectedLanguage("en")}
                      className="accent-black"
                    />

                    <span>English</span>
                  </label>

                  <label
                    className="
                      flex cursor-pointer items-center gap-3
                      rounded-lg px-3 py-3 transition hover:bg-gray-100
                    "
                  >
                    <input
                      type="radio"
                      name="language"
                      value="ar"
                      checked={selectedLanguage === "ar"}
                      onChange={() => setSelectedLanguage("ar")}
                      className="accent-black"
                    />

                    <span>العربية</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleLanguageConfirm}
                    className="
                      mt-2 w-full rounded-lg bg-black py-2
                      font-medium text-white transition hover:bg-gray-800
                    "
                  >
                    {getTranslation("Confirm", "Confirm", "تأكيد")}
                  </button>
                </div>
              )}
            </div>

            {/* COUNTRY SELECTOR */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={countryOpen}
                aria-label={getTranslation(
                  "Select Country",
                  "Select Country",
                  "اختيار الدولة"
                )}
                onClick={() => {
                  setCountryOpen((prev) => !prev);
                  setLanguageOpen(false);
                }}
                className="
                  flex items-center gap-1
                  transition hover:text-gray-300 sm:gap-2
                "
              >
                <FaMapMarkerAlt className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

                <span>
                  {countries.find((item) => item.value === country)?.label ||
                    country}
                </span>

                <FaChevronDown
                  className={`h-2 w-2 transition-transform duration-300 ${
                    countryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {countryOpen && (
                <div
                  dir={isArabic ? "rtl" : "ltr"}
                  className="
                    absolute end-e-0 top-7 z-100 w-40
                    overflow-hidden rounded-lg bg-white
                    text-black shadow-xl sm:top-8 sm:w-48
                  "
                >
                  {countries.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleCountryChange(item.value)}
                      className="
                        w-full px-3 py-2 text-start
                        transition hover:bg-gray-100 sm:px-4
                      "
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <a
            href="mailto:cs@oudelite.com"
            dir="ltr"
            className="
              flex items-center gap-1 whitespace-nowrap
              transition hover:text-gray-300
            "
          >
            <AiOutlineMail className="shrink-0" />

            <span className="hidden lg:inline">
              cs@oudelite.com
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
