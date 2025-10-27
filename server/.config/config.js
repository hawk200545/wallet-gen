import 'dotenv/config';

export const b_port = Number(process.env.PORT || process.env.BACKEND_PORT || 3000);
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';
export const JWT_USER_SECRET = process.env.JWT_USER_SECRET || 'replace-this-secret';
