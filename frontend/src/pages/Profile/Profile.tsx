

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Alert,
  Row,
  Col,
} from "antd";
import { motion } from "framer-motion";
import { AppState } from "../../redux/AppState";
import { userSlice } from "../../redux/UserSlice";
import { tokenSlice } from "../../redux/TokenSlice";
import { vacationsSlice } from "../../redux/VacationsSlice";
import { usersApi } from "../../api/usersApi";
import { jwtDecode } from "../../utils/jwtDecode";
import { IUser } from "../../models/User";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../../schemas/profileSchemas";
import { getZodErrors, FormErrors } from "../../utils/zodErrors";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import {
  AVATAR_BASE_URL,
  ROUTES,
  IMAGE_FILE_ACCEPT,
  TOKEN_STORAGE_KEY,
} from "../../config/appConfig";
import { buttonHover, buttonTap, fadeUp } from "../../ui/motion";


function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state: AppState) => state.user);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileErrors, setProfileErrors] = useState<FormErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<FormErrors>({});
  const [avatarKey, setAvatarKey] = useState(Date.now());

  useEffect(() => {
    
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await usersApi.getProfile();
      setProfile(res.data);
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setEmail(res.data.email);
    } catch {
      setError("Failed to load profile");
    }
  };

  const handleUpdateProfile = async () => {
    setProfileErrors({});
    setError("");
    setMessage("");
    try {
      
      const data = updateProfileSchema.parse({ firstName, lastName, email });
      setLoading(true);
      const res = await usersApi.updateProfile(data);
      
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
      dispatch(tokenSlice.actions.initToken(res.data.token));
      dispatch(userSlice.actions.initUser(jwtDecode(res.data.token)));
      setMessage("Profile updated successfully");
    } catch (err: unknown) {
      if (err instanceof ZodError) setProfileErrors(getZodErrors(err));
      else if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await usersApi.updateAvatar(fd);
      setProfile((prev) =>
        prev ? { ...prev, avatar: res.data.avatar } : prev,
      );
      setAvatarKey(Date.now());
      setMessage("Avatar updated");
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to update avatar");
    }
  };

  const handleChangePassword = async () => {
    setPasswordErrors({});
    setError("");
    setMessage("");
    try {
      
      const data = changePasswordSchema.parse({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setLoading(true);
      await usersApi.changePassword(data);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully");
    } catch (err: unknown) {
      if (err instanceof ZodError) setPasswordErrors(getZodErrors(err));
      else if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await usersApi.deleteAccount();
      dispatch(userSlice.actions.logoutUser());
      dispatch(tokenSlice.actions.logoutToken());
      dispatch(vacationsSlice.actions.clearVacations());
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      navigate(ROUTES.login);
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div style={{ maxWidth: 672, margin: "0 auto", padding: "32px 24px" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: 24 }}
      >
        <Typography.Title level={2} style={{ color: "var(--text-primary)" }}>
          My Profile
        </Typography.Title>
      </motion.div>

      {message && (
        <Alert type="success" title={message} style={{ marginBottom: 16 }} />
      )}
      {error && (
        <Alert
          type="error"
          title={error}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Card
          title="Avatar"
          className="glass-surface"
          style={{ marginBottom: 24, borderRadius: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Avatar
              size={80}
              src={
                profile?.avatar
                  ? `${AVATAR_BASE_URL}/${profile.avatar}?t=${avatarKey}`
                  : undefined
              }
              style={{ backgroundColor: "var(--accent-solid)" }}
            >
              {authUser?.firstName?.[0]}
              {authUser?.lastName?.[0]}
            </Avatar>
            <label style={{ cursor: "pointer", display: "inline-block" }}>
              <span className="ant-btn ant-btn-default ghost-dark-button">
                Change Avatar
              </span>
              <input
                type="file"
                accept={IMAGE_FILE_ACCEPT}
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </Card>

        <Card
          title="Edit Profile"
          className="glass-surface"
          style={{ marginBottom: 24, borderRadius: 16 }}
        >
          <div>
            <Form layout="vertical" size="large" onFinish={handleUpdateProfile}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    validateStatus={
                      profileErrors.firstName ? "error" : undefined
                    }
                    help={profileErrors.firstName}
                  >
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    validateStatus={
                      profileErrors.lastName ? "error" : undefined
                    }
                    help={profileErrors.lastName}
                  >
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Email"
                validateStatus={profileErrors.email ? "error" : undefined}
                help={profileErrors.email}
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="primary-gradient-button"
                >
                  Update Profile
                </Button>
              </motion.div>
            </Form>
          </div>
        </Card>

        <Card
          title="Change Password"
          className="glass-surface"
          style={{ marginBottom: 24, borderRadius: 16 }}
        >
          <div>
            <Form
              layout="vertical"
              size="large"
              onFinish={handleChangePassword}
            >
              <Form.Item
                label="Current Password"
                validateStatus={
                  passwordErrors.currentPassword ? "error" : undefined
                }
                help={passwordErrors.currentPassword}
              >
                <Input.Password
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="New Password"
                validateStatus={
                  passwordErrors.newPassword ? "error" : undefined
                }
                help={passwordErrors.newPassword}
              >
                <Input.Password
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Confirm New Password"
                validateStatus={
                  passwordErrors.confirmPassword ? "error" : undefined
                }
                help={passwordErrors.confirmPassword}
              >
                <Input.Password
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="primary-gradient-button"
                >
                  Change Password
                </Button>
              </motion.div>
            </Form>
          </div>
        </Card>

        <Card
          title={<Typography.Text type="danger">Danger Zone</Typography.Text>}
          className="glass-surface"
          style={{ borderColor: "var(--danger-accent)", borderRadius: 16 }}
        >
          <Typography.Text
            style={{
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: 16,
            }}
          >
            Once you delete your account, there is no going back.
          </Typography.Text>
          <motion.div whileHover={buttonHover} whileTap={buttonTap}>
            <Button type="primary" danger onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Profile;
