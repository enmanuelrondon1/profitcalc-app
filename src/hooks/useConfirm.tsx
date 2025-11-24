// src/hooks/useConfirm.tsx
import { useState } from 'react';

// Este hook manejará el estado de cualquier diálogo de confirmación
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void | Promise<void>>(() => () => {});

  const confirm = (msg: string, action: () => void | Promise<void>) => {
    setMessage(msg);
    setOnConfirm(() => action);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);
  const handleConfirm = async () => {
    await onConfirm();
    handleClose();
  };

  return { isOpen, message, confirm, handleClose, handleConfirm };
};