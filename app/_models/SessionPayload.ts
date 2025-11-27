import { JWTPayload } from "jose";

export default interface SessionPayload extends JWTPayload {
  id: number;
}
