import { Form, Button } from "react-bootstrap";
import style from "./style.module.css";
import { useState } from "react";
import { validateEmail } from "../../../utils/validation/email-validation";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import { Helmet } from "../../../components/utils/Helmet";
import notify from "../../../components/utils/Notify";
import { LoadingButton } from "../../../components/utils/LoadingButton";

export const Login = () => {
  const [useEmail, setUseEmail] = useState(true); // toggle بين الإيميل واليوزرنيم
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => {
      const newErrors = new Map(prev);
      newErrors.delete(e.target.name);
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = new Map<string, string>();
    const identity = useEmail ? data.email.trim() : data.username.trim();

    if (!identity) {
      newErrors.set(
        useEmail ? "email" : "username",
        `Please enter ${useEmail ? "email" : "username"}`
      );
    }

    if (useEmail && identity && !validateEmail(identity)) {
      newErrors.set("email", "Invalid email format");
    }

    if (!data.password.trim()) {
      newErrors.set("password", "Please enter password");
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }

    const finalData = {
      [useEmail ? "email" : "username"]: identity,
      password: data.password.trim(),
    };

    setLoading(true);
    const response = await authAxios(
      false,
      ApiEndpoints.login,
      "POST",
      finalData
    );

    if (response.status === 200) {
      notify("Logged in successfully", "success", 1000);
      localStorage.setItem("token", response?.data?.data?.token);
      sessionStorage.setItem(
        "user",
        JSON.stringify(response?.data?.data?.user)
      );
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else if (response.status === 403) {
      notify("Email or password is invalid", "error");
    } else {
      notify("Something went wrong", "error");
    }

    setLoading(false);
  };

  return (
    <div className="login container">
      <Helmet title="Login" />
      <Form onSubmit={handleSubmit} className={style.form}>
        <h2 className="text-center fw-bold">Login</h2>
        <hr />

        {/* حقل الإيميل أو اليوزرنيم حسب الحالة */}
        {useEmail ? (
          <Form.Group className="mb-3" controlId="email">
            <div className="d-flex justify-content-between align-items-end mb-2">
              <Form.Label className="mb-0">Email</Form.Label>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setUseEmail(!useEmail)}
              >
                Use {useEmail ? "Username" : "Email"}
              </Button>
            </div>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={data.email}
              onChange={handleChange}
              isInvalid={errors.has("email")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.get("email")}
            </Form.Control.Feedback>
          </Form.Group>
        ) : (
          <Form.Group className="mb-3" controlId="username">
            <div className="d-flex justify-content-between align-items-end mb-2">
              <Form.Label className="mb-0">Username</Form.Label>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setUseEmail(!useEmail)}
              >
                Use {useEmail ? "Username" : "Email"}
              </Button>
            </div>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={data.username}
              onChange={handleChange}
              isInvalid={errors.has("username")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.get("username")}
            </Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={data.password}
            onChange={handleChange}
            name="password"
            type="password"
            placeholder="Password"
            isInvalid={errors.has("password")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.get("password")}
          </Form.Control.Feedback>
        </Form.Group>

        <LoadingButton
          loading={loading}
          type="submit"
          variant="outline-primary"
        >
          Login
        </LoadingButton>
      </Form>
    </div>
  );
};
