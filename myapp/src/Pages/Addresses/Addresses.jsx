
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  FaMapMarkerAlt,
  FaHome,
  FaBriefcase,
  FaUser,
  FaPhone,
  FaGlobe,
  FaCity,
  FaRoad,
  FaBuilding,
  FaSave,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";
const ADDRESSES_URL = `${API_URL}/users/addresses`;

const INITIAL_VALUES = {
  label: "home",
  full_name: "",
  phone: "",
  country: "",
  emirate: "",
  city: "",
  district: "",
  street: "",
  building: "",
  flat: "",
  postal_code: "",
  is_default: false,
};

export default function Addresses() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: INITIAL_VALUES,
  });

  const tr = (key, fallback) =>
    t(`address.${key}`, { defaultValue: fallback });

  const getToken = () => localStorage.getItem("token");

  const getHeaders = () => {
    const token = getToken();

    if (!token) {
      throw new Error("LOGIN_REQUIRED");
    }

    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const showError = (error, fallback) => {
    if (error.message === "LOGIN_REQUIRED") {
      toast.error(
        isArabic
          ? "من فضلك سجّلي الدخول أولاً"
          : "Please login first"
      );
      return;
    }

    toast.error(
      error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        fallback
    );
  };

  // GET: Fetch all saved addresses
  const fetchAddresses = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(ADDRESSES_URL, {
        headers: getHeaders(),
      });

      const result = response.data?.data;

      // Supports either { data: [...] } or { data: { data: [...] } }
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(response.data?.addresses)
        ? response.data.addresses
        : [];

      setAddresses(list);
    } catch (error) {
      showError(
        error,
        isArabic
          ? "تعذّر تحميل العناوين"
          : "Failed to load addresses"
      );
    } finally {
      setLoading(false);
    }
  }, [isArabic]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Open the form for creating a new address
  const handleAddNew = () => {
    setEditingId(null);
    reset({ ...INITIAL_VALUES });
    setShowForm(true);
  };

  // Load an existing address into the form
  const handleEdit = (address) => {
    const id = address.id ?? address.address_id;

    if (id == null) {
      toast.error(
        isArabic
          ? "معرّف العنوان غير متوفر"
          : "Address ID is missing"
      );
      return;
    }

    setEditingId(id);

    reset({
      ...INITIAL_VALUES,
      ...address,
      label: address.label || "home",
      is_default:
        address.is_default === true ||
        address.is_default === 1 ||
        address.is_default === "1",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    reset({ ...INITIAL_VALUES });
  };

  // POST: Create, PUT: Update
  const onSubmit = async (formData) => {
    try {
      const headers = getHeaders();

      const payload = {
        ...formData,
        is_default: Boolean(formData.is_default),
      };

      let response;

      if (editingId !== null) {
        response = await axios.put(
          `${ADDRESSES_URL}/${editingId}`,
          payload,
          { headers }
        );
      } else {
        response = await axios.post(
          ADDRESSES_URL,
          payload,
          { headers }
        );
      }

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "REQUEST_FAILED"
        );
      }

      toast.success(
        response.data?.message ||
          (isArabic
            ? editingId !== null
              ? "تم تحديث العنوان بنجاح"
              : "تم إضافة العنوان بنجاح"
            : editingId !== null
            ? "Address updated successfully"
            : "Address added successfully")
      );

      setEditingId(null);
      setShowForm(false);
      reset({ ...INITIAL_VALUES });

      await fetchAddresses();
    } catch (error) {
      showError(
        error,
        isArabic
          ? "تعذّر حفظ العنوان"
          : "Failed to save address"
      );
    }
  };

  // DELETE: Remove an address
  const handleDelete = async (address) => {
    const id = address.id ?? address.address_id;

    if (id == null) {
      toast.error(
        isArabic
          ? "معرّف العنوان غير متوفر"
          : "Address ID is missing"
      );
      return;
    }

    const confirmed = window.confirm(
      isArabic
        ? "هل أنتِ متأكدة من حذف هذا العنوان؟"
        : "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await axios.delete(
        `${ADDRESSES_URL}/${id}`,
        { headers: getHeaders() }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "REQUEST_FAILED"
        );
      }

      toast.success(
        response.data?.message ||
          (isArabic
            ? "تم حذف العنوان بنجاح"
            : "Address deleted successfully")
      );

      if (String(editingId) === String(id)) {
        handleCancel();
      }

      await fetchAddresses();
    } catch (error) {
      showError(
        error,
        isArabic
          ? "تعذّر حذف العنوان"
          : "Failed to delete address"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const fields = [
    {
      name: "full_name",
      label: tr("fullName", "Full name"),
      placeholder: tr("fullNamePlaceholder", "Enter full name"),
      icon: <FaUser />,
    },
    {
      name: "phone",
      label: tr("phone", "Phone"),
      placeholder: "+20 100 123 4567",
      icon: <FaPhone />,
      type: "tel",
    },
    {
      name: "country",
      label: tr("country", "Country"),
      placeholder: tr("countryPlaceholder", "Enter country"),
      icon: <FaGlobe />,
    },
    {
      name: "emirate",
      label: tr("emirate", "Emirate / Governorate"),
      placeholder: tr("emiratePlaceholder", "Enter emirate"),
      icon: <FaMapMarkerAlt />,
    },
    {
      name: "city",
      label: tr("city", "City"),
      placeholder: tr("cityPlaceholder", "Enter city"),
      icon: <FaCity />,
    },
    {
      name: "district",
      label: tr("district", "District"),
      placeholder: tr("districtPlaceholder", "Enter district"),
      icon: <FaMapMarkerAlt />,
    },
    {
      name: "street",
      label: tr("street", "Street"),
      placeholder: tr("streetPlaceholder", "Enter street"),
      icon: <FaRoad />,
    },
    {
      name: "building",
      label: tr("building", "Building"),
      placeholder: tr("buildingPlaceholder", "Enter building"),
      icon: <FaBuilding />,
    },
    {
      name: "flat",
      label: tr("flat", "Apartment / Flat"),
      placeholder: tr("flatPlaceholder", "Enter apartment number"),
      icon: <FaBuilding />,
    },
    {
      name: "postal_code",
      label: tr("postalCode", "Postal code"),
      placeholder: tr("postalCodePlaceholder", "Enter postal code"),
      icon: <FaMapMarkerAlt />,
    },
  ];

  const inputClass = (name) =>
    `w-full rounded-xl border bg-[#fcfaf8] py-3 ${
      isArabic ? "pr-10 pl-4" : "pl-10 pr-4"
    } text-sm text-[#302218] outline-none transition placeholder:text-gray-400 focus:border-[#a7835d] focus:bg-white focus:ring-4 focus:ring-[#a7835d]/10 ${
      errors[name]
        ? "border-red-400"
        : "border-[#e9dfd4]"
    }`;

  const getAddressId = (address) =>
    address.id ?? address.address_id;

  const getAddressLabel = (address) =>
    address.label === "work"
      ? tr("work", "Work")
      : tr("home", "Home");

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f8f5f1] px-4 py-10 sm:px-6 lg:py-16"
    >
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#302218] sm:text-3xl">
            {tr("title", "My Addresses")}
          </h1>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            {tr(
              "subtitle",
              "Manage your delivery addresses"
            )}
          </p>
        </div>

        {/* Saved Addresses */}
        <div className="mb-8 rounded-3xl border border-[#eee4d8] bg-white p-5 shadow-[0_15px_50px_rgba(48,34,24,0.07)] sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#302218]">
              {tr("savedAddresses", "Saved Addresses")}
            </h2>

            <button
              type="button"
              onClick={handleAddNew}
              className="flex items-center gap-2 rounded-xl bg-[#302218] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#654a35]"
            >
              <FaPlus />
              {tr("addNew", "Add New Address")}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-[#8b6848]">
              <FaSpinner className="animate-spin text-xl" />
              <span>{tr("loading", "Loading addresses...")}</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e9dfd4] bg-[#fcfaf8] px-4 py-10 text-center">
              <FaMapMarkerAlt className="mx-auto mb-3 text-3xl text-[#a7835d]" />

              <p className="text-sm text-gray-500">
                {tr(
                  "empty",
                  "You haven't added any addresses yet."
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((address) => {
                const id = getAddressId(address);

                const isDefault =
                  address.is_default === true ||
                  address.is_default === 1 ||
                  address.is_default === "1";

                return (
                  <div
                    key={id ?? `${address.city}-${address.street}`}
                    className={`rounded-2xl border p-4 transition sm:p-5 ${
                      isDefault
                        ? "border-[#b99a78] bg-[#faf6f1]"
                        : "border-[#eee4d8] bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1e7dc] text-lg text-[#8b6848]">
                          {address.label === "work" ? (
                            <FaBriefcase />
                          ) : (
                            <FaHome />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-[#302218]">
                              {getAddressLabel(address)}
                            </h3>

                            {isDefault && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8ddcf] px-2.5 py-1 text-xs font-semibold text-[#654a35]">
                                <FaCheckCircle />
                                {tr("defaultBadge", "Default")}
                              </span>
                            )}
                          </div>

                          <p className="mb-1 wrap-break-words text-sm font-medium text-[#493729]">
                            {address.full_name}
                          </p>

                          {address.phone && (
                            <p className="mb-2 text-sm text-gray-500">
                              {address.phone}
                            </p>
                          )}

                          <p className="wrap-break-words text-sm leading-6 text-gray-500">
                            {[
                              address.flat,
                              address.building,
                              address.street,
                              address.district,
                              address.city,
                              address.emirate,
                              address.country,
                              address.postal_code,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(address)}
                          className="flex items-center gap-2 rounded-lg border border-[#e9dfd4] px-3 py-2 text-sm font-semibold text-[#654a35] transition hover:bg-[#f5eee6]"
                        >
                          <FaEdit />
                          {tr("edit", "Edit")}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(address)}
                          disabled={deletingId === id}
                          aria-label={tr("delete", "Delete")}
                          className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}

                          <span>{tr("delete", "Delete")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div
            id="address-form"
            className="overflow-hidden rounded-3xl border border-[#eee4d8] bg-white shadow-[0_15px_50px_rgba(48,34,24,0.07)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#eee4d8] px-5 py-5 sm:px-8">
              <h2 className="text-lg font-bold text-[#302218]">
                {editingId !== null
                  ? tr("editAddress", "Edit Address")
                  : tr("newAddress", "Add New Address")}
              </h2>

              <button
                type="button"
                onClick={handleCancel}
                aria-label={tr("cancel", "Cancel")}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-[#f5eee6] hover:text-[#302218]"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 p-5 sm:p-8 lg:p-10"
            >
              {/* Address Type */}
              <div>
                <h3 className="mb-4 text-base font-bold text-[#302218]">
                  {tr("deliveryAddress", "Address Type")}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: "home",
                      label: tr("home", "Home"),
                      icon: <FaHome />,
                    },
                    {
                      value: "work",
                      label: tr("work", "Work"),
                      icon: <FaBriefcase />,
                    },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={item.value}
                        {...register("label", { required: true })}
                        className="peer sr-only"
                      />

                      <div className="flex items-center justify-center gap-3 rounded-xl border border-[#e9dfd4] bg-[#fcfaf8] p-4 text-sm font-semibold text-[#6d5b4b] transition hover:border-[#a7835d] peer-checked:border-[#8b6848] peer-checked:bg-[#f5eee6] peer-checked:text-[#302218]">
                        <span className="text-lg">
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Address Details */}
              <div>
                <h3 className="mb-5 text-base font-bold text-[#302218]">
                  {tr("personalDetails", "Address Details")}
                </h3>

                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-semibold text-[#493729]"
                      >
                        {field.label}
                        <span
                          className={`text-[#a7835d] ${
                            isArabic ? "mr-1" : "ml-1"
                          }`}
                        >
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 text-sm text-[#a7835d] ${
                            isArabic ? "right-3" : "left-3"
                          }`}
                        >
                          {field.icon}
                        </span>

                        <input
                          id={field.name}
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          {...register(field.name, {
                            required: tr(
                              "required",
                              "This field is required"
                            ),
                            ...(field.name === "phone"
                              ? {
                                  pattern: {
                                    value: /^\+?[0-9\s()-]{7,20}$/,
                                    message: tr(
                                      "invalidPhone",
                                      "Please enter a valid phone number"
                                    ),
                                  },
                                }
                              : {}),
                          })}
                          className={inputClass(field.name)}
                        />
                      </div>

                      {errors[field.name] && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors[field.name].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Default Address */}
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#eadbca] bg-[#faf6f1] p-4 transition hover:bg-[#f5eee6]">
                <input
                  type="checkbox"
                  {...register("is_default")}
                  className="mt-1 h-4 w-4 accent-[#8b6848]"
                />

                <span>
                  <span className="block text-sm font-bold text-[#302218]">
                    {tr("setDefault", "Set as default address")}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    {tr(
                      "defaultDescription",
                      "Use this address as your primary delivery address."
                    )}
                  </span>
                </span>
              </label>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#302218] px-6 py-4 font-semibold text-white shadow-md transition duration-300 hover:bg-[#654a35] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {tr("saving", "Saving...")}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingId !== null
                        ? tr("update", "Update Address")
                        : tr("save", "Save Address")}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="rounded-xl border border-[#e9dfd4] px-6 py-4 font-semibold text-[#654a35] transition hover:bg-[#fcfaf8] disabled:opacity-50"
                >
                  {tr("cancel", "Cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="mt-5 text-center text-xs text-gray-400">
          {tr(
            "footer",
            "Your address information is used for delivery purposes."
          )}
        </p>
      </div>
    </section>
  );
}
