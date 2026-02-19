import { Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { IAttachment } from "../../../utils/interfaces/attachment.interface";
import { socket } from "../../../socket/socket";
import type { IMessage } from "../../../utils/interfaces/message.interface";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { messagesAtom } from "../../../recoil/messages.atom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import notify from "../../utils/Notify";

export const DeleteDropdownAttachment = ({
  attachment,
  message,
  isReceiver,
  token = "image",
}: {
  attachment: IAttachment;
  message: IMessage;
  isReceiver: boolean;
  token?: "image" | "video" | "doc" | "";
}) => {
  const { user } = useLoggedInUser();
  const { id: chatId } = useParams();
  const setMessages = useSetRecoilState(messagesAtom);

  const handleDelete = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.deleteAttachment(
        message._id as string,
        attachment._id as string,
      ),
      "DELETE",
    );

    if (response.status != 200) {
      notify("Failed to remove message");
      return;
    }

    setMessages((prev) =>
      prev.map((m) => {
        if (m._id !== message._id) return m;
        return {
          ...m,
          attachments: m.attachments.filter((att) => att._id !== attachment._id),
        };
      }),
    );
  };

  const handleDeleteForAll = () => {
    const payload = {
      user,
      chatId,
      messageId: message._id,
      attachmentId: attachment._id,
    };
    socket.emit("attachment:delete:for-all", payload);

    setMessages((prev) =>
      prev.map((m) => {
        if (m._id !== message._id) return m;

        return {
          ...m,
          attachments: m.attachments.map((att) =>
            att._id === attachment._id
              ? {
                  ...att,
                  deleteFor: [...(att.deleteFor || []), user._id as any],
                }
              : att,
          ),
        };
      }),
    );
  };

  return (
    <Dropdown
      style={{
        top: "0px",
        right: "2px",
        color: "black",
      }}
      className="position-absolute"
    >
      <Dropdown.Toggle
        id="dropdown-basic"
        className={`border-0 no-arrow p-0 bg-light text-dark`}
      >
        <BsThreeDotsVertical />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleDelete}>Delete {token}</Dropdown.Item>
        {!isReceiver && (
          <Dropdown.Item onClick={handleDeleteForAll}>
            Delete {token} for all
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
