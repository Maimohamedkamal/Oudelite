import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaPaperPlane } from "react-icons/fa";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";

export default function ContactMessage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");
  const direction = isArabic ? "rtl" : "ltr";

  // Use the translation namespace already defined in i18n.js
  const tr = (key) => t(`contactPageSms.${key}`);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/contact`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        toast.success(tr("successMessage"));
        reset();
      } else {
        toast.error(
          response.data?.message || tr("errorMessage")
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);

      toast.error(
        error.response?.data?.message || tr("errorMessage")
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#302218] outline-none transition placeholder:text-gray-400 focus:border-[#8b6848] focus:ring-2 focus:ring-[#8b6848]/20 ${
      errors[field]
        ? "border-red-500"
        : "border-[#e5d8ca]"
    }`;

  return (
    <main
      dir={direction}
      className="min-h-screen bg-[#fcfaf7] px-4 py-12 sm:px-6 lg:py-16"
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* Heading */}
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="mb-4 text-2xl font-bold tracking-wide text-[#302218] sm:text-3xl">
            {tr("formTitle")}
          </h1>

          <p className="mb-3 text-sm font-medium text-[#8b6848]">
            {tr("subtitle")}
          </p>

          <p className="mx-auto max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            {tr("description")}
          </p>
        </header>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-1 gap-5 rounded-2xl border border-[#eee4d8] bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 block text-sm font-semibold text-[#302218]"
            >
              {tr("name")}
            </label>

            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              placeholder={tr("namePlaceholder")}
              aria-invalid={Boolean(errors.name)}
              className={inputClass("name")}
              {...register("name", {
                required: tr("nameRequired"),
                minLength: {
                  value: 2,
                  message: tr("nameMin"),
                },
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="mb-2 block text-sm font-semibold text-[#302218]"
            >
              {tr("email")}
            </label>

            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              dir="ltr"
              placeholder={tr("emailPlaceholder")}
              aria-invalid={Boolean(errors.email)}
              className={inputClass("email")}
              {...register("email", {
                required: tr("emailRequired"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: tr("emailInvalid"),
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="contact-phone"
              className="mb-2 block text-sm font-semibold text-[#302218]"
            >
              {tr("phone")}
            </label>

            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={tr("phonePlaceholder")}
              aria-invalid={Boolean(errors.phone)}
              className={inputClass("phone")}
              {...register("phone", {
                required: tr("phoneRequired"),
                pattern: {
                  value: /^\+?[0-9\s()-]{7,20}$/,
                  message: tr("phoneInvalid"),
                },
              })}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="contact-subject"
              className="mb-2 block text-sm font-semibold text-[#302218]"
            >
              {tr("subject")}
            </label>

            <input
              id="contact-subject"
              type="text"
              placeholder={tr("subjectPlaceholder")}
              aria-invalid={Boolean(errors.subject)}
              className={inputClass("subject")}
              {...register("subject", {
                required: tr("subjectRequired"),
                minLength: {
                  value: 3,
                  message: tr("subjectMin"),
                },
              })}
            />

            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="lg:col-span-2">
            <label
              htmlFor="contact-message"
              className="mb-2 block text-sm font-semibold text-[#302218]"
            >
              {tr("message")}
            </label>

            <textarea
              id="contact-message"
              rows={5}
              placeholder={tr("messagePlaceholder")}
              aria-invalid={Boolean(errors.message)}
              className={`${inputClass("message")} resize-y`}
              {...register("message", {
                required: tr("messageRequired"),
                minLength: {
                  value: 10,
                  message: tr("messageMin"),
                },
              })}
            />

            {errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#302218] px-6 py-3.5 font-semibold text-white transition duration-300 hover:bg-[#8b6848] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <span>{tr("sending")}</span>
              ) : (
                <>
                  <FaPaperPlane
                    className={isArabic ? "rotate-180" : ""}
                  />
                  <span>{tr("send")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
