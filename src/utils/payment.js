// utils/payment.js
import axios from "axios";

export const verifyKhaltiPayment = async (pidx) => {
  try {
    const response = await axios.get("/api/donations/verify/", {
      params: { pidx },
    });
    return response.data;
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};
