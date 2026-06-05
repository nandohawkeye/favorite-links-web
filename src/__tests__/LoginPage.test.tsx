import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

import { api } from '@/lib/api';

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
  });

  it('deve exibir erro quando credenciais são inválidas', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(
      new Error('Credenciais inválidas'),
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeTruthy();
    });
  });

  it('deve chamar a API com os dados corretos ao fazer login', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ token: 'fake-token' });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'teste@email.com',
        password: '123456',
      });
    });
  });
});
