import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { imageViewAtom } from "../../../recoil/image-view.atom";
import { getImage, saveImage } from "../../../db/image.store";

export function ChatImageComp({
  url,
  imageViewModal,
}: {
  url: string;
  imageViewModal: { isOpen: boolean; open: () => void; close: () => void };
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setImageUrl = useSetRecoilState(imageViewAtom);

  useEffect(() => {
    let isActive = true;

    const fetchImageFromIndexedDB = async () => {
      const blob = await getImage(url);
      if (blob && isActive) {
        setBlobUrl(URL.createObjectURL(blob));
      }
    };

    fetchImageFromIndexedDB();

    return () => {
      isActive = false;
    };
  }, [url]);

  const download = async () => {
    setLoading(true);

    const res = await fetch(url);
    const blob = await res.blob();

    await saveImage(url, blob);
    setBlobUrl(URL.createObjectURL(blob));

    setLoading(false);
  };

  // بعد التحميل
  if (blobUrl) {
    return (
      <img
        src={blobUrl}
        alt="image"
        style={{
          width: 100,
          height: 100,
          objectFit: "cover",
          borderRadius: 8,
          flex: 1,
          cursor: "pointer",
        }}
        onClick={() => {
          setImageUrl(blobUrl);
          imageViewModal.open();
        }}
      />
    );
  }

  // قبل التحميل
  return (
    <div
      style={{
        width: 100,
        height: 100,
        flex: 1,
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
      {loading ? "Downloading..." : "Download"}
    </div>
  );
}
