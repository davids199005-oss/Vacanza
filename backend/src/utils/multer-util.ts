

import fs from "fs";
import path from "path";
import multer from "multer";

const VACATIONS_DIR = path.join(process.cwd(), "assets/images/vacations");
const AVATARS_DIR = path.join(process.cwd(), "assets/images/avatars");

export const INVALID_IMAGE_FORMAT_ERROR = "Only JPEG, PNG, WEBP images are allowed";


const MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};


if (!fs.existsSync(VACATIONS_DIR)) {
    fs.mkdirSync(VACATIONS_DIR, { recursive: true });
}
if (!fs.existsSync(AVATARS_DIR)) {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
}


const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (/^image\/(jpeg|png|webp)$/i.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(INVALID_IMAGE_FORMAT_ERROR));
    }
};

const generateFilename = (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    
    const ext = MIME_TO_EXT[file.mimetype] ?? ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
};


const vacationStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, VACATIONS_DIR),
    filename: generateFilename,
});


const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
    filename: generateFilename,
});

const limits = { fileSize: 5 * 1024 * 1024 }; 


export const uploadVacationImage = multer({
    storage: vacationStorage,
    limits,
    fileFilter,
}).single("image");


export const uploadAvatar = multer({
    storage: avatarStorage,
    limits,
    fileFilter,
}).single("avatar");
