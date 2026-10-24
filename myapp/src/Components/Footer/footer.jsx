

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const translate = (key, en, ar) =>
    t(key, { defaultValue: isArabic ? ar : en });

  const footerLinks = [
    { to: "/about", key: "aboutUs", en: "About us", ar: "من نحن" },
    { to: "/stores", key: "findStore", en: "Find store", ar: "ابحث عن متجر" },
    {
      to: "/return-policy",
      key: "returnPolicy",
      en: "Return policy",
      ar: "سياسة الاسترجاع",
    },
    {
      to: "/contact",
      key: "contactUs",
      en: "Contact us",
      ar: "تواصل معنا",
    },
    {
      to: "/privacy",
      key: "privacyPolicy",
      en: "Privacy policy",
      ar: "سياسة الخصوصية",
    },
    {
      to: "/shipping",
      key: "shippingPolicy",
      en: "Shipping Policy",
      ar: "سياسة الشحن",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      icon: <FaFacebookF />,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      icon: <FaInstagram />,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/",
      icon: <FaTiktok />,
    },
    {
      name: "X",
      href: "https://x.com/",
      icon: <FaXTwitter />,
    },
  ];

  return (
    <div className="w-full" dir={isArabic ? "rtl" : "ltr"}>
      {/* Wave */}
      <div className="wave-container h-24 w-full overflow-hidden">
        <svg
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          className="block h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M0,200 L0,100 C100,110 200,110 300,100 C400,90 450,90 500,90 C600,100 700,110 800,110 C900,105 950,95 1000,92 L1000,200 L0,200Z"
            fill="#eff1f1"
          />
        </svg>
      </div>

      {/* Footer */}
      <footer className="bg-[#eff1f1] text-black">
        <div className="mx-auto max-w-7xl px-6 py-14">
          {/* Top Section */}
          <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Logo + About */}
            <div>
              <img
                src="https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/wWORaV/w7rG7JtxSIcfpJV5fS7eaUlBAeM2N6pu5LS4yxYa.png"
                alt="Oud Elite"
                className="mb-5 h-14 w-32 object-contain"
              />

              <p className="max-w-xs text-sm leading-7 text-black/70">
                {translate(
                  "footerAbout",
                  "At Oud Elite, everything we do is inspired by our mission, values, and vision.",
                  "في نخبة العود، تستلهم جميع أعمالنا من رسالتنا وقيمنا ورؤيتنا."
                )}
              </p>

              {/* Social Media */}
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="mb-6 text-lg font-semibold">
                {translate("usefulLinks", "Useful Links", "روابط مهمة")}
              </h3>

              <ul className="space-y-4 text-sm">
                {footerLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-block text-black/70 transition-all duration-300 hover:text-black hover:translate-x-0.5"
                    >
                      {translate(item.key, item.en, item.ar)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="mb-6 text-lg font-semibold">
                {translate(
                  "companyInformation",
                  "Company Information",
                  "معلومات الشركة"
                )}
              </h3>

              <div className="space-y-5">
                {/* Commercial Register */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.salla.network/cdn-cgi/image/fit=scale-down,width=70,height=70,onerror=redirect,format=auto/images/commercial-register.png"
                    alt={translate(
                      "commercialRegister",
                      "Commercial Register",
                      "السجل التجاري"
                    )}
                    className="h-10 w-10 rounded bg-white object-contain p-1"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      {translate(
                        "commercialRegister",
                        "Commercial Register",
                        "السجل التجاري"
                      )}
                    </p>
                    <p className="text-sm text-black/70" dir="ltr">
                      1010226743
                    </p>
                  </div>
                </div>

                {/* Tax ID */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.salla.network/images/tax.png?v=2.0.5"
                    alt={translate("taxId", "Tax ID", "الرقم الضريبي")}
                    className="h-10 w-10 rounded bg-white object-contain p-1"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      {translate("taxId", "Tax ID number", "الرقم الضريبي")}
                    </p>
                    <p className="text-sm text-black/70" dir="ltr">
                      310770636310003
                    </p>
                  </div>
                </div>

                {/* Certificates */}
                <div className="mt-5 flex flex-wrap gap-4">
                  <img
                    src="https://cdn.salla.sa/form-builder/jRLhPnh7dmiGmXGJA3P8830ZIBecTDKIqFkRPZMj.png"
                    alt={translate("certificate", "Certificate", "شهادة")}
                    className="h-14 w-auto rounded bg-white object-contain p-1"
                  />

                  <img
                    src="https://cdn.salla.sa/form-builder/XrA8UwJUvs09gkPSi8olrwbgLNXKimgGPuCr2ZuX.png"
                    alt={translate("certificate", "Certificate", "شهادة")}
                    className="h-14 w-auto rounded bg-white object-contain p-1"
                  />
                </div>
              </div>
            </div>

            {/* Download App */}
            <div>
              <h3 className="mb-6 text-lg font-semibold">
                {translate("downloadApp", "Download Our App", "حمّل تطبيقنا")}
              </h3>

              <p className="mb-5 text-sm leading-6 text-black/70">
                {translate(
                  "appDescription",
                  "Enjoy a smoother shopping experience through our mobile app.",
                  "استمتع بتجربة تسوق أسهل من خلال تطبيقنا على الهاتف."
                )}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="https://apps.apple.com/us/app/%D9%86%D8%AE%D8%A8%D8%A9-%D8%A7%D9%84%D8%B9%D9%88%D8%AF-oud-elite/id6770585739"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                >
                  <img
                    src="https://cdn.salla.network/images/appstore.png?v=2.0.5"
                    alt="Download on App Store"
                    className="w-40 transition-transform duration-300 hover:scale-105"
                  />
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.oudelite.app&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get it on Google Play"
                >
                  <img
                    src="https://cdn.salla.network/images/googleplay.png?v=2.0.5"
                    alt="Get it on Google Play"
                    className="w-40 transition-transform duration-300 hover:scale-105"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-7 md:flex-row">
            <div className="flex flex-col items-center gap-4 text-sm sm:flex-row sm:gap-5">
              <a
                href="tel:+9668001220066"
                dir="ltr"
                className="text-black/70 transition hover:text-black"
              >
                +966 800 122 0066
              </a>

              <a
                href="mailto:support@oudelite.com"
                dir="ltr"
                className="text-black/70 transition hover:text-black"
              >
                support@oudelite.com
              </a>
            </div>

            <p className="text-center text-sm text-black/70">
              {translate(
                "footerTagline",
                "Premium Oud & Perfumes",
                "أجود أنواع العود والعطور"
              )}
            </p>
          </div>

          {/* Bottom */}
          <div className="mt-7 border-t border-black/10 pt-6 text-center">
            <p className="text-sm text-black/60">
              © {new Date().getFullYear()} Oud Elite.{" "}
              {translate(
                "allRightsReserved",
                "All rights reserved.",
                "جميع الحقوق محفوظة."
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
