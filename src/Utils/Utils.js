export const returnMessage = (field, error, message, success) => {
  return {
    field,
    error,
    message,
    success: success || false,
  };
};
