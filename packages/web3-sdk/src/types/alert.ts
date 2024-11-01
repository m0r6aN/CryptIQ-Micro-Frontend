export type AlertType = {
  title: string;
  message: string;
  severity: string;
  timestamp: number;
  actionRequired?: boolean;
};
