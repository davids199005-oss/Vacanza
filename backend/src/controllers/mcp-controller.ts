/**
 * @fileoverview MCP controller: vacation Q&A via AI + MCP tools.
 * Layer: Controller — validates question, delegates to mcpService.
 * Notes:
 * - Endpoint is authenticated in router.
 * - Question text is validated and normalized before model call.
 */

import { Request, Response, NextFunction } from "express";
import { mcpService } from "../services/mcp-service.ts";
import { StatusCode } from "../enums/status-codes-enum.ts";
import { mcpQuestionSchema } from "../schemas/mcp-schema.ts";

class McpController {

    constructor() {
        this.askQuestion = this.askQuestion.bind(this);
        
    }

    public async askQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate incoming question payload.
            const { question } = mcpQuestionSchema.parse(req.body);
            // Delegate tool-augmented answer generation to service.
            const answer = await mcpService.askQuestion(question.trim());
            res.status(StatusCode.OK).json({ answer });
        } catch (error) {
            next(error);
        }
    }
}

export const mcpController = new McpController();