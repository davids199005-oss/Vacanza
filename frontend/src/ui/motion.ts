/**
 * @fileoverview Общие анимационные пресеты Framer Motion для всего UI.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Содержит набор переиспользуемых variants и transition-объектов,
 *   которые применяются на страницах и в компонентах для единого «почерка»
 *   анимаций (появление, hover/tap кнопок, stagger-каскады в сетках).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой UI. Импортируется страницами (Landing, Vacations, About и др.)
 *   и компонентами (VacationCard, Footer). Меняя значения здесь, можно
 *   синхронно скорректировать «настроение» анимации во всём приложении.
 *
 * ЭКСПОРТЫ:
 *   - fadeIn          — мягкое появление по прозрачности.
 *   - fadeScale       — появление + лёгкий zoom + подъём.
 *   - fadeUp          — появление снизу с опциональной задержкой через `custom`.
 *   - staggerContainer— контейнер для каскадного запуска children.
 *   - staggerItem     — элемент стаггер-сетки.
 *   - buttonHover     — микроанимация при ховере над кнопкой.
 *   - buttonTap       — микроанимация при нажатии на кнопку.
 */

import type { TargetAndTransition, Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    // Базовое появление: мягкая анимация прозрачности.
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeScale: Variants = {
  // Появление с масштабом: лёгкий zoom-in и подъём вверх.
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeUp: Variants = {
  // Появление снизу с опциональной задержкой через параметр `custom`.
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: custom * 0.08,
      ease: "easeOut",
    },
  }),
};

export const staggerContainer: Variants = {
  // Контейнер для каскадного запуска анимаций дочерних элементов.
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

export const staggerItem: Variants = {
  // Стандартное появление одной карточки в списке/сетке.
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const buttonHover: TargetAndTransition = {
  // Микроанимация при наведении: лёгкий подъём и масштабирование.
  y: -2,
  scale: 1.01,
  transition: { duration: 0.2, ease: "easeOut" as const },
};

export const buttonTap: TargetAndTransition = {
  // Микроанимация при нажатии: «продавливание» кнопки.
  y: 0,
  scale: 0.98,
  transition: { duration: 0.12, ease: "easeOut" as const },
};
