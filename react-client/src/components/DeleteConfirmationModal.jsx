import React from 'react';
import '../assets/Modal.css';

const DeleteConfirmationModal = ({ isOpen, songName, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-box">
                <h3 style={{ marginTop: 0 }}>Confirmar Borrado</h3>

                <p>
                    ¿Estás seguro de que deseas eliminar la canción <br/>
                    <strong>"{songName}"</strong>?
                </p>
                <p style={{ color: '#ff4d4d', fontSize: '0.9rem' }}>
                    Esta acción no se puede deshacer.
                </p>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button
                        className="btn-danger"
                        onClick={onConfirm}
                        disabled={!songName || songName.trim() === ""}
                    >
                        Confirmar Borrado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;