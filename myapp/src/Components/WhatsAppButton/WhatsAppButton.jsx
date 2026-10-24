import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "9668001220066";

  const message = encodeURIComponent(
    "Hello Oud Elite, I would like to ask about a product."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Oud Elite on WhatsApp"
      className="
        fixed
        bottom-4
        right-4
        sm:bottom-6
        sm:right-6
        z-50
        group
      "
    >
      <div className="relative flex items-center">

        {/* Contact us */}
        <span
          className="
            absolute
            right-full
            mr-3

            bg-white
            text-gray-800
            shadow-lg
            rounded-full

            px-4
            py-2

            text-sm
            font-medium
            whitespace-nowrap

            opacity-0
            invisible
            translate-x-3

            group-hover:opacity-100
            group-hover:visible
            group-hover:translate-x-0

            transition-all
            duration-300
          "
        >
          Contact us
        </span>

        {/* WhatsApp */}
        <div
          className="
            w-12
            h-12
            sm:w-14
            sm:h-14

            rounded-full
            bg-green-500
            text-white

            flex
            items-center
            justify-center

            shadow-lg

            group-hover:scale-110
            transition-transform
            duration-300
          "
        >
          <FaWhatsapp
            className="
              text-[26px]
              sm:text-[30px]
            "
          />
        </div>

      </div>
    </a>
  );
}
