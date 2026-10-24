

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

const API_URL = "https://oud-elite.shaarapp.com/api/v1";
const STORAGE_KEY = "oudEliteWishlist";

function getSavedWishlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {s
    return [];
  }
}

function saveWishlist(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function extractWishlistItems(data) {
  let current = data?.data ?? data;

  for (let i = 0; i < 5 && current; i++) {
    if (Array.isArray(current)) return current;
    if (typeof current !== "object") return null;

    const key = ["items", "products", "wishlist"].find(
      (name) => name in current
    );

    if (!key) return null;
    current = current[key];
  }

  return Array.isArray(current) ? current : null;
}

function getProductId(item) {
  return item?.product_id ?? item?.product?.id ?? item?.id;
}

export default function ToggleWishlist({
  productId,
  className = "",
}) {
  const [favorite, setFavorite] = useState(() =>
    getSavedWishlist().some(
      (id) => String(id) === String(productId)
    )
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      if (!productId) return;

      const savedIds = getSavedWishlist();

      if (!cancelled) {
        setFavorite(
          savedIds.some(
            (id) => String(id) === String(productId)
          )
        );
      }

      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get(
          `${API_URL}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (cancelled) return;

        const items = extractWishlistItems(response.data);

        if (items !== null) {
          const serverIds = items
            .map(getProductId)
            .filter((id) => id !== undefined && id !== null);

          saveWishlist(serverIds);

          setFavorite(
            serverIds.some(
              (id) => String(id) === String(productId)
            )
          );
        }
      } catch (error) {
        console.error(
          "Load wishlist error:",
          error.response?.data || error.message
        );
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function ToggleWishlistItem() {
    if (loading) return;

    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const savedIds = getSavedWishlist();

      const exists = savedIds.some(
        (id) => String(id) === String(productId)
      );

      const updatedIds = exists
        ? savedIds.filter(
            (id) => String(id) !== String(productId)
          )
        : [...savedIds, productId];

      saveWishlist(updatedIds);
      setFavorite(!exists);

      toast.success(
        response.data?.message ||
          "Wishlist updated successfully"
      );
    } catch (error) {
      console.error(
        "Wishlist error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update wishlist"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={ToggleWishlistItem}
      disabled={loading}
      aria-label={
        favorite ? "Remove from wishlist" : "Add to wishlist"
      }
      aria-pressed={favorite}
      className={`
        flex h-12 w-12 shrink-0 items-center justify-center
        rounded-full bg-white shadow-lg
        transition-all duration-300
        hover:scale-110
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
    >
      {favorite ? (
        <FaHeart className="text-red-500" size={20} />
      ) : (
        <FaRegHeart className="text-gray-700" size={20} />
      )}
    </button>
  );
}
