'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Link, Tag } from '@/types';
import LinkModal from '@/components/LinkModal';

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | undefined>();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  async function fetchLinks() {
    try {
      const data = await api.get<Link[]>('/links');
      setLinks(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTags() {
    try {
      const data = await api.get<Tag[]>('/tags');
      setTags(data);
    } catch {
      // ignora erro de tags
    }
  }

  useEffect(() => {
    fetchLinks();
    fetchTags();
  }, []);

  async function handleDelete(id: string) {
    try {
      await api.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }

  function handleEdit(link: Link) {
    setEditingLink(link);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingLink(undefined);
  }

  function handleSave() {
    handleCloseModal();
    fetchLinks();
  }

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      search === '' ||
      link.url.toLowerCase().includes(search.toLowerCase()) ||
      (link.title?.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesTag =
      selectedTag === '' || link.tags.some((t) => t.id === selectedTag);

    return matchesSearch && matchesTag;
  });

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Meus links</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Adicionar link
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título ou URL..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 text-lg">Nenhum link encontrado</p>
          <p className="text-gray-300 text-sm mt-1">
            {links.length === 0
              ? 'Adicione seu primeiro link'
              : 'Tente outros filtros'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLinks.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between"
            >
              <div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {link.title ?? link.url}
                </a>
                <p className="text-sm text-gray-400 mt-0.5">{link.url}</p>
                {link.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {link.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: tag.color ?? '#e5e7eb',
                          color: tag.color ? '#fff' : '#4b5563',
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(link)}
                  className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
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
        <LinkModal
          link={editingLink}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
