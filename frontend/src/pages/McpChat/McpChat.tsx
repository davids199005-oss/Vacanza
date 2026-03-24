/**
 * @fileoverview MCP chat page.
 * Layer: Page — question input, MCP answer via API.
 * Notes:
 * - Validates question text and renders markdown response from backend.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Card, Alert, Space, Typography } from "antd";
import { mcpApi } from "../../api/mcpApi";
import { mcpQuestionSchema } from "../../schemas/aiSchemas";
import { getZodErrors, FormErrors } from "../../utils/zodErrors";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import ReactMarkdown from "react-markdown";
import { buttonHover, buttonTap, fadeUp } from "../../ui/motion";

/** MCP chat form with question input and markdown answer. */
function McpChat() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({}); setError(""); setAnswer("");
        try {
            // Validate user question before API request.
            const data = mcpQuestionSchema.parse({ question });
            setLoading(true);
            const response = await mcpApi.ask(data.question);
            setAnswer(response.data.answer);
        } catch (err: unknown) {
            if (err instanceof ZodError) setFieldErrors(getZodErrors(err));
            else if (err instanceof AxiosError) setError(err.response?.data?.message || "Failed to get answer");
        } finally { setLoading(false); }
    };

    return (
        <div className="page-content" style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Typography.Title level={2} style={{ marginBottom: 8, color: "var(--text-primary)" }}>Ask About Vacations</Typography.Title>
                <Typography.Text style={{ color: "var(--text-secondary)", display: "block", marginBottom: 24 }}>
                    Ask any question about the vacations in our database.
                </Typography.Text>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <Space size="middle" style={{ width: "100%", marginBottom: 24 }} align="start">
                    <Space orientation="vertical" style={{ flex: 1 }} size={4}>
                        <Input
                            className="glass-surface"
                            placeholder="e.g., How many active vacations are there?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            status={fieldErrors.question ? "error" : undefined}
                        />
                        {fieldErrors.question && (
                            <Typography.Text type="danger" style={{ fontSize: 12 }}>{fieldErrors.question}</Typography.Text>
                        )}
                    </Space>
                    <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                        <Button type="primary" htmlType="submit" loading={loading} className="primary-gradient-button">
                            {loading ? "Thinking..." : "Ask"}
                        </Button>
                    </motion.div>
                </Space>
            </form>

            {error && <Alert type="error" title={error} style={{ marginBottom: 16 }} />}

            {answer && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Card className="glass-surface" style={{ paddingTop: 24, borderRadius: 16 }}>
                        <div className="markdown-content">
                            <ReactMarkdown>{answer}</ReactMarkdown>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}

export default McpChat;
