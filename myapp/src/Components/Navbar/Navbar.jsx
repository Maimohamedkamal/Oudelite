import axios from "axios";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {  IoMenu, IoClose } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import {
  FaRegUser,
  FaRegHeart,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";

import { CartCount } from "../CartCount";
import toast from "react-hot-toast";
import SearchContent from "../SearchContant/SearchContant";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function Navbar() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isArabic = i18n.language.startsWith("ar");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Cart Context
  const cartContext = useContext(CartCount);

  const Count =
    cartContext?.Count ??
    Number(localStorage.getItem("count") || 0);

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    setMenuOpen(false);

    toast.success(
      isArabic
        ? "تم تسجيل الخروج بنجاح"
        : "Logged out successfully"
    );

    navigate("/login");
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Fetch featured categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(
          `${API_URL}/categories?featured=true`
        );

        setLinks(
          Array.isArray(response?.data?.data)
            ? response.data.data
            : []
        );
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  // Hide category navigation when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setHideNav(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menus after navigation
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const getCategoryName = (category) =>
    isArabic
      ? category.name_ar || category.name_en
      : category.name_en || category.name_ar;

  const renderCategories = (mobile = false) => {
    if (loading) {
      return (
        <li className="py-3 text-sm text-gray-400">
          {isArabic
            ? "جاري تحميل التصنيفات..."
            : "Loading categories..."}
        </li>
      );
    }

    if (error) {
      return (
        <li className="py-3 text-sm text-red-500">
          {isArabic
            ? "فشل تحميل التصنيفات."
            : "Failed to load categories."}
        </li>
      );
    }

    if (links.length === 0) {
      return (
        <li className="py-3 text-sm text-gray-400">
          {isArabic
            ? "لا توجد تصنيفات"
            : "No categories available"}
        </li>
      );
    }

    return links.map((category) => (
      <li
        key={category.id}
        className={
          mobile
            ? "border-b border-black/5 last:border-0"
            : "shrink-0"
        }
      >
        <Link
          to={`/category/${category.slug}`}
          onClick={mobile ? closeMenus : undefined}
          className={
            mobile
              ? "block py-3 text-sm font-medium transition-colors duration-300 hover:text-[#a67c52]"
              : "inline-block py-2 transition-colors duration-300 hover:text-[#a67c52]"
          }
        >
          {getCategoryName(category)}
        </Link>
      </li>
    ));
  };

  const menuItems = [
    {
      label: isArabic ? "الملف الشخصي" : "My Profile",
      path: "/profile",
      icon: <FaRegUser />,
    },
    {
      label: isArabic ? "المفضلة" : "My Wishlist",
      path: "/wishlist",
      icon: <FaRegHeart />,
    },
    {
      label: isArabic ? "طلباتي" : "My Orders",
      path: "/orders",
      icon: <FaBoxOpen />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* TOP NAVBAR */}
      <div className="w-full border-b border-black/5 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          {/* SEARCH */}
          <div className="flex items-center gap-3">
      
                    <SearchContent/>



          </div>

          {/* LOGO */}
          <Link
            to="/home"
            onClick={closeMenus}
            className="flex flex-1 items-center justify-center"
          >
            <img
              src="https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/wWORaV/w7rG7JtxSIcfpJV5fS7eaUlBAeM2N6pu5LS4yxYa.png"
              alt="Oud Elite"
              className="h-16 w-32 object-contain sm:h-20 sm:w-40"
            />
          </Link>

          {/* USER, CART AND MOBILE MENU */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* USER DROPDOWN */}
            <div className="relative" ref={profileRef}>
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen((prev) => !prev)
                    }
                    aria-label={t("account")}
                    aria-expanded={profileOpen}
                    className="flex items-center gap-1 text-xl transition-all duration-300 hover:scale-105 hover:text-[#a67c52] sm:text-2xl"
                  >
                    <FiUser />

                   
                    
                  </button>

                  {profileOpen && (
                    <div
                      dir={isArabic ? "rtl" : "ltr"}
                      className={`absolute top-full z-60 mt-3  w-40 overflow-hidden rounded-2xl border border-[#eee4d8] bg-white py-2 shadow-xl ${
                        isArabic ? "left-0" : "-right-10"
                      }`}
                    >
                      <div className="border-b border-[#eee4d8] px-4 py-3">
                        <p className="text-xs text-gray-400">
                          {isArabic
                            ? "مرحباً بعودتك"
                            : "Welcome back"}
                        </p>

                       
                      </div>

                      {menuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeMenus}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#302218] transition hover:bg-[#f8f3ed] hover:text-[#a67c52]"
                        >
                          <span className="text-base">
                            {item.icon}
                          </span>

                          <span>{item.label}</span>
                        </Link>
                      ))}

                      <div className="my-2 border-t border-[#eee4d8]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <FaSignOutAlt />
                        <span>
                          {isArabic
                            ? "تسجيل الخروج"
                            : "Logout"}
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={closeMenus}
                  aria-label={t("account")}
                  className="text-xl transition-all duration-300 hover:scale-110 hover:text-[#a67c52] sm:text-2xl"
                >
                  <FiUser />
                </Link>
              )}
            </div>

            {/* CART */}
            <Link
              to="/cart"
              onClick={closeMenus}
              aria-label={t("shoppingCart")}
              className="relative flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:text-[#a67c52] sm:text-2xl"
            >
              <MdOutlineShoppingCart />

              {Number(Count) > 0 && (
                <span
                  dir="ltr"
                  className="absolute -inset-e-1  -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
                >
                  {Count}
                </span>
              )}
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              aria-label={t("toggleMenu")}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="text-2xl transition-all duration-300 hover:scale-110 hover:text-[#a67c52] lg:hidden"
            >
              {menuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP CATEGORY NAVIGATION */}
      <div
        className={`
          hidden overflow-hidden bg-white lg:block
          transition-all duration-300 ease-in-out
          ${
            hideNav
              ? "max-h-0 -translate-y-2 opacity-0 pointer-events-none"
              : "max-h-24 translate-y-0 opacity-100"
          }
        `}
      >
        <nav
          dir={isArabic ? "rtl" : "ltr"}
          className="w-full border-b border-black/5 bg-white"
        >
          <div className="mx-auto max-w-7xl px-6">
            <ul className="flex items-center justify-center gap-5 py-4 text-sm font-semibold xl:gap-8 xl:text-base">
              {renderCategories()}
            </ul>
          </div>
        </nav>
      </div>

      {/* MOBILE CATEGORY MENU */}
      <div
        className={`
          overflow-hidden bg-white transition-all duration-300 lg:hidden
          ${
            menuOpen
              ? "max-h-[80vh] border-b border-black/10"
              : "max-h-0"
          }
        `}
      >
        <nav
          dir={isArabic ? "rtl" : "ltr"}
          className="max-h-[80vh] overflow-y-auto px-5 py-3"
        >
          <ul className="flex flex-col">
            {renderCategories(true)}
          </ul>
        </nav>
      </div>

    </header>
  );
}
