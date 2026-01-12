import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IMessage } from "../../../utils/interfaces/message.interface";
import type { IUser } from "../../../utils/interfaces/user-interface";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { LoadingButton } from "../../../components/utils/LoadingButton";
import { socket } from "../../../socket/socket";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { FiSend } from "react-icons/fi";
import { FaMicrophone } from "react-icons/fa";
import { IoIosAttach } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

export const ChatPage = () => {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState<Partial<IUser>>({});
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useLoggedInUser();

  const getChatWithMessage = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.getChatWithMessage(chatId as string)
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

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => prev.concat(message));
    });

    return () => {
      socket.emit("leave", {
        chatId,
        sender: user._id,
      });
    };
  }, [user?._id]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payload = {
      _id: new Date(),
      content: newMessage,
      sender: user,
      createdAt: new Date(),
      seenBy: [user._id!],
      chat: chatId,
    };

    setMessages((prev) => [...prev, payload as any]);
    setNewMessage("");
    setLoading(true);
    socket.emit("sendMessage", payload);
    setLoading(false);

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
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
              <Button className="bg-light text-dark border-0">
                <BsThreeDotsVertical />
              </Button>
            </Card.Header>

            {/* ===== Messages ===== */}
            <Card.Body
              className="flex-grow-1 overflow-auto"
              style={{ background: "#f5f5f5" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`d-flex mb-2 ${
                    msg.sender?._id === receiver?._id
                      ? "justify-content-start"
                      : "justify-content-end"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.sender?._id === receiver?._id
                        ? "bg-white"
                        : "bg-primary text-white"
                    }`}
                    style={{ maxWidth: "70%" }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </Card.Body>

            {/* ===== Input ===== */}
            <Card.Footer>
              <Form onSubmit={handleSendMessage}>
                <Row>
                  <Col>
                    <Form.Control
                      className="shadow-none"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </Col>
                  <Col xs="auto" className="p-0">
                    <LoadingButton variant="outline-secondary" className="me-1">
                      <IoIosAttach />
                    </LoadingButton>
                    {newMessage.trim() ? (
                      <LoadingButton
                        loading={loading}
                        type="submit"
                        variant="outline-secondary"
                      >
                        <FiSend />
                      </LoadingButton>
                    ) : (
                      <LoadingButton variant="outline-secondary">
                        <FaMicrophone />
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
