export const GetApiErrorMessage = (error) => {
  // Axios response error
  if (error?.response?.data) {
    const data = error.response.data;
    console.log(data);
    // Common backend patterns

    if (data?.details?.newPassword) {
      return data.details.newPassword[0];
    }

    if (data?.details?.password) {
      return data.details.password[0];
    }

    return (
      // data.details.password[0] ||

      data.message || data.error || data.data?.message || "Something went wrong"
    );
  }

  // Timeout
  if (error?.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  // Network / unknown
  return "Network error. Please check your connection.";
};
