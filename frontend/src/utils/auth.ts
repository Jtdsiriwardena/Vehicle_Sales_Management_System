import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp: number; 
  iat: number;
  [key: string]: any;
}

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded: TokenPayload = jwtDecode(token);
    const now = Date.now() / 1000; 
    return decoded.exp > now;
  } catch (err) {
    return false;
  }
};
