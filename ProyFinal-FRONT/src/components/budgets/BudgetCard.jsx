import { useNavigate } from "react-router-dom";
import { allowRoleAbove, cureDate } from "../../utils/functions";
import ApiService from "../../utils/ApiService";
import { useContext, useEffect, useState } from "react";
import ContextComponent from "../../context/ContextComponent";
import Swal from "sweetalert2";

const api = new ApiService('http://127.0.0.1:8000/api');

const BudgetCard = ({ budget }) => {
    const { darkMode, userData } = useContext(ContextComponent);
    const navigate = useNavigate();

    return (
        <>
            <td onClick={() => navigate(`/budget/${budget.id}`)} className="text-left pl-2">{budget.title}</td>
            <td onClick={() => navigate(`/budget/${budget.id}`)}><p className="py-1 text-white">{
                budget.state === 'pending' ? (
                    <span className="bg-green-700 border-2 border-green-900 rounded px-1 font-semibold">Pendiente</span>
                ) :
                    budget.state === 'draft' ? (
                        <span className="bg-gray-700 border-2 border-gray-900 rounded px-1 font-semibold">Ocultado</span>
                    ) :
                        budget.state === 'accepted' ? (
                            <span className="bg-teal-700 border-2 border-teal-900 rounded px-1 font-semibold">Aceptado</span>
                        ) :
                            budget.state === 'rejected' ? (
                                <span className="bg-red-700 border-2 border-red-900 rounded px-1 font-semibold">Rechazado</span>
                            ) :
                                budget.state === 'paid' ? (
                                    <span className="bg-lime-700 border-2 border-lime-900 rounded px-1 font-semibold">Pagado</span>
                                ) :
                                    budget.state === 'canceled' ? (
                                        <span className="bg-orange-700 border-2 border-orange-900 rounded px-1 font-semibold">Cancelado</span>
                                    ) : (<p>?</p>)
            }</p></td>
            <td onClick={() => navigate(`/budget/${budget.id}`)}>
                {budget.createDate ? cureDate(budget.createDate).ddMMyyyy : 'Fecha no disponible'}
            </td>
            <td onClick={() => navigate(`/budget/${budget.id}`)} className="hidden lg:table-cell">{budget.total}€</td>
        </>
    );
};

export default BudgetCard;
