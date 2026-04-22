import React from 'react';

const SongToast = ({ errors, type = 'danger', float = false }) => {
    if (!errors || errors.length === 0) return null;

    const isFloating = type === 'success' || float;
    const containerClass = `alert alert-${type} ${isFloating ? 'toast-fixed-bottom' : 'mt-3'}`;

    return (
        <div className={containerClass} role="alert">
            {Array.isArray(errors) ? (
                <ul className="mb-0" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {errors.map((err, index) => (
                        <li key={index}>{err.msg || err}</li>
                    ))}
                </ul>
            ) : (
                <p className="mb-0">{errors}</p>
            )}
        </div>
    );
};

export default SongToast;