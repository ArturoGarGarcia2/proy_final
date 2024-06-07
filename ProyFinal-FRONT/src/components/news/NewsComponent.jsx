import { useContext, useEffect, useState } from "react";
import ApiService from "../../utils/ApiService";
import ContextComponent from "../../context/ContextComponent";
import MiniSpinner from "../MiniSpinner";
import NewsCard from "./NewsCard";
import { allowRoleAbove } from "../../utils/functions";
import Swal from "sweetalert2";


const api = new ApiService('http://127.0.0.1:8000/api');


const NewsComponent = ({newsEndpoints,project}) => {
    const { userData } = useContext(ContextComponent);
    const [newsItems, setNewsItems] = useState([])
    const [loading, setLoading] = useState(false)

    const handleNewNew = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Cuenta qué ha pasado últimamente',
            html: `
                <label>
                    <input type="text" id="newNewTitleInput" name="title" class="swal2-input" placeholder="Aquí el título" required>
                    <textarea id="newNewDescriptionInput" name="description" class="swal2-textarea" placeholder="Aquí lo que ha pasado" required></textarea>
                </label>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    [document.getElementById('newNewTitleInput').name]: document.getElementById('newNewTitleInput').value,
                    [document.getElementById('newNewDescriptionInput').name]: document.getElementById('newNewDescriptionInput').value,
                    project:project['@id'],
                    date: new Date(),
                }
            }
        });
    
        if (formValues) {
            const response = await api.post('news',formValues,localStorage.getItem('token'))
            if(response['@context'] === '/api/contexts/Error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response['hydra:description'],
                });
            }else{
                console.log(response)
                setNewsItems(prev => [...prev,response])
                Swal.fire({
                    icon:'success',
                    title: '¡Listo!',
                    text: 'La actualización se ha creado correctamente',
                })
            }
        }
    }

    const loadData = async () => {
        try {
            const uniqueNewsEndpoints = new Set(newsEndpoints);
            const fetchedNews = [];
            for (const newsEndpoint of uniqueNewsEndpoints) {
                const response = await api.get(newsEndpoint.substring(5), localStorage.getItem('token'));
                if (response['@context'] === '/api/contexts/Error') {
                    console.log('error en', newsEndpoint);
                } else {
                    fetchedNews.push(response);
                }
            }
            setNewsItems(fetchedNews);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    };

    const isInactive = () => {
        return project.state === 'paused' || project.state === 'abandoned' || project.state === 'finished'
    }

    useEffect(() => {
        loadData();
    }, [])
    return (
        <>
            <div className='flex gap-4'>
                <h1 className='text-xl font-bold'>Actualizaciones:</h1>
                <div>
                <button className={`bg-slate-600 hover:bg-slate-700 py-1 px-3 rounded-md text-white mb-5 ${!isInactive() && !loading && allowRoleAbove(userData.roles,1)? 'block' : 'hidden'}`} onClick={handleNewNew}>Nueva actualización</button>
                </div>
            </div>
        {loading && (<MiniSpinner/>)}
        {!loading && (
            <>
            <div className='flex flex-wrap justify-evenly lg:justify-start gap-2'>
            
            {newsEndpoints.length !== 0 ? newsItems.map(newsItem => (
                <NewsCard key={newsItem.id} newsItem={newsItem}/>
            )) : (
                <p>No hay actualizaciones</p>
            )}
            </div>
            </>
        )}
        </>
    )
}

export default NewsComponent