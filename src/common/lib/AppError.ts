type AppErrorType = "unauthorized";

class AppError extends Error {
  type: AppErrorType;
  constructor(type: AppErrorType) {
    super(type);
    this.type = type;
  }
}

export default AppError;
