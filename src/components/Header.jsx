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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const ANIME_GENRES = [
    { name: "Shounen", slug: "shounen" },
    { name: "Shoujo", slug: "shoujo" },
    { name: "Seinen", slug: "seinen" },
    { name: "Isekai", slug: "isekai" },
    { name: "Mecha", slug: "mecha" },
    { name: "Đời thường", slug: "slice-of-life" },
    { name: "Hành động", slug: "action" },
    { name: "Phiêu lưu", slug: "adventure" },
    { name: "Hài hước", slug: "comedy" },
    { name: "Lãng mạn", slug: "romance" },
    { name: "Kỳ ảo", slug: "fantasy" },
    { name: "Siêu nhiên", slug: "supernatural" },
    { name: "Huyền bí", slug: "mystery" },
    { name: "Khoa học viễn tưởng", slug: "sci-fi" },
    { name: "Kinh dị", slug: "horror" },
    { name: "Thể thao", slug: "sports" },
    { name: "Âm nhạc", slug: "music" },
    { name: "Trường học", slug: "school" },
    { name: "Lịch sử", slug: "historical" },
  ];

  const genreRef = useRef(null);
  const yearRef = useRef(null);
  const searchRef = useRef(null);

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

      // 3. Đóng ô kết quả tìm kiếm
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }

    // Gắn sự kiện lắng nghe khi component mount
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp: Loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGenreOpen, isYearOpen, isSearchOpen]);

  // Tìm kiếm TMDB (debounce) - CHỈ anime/hoạt hình (genre_ids includes 16)
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      const q = searchQuery.trim();
      if (q.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const apiKey = import.meta.env.VITE_API_KEY;
        const url = `https://api.themoviedb.org/3/search/multi?language=vi-VN&query=${encodeURIComponent(
          q
        )}&include_adult=false`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json;charset=utf-8",
          },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const results = (data.results || [])
          .filter((r) => r.media_type === "movie" || r.media_type === "tv")
          .filter((r) => Array.isArray(r.genre_ids) && r.genre_ids.includes(16))
          .slice(0, 8);
        setSearchResults(results);
        setIsSearchOpen(true);
      } catch (e) {
        if (e.name !== "AbortError") {
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  // Khởi tạo years động và dùng danh sách thể loại anime tĩnh
  useEffect(() => {
    // Years từ năm hiện tại về 2006 (chỉ > 2005)
    const now = new Date().getFullYear();
    const yrs = [];
    for (let y = now; y >= 2006; y--) yrs.push(String(y));
    setYears(yrs);

    setGenres(ANIME_GENRES);
    return () => {};
  }, []);

  return (
    <>
      <header className=" sticky top-0 z-50  p-4 bg-gray-950 shadow-md flex items-center justify-between text-white h-15">
        {/* PHẦN 1: LOGO */}
        <div className="flex items-center space-x-2 ml-4">
          <a href="#">
            <img src={logo} alt="logo" className="h-12 w-auto" />
          </a>
        </div>

        {/* Search */}
        <div
          ref={searchRef}
          className="relative flex text-balance items-center w-[300px] "
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 w-5 h-5 top-1/2 transform -translate-y-1/2 text-gray-400 mx-auto"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length && setIsSearchOpen(true)}
            placeholder="Tìm kiếm ..."
            className="w-100 py-1.5 pl-10 pr-4 rounded-lg border border-gray-500 bg-gray-700 
                          focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500 "
          />
          {isSearchOpen && (searchResults.length > 0 || isSearching) && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-auto">
              {isSearching && (
                <div className="px-4 py-3 text-sm text-gray-300">
                  Đang tìm...
                </div>
              )}
              {!isSearching &&
                searchResults.map((item) => {
                  const title = item.title || item.name;
                  const date = (
                    item.release_date ||
                    item.first_air_date ||
                    ""
                  ).slice(0, 4);
                  const img = item.poster_path
                    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                    : null;
                  return (
                    <a
                      key={`${item.media_type}-${item.id}`}
                      href="#"
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          className="w-8 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-8 h-12 bg-gray-600 rounded" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm text-white line-clamp-1">
                          {title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {date} •{" "}
                          {item.media_type === "movie" ? "Phim lẻ" : "Phim bộ"}
                        </div>
                      </div>
                    </a>
                  );
                })}
              {!isSearching &&
                searchResults.length === 0 &&
                searchQuery.trim().length >= 2 && (
                  <div className="px-4 py-3 text-sm text-gray-300">
                    Không tìm thấy kết quả
                  </div>
                )}
            </div>
          )}
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
                    key={genre.slug}
                    href={`/the-loai/anime/${genre.slug}`}
                    className="px-2 py-1 text-sm whitespace-nowrap 
                               text-gray-200 hover:bg-gray-700 hover:text-yellow-400 rounded-sm transition duration-150"
                  >
                    {genre.name}
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
