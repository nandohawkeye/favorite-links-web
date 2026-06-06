import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/(auth)/register/page';

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

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de cadastro', () => {
    render(<RegisterPage />);

    expect(screen.getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeTruthy();
  });

  it('deve exibir erro quando email já cadastrado', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(
      new Error('Email já cadastrado'),
    );

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() => {
      expect(screen.getByText('Email já cadastrado')).toBeTruthy();
    });
  });

  it('deve chamar a API com os dados corretos ao cadastrar', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'novo@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'novo@email.com',
        password: '123456',
      });
    });
  });

  it('deve redirecionar para login após cadastro bem sucedido', async () => {
    const pushMock = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock }),
    }));
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'novo@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});
