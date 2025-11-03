import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTelegram,
  faFacebook,
  faInstagram,
  faTiktok,
  faDiscord,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-black text-white min-h-96 relative pt-8 ">
      <div className="bg-red-600 rounded-2xl w-80  text-white px-4 py-2 mx-4 mt-0 mb-4 flex items-center gap-2">
        <span className="text-white text-base">★</span>
        <span className="text-sm font-medium">
          Hoàng Sa & Trường Sa là của Việt Nam!
        </span>
      </div>

      <div className="px-4 pb-4">
        {/* Logo và tagline */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-white">RoAnime</h2>
              <p className="text-sm text-gray-300 mt-1">Anime hay cả rổ</p>
            </div>
          </div>
        </div>

        {/* Social media icons */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <a
            href="#"
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            title="Telegram"
          >
            <span className="text-base">
              <FontAwesomeIcon icon={faTelegram} />
            </span>
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            title="Discord"
          >
            <span className="text-base">
              {" "}
              <FontAwesomeIcon icon={faDiscord} />
            </span>
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            title="X (Twitter)"
          >
            <span className="text-base">
              {" "}
              <FontAwesomeIcon icon={faTwitter} />
            </span>
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            title="Facebook"
          >
            <span className="text-base">
              {" "}
              <FontAwesomeIcon icon={faFacebook} />
            </span>
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            title="TikTok"
          >
            <span className="text-base">
              {" "}
              <FontAwesomeIcon icon={faTiktok} />
            </span>
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            title="YouTube"
          >
            <span className="text-base">
              {" "}
              <FontAwesomeIcon icon={faYoutube} />
            </span>
          </a>

          <a
            href="#"
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
            title="Instagram"
          >
            <span className="text-base">
              {" "}
              <FontAwesomeIcon icon={faInstagram} />
            </span>
          </a>
        </div>

        {/* Navigation links */}
        <div className="mb-5">
          <div className="flex gap-5 mb-2 flex-wrap ">
            <a
              href="#"
              className="text-white text-sm hover:text-gray-300 transition-colors text-deco"
            >
              Hỏi-Đáp
            </a>
            <a
              href="#"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Giới thiệu
            </a>
            <a
              href="#"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Liên hệ
            </a>
          </div>
        </div>

        {/* Description */}
        <div
          className="
                      mb-5 flex items-start gap-4 
                      md:flex-row md:items-center md:justify-between
                    "
        >
          <p className="max-w-full text-sm leading-relaxed text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos facere
            aliquam, cupiditate iure beatae in nemo, voluptates nam ducimus ut
            veritatis suscipit? Qui eaque hic perspiciatis, possimus tempora
            reprehenderit nesciunt!
          </p>

          <button
            className="self-end flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded border-none bg-white text-black transition-colors hover:bg-gray-400"
            onClick={scrollToTop}
            title="Lên đầu trang"
          >
            <span className="text-lg font-bold ">
              <FontAwesomeIcon icon={faArrowUp} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
