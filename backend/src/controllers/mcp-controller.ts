

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
            
            const { question } = mcpQuestionSchema.parse(req.body);
            
            const answer = await mcpService.askQuestion(question.trim());
            res.status(StatusCode.OK).json({ answer });
        } catch (error) {
            next(error);
        }
    }
}

export const mcpController = new McpController();
