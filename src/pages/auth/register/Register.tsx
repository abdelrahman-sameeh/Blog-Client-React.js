import { Form } from "react-bootstrap";
import style from "./style.module.css";
import { useState } from "react";
import { validateEmail } from "../../../utils/validation/email-validation";
import { validatePassword } from "../../../utils/validation/password-validation";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import { Helmet } from "../../../components/utils/Helmet";
import notify from "../../../components/utils/Notify";
import { LoadingButton } from "../../../components/utils/LoadingButton";

export const Register = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
    // validation
    const newErrors = new Map<string, string>();
    if (!validateEmail(data.email)) {
      newErrors.set("email", "Invalid email");
    }
    if (!validatePassword(data.password)) {
      newErrors.set(
        "password",
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    }
    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }
    // send request
    setLoading(true);
    const response = await authAxios(
      false,
      ApiEndpoints.register,
      "POST",
      data
    );
    if (response.status == 201) {
      notify("Account created successfully", "success", 1000);
      localStorage.setItem(
        "token",
        response?.data?.data?.token
      );
      sessionStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else if (response.status == 409) {
      notify("Email already exist", "error");
      setErrors((prev) => prev.set("email", "Email already exist"));
    } else {
      notify("Something went wrong", "error");
    }
    setLoading(false);
  };

  return (
    <div className="register container">
      <Helmet title="Register" />
      <Form onSubmit={handleSubmit} className={style.form}>
        <h2 className="text-center fw-bold">Register</h2>
        <hr />
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First name</Form.Label>
          <Form.Control
            value={data.firstName}
            onChange={handleChange}
            name="firstName"
            type="text"
            placeholder="First name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            value={data.lastName}
            onChange={handleChange}
            name="lastName"
            type="text"
            placeholder="Last name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={data.email}
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Enter email"
            isInvalid={errors.has("email")}
          />
          <Form.Control.Feedback type="invalid">
            {errors.get("email")}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

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
          <Form.Text className="text-muted">
            Password must be 8+ characters and include: uppercase, lowercase,
            number, and special symbol like @#$%!^&*.
          </Form.Text>
        </Form.Group>

        <LoadingButton
          loading={loading}
          type={"submit"}
          variant="outline-primary"
        >
          Submit
        </LoadingButton>
      </Form>
    </div>
  );
};
