export type ErrorCode =
  | "COUNTRY_NOT_SUPPORTED"
  | "INVALID_DATE"
  | "INVALID_YEAR"
  | "SERVICE_UNAVAILABLE"
  | "RATE_LIMIT_EXCEEDED"
  | "INVALID_PARAMETER"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  code: ErrorCode;
  status: number;
  constructor(code: ErrorCode, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message = "Holiday data service temporarily unavailable") {
    super("SERVICE_UNAVAILABLE", message, 503);
  }
}
