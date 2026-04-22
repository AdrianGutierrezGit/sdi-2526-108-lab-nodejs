import React from "react";
import SongForm from "../components/SongForm.jsx";
import "../assets/AddSongForm.css";

const AddSongForm = ({ onSongAdded }) => {
    return (
        <div className="add-song-container">
            <SongForm onSongAdded={onSongAdded} />

        </div>
    );
};

export default AddSongForm;