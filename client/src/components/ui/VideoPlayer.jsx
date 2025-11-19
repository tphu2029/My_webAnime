import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

export default function VideoPlayer({ option, getInstance, ...rest }) {
  const artRef = useRef();

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
      url: option.url,
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Trình duyệt không hỗ trợ HLS";
          }
        },
      },
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [option.url]); // Re-render khi URL thay đổi

  return <div ref={artRef} {...rest}></div>;
}
