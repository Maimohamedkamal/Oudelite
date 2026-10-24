import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
  FaPlus,
  FaMapMarkerAlt,
} from "react-icons/fa";

const API_URL =
  "https://oud-elite.shaarapp.com/api/v1/users/profile";

const getAvatarUrl = (profile) => {
  if (!profile) return null;

  let avatar =
    profile.avatar_url ||
    profile.profile_image ||
    profile.image_url ||
    profile.avatar ||
    profile.image ||
    null;

  if (avatar && typeof avatar === "object") {
    avatar =
      avatar.url ||
      avatar.avatar_url ||
      avatar.image_url ||
      avatar.path ||
      avatar.image ||
      null;
  }

  if (typeof avatar !== "string" || !avatar.trim()) {
    return null;
  }

  avatar = avatar.trim();

  if (/^https?:\/\//i.test(avatar)) {
    return avatar;
  }

  if (avatar.startsWith("//")) {
    return `${window.location.protocol}${avatar}`;
  }

  return new URL(
    avatar.replace(/^\/+/, ""),
    "https://oud-elite.shaarapp.com/"
  ).href;
};

export default function Profile() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setAvatarFailed] = useState(false);

  const text = (en, ar) => (isArabic ? ar : en);
  const avatarUrl = getAvatarUrl(user);

  useEffect(() => {
    let mounted = true;

    const getProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!mounted) return;

        console.log("Profile API response:", response.data);

        if (response.data?.success) {
          const profile =
            response.data?.data?.user ??
            response.data?.data;

          setUser(profile);
          setAvatarFailed(false);
        } else {
          setError(
            text(
              "Unable to load your profile.",
              "تعذر تحميل بيانات حسابك."
            )
          );
        }
      } catch (err) {
        if (!mounted) return;

        console.error(
          "Profile error:",
          err.response?.data || err
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            text(
              "Unable to load your profile. Please try again.",
              "تعذر تحميل بيانات حسابك. حاولي مرة أخرى."
            )
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getProfile();

    return () => {
      mounted = false;
    };
  }, [navigate, isArabic]);

  const formatDate = (date) => {
    if (!date) return text("Not available", "غير متاح");

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return text("Not available", "غير متاح");
    }

    return parsedDate.toLocaleDateString(
      isArabic ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const infoCard = (Icon, label, value, extraClass = "") => (
    <div
      className={`rounded-2xl border border-[#eee5d8] bg-[#faf9f7] p-5 ${extraClass}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1e8dc] text-[#a67c52]">
          <Icon />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="mt-1 wrap-break-words text-sm font-medium text-gray-800">
            {value || text("Not provided", "غير متوفر")}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        dir={direction}
        className="min-h-screen bg-[#faf9f7] px-5 py-16"
      >
        <div className="mx-auto w-full max-w-5xl animate-pulse">
          <div className="mx-auto mb-3 h-10 w-48 rounded bg-gray-200" />
          <div className="mx-auto mb-12 h-4 w-72 max-w-full rounded bg-gray-200" />

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-3 h-6 w-32 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-5 py-16"
      >
        <div className="max-w-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {text("Something went wrong", "حدث خطأ")}
          </h2>

          <p className="mt-3 text-gray-500">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-[#a67c52]"
          >
            {text("Try Again", "حاولي مرة أخرى")}
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        dir={direction}
        className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-5"
      >
        <p className="text-gray-500">
          {text(
            "No profile information found.",
            "لا توجد بيانات للحساب."
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      dir={direction}
      className="min-h-screen bg-[#faf9f7]"
    >
      <main className="py-12 md:py-16">
        <div className="mx-auto w-[90%] max-w-5xl">
    
          {/* PROFILE CARD */}
          <div className="overflow-hidden rounded-3xl border border-[#eee5d8] bg-white shadow-sm">
        
            {/* USER INFORMATION */}
            <div className="p-6 md:p-10">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {text(
                    "Personal Information",
                    "المعلومات الشخصية"
                  )}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  {/* EDIT PROFILE LINK */}
                  <Link
                    to="/edit-profile"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a67c52] px-4 py-2 text-sm font-medium text-[#a67c52] transition-all duration-300 hover:bg-[#a67c52] hover:text-white"
                  >
                    <FaEdit />
                    <span>{text("Edit Profile", "تعديل البيانات")}</span>
                  </Link>

                  {/* ADD ADDRESS LINK */}
                  <Link
                    to="/address"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a67c52] px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#8b6540] shadow-sm hover:shadow"
                  >
                    <FaPlus className="text-xs" />
                    <FaMapMarkerAlt />
                    <span>{text("Add Address", "إضافة عنوان")}</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {infoCard(
                  FaUser,
                  text("Full Name", "الاسم الكامل"),
                  user.name
                )}

                {infoCard(
                  FaEnvelope,
                  text("Email", "البريد الإلكتروني"),
                  user.email
                )}

                {infoCard(
                  FaPhone,
                  text("Phone", "رقم الهاتف"),
                  user.phone
                )}

                {infoCard(
                  FaUser,
                  text("Gender", "النوع"),
                  user.gender
                    ? user.gender.toLowerCase() === "male"
                      ? text("Male", "ذكر")
                      : user.gender.toLowerCase() === "female"
                      ? text("Female", "أنثى")
                      : user.gender
                    : text("Not specified", "غير محدد")
                )}

                {infoCard(
                  FaCalendarAlt,
                  text("Member Since", "تاريخ إنشاء الحساب"),
                  formatDate(user.created_at),
                  "md:col-span-2"
                )}
              </div>

          

            </div>
          </div>
        
        </div>
      </main>
    </div>
  );
}