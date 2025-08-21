'use server';

import { z } from 'zod';

import { createUser, getUser } from '@/lib/db/queries';

import { signIn } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    console.log('🚀 Login action: Starting login process');

    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    console.log('📧 Login action: Validated email:', validatedData.email);
    console.log(
      '🔑 Login action: Password length:',
      validatedData.password.length,
    );

    const result = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    console.log('🔄 Login action: SignIn result:', result);

    if (result?.error) {
      console.log('❌ Login action: SignIn error:', result.error);
      return { status: 'failed' };
    }

    console.log('✅ Login action: Login successful');
    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('📝 Login action: Validation error:', error.errors);
      return { status: 'invalid_data' };
    }

    console.error('💥 Login action: Unexpected error:', error);
    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    }

    await createUser(validatedData.email, validatedData.password);

    const result = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return { status: 'failed' };
    }

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    console.error('Register error:', error);
    return { status: 'failed' };
  }
};
