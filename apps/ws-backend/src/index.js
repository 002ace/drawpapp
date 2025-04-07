"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const config_1 = require("@repo/backend-common/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", function connection(ws, request) {
    const url = request.url;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const token = queryParams.get("token") || "";
    const decode = jsonwebtoken_1.default.verify(token, config_1.jwt_secret);
    if (typeof decode == "string") {
        ws.close();
        return;
    }
    if (!decode || !decode.userId) {
        ws.close();
        return;
    }
    ws.on("message", function message(data) {
        ws.send("pongcd ");
    });
});
