import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import TagModal from '@/components/TagModal';

jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn(),
    put: jest.fn(),
  },
}));

import { api } from '@/lib/api';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

describe('TagModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criação de tag', () => {
    it('deve renderizar o modal de criação', async () => {
      await act(async () => {
        render(<TagModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      expect(screen.getByText('Nova tag')).toBeTruthy();
      expect(
        screen.getByPlaceholderText('Ex: dev, design, estudo'),
      ).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy();
    });

    it('deve chamar onClose ao clicar em cancelar', async () => {
      await act(async () => {
        render(<TagModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar a API e onSave ao criar uma tag', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({});

      await act(async () => {
        render(<TagModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      fireEvent.change(screen.getByPlaceholderText('Ex: dev, design, estudo'), {
        target: { value: 'dev' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/tags', {
          name: 'dev',
          color: null,
          icon: null,
        });
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
    });

    it('deve exibir erro quando a API falhar', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(
        new Error('Tag já cadastrada'),
      );

      await act(async () => {
        render(<TagModal onClose={mockOnClose} onSave={mockOnSave} />);
      });

      fireEvent.change(screen.getByPlaceholderText('Ex: dev, design, estudo'), {
        target: { value: 'dev' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

      await waitFor(() => {
        expect(screen.getByText('Tag já cadastrada')).toBeTruthy();
      });
    });
  });

  describe('edição de tag', () => {
    const mockTag = {
      id: '1',
      name: 'dev',
      color: '#6366f1',
      icon: '1F4BB',
      userId: '1',
    };

    it('deve renderizar o modal de edição com dados preenchidos', async () => {
      await act(async () => {
        render(
          <TagModal tag={mockTag} onClose={mockOnClose} onSave={mockOnSave} />,
        );
      });

      expect(screen.getByText('Editar tag')).toBeTruthy();
      expect(screen.getByDisplayValue('dev')).toBeTruthy();
      expect(screen.getByPlaceholderText('#6366f1 (opcional)')).toBeTruthy();
      expect(screen.getByDisplayValue('1F4BB')).toBeTruthy();
    });

    it('deve chamar a API de update ao editar uma tag', async () => {
      (api.put as jest.Mock).mockResolvedValueOnce({});

      await act(async () => {
        render(
          <TagModal tag={mockTag} onClose={mockOnClose} onSave={mockOnSave} />,
        );
      });

      fireEvent.change(screen.getByDisplayValue('dev'), {
        target: { value: 'design' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/tags/1', {
          name: 'design',
          color: '#6366f1',
          icon: '1F4BB',
        });
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
    });
  });
});
