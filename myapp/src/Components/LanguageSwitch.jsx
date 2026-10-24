import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";

    i18n.changeLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);

    document.documentElement.lang = newLanguage;
    document.documentElement.dir =
      newLanguage === "ar" ? "rtl" : "ltr";
  };

  return (
    <button
      onClick={changeLanguage}
      className="rounded-full border border-gray-300 px-4 py-2
                 text-sm font-semibold transition hover:bg-gray-100"
    >
      {i18n.language === "en" ? "العربية" : "English"}
    </button>
  );
}
