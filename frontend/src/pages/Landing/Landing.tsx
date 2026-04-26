/**
 * @fileoverview Лендинговая страница продукта Vacanza.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   Публичная посадочная страница, которую пользователь видит первой,
 *   попадая на корень сайта (/). Обзор продукта, преимуществ и направлений,
 *   плюс CTA на регистрацию/логин.
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Pages. Самостоятельная композиция (без общего Layout/Navbar) —
 *   собственный footer и собственная стилизация (`Landing.css`).
 *
 * СТРУКТУРА:
 *   - Hero-секция: заголовок, подзаголовок, CTA-кнопки и карточки статистики.
 *   - Секция Features: 4 ценностных блока продукта.
 *   - Секция Gallery: визуальные карточки направлений (5 локаций).
 *   - Финальный CTA-блок (повторно зовёт зарегистрироваться).
 *   - Footer с публичными ссылками (About / Sign In / Register).
 *
 * Для анимаций используется Framer Motion (staggerContainer/staggerItem,
 * fadeUp, плавающая floatingTransition для статистических карточек).
 */

import { Link } from "react-router-dom";
import { Button, Col, Row, Space, Typography } from "antd";
import { motion } from "framer-motion";
import { ROUTES } from "../../config/appConfig";
import landing1Img from "../../assets/landing1.jpg";
import landing2Img from "../../assets/landing2.jpg";
import landing3Img from "../../assets/landing3.jpg";
import landing4Img from "../../assets/landing4.jpg";
import landing5Img from "../../assets/landing5.jpeg";
import {
  buttonHover,
  buttonTap,
  fadeUp,
  staggerContainer,
  staggerItem,
} from "../../ui/motion";
import "../../ui/Landing.css";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type Stat = {
  value: string;
  label: string;
};

type GalleryItem = {
  image: string;
  title: string;
  subtitle: string;
  accent: "warm" | "cool" | "violet";
};

const features: Feature[] = [
  {
    icon: "1",
    title: "Curated destinations",
    description:
      "Explore handpicked places designed for memorable city breaks, nature retreats, and luxury escapes.",
  },
  {
    icon: "2",
    title: "AI smart planning",
    description:
      "Get route ideas, personalized timing, and tailored activity suggestions based on your travel style.",
  },
  {
    icon: "3",
    title: "Favorites and sharing",
    description:
      "Save dream places, organize shortlists, and share a refined trip board with your travel companions.",
  },
  {
    icon: "4",
    title: "One elegant workflow",
    description:
      "Move from discovery to decision in one polished experience built for speed and confidence.",
  },
];

const stats: Stat[] = [
  { value: "120+", label: "Premium destinations" },
  { value: "95k+", label: "Travelers inspired" },
  { value: "4.9/5", label: "Average experience score" },
];

const galleryItems: GalleryItem[] = [
  {
    image: landing1Img,
    title: "Madrid",
    subtitle: "City of art and culture",
    accent: "warm",
  },
  {
    image: landing2Img,
    title: "Moscow",
    subtitle: "Kremlin and Red Square",
    accent: "cool",
  },
  {
    image: landing3Img,
    title: "Jaffa",
    subtitle: "Old town with beautiful views",
    accent: "violet",
  },
  {
    image: landing4Img,
    title: "Haifa",
    subtitle: "The city of the flowers",
    accent: "cool",
  },
  {
    image: landing5Img,
    title: "Prague",
    subtitle: "Evening reflections",
    accent: "warm",
  },
];

// Общий transition для "плавающей" анимации карточек статистики.
const floatingTransition = {
  duration: 8.0,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
};

function Landing() {
  return (
    <div className="app-shell landing-page">
      <div className="landing-page__noise" />

      {/* Hero-секция: первое впечатление, ключевой оффер и CTA-кнопки. */}
      <section className="landing-hero">
        <div className="landing-hero__media" aria-hidden="true">
          <img src={landing5Img} alt="" className="landing-hero__image" />
          <div className="landing-hero__overlay" />
          <div className="landing-hero__orb landing-hero__orb--one" />
          <div className="landing-hero__orb landing-hero__orb--two" />
        </div>

        <div className="landing-section landing-hero__content">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="landing-pill-wrap"
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ duration: 0.25 }}
          >
            <span className="landing-pill">Luxury travel platform</span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <Typography.Title level={1} className="landing-hero__title">
              We plan your travel
              <span className="accent-gradient-text"> to perfection</span>
            </Typography.Title>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="landing-hero__description"
          >
            Vacanza is a travel planning platform that helps you plan your
            vacation to the best destinations in the world.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="landing-hero__actions"
          >
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Button
                type="primary"
                size="large"
                className="primary-gradient-button landing-action-button"
              >
                <Link to={ROUTES.register} className="landing-link-reset">
                  Start Planning
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Button
                size="large"
                className="ghost-dark-button landing-action-button"
              >
                <Link to={ROUTES.login} className="landing-link-reset">
                  Login
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="landing-hero__stats"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="landing-stat-card"
                animate={{ y: [0, index % 2 === 0 ? -6 : -4, 0] }}
                transition={{ ...floatingTransition, delay: index * 0.35 }}
              >
                <Typography.Text className="landing-stat-card__value">
                  {stat.value}
                </Typography.Text>
                <Typography.Text className="landing-stat-card__label">
                  {stat.label}
                </Typography.Text>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="landing-scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <span />
        </motion.div>
      </section>

      {/* Секция преимуществ: ценностные блоки продукта. */}
      <section className="landing-section">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            variants={staggerItem}
            className="landing-section__heading"
          >
            <Typography.Title level={2} className="landing-section__title">
              Designed for premium travel decisions
            </Typography.Title>
            <Typography.Text className="landing-section__subtitle">
              A modern travel workflow that combines inspiration, smart
              recommendations, and confidence at every step.
            </Typography.Text>
          </motion.div>

          <Row gutter={[20, 20]}>
            {features.map((feature) => (
              <Col xs={24} md={12} key={feature.title}>
                <motion.article
                  variants={staggerItem}
                  className="landing-feature-card"
                  whileHover={{ y: -8, scale: 1.01, rotateX: 2 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <span className="landing-feature-card__index">
                    {feature.icon}
                  </span>
                  <Typography.Title
                    level={4}
                    className="landing-feature-card__title"
                  >
                    {feature.title}
                  </Typography.Title>
                  <Typography.Text className="landing-feature-card__description">
                    {feature.description}
                  </Typography.Text>
                </motion.article>
              </Col>
            ))}
          </Row>
        </motion.div>
      </section>

      {/* Секция галереи: визуальные примеры направлений. */}
      <section className="landing-section">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={staggerItem}
            className="landing-section__heading"
          >
            <Typography.Title level={2} className="landing-section__title">
              Explore the best destinations in the world
            </Typography.Title>
            <Typography.Text className="landing-section__subtitle">
              Our platform is designed to help you plan your vacation to the
              best destinations in the world.
            </Typography.Text>
          </motion.div>

          <div className="landing-gallery">
            {galleryItems.map((item, index) => (
              <motion.article
                key={item.title}
                className={`landing-gallery-card landing-gallery-card--${item.accent}`}
                variants={staggerItem}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, scale: 1.015 }}
              >
                <div className="landing-gallery-card__media">
                  <img src={item.image} alt={`${item.title} destination`} />
                </div>
                <div className="landing-gallery-card__meta">
                  <Typography.Text className="landing-gallery-card__eyebrow"></Typography.Text>
                  <Typography.Title
                    level={4}
                    className="landing-gallery-card__title"
                  >
                    {item.title}
                  </Typography.Title>
                  <Typography.Text className="landing-gallery-card__subtitle">
                    {item.subtitle}
                  </Typography.Text>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Финальный CTA для перехода к регистрации. */}
      <section className="landing-cta">
        <motion.div
          className="landing-cta__panel"
          initial={{ opacity: 0, y: 28, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <motion.div
            className="landing-cta__sparkle"
            aria-hidden="true"
            animate={{ x: ["-120%", "140%"] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 1.8,
              ease: "easeInOut",
            }}
          />
          <Typography.Title level={5} className="landing-cta__title">
            Build your next extraordinary trip
          </Typography.Title>
          <Typography.Text className="landing-cta__subtitle">
            Join travelers who plan faster, choose better destinations, and
            enjoy a premium booking journey.
          </Typography.Text>
          <motion.div whileHover={buttonHover} whileTap={buttonTap}>
            <Button
              type="primary"
              size="large"
              className="primary-gradient-button landing-action-button"
            >
              <Link to={ROUTES.register} className="landing-link-reset">
                Let's start planning your dream vacation
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Нижняя навигация лендинга (публичные ссылки). */}
      <footer className="landing-footer">
        <div className="landing-footer__col landing-footer__col--left">
          <Typography.Text strong className="landing-footer__brand">
            Vacanza
          </Typography.Text>
        </div>

        <div className="landing-footer__col landing-footer__col--center">
          <Space size="large">
            <Link to={ROUTES.about} className="landing-footer__link">
              About
            </Link>
            <Link to={ROUTES.login} className="landing-footer__link">
              Sign In
            </Link>
            <Link to={ROUTES.register} className="landing-footer__link">
              Register
            </Link>
          </Space>
        </div>

        <div className="landing-footer__col landing-footer__col--right">
          <Typography.Text className="landing-footer__copy">
            &copy; {new Date().getFullYear()} Vacanza. All rights reserved.
          </Typography.Text>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
