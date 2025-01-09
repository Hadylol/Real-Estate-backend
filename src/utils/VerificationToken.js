export const generateVerificationToken = () => {
  const token = Math.floor(1000 * Math.random() * 900).toString();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour
  return {
    token,
    expiresAt,
  };
};