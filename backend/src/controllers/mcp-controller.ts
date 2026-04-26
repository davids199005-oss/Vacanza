/**
 * @fileoverview Контроллер MCP-эндпоинта Q&A.
 *
 * НАЗНАЧЕНИЕ ФАЙЛА:
 *   HTTP-обработчик POST /api/mcp/ask. Принимает текстовый вопрос и
 *   возвращает ответ, синтезированный через LLM с использованием MCP-инструментов
 *   (доступ к данным БД через MCP-сервер).
 *
 * РОЛЬ В АРХИТЕКТУРЕ:
 *   Слой Controller. Эндпоинт защищён аутентификацией (проверяется в роутере).
 *
 * ЧТО ИМЕННО ДЕЛАЕТ:
 *   - Валидирует тело запроса схемой mcpQuestionSchema (длина 2..500).
 *   - Тримит question перед передачей в сервис.
 *   - Делегирует генерацию ответа в mcpService.askQuestion.
 *   - Возвращает 200 OK + { answer: <строка-ответ модели> }.
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
            // Валидируем входной payload.
            const { question } = mcpQuestionSchema.parse(req.body);
            // Делегируем сервису генерацию ответа с использованием tools.
            const answer = await mcpService.askQuestion(question.trim());
            res.status(StatusCode.OK).json({ answer });
        } catch (error) {
            next(error);
        }
    }
}

export const mcpController = new McpController();
