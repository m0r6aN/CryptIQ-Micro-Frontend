export type AlertType = {
  type:string
  title: string;
  message: string;
  severity: string;
  timestamp: number;
  actionRequired?: boolean;
};
