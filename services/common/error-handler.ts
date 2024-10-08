export const handleApiError = (reply, error: Error) => {
    console.error('API Error:', error);
    reply.status(500).send({ success: false, message: error.message });
  };
  