/**
 * @fileoverview Add/Edit vacation form (admin).
 * Layer: Page — create or update vacation with schema validation.
 * Notes:
 * - Supports both create and update modes based on route param.
 * - Uses separate schema behavior for add vs edit date constraints.
 */

import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Button, Card, Input, Row, Col, Space, Typography, Alert } from "antd";
import type { FormErrors } from "../../../utils/zodErrors";
import { AppState } from "../../../redux/AppState";
import { vacationsSlice } from "../../../redux/VacationsSlice";
import { vacationsApi } from "../../../api/vacationsApi";
import {
  addVacationSchema,
  updateVacationSchema,
} from "../../../schemas/vacationSchemas";
import { getZodErrors } from "../../../utils/zodErrors";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import { VACATION_IMAGE_BASE_URL, ROUTES } from "../../../config/constants";
import { buttonHover, buttonTap, fadeUp } from "../../../ui/motion";

const { TextArea } = Input;

/** Add or edit vacation form; schema varies by mode (add vs update). */
function VacationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vacations = useSelector((state: AppState) => state.vacations);

  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  useEffect(() => {
    // Preload vacations when editing and cache is empty.
    if (isEdit && vacations.length === 0) {
      vacationsApi
        .getAll()
        .then((res) => dispatch(vacationsSlice.actions.initVacations(res.data)))
        .catch(() => {});
    }
  }, [isEdit, vacations.length, dispatch]);

  useEffect(() => {
    // Populate form fields from selected vacation in edit mode.
    if (isEdit && id) {
      const v = vacations.find((v) => v.id === Number(id));
      if (v) {
        setDestination(v.destination);
        setDescription(v.description);
        setStartDate(v.startDate.split("T")[0]);
        setEndDate(v.endDate.split("T")[0]);
        setPrice(String(Number(v.price)));
        setCurrentImage(v.image);
      }
    }
  }, [isEdit, id, vacations]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError("");
    try {
      // Validate form data with mode-specific schema.
      (isEdit ? updateVacationSchema : addVacationSchema).parse({
        destination,
        description,
        startDate,
        endDate,
        price: Number(price),
      });
    } catch (err) {
      if (err instanceof ZodError) {
        setFieldErrors(getZodErrors(err));
        return;
      }
    }
    // Image is mandatory only on create.
    if (!isEdit && !image) {
      setFieldErrors({ image: "Image is required" });
      return;
    }

    setLoading(true);
    // Build multipart payload for backend.
    const fd = new FormData();
    fd.append("destination", destination);
    fd.append("description", description);
    fd.append("startDate", startDate);
    fd.append("endDate", endDate);
    fd.append("price", price);
    if (image) fd.append("image", image);
    try {
      if (isEdit && id) {
        await vacationsApi.update(Number(id), fd);
      } else {
        await vacationsApi.add(fd);
      }
      const res = await vacationsApi.getAll();
      dispatch(vacationsSlice.actions.initVacations(res.data));
      navigate(ROUTES.adminVacations);
    } catch (err: unknown) {
      if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-content"
      style={{ maxWidth: 672, margin: "0 auto", padding: 32 }}
    >
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Card
          className="glass-surface"
          style={{ borderRadius: 16 }}
          title={
            <Typography.Title
              level={2}
              style={{ margin: 0, color: "var(--text-primary)" }}
            >
              {isEdit ? "Edit Vacation" : "Add Vacation"}
            </Typography.Title>
          }
        >
          {error && (
            <Alert type="error" title={error} style={{ marginBottom: 16 }} />
          )}
          <form onSubmit={handleSubmit}>
            <Space
              orientation="vertical"
              size="middle"
              style={{ width: "100%" }}
            >
              <div>
                <Typography.Text strong>Destination</Typography.Text>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  status={fieldErrors.destination ? "error" : undefined}
                  style={{ marginTop: 4 }}
                />
                {fieldErrors.destination && (
                  <Typography.Text type="danger" style={{ fontSize: 12 }}>
                    {fieldErrors.destination}
                  </Typography.Text>
                )}
              </div>
              <div>
                <Typography.Text strong>Description</Typography.Text>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  status={fieldErrors.description ? "error" : undefined}
                  rows={4}
                  style={{ marginTop: 4 }}
                />
                {fieldErrors.description && (
                  <Typography.Text type="danger" style={{ fontSize: 12 }}>
                    {fieldErrors.description}
                  </Typography.Text>
                )}
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Typography.Text strong>Start Date</Typography.Text>
                  <Input
                    type="date"
                    className="date-input-styled"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    status={fieldErrors.startDate ? "error" : undefined}
                    style={{ marginTop: 4, width: "100%" }}
                  />
                  {fieldErrors.startDate && (
                    <Typography.Text type="danger" style={{ fontSize: 12 }}>
                      {fieldErrors.startDate}
                    </Typography.Text>
                  )}
                </Col>
                <Col span={12}>
                  <Typography.Text strong>End Date</Typography.Text>
                  <Input
                    type="date"
                    className="date-input-styled"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    status={fieldErrors.endDate ? "error" : undefined}
                    style={{ marginTop: 4, width: "100%" }}
                  />
                  {fieldErrors.endDate && (
                    <Typography.Text type="danger" style={{ fontSize: 12 }}>
                      {fieldErrors.endDate}
                    </Typography.Text>
                  )}
                </Col>
              </Row>
              <div>
                <Typography.Text strong>Price ($)</Typography.Text>
                <Input
                  type="number"
                  className="price-input-styled"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={1}
                  max={10000}
                  status={fieldErrors.price ? "error" : undefined}
                  style={{ marginTop: 4 }}
                />
                {fieldErrors.price && (
                  <Typography.Text type="danger" style={{ fontSize: 12 }}>
                    {fieldErrors.price}
                  </Typography.Text>
                )}
              </div>
              <div>
                <Typography.Text strong>
                  Image {isEdit && "(optional)"}
                </Typography.Text>
                {isEdit && currentImage && (
                  <img
                    src={`${VACATION_IMAGE_BASE_URL}/${currentImage}`}
                    alt="Current"
                    style={{
                      display: "block",
                      width: 192,
                      height: 128,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                )}
                <Input
                  type="file"
                  className="file-input-styled"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  status={fieldErrors.image ? "error" : undefined}
                  style={{ marginTop: 4 }}
                />
                {fieldErrors.image && (
                  <Typography.Text type="danger" style={{ fontSize: 12 }}>
                    {fieldErrors.image}
                  </Typography.Text>
                )}
              </div>
              <Space style={{ width: "100%", marginTop: 8 }} wrap>
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="primary-gradient-button"
                  >
                    {loading ? "Saving..." : isEdit ? "Update" : "Add Vacation"}
                  </Button>
                </motion.div>
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    className="ghost-dark-button"
                    onClick={() => navigate(ROUTES.adminVacations)}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </Space>
            </Space>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default VacationForm;
