class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // When new obj is created , constructor is called,
    // that func will not appear in stack trace and polute it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
