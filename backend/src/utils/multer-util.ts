/**
 * @fileoverview Multer configuration for vacation images and user avatars.
 * Layer: Util — file upload, validation (JPEG/PNG/WEBP), storage paths.
 * Notes:
 * - Creates upload directories on startup if missing.
 * - Uses distinct storage targets for vacations and avatars.
 */

import fs from "fs";
import path from "path";
import multer from "multer";

const VACATIONS_DIR = path.join(process.cwd(), "assets/images/vacations");
const AVATARS_DIR = path.join(process.cwd(), "assets/images/avatars");

export const INVALID_IMAGE_FORMAT_ERROR = "Only JPEG, PNG, WEBP images are allowed";

/** MIME type to file extension mapping. */
const MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

// Ensure upload directories exist
if (!fs.existsSync(VACATIONS_DIR)) {
    fs.mkdirSync(VACATIONS_DIR, { recursive: true });
}
if (!fs.existsSync(AVATARS_DIR)) {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

/** Rejects non-image files; allows only JPEG, PNG, WEBP. */
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (/^image\/(jpeg|png|webp)$/i.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(INVALID_IMAGE_FORMAT_ERROR));
    }
};

const generateFilename = (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Use timestamp + random suffix to reduce filename collisions.
    const ext = MIME_TO_EXT[file.mimetype] ?? ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
};

/** Storage for vacation images (assets/images/vacations). */
const vacationStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, VACATIONS_DIR),
    filename: generateFilename,
});

/** Storage for avatars (assets/images/avatars). */
const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
    filename: generateFilename,
});

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

/** Multer middleware for vacation images; field name "image". */
export const uploadVacationImage = multer({
    storage: vacationStorage,
    limits,
    fileFilter,
}).single("image");

/** Multer middleware for avatars; field name "avatar". */
export const uploadAvatar = multer({
    storage: avatarStorage,
    limits,
    fileFilter,
}).single("avatar");
