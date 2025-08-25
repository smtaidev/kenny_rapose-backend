export function generateOtp(length = 6): string {
  // Ensure we always get exactly 6 digits
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1; 
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}
