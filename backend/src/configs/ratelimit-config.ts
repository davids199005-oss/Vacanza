

import rateLimit from "express-rate-limit";


export const globalRateLimit = rateLimit({
    
    windowMs: 15 * 60 * 1000,
    
    max: 1000,
    
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});


export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    
    message: { message: "Too many login attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});


export const recommendationsRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    
    
    message: { message: "Too many AI requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});


export const mcpRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    
    
    message: { message: "Too many MCP requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
