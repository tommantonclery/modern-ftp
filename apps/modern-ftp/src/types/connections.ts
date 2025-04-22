export type UIConnection = {
    id: string;
    name: string;
    host: string;
    port: number;
    username: string;
    password?: string;
    privateKey?: string;
    healthy?: boolean;
  };
  