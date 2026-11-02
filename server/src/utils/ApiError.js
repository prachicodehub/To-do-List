export default class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }
}
