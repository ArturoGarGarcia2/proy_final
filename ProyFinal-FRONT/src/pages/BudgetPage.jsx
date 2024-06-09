import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../utils/ApiService";
import Spinner from "../components/Spinner";
import { allowRoleAbove, allowRoleEqual, cureDate } from "../utils/functions";
import ChapterComponent from "../components/chapter/ChapterComponent";
import ContextComponent from "../context/ContextComponent";
import Swal from "sweetalert2";

const api = new ApiService();

const BudgetPage = () => {
    const { darkMode, userData } = useContext(ContextComponent);
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState({});
    const { budgetId } = useParams();

    const loadData = async () => {
        try {
            const response = await api.get(`budgets/${budgetId}`, localStorage.getItem('token'));
            if (response['@context'] === '/api/contexts/Error') {
                console.error('error en', response);
            } else {
                setBudget(response);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleModifyBudget = async (newState) => {
        let title, text, icon;
        
        switch (newState) {
            case 'pending':
                title = 'Enviar presupuesto';
                text = 'Esto le permitirá al cliente ver el presupuesto, haciendo que no se pueda modificar.';
                icon = 'warning';
                break;
            case 'accepted':
                title = 'Aceptar presupuesto';
                text = 'Al efectuar esta acción demuestras tu plena conformidad con lo expresado en todos los capítulos.';
                icon = 'question';
                break;
            case 'rejected':
                title = 'Rechazar presupuesto';
                text = 'Si ha habido algún problema, por favor, comunícanos qué ha sido para poder solucionarlo.';
                icon = 'question';
                break;
            case 'canceled':
                title = 'Cancelar presupuesto';
                text = 'Esta acción es irreversible.';
                icon = 'warning';
                break;
            case 'paid':
                title = 'Pagar presupuesto';
                text = `El total a pagar es de ${budget.total}`;
                icon = 'warning';
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
            const response = await api.patch('budgets',budget['@id'].split('/')[3],{state:newState},localStorage.getItem('token'))
            setBudget(prev => ({...prev,state:newState}))
        }
    };

    useEffect(() => {
        loadData();
    }, [budget.state]);

    return (
        <>
            {loading && (<Spinner />)}
            {!loading && (
                <div className="w-4/5 m-auto">
                    <h1 className="text-3xl font-bold my-10">{budget.title}:</h1>
                    <div className="flex justify-evenly my-10 text-xl">
                        <p className="border-2 rounded px-1 font-semibold text-white"><span className="text-black">Estado:</span> {
                            budget.state === 'pending' ? (
                                <span className="bg-green-700 border-2 border-green-900">Pendiente</span>
                            ) :
                            budget.state === 'draft' ? (
                                <span className="bg-gray-700 border-2 border-gray-900">Oculto</span>
                            ) :
                            budget.state === 'accepted' ? (
                                <span className="bg-teal-800 border-2 border-teal-900">Aceptado</span>
                            ) :
                            budget.state === 'rejected' ? (
                                <span className="bg-red-800 border-2 border-gray-900">Rechazado</span>
                            ) :
                            budget.state === 'paid' ? (
                                <span className="bg-lime-800 border-2 border-lime-900">Pagado</span>
                            ) :
                            budget.state === 'canceled' ? (
                                <span className="bg-orange-800 border-2 border-orange-900">Cancelado</span>
                            ) : (<p>?</p>)
                        }</p>
                        <p>Enviado el: {cureDate(budget.createDate).ddMMyyyy}</p>
                    </div>
                    <table className="w-full m-auto text-center border border-black">
                        <thead className="bg-slate-500 border-x border-b-2 border-black">
                            <tr className={`${darkMode ? 'bg-slate-900' : 'bg-slate-400'} [&>*]:w-1/6 [&>*]:py-1 [&>*]:text-lg [&>*]:border-b-2 [&>*]:border-black`}>
                                <th>Capítulo</th>
                                <th>Unidad</th>
                                <th>Cantidad</th>
                                <th>Precio/unidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody className={`
                        ${darkMode?'[&>tr:nth-child(2n+1)]:bg-slate-700':'[&>tr:nth-child(2n+1)]:bg-slate-100'} ${darkMode?'[&>tr:nth-child(2n)]:bg-slate-800':'[&>tr:nth-child(2n)]:bg-slate-200'}
                        [&>tr.chapter]:border-x [&>tr.chapter]:border-black
                        `}>
                            {budget.chapters && budget.chapters.map((chapter) => (
                                <ChapterComponent key={chapter} chapterEndpoint={chapter} />
                            ))}
                            <tr className="border-t-2 border-black">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="ps-5 text-left border-s border-black">
                                    Total
                                </td>
                                <td className="text-center border-e border-black">
                                    {(budget.total/1.21).toFixed(2)}€
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="ps-5 text-left border-s border-black">
                                    IVA - 21%
                                </td>
                                <td className="text-center border-e border-black">
                                    {((budget.total/1.21) * 0.21).toFixed(2)}€
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="ps-5 text-left border-s border-b border-black">
                                    Total con iva
                                </td>
                                <td className="text-center border-e border-b border-black font-semibold">
                                    {budget.total.toFixed(2)}€
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {allowRoleEqual(userData.roles, 0) && budget.state === 'pending' && (
                        <div className="flex gap-10">
                            <button className="bg-[#01203C] text-white px-2 py-3 text-sm rounded-md my-5 hover:bg-[#21405C]" onClick={() => handleModifyBudget('accepted')}>Aceptar presupuesto</button>
                            <button className="bg-white border-4 border-[#01203C] px-1 py-2 text-sm rounded-md my-5 hover:bg-slate-200" onClick={() => handleModifyBudget('rejected')}>Rechazar presupuesto</button>
                        </div>
                    )}
                    {allowRoleEqual(userData.roles, 0) && budget.state === 'accepted' && (
                        <div className="flex gap-10">
                            <button className="bg-[#01203C] text-white px-2 py-3 text-sm rounded-md my-5 hover:bg-[#21405C]" onClick={() => handleModifyBudget('paid')}>Pagar</button>
                        </div>
                    )}
                    {allowRoleAbove(userData.roles, 1) && budget.state === 'pending' && (
                        <div className="flex gap-10">
                            <button className="bg-[#01203C] text-white px-2 py-3 text-sm rounded-md my-5 hover:bg-[#21405C]" onClick={() => handleModifyBudget('canceled')}>Cancelar presupuesto</button>
                            {/* <button className="bg-white border-4 border-[#01203C] px-1 py-2 text-sm rounded-md my-5 hover:bg-slate-200">Rechazar presupuesto</button> */}
                        </div>
                    )}
                    {allowRoleAbove(userData.roles, 1) && budget.state === 'draft' && (
                        <div className="flex gap-10">
                            <button className="bg-[#01203C] text-white px-2 py-3 text-sm rounded-md my-5 hover:bg-[#21405C]" onClick={() => handleModifyBudget('pending')}>Enviar presupuesto</button>
                            {/* <button className="bg-white border-4 border-[#01203C] px-1 py-2 text-sm rounded-md my-5 hover:bg-slate-200">Rechazar presupuesto</button> */}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default BudgetPage;
