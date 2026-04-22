import React, { useState } from 'react';
import { apiFetch } from "../services/ApiService.js";
import SongToast from './SongToast.jsx';
import "../assets/SongForm.css";

const SongForm = ({ onSongAdded }) => {

    const [title, setTitle] = useState("");
    const [kind, setKind] = useState("");
    const [price, setPrice] = useState("");
    const [serverErrors, setServerErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    const isTitleValid = title.trim().length >= 5;
    const isKindValid = kind.trim().length >= 3;
    const isPriceValid = price !== "" && !isNaN(price) && Number(price) > 0;
    const isFormValid = isTitleValid && isKindValid && isPriceValid;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerErrors([]);
        setSuccessMsg("");

        try {
            await apiFetch("http://localhost:8081/api/v1.0/songs", {
                method: "POST",
                body: JSON.stringify({ title, kind, price })
            });

            setSuccessMsg("Canción añadida con éxito");

            setTitle("");
            setKind("");
            setPrice("");

            setTimeout(() => {
                if (onSongAdded) {
                    onSongAdded();
                }
            }, 1500);

        } catch (error) {
            if (error.message === "UNAUTHORIZED") {
                setServerErrors(["No estás autorizado. Inicia sesión de nuevo."]);
            } else if (error.details) {
                setServerErrors(Array.isArray(error.details) ? error.details : [error.details]);
            } else {
                setServerErrors([error.message || "Se ha producido un error inesperado."]);
            }
        }
    };

    return (
        <>
            <SongToast errors={serverErrors} type="danger" />
            {successMsg && <SongToast errors={[successMsg]} type="success" />}

            <form onSubmit={handleSubmit} className="song-form">

                <div className="form-group">
                    <label>Título:</label>
                    <input
                        type="text"
                        placeholder="Mín. 5 letras"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={title && !isTitleValid ? "input-invalid" : ""}
                    />
                </div>

                <div className="form-group">
                    <label>Género:</label>
                    <input
                        type="text"
                        placeholder="Mín. 3 letras"
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                        className={kind && !isKindValid ? "input-invalid" : ""}
                    />
                </div>

                <div className="form-group">
                    <label>Precio (€):</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 2.50"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={price && !isPriceValid ? "input-invalid" : ""}
                    />
                </div>

                <button type="submit" disabled={!isFormValid}>
                    Enviar
                </button>
            </form>
        </>
    );
};

export default SongForm;