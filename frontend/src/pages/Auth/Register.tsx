

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Form, Input, Button, Typography, Alert, Row, Col } from "antd";
import { motion } from "framer-motion";
import { AppState } from "../../redux/AppState";
import { userSlice } from "../../redux/UserSlice";
import { tokenSlice } from "../../redux/TokenSlice";
import { authApi } from "../../api/authApi";
import { jwtDecode } from "../../utils/jwtDecode";
import { registerSchema } from "../../schemas/authSchemas";
import { getZodErrors, FormErrors } from "../../utils/zodErrors";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import { ROUTES, TOKEN_STORAGE_KEY } from "../../config/appConfig";
import backgroundImg from "../../assets/landing5.jpeg";
import { buttonHover, buttonTap, fadeScale } from "../../ui/motion";


function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: AppState) => state.user);

  useEffect(() => {
    if (user) navigate(ROUTES.vacations, { replace: true });
  }, [user, navigate]);

  const handleSubmit = async () => {
    setFieldErrors({});
    setError("");
    try {
      
      const data = registerSchema.parse({
        firstName,
        lastName,
        email,
        password,
      });
      setLoading(true);
      const response = await authApi.register(data);
      const token = response.data.token;
      
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      dispatch(tokenSlice.actions.initToken(token));
      dispatch(userSlice.actions.initUser(jwtDecode(token)));
    } catch (err: unknown) {
      if (err instanceof ZodError) setFieldErrors(getZodErrors(err));
      else if (err instanceof AxiosError)
        setError(
          err.response?.data?.message ||
            err.response?.data?.details ||
            "Registration failed",
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <img
        src={backgroundImg}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(145deg, var(--auth-overlay-start), var(--auth-overlay-end))",
          backdropFilter: "blur(7px)",
        }}
      />

      <motion.div
        variants={fadeScale}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 448,
          padding: 16,
        }}
      >
        <Card
          className="glass-surface"
          style={{
            boxShadow: "var(--shadow-strong)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Typography.Title
              level={2}
              style={{ marginBottom: 8, color: "var(--text-primary)" }}
            >
              Create account
            </Typography.Title>
            <Typography.Text style={{ color: "var(--text-secondary)" }}>
              Join Vacanza and start exploring
            </Typography.Text>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <div>
            <Form layout="vertical" size="large" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    validateStatus={fieldErrors.firstName ? "error" : undefined}
                    help={fieldErrors.firstName}
                  >
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    validateStatus={fieldErrors.lastName ? "error" : undefined}
                    help={fieldErrors.lastName}
                  >
                    <Input
                      id="lastName"
                      placeholder="Your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Email"
                validateStatus={fieldErrors.email ? "error" : undefined}
                help={fieldErrors.email}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                validateStatus={fieldErrors.password ? "error" : undefined}
                help={fieldErrors.password}
              >
                <Input.Password
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="primary-gradient-button"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </motion.div>
              </Form.Item>
            </Form>
          </div>

          <Typography.Text
            style={{
              color: "var(--text-secondary)",
              display: "block",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            Already have an account?{" "}
            <Link
              to={ROUTES.login}
              style={{ fontWeight: 500, color: "var(--link-accent)" }}
            >
              Sign in
            </Link>
          </Typography.Text>
        </Card>
      </motion.div>
    </div>
  );
}

export default Register;
