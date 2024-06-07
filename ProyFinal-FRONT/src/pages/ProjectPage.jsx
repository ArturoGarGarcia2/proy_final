import { useContext, useEffect, useState } from 'react';
import ApiService from '../utils/ApiService';
import Spinner from '../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import ContextComponent from '../context/ContextComponent';
import MeetingComponent from '../components/meeting/MeetingComponent';
import NewsComponent from '../components/news/NewsComponent';
import BudgetComponent from '../components/budgets/BudgetComponent';
import Swal from 'sweetalert2';
import { allowRoleAbove } from '../utils/functions';

const api = new ApiService('http://127.0.0.1:8000/api');

function ProjectPage() {
    const { projectId } = useParams();
    const { darkMode, userData } = useContext(ContextComponent);
    const navigate = useNavigate();
    const [project, setProject] = useState({});
    const [client, setClient] = useState('');
    const [newsEndpoints, setNewsEndpoints] = useState([]);
    const [meetingEndpoints, setMeetingEndpoints] = useState([]);
    const [budgetEndpoints, setBudgetEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadProject = async () => {
        try {
            const response = await api.get('projects/'+projectId, localStorage.getItem('token'));
            setProject(response);

            console.log(response)

            const nameResponse = await api.get(response.client.substring(5),localStorage.getItem('token'));
            setClient(prev => prev ? nameResponse.name : nameResponse.name);

            if (response.news.length === 0) {
                setNewsEndpoints([]);
            } else {
                for (const newsUrl of response.news) {
                    setNewsEndpoints(prev => new Set([...prev,newsUrl]));
                }
            }

            if (response.meetings.length === 0) {
                setMeetingEndpoints([]);
            } else {
                for (const meetingUrl of response.meetings) {
                    setMeetingEndpoints(prev => new Set([...prev,meetingUrl]));
                }
            }

            if (response.budgets.length === 0) {
                setBudgetEndpoints([]);
            } else {
                for (const budgetUrl of response.budgets) {
                    setBudgetEndpoints(prev => new Set([...prev,budgetUrl]));
                }
            }

        } catch (error) {
            setError(true);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleModifyProject = async (newState) => {
        let title, text, icon;
        
        switch (newState) {
            case 'accepted':
                title = 'Aceptar presupuesto';
                text = 'Acepta para hacerle saber al cliente que se va a realizar la reforma';
                icon = 'question';
                break;
            case 'rejected':
                title = 'Rechazar presupuesto';
                text = 'Acepta si el proyecto no quieres realizar el proyecto';
                icon = 'question';
                break;
            case 'wip':
                title = '¿Empezar el proyecto?';
                text = 'Acepta si va a empezar el proyecto';
                icon = 'question';
                break;
            case 'finished':
                title = '¿Terminar el proyecto?';
                text = `Acepta si ha finalizado el proyecto 🥳, esta acción no se puede revertir`;
                icon = 'warning';
                break;
            case 'abandoned':
                title = '¿Marcar como abandonado?';
                text = `Esta acción no se puede revertir`;
                icon = 'warning';
                break;
            case 'paused':
                title = '¿Pausar el proyecto?';
                text = `Más tarde puedes reaundarlo`;
                icon = 'question';
                break;
            default:
                title = '';
                text = '';
                icon = 'question';
                break;
        }

        const result = await Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const response = await api.patch('projects',project['@id'].split('/')[3],{state:newState},localStorage.getItem('token'))
            setProject(prev => ({...prev,state:newState}))
        }
    };

    useEffect(() => {
        loadProject();
    }, []);


    return (
        <div className='flex flex-col items-center h-full'>
            {loading && <Spinner />}
            {!loading && error && <p>Error al cargar el proyecto</p>}
            {!loading && !error && (
                <div className={`w-full h-full py-4 px-8 flex flex-col gap-4`}>
                    <div>
                        <h1 className='font-semibold text-3xl mb-10'>Proyecto de {client}</h1>
                        <div><p
                    className={`rounded text-xl font-semibold w-32 text-center text-white ${
                        project.state === 'created' ? 'bg-green-700' :
                        project.state === 'accepted' ? 'bg-yellow-700' :
                        project.state === 'rejected' ? 'bg-red-700' :
                        project.state === 'wip' ? 'bg-teal-700' :
                        project.state === 'paused' ? 'bg-neutral-700' :
                        project.state === 'finished' ? 'bg-lime-700' :
                        project.state === 'abandoned' ? 'bg-rose-700' :
                     ''
                    }`}
                    >{project.state === 'created' ? 'Pendiente' :
                      project.state === 'accepted' ? 'Aceptado' :
                      project.state === 'rejected' ? 'Rechazado' :
                      project.state === 'wip' ? 'En proceso' :
                      project.state === 'paused' ? 'Pausado' :
                      project.state === 'finished' ? 'Terminado' :
                      project.state === 'abandoned' ? 'Abandonado' :
                      ''}</p></div>
                    </div>
                    {/* <div className={`${userData.projects.length === 0 ? 'block' : 'hidden'} flex flex-col`}>
                        Aún no tienes un proyecto, ¡Inicia uno aquí!
                        <button onClick={handleCreateProject}>Quiero dar el paso</button>
                    </div> */}
                    <div className={`py-6 lg:px-12`}>
                        <div className='flex flex-col justify-evenly gap-3'>
                            <div>
                                <h1 className='text-2xl font-bold w-1/3 mb-4'>Presupuestos:</h1>
                                <div>
                                    <BudgetComponent budgetEndpoints={[...budgetEndpoints]} project={project} projectId={project.id}/>
                                </div>
                            </div>
                            <hr />
                            <div className='flex flex-col lg:flex-row'>
                                <div className='w-full lg:w-1/2 mt-10'>
                                    <NewsComponent  newsEndpoints={[...newsEndpoints]} project={project}/>
                                </div>
                                <div className='flex flex-col gap-6 w-full lg:w-1/2 mt-10'>
                                    <MeetingComponent meetingEndpoints={[...meetingEndpoints]} project={project}/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='flex gap-2 mb-10 mt-10'>
                            <h2 className='w-1/6'><span className='font-semibold text-lg'>Dirección del proyecto:</span> <br /> {project.address}</h2>
                            <br />
                            <h2 className='w-1/6'><span className='font-semibold text-lg'>Superficie:</span> <br /> {project.surface}m²</h2>
                            <br />
                            <h2 className='w-1/6'><span className='font-semibold text-lg'>Tipo:</span> <br /> {project.type === 'partial' ? 'Parcial' : 'Completa' }</h2>
                            <br />
                            <h2 className='w-1/6'><span className='font-semibold text-lg'>Propiedad:</span> <br /> {project.ownership === 'owner' ? 'Propietario' : 'Alquiler' }</h2>
                            <br />
                            <p className='w-2/6'><span className='font-semibold text-lg'>Descripción:</span> <br /> {project.description}</p>
                            </div>
                            <br />
                        </div>
                        
                        <div className='my-10 w-full'>
                            {allowRoleAbove(userData.roles,1) &&(
                                <div className='flex gap-4'>
                                    {project.state === 'created' && (
                                        <>
                                            <button className='bg-[#01203C] py-1 px-2 rounded text-white border-2 border-[#01203C] hover:bg-[#21405C]' onClick={()=>handleModifyProject('accepted')}>Aceptar proyecto</button>
                                            <button className='bg-white text-black py-1 px-2 rounded border-2 border-[#01203C]' onClick={()=>handleModifyProject('rejected')}>Rechazar proyecto</button>
                                        </>
                                    )}
                                    {project.state === 'accepted' && (
                                        <>
                                            <button className='bg-white text-black py-1 px-2 rounded border-2 border-[#01203C]' onClick={()=>handleModifyProject('wip')}>Comenzar proyecto</button>
                                            <button className='bg-white text-black py-1 px-2 rounded border-2 border-[#01203C]' onClick={()=>handleModifyProject('abandoned')}>Abandonar proyecto</button>
                                        </>
                                    )}
                                    {project.state === 'paused' && (
                                        <>
                                            <button className='bg-white text-black py-1 px-2 rounded border-2 border-[#01203C]' onClick={()=>handleModifyProject('wip')}>Retomar proyecto</button>
                                        </>
                                    )}
                                    {project.state === 'wip' && (
                                        <>
                                            <div className='flex flex-col gap-4'>
                                                <button className='bg-neutral-500 hover:bg-neutral-600 text-white font-semidold py-1 px-2 rounded border-2 border-neutral-950' onClick={()=>handleModifyProject('paused')}>Pausar proyecto</button>
                                                <button className='bg-rose-500 hover:bg-rose-600 text-white font-semidold py-1 px-2 rounded border-2 border-rose-950' onClick={()=>handleModifyProject('abandoned')}>Abandonar proyecto</button>
                                            </div>
                                            <div>
                                                <button className='bg-emerald-500 hover:bg-emerald-600 text-white font-semidold py-1 px-2 rounded border-2 border-emerald-950' onClick={()=>handleModifyProject('finished')}>Terminar proyecto</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectPage;
