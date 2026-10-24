import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaPhone,
  FaVenusMars,
  FaCamera,
  FaArrowLeft,
} from "react-icons/fa";
import toast from "react-hot-toast";

const API_URL =
  "https://oud-elite.shaarapp.com/api/v1/users/profile";

export default function EditProfile() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      gender: "",
      avatar: null,
    },
  });

  const selectedAvatar = watch("avatar");

  // Get profile data
  useEffect(() => {
    let mounted = true;

    const getProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          isArabic
            ? "يرجى تسجيل الدخول أولاً"
            : "Please log in first"
        );

        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!mounted) return;

        const user =
          response.data?.data?.user ??
          response.data?.data ??
          response.data?.user ??
          {};

        reset({
          name: user.name ?? user.full_name ?? "",
          phone: user.phone ?? "",
          gender: user.gender ?? "",
          avatar: null,
        });

        setPreview(
          user.avatar ??
            user.avatar_url ??
            user.profile_image ??
            null
        );
      } catch (error) {
        if (!mounted) return;

        console.error(
          "Get profile error:",
          error.response?.data || error
        );

        if (error.response?.status === 401) {
          toast.error(
            isArabic
              ? "انتهت صلاحية تسجيل الدخول"
              : "Your session has expired"
          );

          navigate("/login");
        } else {
          toast.error(
            isArabic
              ? "فشل تحميل بيانات البروفايل"
              : "Failed to load profile"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getProfile();

    return () => {
      mounted = false;
    };
  }, [navigate, reset, isArabic]);

  // Preview selected avatar
  useEffect(() => {
    if (!selectedAvatar || selectedAvatar.length === 0) {
      return;
    }

    const file = selectedAvatar[0];

    if (!file.type.startsWith("image/")) {
      toast.error(
        isArabic
          ? "يرجى اختيار ملف صورة صحيح"
          : "Please select a valid image"
      );

      setValue("avatar", null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم الصورة يجب ألا يتجاوز 5 ميجابايت"
          : "Image size must not exceed 5 MB"
      );

      setValue("avatar", null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [selectedAvatar, setValue, isArabic]);

  // Update profile using PUT
  const onSubmit = async (values) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        isArabic
          ? "يرجى تسجيل الدخول أولاً"
          : "Please log in first"
      );

      navigate("/login");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", values.name.trim());
      formData.append("phone", values.phone.trim());
      formData.append("gender", values.gender);

      if (values.avatar?.length > 0) {
        formData.append("avatar", values.avatar[0]);
      }

      const response = await axios.put(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      toast.success(
        response.data?.message ||
          (isArabic
            ? "تم تحديث البروفايل بنجاح"
            : "Profile updated successfully")
      );

      navigate("/profile");
    } catch (error) {
      console.error(
        "Update profile error:",
        error.response?.data || error
      );

      const status = error.response?.status;

      if (status === 401) {
        toast.error(
          isArabic
            ? "يرجى تسجيل الدخول مرة أخرى"
            : "Please log in again"
        );
      } else if (status === 422) {
        toast.error(
          isArabic
            ? "يرجى مراجعة البيانات المدخلة"
            : "Please check the information you entered"
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            (isArabic
              ? "فشل تحديث البروفايل"
              : "Failed to update profile")
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4  border-[#a67c52]" />

          <p className="text-sm text-gray-500">
            {isArabic
              ? "جاري تحميل البيانات..."
              : "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-red-900"
        >
          <FaArrowLeft
            className={isArabic ? "rotate-180" : ""}
          />

          {isArabic ? "العودة للبروفايل" : "Back to Profile"}
        </Link>

        {/* Main card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {/* Header */}
          <div className="bg-[#a67c52] px-6 py-8 text-white sm:px-10">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {isArabic
                ? "تعديل البروفايل"
                : "Edit Profile"}
            </h1>

            <p className="mt-2 text-sm text-white/70">
              {isArabic
                ? "حدّث بياناتك الشخصية "
                : "Update your personal information "}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7 p-6 sm:p-10"
          >
         
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                {isArabic ? "الاسم بالكامل" : "Full Name"}
              </label>

              <div className="relative">
                <FaUser
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                    isArabic ? "right-4" : "left-4"
                  }`}
                />

                <input
                  id="name"
                  type="text"
                  placeholder={
                    isArabic
                      ? "أدخل اسمك بالكامل"
                      : "Enter your full name"
                  }
                  className={`w-full rounded-xl border bg-white py-3 text-sm outline-none transition focus:border-red-900 focus:ring-2 focus:ring-red-900/10 ${
                    isArabic
                      ? "pr-11 pl-4"
                      : "pl-11 pr-4"
                  } ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  {...register("name", {
                    required: isArabic
                      ? "الاسم مطلوب"
                      : "Name is required",
                    minLength: {
                      value: 2,
                      message: isArabic
                        ? "الاسم يجب أن يحتوي على حرفين على الأقل"
                        : "Name must contain at least 2 characters",
                    },
                  })}
                />
              </div>

              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                {isArabic ? "رقم الهاتف" : "Phone Number"}
              </label>

              <div className="relative">
                <FaPhone
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                    isArabic ? "right-4" : "left-4"
                  }`}
                />

                <input
                  id="phone"
                  type="tel"
                  placeholder={
                    isArabic
                      ? "أدخل رقم الهاتف"
                      : "Enter your phone number"
                  }
                  className={`w-full rounded-xl border bg-white py-3 text-sm outline-none transition focus:border-red-900 focus:ring-2 focus:ring-red-900/10 ${
                    isArabic
                      ? "pr-11 pl-4"
                      : "pl-11 pr-4"
                  } ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  {...register("phone", {
                    required: isArabic
                      ? "رقم الهاتف مطلوب"
                      : "Phone number is required",
                    minLength: {
                      value: 7,
                      message: isArabic
                        ? "رقم الهاتف غير صحيح"
                        : "Phone number is invalid",
                    },
                  })}
                />
              </div>

              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                {isArabic ? "النوع" : "Gender"}
              </label>

              <div className="relative">
                <FaVenusMars
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                    isArabic ? "right-4" : "left-4"
                  }`}
                />

                <select
                  id="gender"
                  className={`w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 text-sm outline-none transition focus:border-red-900 focus:ring-2 focus:ring-red-900/10 ${
                    isArabic
                      ? "pr-11 pl-4"
                      : "pl-11 pr-4"
                  }`}
                  {...register("gender")}
                >
                  <option value="">
                    {isArabic
                      ? "اختر النوع"
                      : "Select gender"}
                  </option>

                  <option value="male">
                    {isArabic ? "ذكر" : "Male"}
                  </option>

                  <option value="female">
                    {isArabic ? "أنثى" : "Female"}
                  </option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center rounded-xl bg-[#a67c52] px-6 py-3 font-semibold text-white transition hover:bg-[#b38252] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? isArabic
                    ? "جاري الحفظ..."
                    : "Saving..."
                  : isArabic
                  ? "حفظ التعديلات"
                  : "Save Changes"}
              </button>

              <Link
                to="/profile"
                className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
