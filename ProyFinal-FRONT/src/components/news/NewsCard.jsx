import { useContext, useState } from "react";
import { allowRoleAbove, cureDate } from "../../utils/functions";
import ContextComponent from "../../context/ContextComponent";
import ApiService from "../../utils/ApiService";
import Swal from "sweetalert2";

const api = new ApiService();

const NewsCard = ({ newsItem: item , setNewsItems }) => {
    const { userData } = useContext(ContextComponent);
    const [front, setFront] = useState(true);

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará los capítulos y el presupuesto asociado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });

        if (confirmDelete.isConfirmed) {
            try{
                await api.delete('news',id,localStorage.getItem('token'));
                setNewsItems(prev => prev.filter(n => n.id !== id))
                Swal.fire({title: 'Borrado', icon: 'success', text:'Actualización borrada'})
            }catch(err){
                throw new Error(err)
            }
        }
    }

    return (
        <div className="text-black relative w-[45%] lg:w-80 h-48 perspective-1000  cursor-pointer" onClick={() => setFront(prev => !prev)}>
            <div className={`relative w-full h-full transition-transform ease-out duration-300 transform ${!front ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full bg-white rounded p-4 flex flex-col transform">
                    <div className={`front ${!front ? 'hidden' : ''}`}>
                        <h1 className="font-bold">{item.title}</h1>
                        <p>{cureDate(item.date).ddMMyy} - {cureDate(item.date).HHmm}</p>
                    </div>
                    <div className={`${front ? 'hidden' : ''} rotate-y-180 flex flex-col items-start justify-between`}>
                        <p className="break-words whitespace-normal">{item.description}</p>
                        {allowRoleAbove(userData.roles,1) ? (
                            <button className="bg-red-500 hover:bg-red-600 py-1 px-3 rounded text-white" onClick={() =>handleDelete(item.id)}>Borrar</button>
                        ):(<></>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsCard;
