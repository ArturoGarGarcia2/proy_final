import { useContext, useEffect, useState } from "react";
import ApiService from "../utils/ApiService";
import Spinner from "../components/Spinner";
import ProjectRowComponent from "../components/ProjectRowComponent";
import { useNavigate } from "react-router-dom";
import ContextComponent from "../context/ContextComponent";
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';

const api = new ApiService('http://127.0.0.1:8000/api');

const ProjectsPage = () => {
    const { darkMode } = useContext(ContextComponent);
    const [loading, setLoading] = useState(true);
    const [activeProjects, setActiveProjects] = useState([]);
    const [endedProjects, setEndedProjects] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState(true);

    const loadData = async () => {
        try {
            const response = await api.get('projects', localStorage.getItem('token'));
            if (response['@context'] === '/api/contexts/Error') {
                setError(response);
            } else if (response['hydra:member']) {
                console.log('Projects data:', response['hydra:member']);
                setActiveProjects(response['hydra:member'].filter(p => p.state === 'created' || p.state === 'accepted' || p.state === 'wip'));
                setEndedProjects(response['hydra:member'].filter(p => p.state === 'abandoned' || p.state === 'finished' || p.state === 'rejected' || p.state === 'paused'));
            } else {
                setError('Unexpected response format');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (id) => {
        navigate('/project/'+id)
    }

    const handleSortActive = (field) => {
        const isSameField = sortField === field;
        const newSortDirection = isSameField ? !sortDirection : true;
        setSortField(field);
        setSortDirection(newSortDirection);
        const sortedData = [...activeProjects].sort((a, b) => {
            if (a[field] < b[field]) return newSortDirection ? -1 : 1;
            if (a[field] > b[field]) return newSortDirection ? 1 : -1;
            return 0;
        });
        setActiveProjects(sortedData);
    };

    const handleSortEnded = (field) => {
        const isSameField = sortField === field;
        const newSortDirection = isSameField ? !sortDirection : true;
        setSortField(field);
        setSortDirection(newSortDirection);
        const sortedData = [...endedProjects].sort((a, b) => {
            if (a[field] < b[field]) return newSortDirection ? -1 : 1;
            if (a[field] > b[field]) return newSortDirection ? 1 : -1;
            return 0;
        });
        setEndedProjects(sortedData);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {loading && (<Spinner />)}
            {!loading && error && (
                <div className="error">
                    <p>Error loading projects: {error}</p>
                </div>
            )}
            {!loading && !error && activeProjects.length > 0 && (
                <div className="w-3/4 m-auto">

                <h1 className="text-3xl font-bold my-10 mt-20">Proyectos actuales:</h1>
                {activeProjects.length !== 0 && (
                    <table className="text-center w-full rounded-md border border-black">
                        <thead className="rounded-md">
                            <tr className={`${darkMode?'bg-slate-900':'bg-slate-300'} [&>*]:w-1/6 [&>*]:py-2 [&>*]:text-xl [&>*]:border-b-2 [&>*]:border-black`}>
                                <th onClick={() => handleSortActive('client')} className="cursor-pointer">
                                    Cliente
                                    {sortField === 'client' && (
                                        <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th onClick={() => handleSortActive('address')} className="cursor-pointer">
                                    Dirección
                                    {sortField === 'address' && (
                                        <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th onClick={() => handleSortActive('ownership')} className="cursor-pointer hidden lg:table-cell">
                                    Propiedad
                                    {sortField === 'ownership' && (
                                        <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th onClick={() => handleSortActive('type')} className="cursor-pointer hidden lg:table-cell">
                                    Tipo
                                    {sortField === 'type' && (
                                        <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th onClick={() => handleSortActive('surface')} className="cursor-pointer hidden lg:table-cell">
                                    Superficie
                                    {sortField === 'surface' && (
                                        <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th onClick={() => handleSortActive('state')} className="cursor-pointer">
                                    Estado
                                    {sortField === 'state' && (
                                        <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`cursor-pointer ${darkMode?'[&>tr:nth-child(2n+1)]:bg-slate-700 hover:[&>tr:nth-child(2n+1)]:bg-slate-600':'[&>tr:nth-child(2n+1)]:bg-slate-100 hover:[&>tr:nth-child(2n+1)]:bg-slate-300'} ${darkMode?'[&>tr:nth-child(2n)]:bg-slate-800 hover:[&>tr:nth-child(2n)]:bg-slate-600':'[&>tr:nth-child(2n)]:bg-slate-200 hover:[&>tr:nth-child(2n)]:bg-slate-300'}`}>
                            {activeProjects.map((project) => (
                                <ProjectRowComponent key={project.id} project={project} onClick={() => handleNavigate(project.id)}/>
                            ))}
                        </tbody>
                    </table>
                )}
                {activeProjects.length === 0 && (<>No hay proyectos actualmente</>)}

                <h1 className="text-3xl font-bold my-10 mt-20">Proyectos acabados:</h1>
                {endedProjects.length !== 0 && (
                <table className="text-center w-full rounded-md border border-black">
                    <thead className="rounded-md">
                        <tr className={`${darkMode?'bg-slate-900':'bg-slate-300'} [&>*]:w-1/6 [&>*]:py-2 [&>*]:text-xl [&>*]:border-b-2 [&>*]:border-black`}>
                            <th onClick={() => handleSortEnded('client')} className="cursor-pointer">
                                Cliente
                                {sortField === 'client' && (
                                    <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                )}
                            </th>
                            <th onClick={() => handleSortEnded('address')} className="cursor-pointer">
                                Dirección
                                {sortField === 'address' && (
                                    <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                )}
                            </th>
                            <th onClick={() => handleSortEnded('ownership')} className="cursor-pointer hidden lg:table-cell">
                                Propiedad
                                {sortField === 'ownership' && (
                                    <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                )}
                            </th>
                            <th onClick={() => handleSortEnded('type')} className="cursor-pointer hidden lg:table-cell">
                                Tipo
                                {sortField === 'type' && (
                                    <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                )}
                            </th>
                            <th onClick={() => handleSortEnded('surface')} className="cursor-pointer hidden lg:table-cell">
                                Superficie
                                {sortField === 'surface' && (
                                    <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                )}
                            </th>
                            <th onClick={() => handleSortEnded('state')} className="cursor-pointer">
                                Estado
                                {sortField === 'state' && (
                                    <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`cursor-pointer ${darkMode?'[&>tr:nth-child(2n+1)]:bg-slate-700 hover:[&>tr:nth-child(2n+1)]:bg-slate-600':'[&>tr:nth-child(2n+1)]:bg-slate-100 hover:[&>tr:nth-child(2n+1)]:bg-slate-300'} ${darkMode?'[&>tr:nth-child(2n)]:bg-slate-800 hover:[&>tr:nth-child(2n)]:bg-slate-600':'[&>tr:nth-child(2n)]:bg-slate-200 hover:[&>tr:nth-child(2n)]:bg-slate-300'}`}>
                        {endedProjects.map((project) => (
                            <ProjectRowComponent key={project.id} project={project} onClick={() => handleNavigate(project.id)}/>
                        ))}
                    </tbody>
                </table>
                )}
                {endedProjects.length === 0 && (<>No hay proyectos actualmente</>)}
                </div>
            )
            // <ProjectRowComponent key={project.id} project={project}/>
            }
            {!loading && !error && activeProjects.length === 0 && (
                <h1 className="mt-20 w-4/5 m-auto font-bold text-2xl">No hay projectos.</h1>
            )}
        </>
    );
};

export default ProjectsPage;
