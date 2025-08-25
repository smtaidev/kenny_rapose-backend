import { ZodError } from 'zod';

const handleZodError = (error: ZodError) => {
  const errors = error.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;
  const message = 'Validation Error';
  const errorDetails = errors;

  return {
    statusCode,
    message,
    errorDetails,
  };
};

export default handleZodError;
