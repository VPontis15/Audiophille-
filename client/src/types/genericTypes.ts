export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Partial<{
    outline?: boolean;
    rounded?: boolean;
    to?: string;
    children: React.ReactNode;
    primary?: boolean;
    secondary?: boolean;
    transparent?: boolean;
    withIcon?: boolean;
    sm?: boolean;
    lg?: boolean;
  }>;

export interface AxiosError {
  response?: {
    data?: {
      status?: string;
      message?: string;
    };
    status?: number;
  };
  message: string;
}
