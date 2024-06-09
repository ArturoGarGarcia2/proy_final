import { useEffect, useState } from "react";
import ApiService from "../utils/ApiService";
import MiniSpinner from "./MiniSpinner";
import { useNavigate } from "react-router-dom";

const api = new ApiService();


const ProjectRowComponent = ({project}) => {
    const [loading, setLoading] = useState(true)
    const [client, setClient] = useState('');
    const navigate = useNavigate();;

    const loadData = async () => {
        try{
            const response = await api.get(project.client.substring(5),localStorage.getItem('token'))
            setClient( prev => response.name === prev ? response.name : response.name)
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    const handleNavigate = (id) => {
        navigate('/project/'+id)
    }

    useEffect(() => {
        loadData();
    }, [])
    
    return (
        <>
        {loading && (<tr><td colSpan="6"><MiniSpinner/></td></tr>)}
        {!loading && (
            <tr className="[&>td]:border-y [&>td]:border-black [&>td]:py-2" onClick={() => handleNavigate(project.id)}>
                <td className="font-bold text-lg">{client}</td>
                <td>{project.address}</td>
                <td className=" hidden lg:table-cell">{project.ownership === 'owner' ? 'Propietario' : 'Alquiler'}</td>
                <td className=" hidden lg:table-cell">{project.type === 'complete' ? 'Completa' : 'Parcial'}</td>
                <td className=" hidden lg:table-cell">{project.surface}m²</td>
                <td>
                    <p
                    className={`rounded font-semibold m-auto text-white max-w-28 underline ${
                        project.state === 'created' ? 'bg-green-700' :
                        project.state === 'accepted' ? 'bg-yellow-700' :
                        project.state === 'wip' ? 'bg-teal-700' :
                        project.state === 'paused' ? 'bg-neutral-700' :
                        project.state === 'rejected' ? 'bg-red-700' :
                        project.state === 'finished' ? 'bg-lime-700' :
                        project.state === 'abandoned' ? 'bg-rose-700' :
                     ''
                    }`}
                    >{project.state === 'created' ? 'Creado' :
                      project.state === 'accepted' ? 'Aceptado' :
                      project.state === 'rejected' ? 'Rechazado' :
                      project.state === 'wip' ? 'En proceso' :
                      project.state === 'paused' ? 'Pausado' :
                      project.state === 'finished' ? 'Terminado' :
                      project.state === 'abandoned' ? 'Abandonado' :
                      ''}</p></td>
            </tr>
        )}
        </>
    )
}

export default ProjectRowComponent