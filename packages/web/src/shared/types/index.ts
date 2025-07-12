export * from '@aipackr/types';

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}