/**
 * @fileoverview AI recommendations page.
 * Layer: Page — destination input, AI-generated travel advice.
 * Notes:
 * - Sends destination to AI endpoint and renders markdown response.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Card, Alert, Space, Typography } from "antd";
import { recommendationsApi } from "../../api/recommendationsApi";
import { recommendationSchema } from "../../schemas/aiSchemas";
import { getZodErrors, FormErrors } from "../../utils/zodErrors";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import ReactMarkdown from "react-markdown";
import { buttonHover, buttonTap, fadeUp } from "../../ui/motion";

/** AI recommendations form with destination input and markdown result. */
function Recommendations() {
    const [destination, setDestination] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({}); setError(""); setRecommendation("");
        try {
            // Validate destination input before API request.
            const data = recommendationSchema.parse({ destination });
            setLoading(true);
            const response = await recommendationsApi.generate(data.destination);
            setRecommendation(response.data.recommendation);
        } catch (err: unknown) {
            if (err instanceof ZodError) setFieldErrors(getZodErrors(err));
            else if (err instanceof AxiosError) setError(err.response?.data?.message || "Failed to get recommendation");
        } finally { setLoading(false); }
    };

    return (
        <div className="page-content" style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Typography.Title level={2} style={{ marginBottom: 8, color: "var(--text-primary)" }}>AI Travel Recommendations</Typography.Title>
                <Typography.Text style={{ color: "var(--text-secondary)", display: "block", marginBottom: 24 }}>
                    Enter a destination and let AI plan your perfect trip.
                </Typography.Text>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <Space size="middle" style={{ width: "100%", marginBottom: 24 }} align="start">
                    <Space orientation="vertical" style={{ flex: 1 }} size={4}>
                        <Input
                            className="glass-surface"
                            placeholder="Enter a destination (e.g., Tokyo, Paris, Bali)"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            status={fieldErrors.destination ? "error" : undefined}
                        />
                        {fieldErrors.destination && (
                            <Typography.Text type="danger" style={{ fontSize: 12 }}>{fieldErrors.destination}</Typography.Text>
                        )}
                    </Space>
                    <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                        <Button type="primary" htmlType="submit" loading={loading} className="primary-gradient-button">
                            {loading ? "Generating..." : "Get Recommendation"}
                        </Button>
                    </motion.div>
                </Space>
            </form>

            {error && <Alert type="error" title={error} style={{ marginBottom: 16 }} />}

            {recommendation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Card className="glass-surface" style={{ paddingTop: 24, borderRadius: 16 }}>
                        <div className="markdown-content">
                            <ReactMarkdown>{recommendation}</ReactMarkdown>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}

export default Recommendations;
