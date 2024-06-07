import { useContext, useEffect, useState } from "react";
import ApiService from "../../utils/ApiService";
import { allowRoleAbove } from "../../utils/functions";
import ContextComponent from "../../context/ContextComponent";
import { useNavigate } from "react-router-dom";
import BudgetCard from "./BudgetCard";
import MiniSpinner from "../MiniSpinner";
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import Swal from "sweetalert2";

const api = new ApiService('http://127.0.0.1:8000/api');

const BudgetComponent = ({ budgetEndpoints, project, projectId }) => {
    const { darkMode, userData } = useContext(ContextComponent);
    const navigate = useNavigate();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState(true);

    const loadData = async () => {
        try {
            const uniqueBudgetEndpoints = new Set(budgetEndpoints);
            const fetchedBudgets = [];
            for (const budgetEndpoint of uniqueBudgetEndpoints) {
                const response = await api.get(budgetEndpoint.substring(5), localStorage.getItem('token'));
                if (response['@context'] === '/api/contexts/Error') {
                    console.log('error en', budgetEndpoint);
                } else {
                    fetchedBudgets.push(response);
                }
            }

            let filteredBudgets = fetchedBudgets;
            if (!allowRoleAbove(userData.roles, 1)) {
                filteredBudgets = fetchedBudgets.filter(budget => budget.state !== 'draft');
            }

            setBudgets(filteredBudgets);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (budget) => {

        try {
            if (budget.chapters) {
                // Mostrar una confirmación al usuario
                const confirmDelete = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Esta acción eliminará los capítulos y el presupuesto asociado.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true,
                });
    
                console.log(budget)

                if (confirmDelete.isConfirmed) {
                    for (const chapter of budget.chapters) {
                        try {
                            const response = await api.delete('chapters', chapter.split('/')[3], localStorage.getItem('token'));
                        } catch (chapterError) {
                            console.log('error',chapterError)
                        }
                    }
                    
                    const espera = await api.get(budget['@id'].substring(5),localStorage.getItem('token'));
                    
                    if(espera.chapters.length === 0) {
                        const budgetResponse = await api.delete('budgets', budget.id, localStorage.getItem('token'));
                        
                        setBudgets(prev => prev.filter(b => b.id !== budget.id));
        
                        await Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'Los capítulos y el presupuesto se han eliminado correctamente.',
                        });

                    }

                }
            }
        } catch (error) {
            console.error('Error eliminando capítulos o presupuesto:', error);
        }
    };

    const handleSort = (field) => {
        const isSameField = sortField === field;
        const newSortDirection = isSameField ? !sortDirection : true;
        setSortField(field);
        setSortDirection(newSortDirection);
        const sortedData = [...budgets].sort((a, b) => {
            if (a[field] < b[field]) return newSortDirection ? -1 : 1;
            if (a[field] > b[field]) return newSortDirection ? 1 : -1;
            return 0;
        });
        setBudgets(sortedData);
    };


    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            {loading && (<MiniSpinner />)}
            {!loading && (
                <div>
                    {!(project.state === 'paused' || project.state === 'abandoned' || project.state === 'finished') && allowRoleAbove(userData.roles, 1) && (
                        <button onClick={() => navigate('/newBudget/' + projectId)} className="bg-slate-600 hover:bg-slate-700 py-1 px-3 rounded-md text-white my-5">Nuevo presupuesto</button>
                    )}
                    {budgetEndpoints.length > 0 && (
                        <table className="w-full text-center border border-black">
                            <thead className="bg-slate-400">
                                <tr className={`${darkMode ? 'bg-slate-900' : 'bg-slate-400'} ${allowRoleAbove(userData.roles,1) ? '[&>th]:w-[22%]' : '[&>th]:w-1/3 lg:[&>th]:w-1/4'} [&>*]:py-1 [&>*]:text-lg [&>*]:border-b-2 [&>*]:border-black`}>
                                    <th onClick={() => handleSort('title')} className="cursor-pointer">
                                        Nombre
                                        {sortField === 'title' && (
                                            <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                        )}
                                    </th>
                                    <th onClick={() => handleSort('state')} className="cursor-pointer">
                                        Estado
                                        {sortField === 'state' && (
                                            <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                        )}
                                    </th>
                                    <th onClick={() => handleSort('createDate')} className="cursor-pointer">
                                        Fecha
                                        {sortField === 'createDate' && (
                                            <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                        )}
                                    </th>
                                    <th onClick={() => handleSort('total')} className="cursor-pointer hidden lg:table-cell">
                                        Total
                                        {sortField === 'total' && (
                                            <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                        )}
                                    </th>
                                    <td className={`${allowRoleAbove(userData.roles,1) ? 'table-cell' : 'hidden'}`}>
                                        Acciones
                                    </td>
                                </tr>
                            </thead>
                            <tbody className={`cursor-pointer ${darkMode ? '[&>tr:nth-child(2n+1)]:bg-slate-700 hover:[&>tr:nth-child(2n+1)]:bg-slate-500' : '[&>tr:nth-child(2n+1)]:bg-slate-100 hover:[&>tr:nth-child(2n+1)]:bg-slate-300'} ${darkMode ? '[&>tr:nth-child(2n)]:bg-slate-800 hover:[&>tr:nth-child(2n)]:bg-slate-500' : '[&>tr:nth-child(2n)]:bg-slate-200 hover:[&>tr:nth-child(2n)]:bg-slate-300'}`}>
                                {budgets.map(budget => (
                                    <tr key={budget.id} className="w-full [&>*]:border-y [&>*]:border-black">
                                        <BudgetCard budget={budget}/>
                                        <td>
                                            <button type="button" onClick={() => handleDelete(budget)} className={`${allowRoleAbove(userData.roles, 1) ? 'table-cell' : 'hidden'} bg-red-900 text-white py-1 px-1 rounded-sm`}>
                                                <DeleteSharpIcon title="Tienda" style={{ fontSize: 30, color: 'white' }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {budgetEndpoints.length === 0 && (
                        <div>No hay presupuestos para este proyecto</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default BudgetComponent;
