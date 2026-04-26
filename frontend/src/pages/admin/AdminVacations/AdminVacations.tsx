/**
 * @fileoverview Админская страница управления вакациями.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Список всех вакаций для администратора с возможностью добавить
 *   новую (кнопка) и операциями редактирования/удаления на каждой карточке.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Pages → admin/. Защищена AdminRoute (требует роль admin).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - useEffect: при пустом кеше — GET /api/vacations и заполнение Redux.
 *   - handleEdit(id): переход на страницу VacationForm в режиме редактирования.
 *   - handleDelete(id): подтверждение через window.confirm → DELETE → удаление
 *     из Redux-кеша через slice.deleteVacation.
 *   - Использует VacationCard в режиме showAdminActions (без like-кнопки).
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Button, Row, Col, Space, Typography, Flex, Alert } from "antd";
import { AppState } from "../../../redux/AppState";
import { vacationsSlice } from "../../../redux/VacationsSlice";
import { vacationsApi } from "../../../api/vacationsApi";
import VacationCard from "../../../components/VacationCard/VacationCard";
import { AxiosError } from "axios";
import { ROUTES } from "../../../config/appConfig";
import { buttonHover, buttonTap, fadeUp } from "../../../ui/motion";

/** Админская страница: список, редактирование и удаление вакаций. */
function AdminVacations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vacations = useSelector((state: AppState) => state.vacations);
  const [loading, setLoading] = useState(vacations.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Грузим вакации только если кеш в Redux пустой.
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

  // Действия над карточкой: переход к редактированию и удаление с подтверждением.
  const handleEdit = (id: number) => navigate(`/admin/vacations/${id}/edit`);
  const handleDelete = async (id: number) => {
    // Защита от случайного удаления — обязательное подтверждение.
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
