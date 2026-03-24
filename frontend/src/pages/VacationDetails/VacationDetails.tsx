/**
 * @fileoverview Vacation detail page.
 * Layer: Page — single vacation view with like, status, dates.
 * Notes:
 * - Reads selected vacation from Redux cache by route param id.
 * - Falls back to API fetch when page is opened directly.
 */

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Tag, Typography, Spin, Alert } from "antd";
import { motion } from "framer-motion";
import { AppState } from "../../redux/AppState";
import { vacationsSlice } from "../../redux/VacationsSlice";
import { vacationsApi } from "../../api/vacationsApi";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { VACATION_IMAGE_BASE_URL, ROUTES } from "../../config/constants";
import { AxiosError } from "axios";
import { buttonHover, buttonTap, fadeUp } from "../../ui/motion";

/** Vacation detail page with status tag, dates, description, and like button. */
function VacationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vacations = useSelector((state: AppState) => state.vacations);
  const [error, setError] = useState("");

  const vacationId = Number(id);

  const vacation = useMemo(() => {
    if (!Number.isFinite(vacationId)) return null;
    return vacations.find((v) => v.id === vacationId) ?? null;
  }, [vacations, vacationId]);

  const loading = vacations.length === 0 && !error;

  // Fetch vacations if not cached (e.g. direct URL)
  useEffect(() => {
    if (vacations.length !== 0) return;

    vacationsApi
      .getAll()
      .then((res) => {
        dispatch(vacationsSlice.actions.initVacations(res.data));
      })
      .catch(() => setError("Failed to load vacation"));
  }, [vacations.length, dispatch]);

  const handleLikeToggle = async () => {
    if (!vacation) return;
    try {
      // Toggle like server-side and update Redux snapshot.
      if (vacation.isLiked) await vacationsApi.removeLike(vacation.id);
      else await vacationsApi.addLike(vacation.id);
      const newLiked = !vacation.isLiked;
      dispatch(
        vacationsSlice.actions.toggleLike({
          vacationId: vacation.id,
          isLiked: newLiked,
        }),
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to toggle like");
    }
  };

  const getStatus = () => {
    // Derive status tag by comparing current date with vacation range.
    if (!vacation) return null;
    const now = new Date();
    const start = new Date(vacation.startDate);
    const end = new Date(vacation.endDate);
    if (end < now)
      return {
        label: "Completed",
        color: "var(--status-completed-bg)",
        textColor: "var(--status-completed-text)",
      };
    if (start <= now && end >= now)
      return {
        label: "Active Now",
        color: "var(--status-active-bg)",
        textColor: "var(--status-active-text)",
      };
    return {
      label: "Upcoming",
      color: "var(--status-upcoming-bg)",
      textColor: "var(--status-upcoming-text)",
    };
  };
  const status = getStatus();

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Alert type="error" title={error} showIcon />
      </div>
    );
  if (!vacation)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Alert type="warning" title="Vacation not found" showIcon />
      </div>
    );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
      {/* Back button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
          style={{ display: "inline-block", marginBottom: 24 }}
        >
          <Button
            className="ghost-dark-button"
            onClick={() => navigate(ROUTES.vacations)}
          >
            ← Back to Vacations
          </Button>
        </motion.div>
      </motion.div>

      {/* Hero image */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 32,
        }}
      >
        <img
          src={`${VACATION_IMAGE_BASE_URL}/${vacation.image}`}
          alt={vacation.destination}
          style={{
            width: "100%",
            height: 420,
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--overlay-dark) 0%, transparent 52%)",
          }}
        />

        {/* Overlay content */}
        <div style={{ position: "absolute", bottom: 24, left: 28, right: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            {status && (
              <Tag
                style={{
                  background: status.color,
                  color: status.textColor,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  padding: "4px 14px",
                }}
              >
                {status.label}
              </Tag>
            )}
            <Tag
              style={{
                fontWeight: 700,
                fontSize: 16,
                padding: "6px 16px",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-accent)",
              }}
            >
              {formatPrice(vacation.price)}
            </Tag>
          </div>
          <Typography.Title
            level={1}
            style={{ margin: 0, color: "var(--hero-title)", fontSize: 36 }}
          >
            {vacation.destination}
          </Typography.Title>
        </div>
      </motion.div>

      {/* Details grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
      >
        <div
          className="glass-surface"
          style={{ borderRadius: 16, padding: 28, marginBottom: 24 }}
        >
          {/* Dates row */}
          <div
            style={{
              display: "flex",
              gap: 32,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <Typography.Text
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  display: "block",
                }}
              >
                Start Date
              </Typography.Text>
              <Typography.Text
                strong
                style={{ color: "var(--text-primary)", fontSize: 16 }}
              >
                {formatDate(vacation.startDate)}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  display: "block",
                }}
              >
                End Date
              </Typography.Text>
              <Typography.Text
                strong
                style={{ color: "var(--text-primary)", fontSize: 16 }}
              >
                {formatDate(vacation.endDate)}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  display: "block",
                }}
              >
                Duration
              </Typography.Text>
              <Typography.Text
                strong
                style={{ color: "var(--text-primary)", fontSize: 16 }}
              >
                {Math.ceil(
                  (new Date(vacation.endDate).getTime() -
                    new Date(vacation.startDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                days
              </Typography.Text>
            </div>
            <div>
              <Typography.Text
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  display: "block",
                }}
              >
                Likes
              </Typography.Text>
              <Typography.Text
                strong
                style={{ color: "var(--text-primary)", fontSize: 16 }}
              >
                {vacation.likes} {vacation.likes === 1 ? "person" : "people"}
              </Typography.Text>
            </div>
          </div>

          {/* Description */}
          <Typography.Title
            level={4}
            style={{ color: "var(--text-primary)", marginBottom: 12 }}
          >
            About this trip
          </Typography.Title>
          <Typography.Paragraph
            style={{
              color: "var(--text-secondary)",
              fontSize: 15,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {vacation.description}
          </Typography.Paragraph>
        </div>
      </motion.div>

      {/* Like button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={3}
      >
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
          style={{ display: "inline-block" }}
        >
          <Button
            type={vacation.isLiked ? "primary" : "default"}
            size="large"
            className={
              vacation.isLiked ? "primary-gradient-button" : "ghost-dark-button"
            }
            onClick={handleLikeToggle}
            style={{ borderRadius: 12, padding: "8px 24px", fontSize: 16 }}
          >
            {vacation.isLiked ? "❤️ Liked" : "🤍 Like this trip"} ·{" "}
            {vacation.likes}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default VacationDetails;
