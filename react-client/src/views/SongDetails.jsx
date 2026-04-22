import { useEffect, useState } from "react";
import { apiFetch } from "../services/ApiService.js";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.jsx";
import SongToast from "../components/SongToast.jsx";
import "../assets/SongDetails.css";
import Portada from "../assets/logo.svg";

const SongDetails = ({ songId, onBack, onDeleted }) => {
    const [song, setSong] = useState(null);
    const [fetchError, setFetchError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteErrors, setDeleteErrors] = useState([]);

    useEffect(() => {
        if (!songId) return;
        apiFetch(`http://localhost:8081/api/v1.0/songs/${songId}`)
            .then(data => {
                setSong(data?.song);
            })
            .catch(err => {
                setFetchError(err.details || "Error al comunicarse con el servidor");
            });
    }, [songId]);

    const triggerDelete = () => {
        setDeleteErrors([]);
        setIsModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            await apiFetch(`http://localhost:8081/api/v1.0/songs/${songId}`, {
                method: "DELETE"
            });

            setIsModalOpen(false);
            if (onDeleted) onDeleted();

        } catch (error) {
            setIsModalOpen(false);

            if (error.details) {
                setDeleteErrors(Array.isArray(error.details) ? error.details : [error.details]);
            } else if (error.message === "UNAUTHORIZED") {
                setDeleteErrors(["No estás autorizado o tu sesión ha caducado."]);
            } else {
                setDeleteErrors([error.message || "Error al intentar eliminar la canción."]);
            }
        }
    };

    if (fetchError) return <div className="error">{fetchError}</div>;
    if (!song) return <p>Cargando canción...</p>;

    return (
        <div className="song-details">
            <SongToast errors={deleteErrors} type="danger" float={true} />

            <img src={Portada} alt="Portada de la canción" />
            <div className="song-info">
                <h2>{song.title}</h2>
                <p><strong>Autor:</strong> {song.author}</p>
                <p><strong>Género:</strong> {song.kind}</p>
                <p className="precio">{song.price} €</p>

                <div className="song-actions">
                    <button className="delete" onClick={triggerDelete}>
                        Eliminar
                    </button>
                    <button className="back" onClick={onBack}>
                        Volver
                    </button>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isModalOpen}
                songName={song.title}
                onConfirm={executeDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default SongDetails;