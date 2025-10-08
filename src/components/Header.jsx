import React from "react";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/img/logo.png";

import LoginModal from "./LoginModal";

function Header() {
  // 🔴 BƯỚC 2: KHAI BÁO STATE
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const genreRef = useRef(null);
  const yearRef = useRef(null);

  // CÁC HÀM XỬ LÝ

  // Hàm mở Modal và đóng mọi Dropdown khác
  const openLoginModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsGenreOpen(false);
    setIsYearOpen(false);
  };

  // Hàm đóng Modal
  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý việc đóng mở menu
  const toggleGenreMenu = (e) => {
    e.preventDefault();
    setIsGenreOpen(!isGenreOpen);
    setIsYearOpen(false);
  };

  // Hàm xử lý đóng mở menu cho NĂM
  const toggleYearMenu = (e) => {
    e.preventDefault();
    setIsYearOpen(!isYearOpen);
    setIsGenreOpen(false);
  };

  // Logic ĐÓNG KHI CLICK RA NGOÀI
  useEffect(() => {
    // Hàm xử lý sự kiện click
    function handleClickOutside(event) {
      // 1. Kiểm tra Dropdown THỂ LOẠI
      if (
        isGenreOpen &&
        genreRef.current &&
        !genreRef.current.contains(event.target)
      ) {
        setIsGenreOpen(false);
      }

      // 2. Kiểm tra Dropdown NĂM
      if (
        isYearOpen &&
        yearRef.current &&
        !yearRef.current.contains(event.target)
      ) {
        setIsYearOpen(false);
      }
    }

    // Gắn sự kiện lắng nghe khi component mount
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp: Loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGenreOpen, isYearOpen]);

  // Dữ liệu giả định cho menu thả xuống
  const genres = [
    "Hành Động",
    "Viễn Tưởng",
    "Kinh Dị",
    "Tâm Lý",
    "Hài",
    "Âm Nhạc",
    "Tài Liệu",
    "Võ Thuật",
    "Phiêu Lưu",
  ];

  const years = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
  ];

  return (
    <>
      <header className=" sticky top-0 z-50  p-4 bg-black shadow-md flex items-center justify-between text-white h-15">
        {/* PHẦN 1: LOGO */}
        <div className="flex items-center space-x-2 ml-4">
          <a href="#">
            <img src={logo} alt="logo" className="h-12 w-auto" />
          </a>
        </div>

        {/* Search */}
        <div className="relative flex text-balance items-center w-[300px] ">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 w-5 h-5 top-1/2 transform -translate-y-1/2 text-gray-400 mx-auto"
          />
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            className="w-100 py-1.5 pl-10 pr-4 rounded-lg border border-gray-500 bg-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500 "
          />
        </div>

        {/* PHẦN 3: MENU*/}

        <div className="relative flex items-center space-x-6   ">
          <a
            href="#"
            className="cursor-pointer hover:text-yellow-200 text-white"
          >
            Chủ đề
          </a>
          <div className="relative">
            {" "}
            <a
              href="#"
              onClick={toggleGenreMenu}
              className="cursor-pointer hover:text-yellow-200 text-white"
            >
              Thể loại
              <FontAwesomeIcon icon={faCaretDown} className="ml-0.5" />
            </a>
            {isGenreOpen && (
              <div
                ref={genreRef}
                className="absolute z-50 top-full mt-4 p-3 rounded-lg shadow-2xl 
                           bg-gray-800 border border-gray-700 grid grid-cols-4 gap-x-6 gap-y-2 w-max min-w-[500px]"
              >
                {genres.map((genre) => (
                  <a
                    key={genre}
                    href={`/the-loai/${genre}`}
                    className="px-2 py-1 text-sm whitespace-nowrap 
                               text-gray-200 hover:bg-gray-700 hover:text-yellow-400 rounded-sm transition duration-150"
                  >
                    {genre}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#"
            className="cursor-pointer hover:text-yellow-200 text-white"
          >
            Phim Lẻ
          </a>
          <a
            href="#"
            className="cursor-pointer hover:text-yellow-200 text-white"
          >
            Phim Bộ
          </a>
          <a
            href="#"
            className="cursor-pointer hover:text-yellow-200 text-white"
          >
            Phim chiếu rạp
          </a>
          <div className="relative">
            <a
              href="#"
              onClick={toggleYearMenu}
              className="cursor-pointer hover:text-yellow-200 text-white"
            >
              Năm
              <FontAwesomeIcon icon={faCaretDown} className="ml-0.5" />
              {isYearOpen && (
                <div
                  ref={yearRef}
                  className="absolute z-50 top-full mt-4 p-3 rounded-lg shadow-2xl 
                           bg-gray-800 border border-gray-700 grid grid-cols-2 gap-x-6 gap-y-2 w-50% min-w-[200px]"
                >
                  {years.map((year) => (
                    <a
                      key={year}
                      href={`/nam/${year}`}
                      className="px-2 py-1 text-sm whitespace-nowrap 
                               text-gray-200 hover:bg-gray-700 hover:text-yellow-400 rounded-sm transition duration-150"
                    >
                      {year}
                    </a>
                  ))}
                </div>
              )}
            </a>
          </div>
        </div>

        {/* USER */}
        <div className="flex items-center text-sm font-semibold">
          <a
            href="#"
            onClick={openLoginModal}
            className="flex items-center space-x-2 py-2 px-4 ml-6 
                       bg-white text-gray-900 font-bold 
                       rounded-full shadow-lg transition duration-200 
                       hover:bg-gray-200"
          >
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
            <span>Đăng nhập</span>
          </a>
        </div>
      </header>
      <LoginModal isOpen={isModalOpen} onClose={closeLoginModal}></LoginModal>
    </>
  );
}
export default Header;
