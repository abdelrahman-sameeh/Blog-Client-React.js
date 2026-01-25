import { useRef } from "react";
import { Dropdown } from "react-bootstrap";
import { IoIosAttach } from "react-icons/io";
import { useSetRecoilState } from "recoil";
import { attachmentsAtom } from "../../../recoil/attachments.atom";

export function AttachmentsComp() {
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const setAttachments = useSetRecoilState(attachmentsAtom);

  const handleFiles = (
    files: FileList | null,
    type: "image" | "video" | "document",
  ) => {
    if (!files) return;
    const newAttachments = Array.from(files).map((file) => ({
      file,
      type,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  return (
    <>
      {/* hidden inputs */}
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        hidden
        multiple
        onChange={(e) => handleFiles(e.target.files, "image")}
      />

      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        hidden
        multiple
        onChange={(e) => handleFiles(e.target.files, "video")}
      />

      <input
        ref={docRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        hidden
        multiple
        onChange={(e) => handleFiles(e.target.files, "document")}
      />

      {/* dropdown */}
      <Dropdown drop="up">
        <Dropdown.Toggle
          variant="outline-secondary"
          className="btn me-1 no-arrow px-2"
        >
          <IoIosAttach className="fs-5" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => imageRef.current?.click()}>
            Image
          </Dropdown.Item>
          <Dropdown.Item onClick={() => videoRef.current?.click()}>
            Video
          </Dropdown.Item>
          <Dropdown.Item onClick={() => docRef.current?.click()}>
            Document
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
