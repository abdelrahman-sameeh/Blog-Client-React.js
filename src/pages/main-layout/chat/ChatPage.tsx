import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IMessage } from "../../../utils/interfaces/message.interface";
import type { IUser } from "../../../utils/interfaces/user-interface";
import { Card, Col, Dropdown, Form, Image, Row } from "react-bootstrap";
import { LoadingButton } from "../../../components/utils/LoadingButton";
import { socket } from "../../../socket/socket";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { FiSend } from "react-icons/fi";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { IoIosAttach } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatTime } from "../../../utils/common/format-time";

export const ChatPage = () => {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState<Partial<IUser>>({});
  const [replyMessage, setReplayMessage] = useState<Partial<IMessage>>({});
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recordTime, setRecordTime] = useState(0); // الوقت بالثواني
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useLoggedInUser();

  const getChatWithMessage = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.getChatWithMessage(chatId as string),
    );

    setMessages(response?.data?.messages || []);
    setReceiver(response?.data?.receiver || {});
  };

  useEffect(() => {
    getChatWithMessage();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", {
      chatId,
      sender: user?._id,
    });

    socket.on("message:sent", (message) => {
      setMessages((prev) => prev.concat(message));
    });

    socket.on("message:deleted:for-all", (updatedMessage: IMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id == updatedMessage._id ? updatedMessage : m)),
      );
    });

    return () => {
      socket.emit("leave", {
        chatId,
        sender: user._id,
      });
    };
  }, [user?._id]);

  useEffect(() => {
    if (isRecording) {
      setRecordTime(0); // إعادة تعيين الوقت عند بداية التسجيل
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1); // زود ثانية
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current as any);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as any);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payload: any = {
      _id: new Date(),
      content: newMessage,
      sender: user,
      type: "text",
      createdAt: new Date(),
      seenBy: [user._id!],
      chat: chatId,
    };

    if (replyMessage?._id) {
      payload["replyTo"] = replyMessage;
    }

    setNewMessage("");
    socket.emit("message:send", payload);
    setReplayMessage({});

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleReply = (message: IMessage) => {
    setReplayMessage(message);
  };

  const handleClearChat = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.clearChat(chatId as string),
      "PATCH",
    );
    if (response.status == 200) {
      setMessages([]);
    }
  };

  const handleDelete = async (message: IMessage) => {
    await authAxios(
      true,
      ApiEndpoints.deleteMessage(message._id as string),
      "DELETE",
    );
    setMessages((prev) => prev.filter((msg) => msg._id != message._id));
  };

  const handleDeleteForAll = async (message: IMessage) => {
    await handleDelete(message);
    socket.emit("message:delete:for-all", {
      message,
      user,
      chat: chatId,
    });
  };

  // recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = handleUploadVoice;

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleUploadVoice = async () => {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

    // save voice in DB
    const formData = new FormData();
    formData.append("voice", audioBlob);
    const response = await authAxios(
      true,
      ApiEndpoints.uploadVoice(chatId as string),
      "POST",
      formData,
      "multipart/form-data",
    );

    if (response.status == 201) {
      const payload: any = {
        _id: new Date(),
        content: response.data.audio,
        sender: user,
        type: "voice",
        createdAt: new Date(),
        seenBy: [user._id!],
        chat: chatId,
      };

      socket.emit("message:send", payload);
    }
  };

  return (
    <main className="main-content custom-container d-flex justify-content-center align-items-center">
      <Row className="justify-content-center h-100 mb-3 flex-1">
        <Col md={8} style={{ height: "550px" }}>
          <Card className="d-flex flex-column h-100">
            {/* ===== Header ===== */}
            <Card.Header className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center ">
                {receiver?.picture ? (
                  <Image
                    src={receiver?.picture}
                    roundedCircle
                    width={40}
                    height={40}
                  />
                ) : (
                  <div
                    style={{ width: "40px", height: "40px" }}
                    className="border rounded-circle d-flex justify-content-center align-items-center"
                  >
                    {receiver.username?.[0]?.toUpperCase()}
                  </div>
                )}

                <strong
                  style={{ maxWidth: "280px" }}
                  title={`${receiver.firstName} ${receiver?.lastName}`}
                  className="text-truncate ms-3"
                >
                  {`${receiver.firstName} ${receiver?.lastName}` || "Chat"}
                </strong>
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="bg-transparent text-dark border-0 no-arrow p-0"
                >
                  <BsThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleClearChat}>
                    Clear Chat
                  </Dropdown.Item>
                  <Dropdown.Item>Block</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>

            {/* ===== Messages ===== */}
            <Card.Body
              className="flex-grow-1 overflow-auto"
              style={{ background: "#f5f5f5" }}
            >
              {messages.map((msg) => {
                const isReceiver = msg.sender?._id === receiver?._id;
                const isDeletedForAll = msg.deletedForAll?.isDeleted === true;

                return (
                  <div
                    key={msg._id}
                    className={`d-flex mb-2 ${
                      isReceiver
                        ? "justify-content-start"
                        : "justify-content-end"
                    }`}
                  >
                    {isDeletedForAll ? (
                      <div
                        id={msg._id}
                        className={`p-2 rounded d-flex align-items-center ${
                          isDeletedForAll
                            ? "bg-light text-muted"
                            : isReceiver
                              ? "bg-white"
                              : "bg-primary text-white"
                        }`}
                        style={{
                          maxWidth: "70%",
                          fontSize: "0.9rem",
                        }}
                      >
                        <div className="fst-italic">
                          <span>🗑️</span>
                          <span>This message was deleted</span>
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="text-dark bg-transparent border-0 no-arrow p-0"
                          >
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleDelete(msg)}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    ) : (
                      <div
                        id={`msg-${msg._id}`}
                        className={`p-2 rounded ${
                          isReceiver ? "bg-white" : "bg-secondary text-white"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        {/* Reply preview */}
                        {msg.replyTo && (
                          <div
                            role="button"
                            onClick={() => {
                              const el = document.getElementById(
                                `msg-${(msg.replyTo as IMessage)._id}`,
                              );
                              el?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                              el?.classList.add("highlight-message");
                              setTimeout(
                                () => el?.classList.remove("highlight-message"),
                                2500,
                              );
                            }}
                            className={`mb-1 p-1 rounded small pointer ${
                              isReceiver
                                ? "bg-light text-dark"
                                : "bg-primary-subtle text-dark"
                            }`}
                            style={{
                              borderLeft: isReceiver ? "3px solid #0d6efd" : "",
                              borderRight: !isReceiver ? "3px solid black" : "",
                            }}
                          >
                            <div className="text-truncate">
                              {msg.replyTo.content}
                            </div>
                          </div>
                        )}

                        {/* Message content + menu */}
                        <div className="d-flex align-items-center gap-2">
                          {msg.type == "text" && <span>{msg.content}</span>}
                          {msg.type == "voice" && (
                            <audio controls style={{ width: "250px" }}>
                              <source src={msg.content} type="audio/webm" />
                              Your browser does not support the audio element.
                            </audio>
                          )}

                          <Dropdown>
                            <Dropdown.Toggle
                              id="dropdown-basic"
                              className={`bg-transparent border-0 no-arrow p-0 ${
                                isReceiver ? "text-dark" : "text-white"
                              }`}
                            >
                              <BsThreeDotsVertical />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleReply(msg)}>
                                Reply
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDelete(msg)}>
                                Delete
                              </Dropdown.Item>
                              {!isReceiver && (
                                <Dropdown.Item
                                  onClick={() => handleDeleteForAll(msg)}
                                >
                                  Delete For All
                                </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </Card.Body>

            {/* ===== Input ===== */}
            <Card.Footer>
              <Form onSubmit={handleSendMessage}>
                {replyMessage?._id ? (
                  <div className="mb-2 p-2 rounded bg-light d-flex justify-content-between align-items-start">
                    <div className="border-start border-3 ps-2">
                      <small className="fw-bold text-primary">
                        Replying to {replyMessage.sender?.username}
                      </small>
                      <div
                        className="text-muted small text-truncate"
                        style={{ maxWidth: "250px" }}
                      >
                        {replyMessage.content}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger p-0 ms-2"
                      onClick={() => setReplayMessage({})}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <></>
                )}
                <Row>
                  {!isRecording && (
                    <Col style={{ flex: "5" }}>
                      <Form.Control
                        className="shadow-none"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </Col>
                  )}

                  <Col
                    xs="auto"
                    className="p-0 d-flex align-items-center flex-1 justify-content-end"
                  >
                    {!isRecording && (
                      <Dropdown drop={"up"}>
                        <Dropdown.Toggle
                          id="dropdown-basic"
                          variant="outline-secondary"
                          className="btn me-1 no-arrow px-2"
                        >
                          <IoIosAttach className="fs-5" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Image</Dropdown.Item>
                          <Dropdown.Item>Video</Dropdown.Item>
                          <Dropdown.Item>Document</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    {isRecording && (
                      <span style={{ flex: ".5" }} className="me-2">
                        {formatTime(recordTime)}
                      </span>
                    )}
                    {!newMessage.trim() && (
                      <LoadingButton
                        variant={isRecording ? "danger" : "outline-secondary"}
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? <FaStop /> : <FaMicrophone />}
                      </LoadingButton>
                    )}
                    {newMessage.trim() && (
                      <LoadingButton
                        type="submit"
                        variant="outline-secondary ms-1"
                      >
                        <FiSend />
                      </LoadingButton>
                    )}

                    {isRecording && (
                      <LoadingButton
                        type="button"
                        onClick={stopRecording}
                        variant="outline-secondary ms-1"
                      >
                        <FiSend />
                      </LoadingButton>
                    )}
                  </Col>
                </Row>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </main>
  );
};
