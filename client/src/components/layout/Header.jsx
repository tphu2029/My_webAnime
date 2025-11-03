import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faCaretDown,
  faBars,
  faTimes,
  faSignOutAlt, // THÊM MỚI: Icon đăng xuất
  faHeart, // THÊM MỚI: Icon yêu thích
  faList, // THÊM MỚI: Icon danh sách
  faHistory, // THÊM MỚI: Icon xem tiếp
  faUserCircle, // THÊM MỚI: Icon tài khoản
  faBell, // THÊM MỚI: Icon chuông
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/img/logo.png";
import LoginModal from "../ui/LoginModal";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State và Context cho menu người dùng
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { authUser, logout } = useAuth();

  const ANIME_GENRES = [
    { name: "Shounen", slug: "shounen" },
    { name: "Shoujo", slug: "shoujo" },
    { name: "Seinen", slug: "seinen" },
    { name: "Isekai", slug: "isekai" },
    { name: "Hành động & Phiêu lưu", slug: "action" },
    { name: "Hài hước", slug: "comedy" },
    { name: "Lãng mạn", slug: "romance" },
    { name: "Kỳ ảo & Siêu nhiên", slug: "fantasy" },
    { name: "Huyền bí", slug: "mystery" },
    { name: "Khoa học viễn tưởng", slug: "sci-fi" },
    { name: "Thể thao", slug: "sports" },
    { name: "Trường học", slug: "school" },
  ];

  const genreRef = useRef(null);
  const yearRef = useRef(null);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const openLoginModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
    setIsGenreOpen(false);
    setIsYearOpen(false);
    setIsUserMenuOpen(false);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  const toggleGenreMenu = (e) => {
    e.preventDefault();
    setIsGenreOpen(!isGenreOpen);
    setIsYearOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleYearMenu = (e) => {
    e.preventDefault();
    setIsYearOpen(!isYearOpen);
    setIsGenreOpen(false);
    setIsUserMenuOpen(false);
  };

  // Hàm bật/tắt menu người dùng
  const toggleUserMenu = (e) => {
    e.preventDefault();
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsGenreOpen(false);
    setIsYearOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  //đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isGenreOpen &&
        genreRef.current &&
        !genreRef.current.contains(event.target)
      ) {
        setIsGenreOpen(false);
      }
      if (
        isYearOpen &&
        yearRef.current &&
        !yearRef.current.contains(event.target)
      ) {
        setIsYearOpen(false);
      }
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
      // đóng menu người dùng
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGenreOpen, isYearOpen, isSearchOpen, isUserMenuOpen]);

  // useEffect tìm kiếm
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

  // useEffect load Năm và Thể loại
  useEffect(() => {
    const now = new Date().getFullYear();
    const yrs = [];
    for (let y = now; y >= 2006; y--) yrs.push(String(y));
    setYears(yrs);
    setGenres(ANIME_GENRES);
    return () => {};
  }, []);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 p-4 bg-gray-950 shadow-md flex items-center justify-between text-white h-15">
        {/*  LOGO  */}
        <div className="flex items-center">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src={logo} alt="logo" className="h-10 sm:h-12 w-auto" />
          </Link>
        </div>

        {/*  SEARCH */}
        <div
          ref={searchRef}
          className="relative flex-1  lg:flex-none  lg:w-[240px] xl:w-[500px] mx-4"
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 w-5 h-5 top-1/2 transform -translate-y-1/2 text-gray-400 "
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length && setIsSearchOpen(true)}
            placeholder="Tìm kiếm ..."
            className="w-full py-1.5 pl-10 pr-4 rounded-lg border border-gray-500 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
          />
          {isSearchOpen && (searchResults.length > 0 || isSearching) && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-auto">
              {/* kết quả tìm kiếm  */}
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
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      to={`/${item.media_type}/${item.id}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
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
                    </Link>
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

        {/* MENU DESKTOP & NÚT ĐĂNG NHẬP / AVATAR */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {/* MENU DESKTOP  */}
          <nav className="relative flex items-center space-x-6">
            <div className="relative">
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
                  className="absolute z-50 top-full mt-4 p-3 rounded-lg shadow-2xl bg-gray-800 border border-gray-700 grid grid-cols-3 gap-x-6 gap-y-2 w-max min-w-[500px]"
                >
                  {genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      to={`/the-loai/anime/${genre.slug}`}
                      onClick={() => setIsGenreOpen(false)}
                      className="px-2 py-1 text-sm whitespace-nowrap text-gray-200 hover:bg-gray-700 hover:text-yellow-400 rounded-sm transition duration-150"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/phim-le"
              className="cursor-pointer hover:text-yellow-200 text-white"
            >
              Phim Lẻ
            </Link>
            <Link
              to="/phim-bo"
              className="cursor-pointer hover:text-yellow-200 text-white"
            >
              Phim Bộ
            </Link>
            <Link
              to="/phim-chieu-rap"
              className="cursor-pointer hover:text-yellow-200 text-white"
            >
              Phim chiếu rạp
            </Link>
            <div className="relative">
              <a
                href="#"
                onClick={toggleYearMenu}
                className="cursor-pointer hover:text-yellow-200 text-white"
              >
                Năm
                <FontAwesomeIcon icon={faCaretDown} className="ml-0.5" />
              </a>
              {isYearOpen && (
                <div
                  ref={yearRef}
                  className="absolute z-50 top-full mt-4 p-3 rounded-lg shadow-2xl bg-gray-800 border border-gray-700 grid grid-cols-2 gap-x-6 gap-y-2 w-max min-w-[200px]"
                >
                  {years.map((year) => (
                    <Link
                      key={year}
                      to={`/nam/${year}`}
                      onClick={() => setIsYearOpen(false)}
                      className="px-2 py-1 text-sm whitespace-nowrap text-gray-200 hover:bg-gray-700 hover:text-yellow-400 rounded-sm transition duration-150"
                    >
                      {year}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* USER DESKTOP  */}
          <div className="relative flex items-center text-sm font-semibold">
            {authUser ? (
              // === NẾU ĐÃ ĐĂNG NHẬP ===
              <div ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600"
                >
                  {/* Sử dụng avatarUrl nếu có, nếu không dùng icon mặc định */}
                  {authUser.avatarUrl ? (
                    <img
                      src={authUser.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                  )}
                </button>

                {/* Menu thả xuống */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-700">
                      <p className="font-bold text-base text-white truncate">
                        {authUser.displayName}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        @{authUser.username}
                      </p>
                    </div>
                    <nav className="py-2">
                      <Link
                        to="/tai-khoan"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <FontAwesomeIcon icon={faUserCircle} className="w-4" />
                        <span>Tài khoản</span>
                      </Link>
                      <Link
                        to="/yeu-thich"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <FontAwesomeIcon icon={faHeart} className="w-4" />
                        <span>Yêu thích</span>
                      </Link>
                      <Link
                        to="/danh-sach"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <FontAwesomeIcon icon={faList} className="w-4" />
                        <span>Danh sách</span>
                      </Link>
                      <Link
                        to="/xem-tiep"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <FontAwesomeIcon icon={faHistory} className="w-4" />
                        <span>Xem tiếp</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 border-t border-gray-700 mt-2"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                        <span>Thoát</span>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              // === NẾU CHƯA ĐĂNG NHẬP ===
              <a
                href="#"
                onClick={openLoginModal}
                className="flex items-center space-x-2 py-2 px-4 bg-white text-gray-900 font-bold rounded-full shadow-lg transition duration-200 hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                <span>Đăng nhập</span>
              </a>
            )}
          </div>
        </div>

        {/* NÚT HAMBURGER CHO DI ĐỘNG */}
        <div className="lg:hidden flex items-center ">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} className="w-10 h-10" />
          </button>
        </div>
      </header>

      {/* PANEL MENU CHO DI ĐỘNG */}
      <div
        className={`fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        {/* Header của menu */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="logo" className="h-10 w-auto" />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Nội dung menu */}
        <nav className="p-4 flex flex-col h-full overflow-y-auto">
          {authUser ? (
            // === NẾU ĐÃ ĐĂNG NHẬP (MOBILE) ===
            <div className="mb-6">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full text-gray-300">
                  {authUser.avatarUrl ? (
                    <img
                      src={authUser.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-base text-white truncate">
                    {authUser.displayName}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    @{authUser.username}
                  </p>
                </div>
              </div>
              <Link
                to="/tai-khoan"
                onClick={handleMobileLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-200 hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faUserCircle} className="w-5" />
                <span>Tài khoản</span>
              </Link>
            </div>
          ) : (
            // === NẾU CHƯA ĐĂNG NHẬP (MOBILE) ===
            <a
              href="#"
              onClick={openLoginModal}
              className="flex items-center justify-center space-x-2 py-2 px-4 mb-6 bg-white text-gray-900 font-bold rounded-full shadow-lg transition duration-200 hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <span>Đăng nhập</span>
            </a>
          )}

          {/* Liên kết chung */}
          <Link
            to="/phim-le"
            onClick={handleMobileLinkClick}
            className="text-lg py-2 text-gray-200 hover:text-yellow-400"
          >
            Phim Lẻ
          </Link>
          <Link
            to="/phim-bo"
            onClick={handleMobileLinkClick}
            className="text-lg py-2 text-gray-200 hover:text-yellow-400"
          >
            Phim Bộ
          </Link>
          <Link
            to="/phim-chieu-rap"
            onClick={handleMobileLinkClick}
            className="text-lg py-2 text-gray-200 hover:text-yellow-400"
          >
            Phim chiếu rạp
          </Link>

          {/* THÊM MỚI: Các link cho user đã đăng nhập (Mobile) */}
          {authUser && (
            <>
              <Link
                to="/yeu-thich"
                onClick={handleMobileLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-200 hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faHeart} className="w-5" />
                <span>Yêu thích</span>
              </Link>
              <Link
                to="/danh-sach"
                onClick={handleMobileLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-200 hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faList} className="w-5" />
                <span>Danh sách</span>
              </Link>
              <Link
                to="/xem-tiep"
                onClick={handleMobileLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-200 hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faHistory} className="w-5" />
                <span>Xem tiếp</span>
              </Link>
            </>
          )}

          {/* ... (Menu thể loại và năm - Giữ nguyên) ... */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h3 className="text-gray-400 font-bold mb-2">Thể Loại</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {genres.map((genre) => (
                <Link
                  key={genre.slug}
                  to={`/the-loai/anime/${genre.slug}`}
                  onClick={handleMobileLinkClick}
                  className="text-gray-200 hover:text-yellow-400 whitespace-nowrap"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <h3 className="text-gray-400 font-bold mb-2">Năm</h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {years.map((year) => (
                <Link
                  key={year}
                  to={`/nam/${year}`}
                  onClick={handleMobileLinkClick}
                  className="px-2 py-1 text-sm whitespace-nowrap text-gray-200 hover:bg-gray-700 hover:text-yellow-400 rounded-sm transition duration-150"
                >
                  {year}
                </Link>
              ))}
            </div>
          </div>

          {/* THÊM MỚI: Nút đăng xuất (Mobile) */}
          {authUser && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-2 py-3 text-lg text-red-400 hover:text-red-300"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </nav>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={closeLoginModal}></LoginModal>
    </>
  );
}
export default Header;
