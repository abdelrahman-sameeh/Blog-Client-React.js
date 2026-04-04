import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IMessage } from "../../../utils/interfaces/message.interface";
import type { IUser } from "../../../utils/interfaces/user-interface";
import { Link } from "react-router-dom";
import { FaMicrophone, FaRegTrashAlt } from "react-icons/fa";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { socket } from "../../../socket/socket";

type ChatType = {
  lastMessage: IMessage;
  receiver: IUser;
  _id: string;
};

const radios = [
  { name: "chats", value: "chat" },
  { name: "requests", value: "request" },
];

export const ChatListPage = () => {
  const [radioValue, setRadioValue] = useState("chat");
  const [chats, setChats] = useState<ChatType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useLoggedInUser();

  const LIMIT = 10;

  const fetchChats = async (pageNumber = 1) => {
    const response = await authAxios(
      true,
      ApiEndpoints.getChatList(
        `?type=${radioValue}&page=${pageNumber}&limit=${LIMIT}`,
      ),
    );

    const newChats = response?.data?.data?.chats || [];

    if (pageNumber === 1) {
      setChats(newChats);
    } else {
      setChats((prev) => [...prev, ...newChats]);
    }

    if (newChats.length < LIMIT) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchChats(1);
  }, [radioValue]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchChats(nextPage);
  };

  function buildLastMessage(message: IMessage) {
    return {
      _id: message._id,
      content: message.content,
      attachments: message.attachments,
      createdAt: message.createdAt,
      type: message.type,
      deletedForAll: message.deletedForAll,
      isDeletedForAll: message?.isDeletedForAll,
    };
  }

  useEffect(() => {
    if (!user?._id) return;

    // refresh last message when send new message in chat list page
    socket.on("message:sent", (message) => {
      const updatedLastMessage: any = buildLastMessage(message);

      setChats((chats) =>
        chats.map((ch) =>
          ch._id == message.chat
            ? { ...ch, lastMessage: updatedLastMessage }
            : ch,
        ),
      );
    });

    // refresh last message when delete last message
    socket.on("message:deleted:for-all", (message: IMessage) => {
      const updatedLastMessage: any = buildLastMessage(message);

      setChats((chats) =>
        chats.map((ch) =>
          ch._id == message.chat && ch.lastMessage._id == message._id
            ? { ...ch, lastMessage: updatedLastMessage }
            : ch,
        ),
      );
    });
  }, [user?._id]);

  return (
    <main className="main-content">
      <div className="custom-container">
        <ButtonGroup style={{ marginBottom: "-20px" }}>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-dark"
              className={`border-0 rounded-0 bg-transparent fw-bold ms-2 text-capitalize ${
                radioValue === radio.value
                  ? "text-dark border-bottom border-dark"
                  : "text-secondary"
              }`}
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>

        <hr style={{ border: "1px solid #cfcfcf" }} />

        {!chats.length && <div className="text-center fw-bold">No chats</div>}

        <InfiniteScroll
          dataLength={chats.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<div className="text-center mt-3">loading...</div>}
        >
          {chats.map((chat) => {
            return (
              <Link
                to={`/chat/${chat._id}`}
                key={chat?._id}
                className="border text-dark text-decoration-none rounded d-flex gap-3 p-2 my-2"
              >
                {chat.receiver.picture ? (
                  <img
                    width={40}
                    height={40}
                    className="rounded-circle"
                    src={chat?.receiver?.picture}
                    alt={chat?.receiver?.username}
                  />
                ) : (
                  <span
                    style={{ width: "40px", height: "40px" }}
                    className="border rounded-circle text-center fs-5 fw-bold"
                  >
                    {chat?.receiver?.username?.[0]}
                  </span>
                )}

                <div className="d-flex justify-content-between flex-1">
                  <div>
                    <div
                      style={{ fontSize: ".9em" }}
                      className="text-truncate fw-bold"
                    >
                      {chat?.receiver?.firstName} {chat?.receiver?.lastName}
                    </div>

                    <div className="text-truncate text-secondary small">
                      {chat?.lastMessage?.deletedForAll?.isDeleted == true ? (
                        <span className="fst-italic">
                          this message was deleted
                          <FaRegTrashAlt />
                        </span>
                      ) : chat.lastMessage.type == "text" ? (
                        chat?.lastMessage?.content ? (
                          chat?.lastMessage?.content
                        ) : (
                          <span>
                            {chat?.lastMessage?.attachments.length > 1
                              ? `${chat?.lastMessage?.attachments.length} attachments was sent`
                              : "an attachment was sent"}
                          </span>
                        )
                      ) : chat.lastMessage.type == "voice" ? (
                        <span>
                          <FaMicrophone /> voice message
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div
                    style={{ fontFamily: "sans-serif", color: "#6c757d" }}
                    className="small"
                  >
                    {new Date(chat.lastMessage?.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </InfiniteScroll>
      </div>
    </main>
  );
};
