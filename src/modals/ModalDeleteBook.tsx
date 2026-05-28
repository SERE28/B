import "./Modal.css";

interface Props {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalDeleteBook({ title, onClose, onConfirm }: Props) {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal delete-modal">
        <h2>Eliminar Libro</h2>

        <p>
          ¿Seguro que quieres eliminar <strong>"{title}"</strong>? Esta acción
          no se puede deshacer.
        </p>

        <div className="modal-buttons">
          <button className="cancel" onClick={handleClose}>
            Cancelar
          </button>

          <button className="delete" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
