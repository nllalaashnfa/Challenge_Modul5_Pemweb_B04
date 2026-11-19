import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message = "Terjadi kesalahan pada server",
  statusCode = 500
) {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
}
