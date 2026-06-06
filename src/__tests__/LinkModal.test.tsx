import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import LinkModal from '@/components/LinkModal';

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

import { api } from '@/lib/api';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

describe('LinkModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValueOnce([]);
  });

  describe('criação de link', () => {
    it('deve renderizar o modal de criação', async () => {
      await act(async () => {
        render(<LinkModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      expect(screen.getByText('Novo link')).toBeTruthy();
      expect(screen.getByPlaceholderText('https://...')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy();
    });

    it('deve chamar onClose ao clicar em cancelar', async () => {
      await act(async () => {
        render(<LinkModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar a API e onSave ao criar um link', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({});

      await act(async () => {
        render(<LinkModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      fireEvent.change(screen.getByPlaceholderText('https://...'), {
        target: { value: 'https://github.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Nome do link (opcional)'), {
        target: { value: 'GitHub' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/links', {
          url: 'https://github.com',
          title: 'GitHub',
          tagIds: [],
        });
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
    });

    it('deve exibir erro quando a API falhar', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(
        new Error('Erro ao criar link'),
      );

      await act(async () => {
        render(<LinkModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      fireEvent.change(screen.getByPlaceholderText('https://...'), {
        target: { value: 'https://github.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

      await waitFor(() => {
        expect(screen.getByText('Erro ao criar link')).toBeTruthy();
      });
    });
  });

  describe('edição de link', () => {
    const mockLink = {
      id: '1',
      url: 'https://github.com',
      title: 'GitHub',
      userId: '1',
      tags: [],
      createdAt: '',
      updatedAt: '',
    };

    it('deve renderizar o modal de edição com dados preenchidos', async () => {
      await act(async () => {
        render(
          <LinkModal
            link={mockLink}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      expect(screen.getByText('Editar link')).toBeTruthy();
      expect(screen.getByDisplayValue('https://github.com')).toBeTruthy();
      expect(screen.getByDisplayValue('GitHub')).toBeTruthy();
    });

    it('deve chamar a API de update ao editar um link', async () => {
      (api.put as jest.Mock).mockResolvedValueOnce({});

      await act(async () => {
        render(
          <LinkModal
            link={mockLink}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      fireEvent.change(screen.getByDisplayValue('GitHub'), {
        target: { value: 'GitHub atualizado' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/links/1', {
          url: 'https://github.com',
          title: 'GitHub atualizado',
          tagIds: [],
        });
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
    });
  });
});
