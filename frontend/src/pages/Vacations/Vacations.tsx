/**
 * @fileoverview Vacations list page.
 * Layer: Page — fetch, filter, paginate, like toggle.
 * Notes:
 * - Uses Redux as cache to avoid unnecessary refetch.
 * - Applies filters and pagination on client side.
 */

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Row, Col, Spin, Alert, Space } from "antd";
import { motion } from "framer-motion";
import { AppState } from "../../redux/AppState";
import { vacationsSlice } from "../../redux/VacationsSlice";
import { vacationsApi } from "../../api/vacationsApi";
import VacationCard from "../../components/VacationCard/VacationCard";
import { AxiosError } from "axios";
import { buttonHover, buttonTap, fadeUp } from "../../ui/motion";

type FilterType = "all" | "liked" | "active" | "upcoming";
const ITEMS_PER_PAGE = 9;
const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "liked", label: "Liked" },
  { key: "active", label: "Active Now" },
  { key: "upcoming", label: "Upcoming" },
];

/** Vacations list with filters (all, liked, active, upcoming) and pagination. */
function Vacations() {
  const dispatch = useDispatch();
  const vacations = useSelector((state: AppState) => state.vacations);
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(vacations.length === 0);
  const [error, setError] = useState("");

  // Fetch once when cache is empty.
  useEffect(() => {
    if (vacations.length === 0) {
      vacationsApi
        .getAll()
        .then((res) => dispatch(vacationsSlice.actions.initVacations(res.data)))
        .catch((err) =>
          setError(err.response?.data?.message || "Failed to fetch vacations"),
        )
        .finally(() => setLoading(false));
    }
  }, [dispatch, vacations.length]);

  const filteredVacations = useMemo(() => {
    // Derive filtered list from active tab.
    const now = new Date();
    switch (filter) {
      case "liked":
        return vacations.filter((v) => v.isLiked);
      case "active":
        return vacations.filter(
          (v) => new Date(v.startDate) <= now && new Date(v.endDate) >= now,
        );
      case "upcoming":
        return vacations.filter((v) => new Date(v.startDate) > now);
      default:
        return vacations;
    }
  }, [vacations, filter]);

  const totalPages = Math.ceil(filteredVacations.length / ITEMS_PER_PAGE);
  const paginatedVacations = filteredVacations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleLikeToggle = async (vacationId: number, isLiked: boolean) => {
    try {
      // Toggle on server, then sync local Redux state.
      if (isLiked) await vacationsApi.removeLike(vacationId);
      else await vacationsApi.addLike(vacationId);
      dispatch(
        vacationsSlice.actions.toggleLike({ vacationId, isLiked: !isLiked }),
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to toggle like");
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 384,
        }}
      >
        <Spin size="large" description="Loading vacations..." />
      </div>
    );
  if (error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 384,
        }}
      >
        <Alert type="error" title={error} showIcon />
      </div>
    );

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{ marginBottom: 32 }}
      >
        <Typography.Title
          level={2}
          style={{ marginBottom: 24, color: "var(--text-primary)" }}
        >
          Vacations
        </Typography.Title>
        <Space wrap size="small">
          {filters.map((f) => (
            <motion.div
              key={f.key}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Button
                type={filter === f.key ? "primary" : "default"}
                size="small"
                className={
                  filter === f.key
                    ? "primary-gradient-button"
                    : "ghost-dark-button"
                }
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                style={{ borderRadius: 9999 }}
              >
                {f.label}
              </Button>
            </motion.div>
          ))}
        </Space>
      </motion.div>

      <Row gutter={[24, 24]}>
        {paginatedVacations.map((vacation) => (
          <Col xs={24} md={12} lg={8} key={vacation.id}>
            <VacationCard
              vacation={vacation}
              showLikeButton
              onLikeToggle={handleLikeToggle}
            />
          </Col>
        ))}
      </Row>

      {filteredVacations.length === 0 && (
        <Typography.Text
          style={{
            color: "var(--text-secondary)",
            display: "block",
            textAlign: "center",
            padding: 64,
          }}
        >
          No vacations found for this filter.
        </Typography.Text>
      )}

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            marginTop: 40,
          }}
        >
          <motion.div whileHover={buttonHover} whileTap={buttonTap}>
            <Button
              className="ghost-dark-button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
          </motion.div>
          <Typography.Text style={{ color: "var(--text-secondary)" }}>
            Page {page} of {totalPages}
          </Typography.Text>
          <motion.div whileHover={buttonHover} whileTap={buttonTap}>
            <Button
              className="ghost-dark-button"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Vacations;
