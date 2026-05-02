'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Tag } from '@/types';
import TagModal from '@/components/TagModal';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | undefined>();

  async function fetchTags() {
    try {
      const data = await api.get<Tag[]>('/tags');
      setTags(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  async function handleDelete(id: string) {
    try {
      await api.delete(`/tags/${id}`);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  function handleEdit(tag: Tag) {
    setEditingTag(tag);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingTag(undefined);
  }

  function handleSave() {
    handleCloseModal();
    fetchTags();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Minhas tags</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nova tag
        </button>
      </div>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 text-lg">Nenhuma tag criada ainda</p>
          <p className="text-gray-300 text-sm mt-1">Crie sua primeira tag</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {tag.color && (
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                )}
                {tag.icon && (
                  <span>{String.fromCodePoint(parseInt(tag.icon, 16))}</span>
                )}
                <span className="font-medium text-gray-700">{tag.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tag)}
                  className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TagModal
          tag={editingTag}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
