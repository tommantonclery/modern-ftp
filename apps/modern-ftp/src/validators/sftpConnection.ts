import { z } from "zod";

export const SftpConnectionSchema = z.object({
  name: z.string().min(1, "Connection name is required"),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().min(1, "Port must be a valid number"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  privateKey: z.string().optional(),
});

export type SftpConnectionInput = z.infer<typeof SftpConnectionSchema>;
