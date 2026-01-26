import { useEffect, useState } from "react";
import { getVideo, saveVideo } from "../../../db/video.store";

export const VideoCacheComp = ({ url }: { url: string }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchVideoFromIndexedDB = async () => {
      const blob = await getVideo(url);
      if (blob && isActive) {
        setBlobUrl(URL.createObjectURL(blob));
      }
    };

    fetchVideoFromIndexedDB();

    return () => {
      isActive = false;
    };
  }, [url]);

  const download = async () => {
    setLoading(true);

    const res = await fetch(url);
    const blob = await res.blob();

    await saveVideo(url, blob);
    setBlobUrl(URL.createObjectURL(blob));

    setLoading(false);
  };

  if (blobUrl) {
    return (
      <video
        preload="metadata"
        controls
        style={{ width: '100%', borderRadius: 8 }}
        src={url}
      />
    );
  }

  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: 8,
        background: "#222",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 12,
      }}
      onClick={download}
    >
      {loading ? "Downloading..." : "Download Video"}
    </div>
  );
};
