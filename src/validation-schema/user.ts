import { object, string, number } from 'yup';

export const userSchema = object({
  name: string(),
  age: number().required().positive().integer(),
  email: string().required().email(),
  phone: string(),
});
