import React, { useState, useEffect } from "react";
import ExpandableAnimeRow from "../components/ExpandableAnimeRow";

const urlAnime =
  "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=1";
const urlAnimePage2 =
  "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=20";
const urlAnimePage3 =
  "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=40";

const apiKey = import.meta.env.VITE_API_KEY;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

const CareList = ({ type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy dữ liệu theo `type`
        let urls = [];
        if (type === "anime1") {
          urls = [urlAnime, urlAnimePage2, urlAnimePage3];
        } else if (type === "anime2") {
          // Thêm các URL khác cho thể loại mới
          // Ví dụ: Lấy phim bộ Hàn Quốc
          urls = [
            "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=60",
            "https://api.themoviedb.org/3/discover/tv?language=vi-VN&sort_by=popularity.desc&with_genres=16&page=80",
          ];
        } else {
          // Xử lý trường hợp không có loại phù hợp
          setData([]);
          setLoading(false);
          return;
        }

        const promises = urls.map((url) =>
          fetch(url, options).then((res) => res.json())
        );
        const results = await Promise.all(promises);

        const combinedData = results.flatMap((res) => res.results);

        // Loại bỏ phim trùng lặp (nếu cần)
        const uniqueData = Array.from(
          new Set(combinedData.map((item) => item.id))
        ).map((id) => combinedData.find((item) => item.id === id));

        // Tạo các danh sách phim mới từ danh sách duy nhất
        let loadedData = [];
        if (type === "anime1") {
          loadedData = [
            {
              title: "Anime Phổ Biến",
              movies: uniqueData.slice(0, 20),
            },
            {
              title: "Anime Được Đánh Giá Cao",
              movies: uniqueData
                .sort((a, b) => b.vote_average - a.vote_average)
                .slice(0, 20),
            },
            // Thêm các thể loại Anime khác
          ];
        } else if (type === "anime2") {
          loadedData = [
            {
              title: "Anime Tuần",
              movies: uniqueData.slice(0, 20),
            },
            {
              title: "Anime Của Năm",
              movies: uniqueData
                .sort((a, b) => b.vote_average - a.vote_average)
                .slice(0, 20),
            },
            // Thêm các thể loại Drama Hàn khác
          ];
        }

        setData(loadedData);
      } catch (err) {
        setError(`Không thể tải dữ liệu: ${err.message}`);
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]); // Thêm 'type' vào dependency array để component re-render khi type thay đổi

  if (loading) {
    return (
      <div className="text-white text-center p-10 h-[700px] bg-gray-900 flex items-center justify-center">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-10 h-[700px] bg-gray-900 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="h-auto w-full bg-gray-950 pb-16">
      <div className="py-3"></div>

      <div className="mt-20 over">
        {data.map((list) => (
          <ExpandableAnimeRow
            key={list.title}
            title={list.title}
            movies={list.movies}
          />
        ))}
      </div>
    </div>
  );
};

export default CareList;
