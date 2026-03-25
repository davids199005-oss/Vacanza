/**
 * @fileoverview About page.
 * Layer: Page — features, tech stack; accessible to all users.
 * Notes:
 * - Chooses navbar variant based on auth state.
 * - Renders feature cards and technology badges.
 */

import { Card, Typography, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AppState } from "../../redux/appState";
import { staggerContainer, staggerItem } from "../../ui/motion";
import Navbar from "../../components/Navbar/navbar";
import SimpleNavbar from "../../components/SimpleNavbar/simpleNavbar";
import Footer from "../../components/Footer/footer";

const features = [
  {
    icon: "🌍",
    title: "Explore Destinations",
    desc: "Browse stunning vacations from around the world",
  },
  {
    icon: "❤️",
    title: "Like & Save",
    desc: "Save your favorite vacations and track them easily",
  },
  {
    icon: "🤖",
    title: "AI Powered",
    desc: "Get personalized travel recommendations with AI",
  },
  {
    icon: "💬",
    title: "MCP Chat",
    desc: "Ask natural language questions about vacation data",
  },
  {
    icon: "📊",
    title: "Reports",
    desc: "View analytics and export data as CSV",
  },
  {
    icon: "🐳",
    title: "Docker Ready",
    desc: "Full containerized deployment with Docker Compose",
  },
];

const techStack = [
  { name: "React + TypeScript", role: "Frontend" },
  { name: "Node.js + Express", role: "Backend" },
  { name: "MySQL", role: "Database" },
  { name: "Redux Toolkit", role: "State Management" },
  { name: "Ant Design + Framer Motion", role: "UI & Motion" },
  { name: "OpenAI GPT", role: "AI Engine" },
  { name: "MCP Server", role: "DB Queries" },
  { name: "Zod", role: "Validation" },
];

/** About page with features and tech stack. Navbar varies by auth state. */
function About() {
  // Token determines whether the full navbar can be shown.
  const token = useSelector((state: AppState) => state.token);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Authenticated users get full navbar; guests see simple navbar. */}
      {token ? <Navbar /> : <SimpleNavbar />}
      <div
        style={{
          flex: 1,
          maxWidth: 960,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <Typography.Title
            level={1}
            style={{ marginBottom: 16, color: "var(--text-primary)" }}
          >
            About Vacanza
          </Typography.Title>
          <Typography.Text
            style={{
              color: "var(--text-secondary)",
              fontSize: 18,
              maxWidth: 672,
              display: "block",
              margin: "0 auto",
            }}
          >
            Vacanza is a modern vacation discovery platform where you can
            explore amazing travel destinations, like your favorites, and get
            personalized AI-powered travel recommendations.
          </Typography.Text>
        </motion.div>

        {/* Features section. */}
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: 24,
            color: "var(--text-primary)",
          }}
        >
          Features
        </Typography.Title>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Row gutter={[16, 16]}>
            {features.map((f, i) => (
              <Col xs={24} md={12} lg={8} key={f.title}>
                <motion.div variants={staggerItem}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <Card
                      className="glass-surface"
                      style={{ height: "100%", borderRadius: 16 }}
                    >
                      <span
                        style={{
                          fontSize: 32,
                          display: "block",
                          marginBottom: 12,
                        }}
                      >
                        {f.icon}
                      </span>
                      <Typography.Title
                        level={5}
                        style={{
                          marginBottom: 4,
                          color: "var(--text-primary)",
                        }}
                      >
                        {f.title}
                      </Typography.Title>
                      <Typography.Text
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {f.desc}
                      </Typography.Text>
                    </Card>
                  </motion.div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Tech stack section. */}
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
            marginTop: 48,
            marginBottom: 24,
            color: "var(--text-primary)",
          }}
        >
          Tech Stack
        </Typography.Title>
        <Row gutter={[12, 12]}>
          {techStack.map((t, i) => (
            <Col xs={12} md={6} key={t.name}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card
                  size="small"
                  className="glass-surface"
                  style={{ textAlign: "center", borderRadius: 14 }}
                >
                  <Typography.Text
                    strong
                    style={{ color: "var(--text-primary)", fontSize: 13 }}
                  >
                    {t.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text
                    style={{ color: "var(--text-secondary)", fontSize: 12 }}
                  >
                    {t.role}
                  </Typography.Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
      <Footer />
    </div>
  );
}

export default About;
