/**
 * @fileoverview Админская страница отчётов.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Показывает столбчатую диаграмму «Лайки по направлениям» (Recharts) и
 *   позволяет скачать данные в CSV-файл одним кликом.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Pages → admin/. Защищена AdminRoute. Использует кеш `vacations`
 *   из Redux (если он пуст — подгружает с сервера).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - useEffect: при пустом кеше — GET /api/vacations и заполнение Redux.
 *   - Преобразует список в формат `{destination, likes}` для Recharts.
 *   - Кнопка Download CSV вызывает exportToCsv(vacations) из utils.
 */

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Button, Card, Space, Typography } from "antd";
import { AppState } from "../../../redux/AppState";
import { vacationsSlice } from "../../../redux/VacationsSlice";
import { vacationsApi } from "../../../api/vacationsApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { exportToCsv } from "../../../utils/csvExport";
import { buttonHover, buttonTap, fadeUp } from "../../../ui/motion";

/** Страница отчётов: столбчатая диаграмма лайков и экспорт CSV. */
function Reports() {
  const dispatch = useDispatch();
  const vacations = useSelector((state: AppState) => state.vacations);

  useEffect(() => {
    // Подгружаем вакации, если страница отчётов открыта первой и кеш пуст.
    if (vacations.length === 0) {
      vacationsApi
        .getAll()
        .then((res) =>
          dispatch(vacationsSlice.actions.initVacations(res.data)),
        );
    }
  }, [dispatch, vacations.length]);

  // Преобразуем список в формат, ожидаемый Recharts (destination/likes).
  const chartData = vacations.map((v) => ({
    destination: v.destination,
    likes: v.likes,
  }));

  return (
    <div
      className="page-content"
      style={{ maxWidth: 1152, margin: "0 auto", padding: 32 }}
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
            Vacations Report
          </Typography.Title>
          <motion.div whileHover={buttonHover} whileTap={buttonTap}>
            <Button
              className="ghost-dark-button"
              onClick={() => exportToCsv(vacations)}
            >
              Download CSV
            </Button>
          </motion.div>
        </Space>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card
          title="Likes per destination"
          className="glass-surface"
          style={{ borderRadius: 16 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis
                dataKey="destination"
                tick={{ fontSize: 12, fill: "var(--chart-tick)" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--chart-tick)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--chart-tooltip-bg)",
                  border: "1px solid var(--chart-tooltip-border)",
                  color: "var(--chart-tooltip-text)",
                }}
                cursor={{ fill: "var(--chart-cursor)" }}
              />
              <Bar
                dataKey="likes"
                fill="var(--accent-start)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  );
}

export default Reports;
