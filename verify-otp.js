// verify-otp.js
import { authenticator } from "otplib";

const [,, token] = process.argv;

if (!token || !/^\d{6}$/.test(token)) {
  console.error("Invalid input format");
  process.exit(1);
}

const secret = "JJZXK6CAGIYDENK7JVQWQZLSL5EGC43TMFXAU==="
  .replace(/\s+/g, "")
  .toUpperCase();

authenticator.options = {
  step: 30,
  digits: 6,
  window: 0   // 🚨 no drift allowed
};

const isValid = authenticator.check(token, secret);

if (isValid) {
  process.exit(0);
} else {
  console.error("OTP check failed");
  process.exit(1);
}