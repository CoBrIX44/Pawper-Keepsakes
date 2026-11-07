import React, { useState } from 'react';
import { ScrapbookCard } from '../types/scrapbook';
import { Modal } from '../components/Modal';

interface DeleteConfirmModalProps {
  card: ScrapbookCard | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  card,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!card) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(card.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete card:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove Keepsake?" maxWidth="400px">
      <div style={{ padding: '4px 0 12px' }}>
        <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.5, marginBottom: '14px' }}>
          Are you sure you want to remove <strong>"{card.title}"</strong> from your scrapbook?
        </p>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '20px' }}>
          This will permanently delete this card from local storage.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-danger"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
