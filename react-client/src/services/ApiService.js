export const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
            ...(options.headers || {})
        }
    });

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error("Respuesta inválida del servidor");
    }

    if (!res.ok) {
        const errorDetails = data?.errors || data?.error || "Error en la API";

        if (res.status === 401) {
            const unauthError = new Error("UNAUTHORIZED");
            unauthError.details = errorDetails;
            throw unauthError;
        }

        const apiError = new Error("API_ERROR");
        apiError.details = errorDetails;
        throw apiError;
    }

    return data;
};