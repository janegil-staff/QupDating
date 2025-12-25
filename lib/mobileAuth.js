import jwt from "jsonwebtoken";

export function verifyMobileToken(req) {
  const rawAuth = req.headers.get("authorization") || "";
  const token = rawAuth.replace("Bearer", "").trim();

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
