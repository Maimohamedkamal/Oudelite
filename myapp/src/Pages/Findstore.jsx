

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  Navigation,
  Phone,
  Compass,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Custom Oud Elite map marker
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Store data
const STORES_DATA = [
  {
    id: "e41-deira",
    name: "E41 - Deira City Centre",
    cityKey: "dubai",
    addressAr:
      "شارع 30، ميناء سعيد، دبي، الإمارات العربية المتحدة",
    addressEn:
      "Street 30, Port Saeed, Dubai, United Arab Emirates",
    phone: "+966920009692",
    statusKey: "open",
    coords: [25.2519, 55.3331],
  },
  {
    id: "e43-sharjah",
    name: "E43 - Sharjah City Centre",
    cityKey: "sharjah",
    addressAr:
      "09FR+WHF، المجاز 2، الشارقة، الإمارات العربية المتحدة",
    addressEn:
      "09FR+WHF, Al Majaz 2, Sharjah, United Arab Emirates",
    phone: "+966920009692",
    statusKey: "open",
    coords: [25.3283, 55.3917],
  },
  {
    id: "souq-okaz",
    name: "Souq Okaz - Naif",
    cityKey: "dubai",
    addressAr:
      "شارع 48، ديرة، السبخة، دبي، الإمارات العربية المتحدة",
    addressEn:
      "Street 48, Deira, Al Sabkha, Dubai, United Arab Emirates",
    phone: "+966920009692",
    statusKey: "open",
    coords: [25.2721, 55.3039],
  },
];

// Move the map when the selected store changes
function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { animate: true, duration: 0.6 });
    }
  }, [center, map]);

  return null;
}

export default function FindStore() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStore, setSelectedStore] = useState(STORES_DATA[0]);

  const direction = isArabic ? "rtl" : "ltr";

  // Filter stores by name, address, and city
  const filteredStores = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return STORES_DATA.filter((store) => {
      const address = isArabic
        ? store.addressAr
        : store.addressEn;

      const searchableText =
        `${store.name} ${address} ${store.phone}`.toLocaleLowerCase();

      const matchesSearch = searchableText.includes(query);

      const matchesCity =
        selectedCity === "all" ||
        store.cityKey === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedCity, isArabic]);

  // Keep the selected store in sync with the filtered results
  useEffect(() => {
    if (
      filteredStores.length > 0 &&
      !filteredStores.some(
        (store) => store.id === selectedStore?.id
      )
    ) {
      setSelectedStore(filteredStores[0]);
    }
  }, [filteredStores, selectedStore]);

  const handleDirections = (store) => {
    const destination = encodeURIComponent(
      `${store.coords[0]},${store.coords[1]}`
    );

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 font-sans text-gray-800"
      dir={direction}
    >
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Page heading */}
        <header className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-amber-700">
            <MapPin className="h-4 w-4" />
            {t("findStore.subtitle")}
          </span>

          <h1 className="text-2xl font-bold tracking-wide text-[#302218] sm:text-3xl">
            {t("findStore.title")}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
            {t("findStore.description")}
          </p>
        </header>

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-3">
          {/* Store list */}
          <section className="flex h-145 min-h-0 flex-col bg-white lg:col-span-1">
            <div className="space-y-4 border-b border-gray-100 p-4 sm:p-5">
              <label className="relative block">
                <span className="sr-only">
                  {t("findStore.search")}
                </span>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t("findStore.search")}
                  className={`w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100 ${
                    isArabic ? "pr-10 pl-4" : "pl-10 pr-4"
                  }`}
                />

                <Search
                  className={`absolute top-3.5 h-4 w-4 text-gray-400 ${
                    isArabic ? "right-3" : "left-3"
                  }`}
                />
              </label>

              {/* City filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: t("findStore.all") },
                  { key: "dubai", label: t("findStore.dubai") },
                  {
                    key: "sharjah",
                    label: t("findStore.sharjah"),
                  },
                ].map((city) => (
                  <button
                    key={city.key}
                    type="button"
                    onClick={() => setSelectedCity(city.key)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      selectedCity === city.key
                        ? "border-[#302218] bg-[#302218] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-amber-700 hover:text-amber-800"
                    }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500">
                {t("findStore.results", {
                  count: filteredStores.length,
                })}
              </p>
            </div>

            {/* Scrollable results */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => {
                  const isSelected =
                    selectedStore?.id === store.id;

                  const address = isArabic
                    ? store.addressAr
                    : store.addressEn;

                  return (
                    <article
                      key={store.id}
                      onClick={() => setSelectedStore(store)}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          setSelectedStore(store);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      className={`cursor-pointer rounded-xl border p-4 text-start transition duration-200 ${
                        isSelected
                          ? "border-amber-700 bg-amber-50/50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-amber-300"
                      }`}
                    >
                      <div className="mb-2 flex items-start gap-2">
                        <MapPin
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            isSelected
                              ? "text-amber-700"
                              : "text-gray-400"
                          }`}
                        />

                        <h2 className="text-sm font-bold leading-6 text-[#302218]">
                          {store.name}
                        </h2>
                      </div>

                      <p className="mb-4 text-xs leading-6 text-gray-500">
                        {address}
                      </p>

                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          {t(`findStore.${store.statusKey}`)}
                        </span>

                        <a
                          href={`tel:${store.phone}`}
                          onClick={(event) => event.stopPropagation()}
                          dir="ltr"
                          className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition hover:text-amber-700"
                          aria-label={`${t("findStore.call")} ${store.phone}`}
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>{store.phone}</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDirections(store);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-semibold text-[#302218] transition hover:border-[#302218] hover:bg-[#302218] hover:text-white"
                      >
                        <Navigation className="h-4 w-4 text-amber-600" />
                        {t("findStore.directions")}
                      </button>
                    </article>
                  );
                })
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                  <Search className="mb-3 h-8 w-8 text-gray-300" />

                  <h2 className="text-sm font-semibold text-gray-700">
                    {t("findStore.noResults")}
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-gray-500">
                    {t("findStore.tryAgain")}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCity("all");
                    }}
                    className="mt-4 rounded-lg bg-[#302218] px-4 py-2 text-xs font-medium text-white transition hover:bg-amber-900"
                  >
                    {t("findStore.reset")}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Interactive map */}
          <section
            className="relative z-0 h-105 border-t border-gray-200 bg-sky-50 lg:col-span-2 lg:h- lg:border-t-0 lg:border-s"
            aria-label={t("findStore.map")}
          >
            <MapContainer
              center={selectedStore.coords}
              zoom={12}
              scrollWheelZoom
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController center={selectedStore.coords} />

              {STORES_DATA.map((store) => {
                const address = isArabic
                  ? store.addressAr
                  : store.addressEn;

                return (
                  <Marker
                    key={store.id}
                    position={store.coords}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => setSelectedStore(store),
                    }}
                  >
                    <Popup>
                      <div
                        dir={direction}
                        className="min-w-48 p-1 text-start"
                      >
                        <h3 className="text-sm font-bold text-[#302218]">
                          {store.name}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-gray-600">
                          {address}
                        </p>

                        <p className="mt-2 text-xs text-gray-500" dir="ltr">
                          {store.phone}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleDirections(store)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#302218] px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-900"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          {t("findStore.directions")}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Return to selected store */}
            <div
              className={`absolute bottom-5 z-1000 ${
                isArabic ? "right-5" : "left-5"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (filteredStores.length > 0) {
                    setSelectedStore(
                      filteredStores.some(
                        (store) =>
                          store.id === selectedStore.id
                      )
                        ? selectedStore
                        : filteredStores[0]
                    );
                  } else {
                    setSearchQuery("");
                    setSelectedCity("all");
                    setSelectedStore(STORES_DATA[0]);
                  }
                }}
                className="flex items-center gap-2 rounded-full bg-[#302218] px-4 py-3 text-xs font-semibold text-white shadow-lg transition hover:bg-amber-900"
              >
                <Compass className="h-4 w-4 text-amber-400" />
                {t("findStore.showSelected")}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}




