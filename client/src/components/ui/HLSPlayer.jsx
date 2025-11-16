import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

/**
 * Component HLSPlayer
 * Video player hỗ trợ HLS streaming (.m3u8)
 * Sử dụng hls.js library để play HLS streams từ Consumet API
 *
 * @param {string} src - URL của HLS stream (.m3u8)
 * @param {string} title - Tiêu đề video (cho accessibility)
 * @param {string} poster - URL của poster image (optional)
 */
const HLSPlayer = ({ src, title = "Video Player", poster = null }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!src || !videoRef.current) return;

    const video = videoRef.current;

    // Kiểm tra nếu browser hỗ trợ HLS native (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari hỗ trợ HLS native, không cần hls.js
      video.src = src;
    } else if (Hls.isSupported()) {
      // Browser không hỗ trợ HLS native, sử dụng hls.js
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      // Load HLS stream
      hls.loadSource(src);
      hls.attachMedia(video);

      // Event: Khi manifest đã load
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded, ready to play");
        // Auto play video (nếu browser cho phép)
        video.play().catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      });

      // Event: Xử lý lỗi
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error, trying to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error, trying to recover");
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal error, cannot recover");
              hls.destroy();
              break;
          }
        }
      });
    } else {
      console.error("HLS is not supported in this browser");
    }

    // Cleanup khi component unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // Nếu không có src, hiển thị thông báo
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900">
        <p className="text-xl text-white">Không tìm thấy video.</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute top-0 left-0 h-full w-full"
      controls
      autoPlay
      poster={poster}
      title={title}
      style={{ backgroundColor: "#000" }}
    >
      {/* Fallback message cho browsers không hỗ trợ */}
      <p className="text-white">
        Trình duyệt của bạn không hỗ trợ HTML5 video.
      </p>
    </video>
  );
};

export default HLSPlayer;
