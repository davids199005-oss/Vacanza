/**
 * @fileoverview Admin vacations management page.
 * Layer: Page — list vacations with edit/delete; admin only.
 * Notes:
 * - Uses shared vacations cache from Redux.
 * - Delete action updates state optimistically after successful API call.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Button, Row, Col, Space, Typography, Flex, Alert } from "antd";
import { AppState } from "../../../redux/appState";
import { vacationsSlice } from "../../../redux/vacationsSlice";
import { vacationsApi } from "../../../api/vacationsApi";
import VacationCard from "../../../components/VacationCard/vacationCard";
import { AxiosError } from "axios";
import { ROUTES } from "../../../config/appConfig";
import { buttonHover, buttonTap, fadeUp } from "../../../ui/motion";

/** Admin page to list, edit, and delete vacations. */
function AdminVacations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vacations = useSelector((state: AppState) => state.vacations);
  const [loading, setLoading] = useState(vacations.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch vacations only if cache is empty.
    if (vacations.length === 0) {
      vacationsApi
        .getAll()
        .then((res) => dispatch(vacationsSlice.actions.initVacations(res.data)))
        .catch((err) =>
          setError(err.response?.data?.message || "Failed to fetch"),
        )
        .finally(() => setLoading(false));
    }
  }, [dispatch, vacations.length]);

  // Navigate to edit form for selected vacation.
  const handleEdit = (id: number) => navigate(`/admin/vacations/${id}/edit`);
  const handleDelete = async (id: number) => {
    // Ask confirmation before destructive deletion.
    if (!window.confirm("Are you sure you want to delete this vacation?"))
      return;
    try {
      await vacationsApi.delete(id);
      dispatch(vacationsSlice.actions.deleteVacation(id));
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: 384 }}>
        <Typography.Text type="secondary">Loading...</Typography.Text>
      </Flex>
    );
  }
  if (error) {
    return (
      <Flex align="center" justify="center" style={{ height: 384 }}>
        <Alert type="error" title={error} showIcon />
      </Flex>
    );
  }

  return (
    <div
      className="page-content"
      style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}
    >
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
          wrap
        >
          <Typography.Title
            level={2}
            style={{ margin: 0, color: "var(--text-primary)" }}
          >
            Manage Vacations
          </Typography.Title>
          <motion.div whileHover={buttonHover} whileTap={buttonTap}>
            <Button
              type="primary"
              size="large"
              className="primary-gradient-button"
              onClick={() => navigate(ROUTES.adminVacationNew)}
            >
              + Add Vacation
            </Button>
          </motion.div>
        </Space>
      </motion.div>
      <Row gutter={[24, 24]}>
        {vacations.map((v) => (
          <Col xs={24} sm={12} lg={8} key={v.id}>
            <VacationCard
              vacation={v}
              showAdminActions
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default AdminVacations;
