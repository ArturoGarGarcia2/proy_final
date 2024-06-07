import ApiService from '../utils/ApiService';

const api = new ApiService('http://127.0.0.1:8000/api');

export const uploadImage = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('upload', formData, token);
    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url; // Asegúrate de que el backend devuelve la URL de la imagen
};
