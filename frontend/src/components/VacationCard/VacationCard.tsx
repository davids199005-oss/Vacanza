/**
 * @fileoverview Карточка вакации для пользовательских и админских списков.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Универсальная карточка одной вакации: изображение, цена, заголовок,
 *   обрезанное описание, диапазон дат и набор кнопок-действий, который
 *   зависит от пропсов (показывать ли лайк, показывать ли админ-операции).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Components. Один и тот же компонент используется в трёх разных
 *   местах: список Vacations (с лайком), Profile/Likes (с лайком), и
 *   AdminVacations (с кнопками Edit/Delete).
 *
 * ПРОПСЫ:
 *   - vacation         — данные карточки (обязательно).
 *   - showLikeButton   — показать кнопку лайка (для пользователя).
 *   - onLikeToggle     — обработчик переключения лайка.
 *   - showAdminActions — показать кнопки Edit/Delete (для админки).
 *   - onEdit/onDelete  — обработчики этих кнопок.
 *
 * ВАЖНО: в кнопках вызывается e.stopPropagation(), потому что вся карточка
 * кликабельна (открывает /vacations/:id), и без stop клик «протекал» бы
 * на карточку.
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, Button, Tag, Typography } from "antd";
import { VacationWithLikes } from "../../models/Vacation";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import {
  VACATION_IMAGE_BASE_URL,
  getVacationDetailsRoute,
} from "../../config/appConfig";
import { buttonHover, buttonTap, fadeUp } from "../../ui/motion";

/** Пропсы компонента VacationCard. */
interface VacationCardProps {
  vacation: VacationWithLikes;
  showLikeButton?: boolean;
  onLikeToggle?: (vacationId: number, isLiked: boolean) => void;
  showAdminActions?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

/** Карточка вакации с опциональными кнопками лайка и админ-действий. */
function VacationCard({
  vacation,
  showLikeButton = false,
  onLikeToggle,
  showAdminActions = false,
  onEdit,
  onDelete,
}: VacationCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Открываем страницу деталей по клику на карточку.
    navigate(getVacationDetailsRoute(vacation.id));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        hoverable
        className="glass-surface"
        style={{ overflow: "hidden", borderRadius: 16, cursor: "pointer" }}
        onClick={handleCardClick}
        cover={
          <div
            style={{ position: "relative", height: 208, overflow: "hidden" }}
          >
            <img
              src={`${VACATION_IMAGE_BASE_URL}/${vacation.image}`}
              alt={vacation.destination}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Tag
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                fontWeight: 700,
                fontSize: 14,
                padding: "4px 12px",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-accent)",
              }}
            >
              {formatPrice(vacation.price)}
            </Tag>
          </div>
        }
      >
        <Typography.Title
          level={5}
          style={{ marginBottom: 4, color: "var(--text-primary)" }}
        >
          {vacation.destination}
        </Typography.Title>
        <Typography.Text
          style={{
            color: "var(--text-secondary)",
            fontSize: 13,
            display: "block",
            marginBottom: 8,
          }}
        >
          {vacation.description.slice(0, 80)}
          {vacation.description.length > 80 ? "…" : ""}
        </Typography.Text>
        <Typography.Text
          style={{
            color: "var(--text-secondary)",
            fontSize: 12,
            display: "block",
            marginBottom: 16,
          }}
        >
          {formatDate(vacation.startDate)} — {formatDate(vacation.endDate)}
        </Typography.Text>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {/* Пользовательское действие: поставить/снять лайк (с e.stopPropagation). */}
          {showLikeButton && (
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Button
                type={vacation.isLiked ? "primary" : "default"}
                size="small"
                className={
                  vacation.isLiked
                    ? "primary-gradient-button"
                    : "ghost-dark-button"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onLikeToggle?.(vacation.id, vacation.isLiked);
                }}
              >
                {vacation.isLiked ? "❤️" : "🤍"} {vacation.likes}
              </Button>
            </motion.div>
          )}
          {/* Админские действия: редактирование и удаление вакации. */}
          {showAdminActions && (
            <>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  size="small"
                  className="ghost-dark-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(vacation.id);
                  }}
                >
                  Edit
                </Button>
              </motion.div>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  size="small"
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(vacation.id);
                  }}
                >
                  Delete
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default VacationCard;
