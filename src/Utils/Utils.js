export const returnMessage = (field, error, message, success) => {
  return {
    field,
    error,
    message,
    success: success || false,
  };
};

export const checkMissingRequiredFields = (data, clientRequiredFields) => {
  const missingFields = clientRequiredFields.filter((field) => {
    return (
      data[field] === undefined || data[field] === null || data[field] === ''
    );
  });

  if (missingFields.length > 0) {
    return {
      success: false,
      errors: `Os campos ${missingFields} são obrigatórios.`,
    };
  }

  return {
    success: true,
    message: 'Todos os campos obrigatórios estão presentes.',
  };
};
