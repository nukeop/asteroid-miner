export type LoadResult<T> = {
  value: T;
  warnings: string[];
  errors: string[];
};
