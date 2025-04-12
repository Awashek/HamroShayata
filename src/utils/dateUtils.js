// utils/dateUtils.js
export const calculateDaysLeft = (deadline) => {
  if (!deadline) return 0;

  const today = new Date();
  const endDate = new Date(deadline);

  // Reset time parts to compare only dates
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const timeDiff = endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysLeft > 0 ? daysLeft : 0; // Return 0 if deadline has passed
};
