import { useContext, useEffect, useState } from "react";
import ApiService from "../../utils/ApiService";
import ContextComponent from "../../context/ContextComponent";
import { allowRoleAbove, cureDate } from "../../utils/functions";
import Swal from "sweetalert2";

const api = new ApiService();

const MeetingCard = ({ meeting, id }) => {
    const { userData } = useContext(ContextComponent);
    const [meetingViewed, setMeetingViewed] = useState(meeting);

    const handleReject = async (e, id) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "Rechazar cita",
            text: `Vas a rechazar la cita del día ${cureDate(meeting.date).ddMMyyyy} a las ${cureDate(meeting.date).HHmm}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'No, cancelar'
        });

        if (result.isConfirmed) {
            const data = { state: 'rejected' };
            const response = await api.patch('meetings', id, data, localStorage.getItem('token'));
            meeting.state = 'rejected';
            setMeetingViewed(prev => ({ ...prev, state: 'rejected' }));

            if (response['@context'] === '/api/contexts/Error') {
                Swal.fire('Error', 'Hubo un problema al rechazar la cita.', 'error');
            } else {
                Swal.fire('Rechazada', 'La cita ha sido rechazada.', 'success');
            }
        }
    };

    const handleAccept = async (e, id) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "Aceptar cita",
            text: `Vas a aceptar la cita del día ${cureDate(meeting.date).ddMMyyyy} a las ${cureDate(meeting.date).HHmm}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, aceptar',
            cancelButtonText: 'No, cancelar'
        });

        if (result.isConfirmed) {
            const data = { state: 'accepted' };
            const response = await api.patch('meetings', id, data, localStorage.getItem('token'));
            meeting.state = 'accepted';
            setMeetingViewed(prev => ({ ...prev, state: 'accepted' }));

            if (response['@context'] === '/api/contexts/Error') {
                Swal.fire('Error', 'Hubo un problema al aceptar la cita.', 'error');
            } else {
                Swal.fire('Aceptada', 'La cita ha sido aceptada.', 'success');
            }
        }
    };

    const handleCancel = async (e, id) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "Cancelar cita",
            text: `Vas a cancelar la cita del día ${cureDate(meetingViewed.date).ddMMyyyy} a las ${cureDate(meetingViewed.date).HHmm}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar la cita',
            cancelButtonText: 'No, no cancelar la cita'
        });

        if (result.isConfirmed) {
            const data = { state: 'canceled' };
            const response = await api.patch('meetings', id, data, localStorage.getItem('token'));
            meetingViewed.state = 'canceled';
            setMeetingViewed(prev => ({ ...prev, state: 'canceled' }));

            if (response['@context'] === '/api/contexts/Error') {
                Swal.fire('Error', 'Hubo un problema al cancelar la cita.', 'error');
            } else {
                Swal.fire('Cancelada', 'La cita ha sido cancelada.', 'success');
            }
        }
    };

    const handleDone = async (e, id) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "¿Se realizó la cita?",
            text: `Por favor, selecciona una opción para la cita del día ${cureDate(meetingViewed.date).ddMMyyyy} a las ${cureDate(meetingViewed.date).HHmm}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, se realizó',
            cancelButtonText: 'Aún no',
            showDenyButton: true,
            denyButtonText: 'No, no se realizó',
        });

        if (result.isConfirmed) {
            const data = { state: 'done' };
            const response = await api.patch('meetings', id, data, localStorage.getItem('token'));
            meetingViewed.state = 'done';
            setMeetingViewed(prev => ({ ...prev, state: 'done' }));

            if (response['@context'] === '/api/contexts/Error') {
                Swal.fire('Error', 'Hubo un problema al actualizar la cita.', 'error');
            } else {
                Swal.fire('Actualizada', 'La cita ha sido marcada como realizada.', 'success');
            }
        } else if (result.isDenied) {
            const data = { state: 'notdone' };
            const response = await api.patch('meetings', id, data, localStorage.getItem('token'));
            meetingViewed.state = 'notdone';
            setMeetingViewed(prev => ({ ...prev, state: 'notdone' }));

            if (response['@context'] === '/api/contexts/Error') {
                Swal.fire('Error', 'Hubo un problema al actualizar la cita.', 'error');
            } else {
                Swal.fire('Actualizada', 'La cita ha sido marcada como no realizada.', 'success');
            }
        }
    };

    return (
        <div className='bg-white text-black rounded w-[45%] lg:w-40 p-4 flex flex-col items-center justify-between h-60 duration-200 hover:-translate-y-1'>
            <div>
                <h1 className='font-semibold'>{meetingViewed.place}</h1>
                <p className='font-semibold'>{cureDate(meetingViewed.date).fullDate}</p>
            </div>

            <div className='flex flex-col gap-2 py-5 justify-center'>
                {meetingViewed.createdBy === userData['@id'] ? (
                    <div className="py-1 text-white">{
                        meetingViewed.state === 'pending' ? (
                            <>
                                <div className="flex flex-col gap-4">
                                    <span className="bg-blue-700 border-2 border-green-900 rounded px-1 font-semibold">Pendiente</span>
                                    <button className="bg-slate-500 hover:bg-slate-600 rounded py-1 px-2" onClick={(e) => handleCancel(e, meetingViewed.id)}>Cancelar</button>
                                </div>
                            </>
                        ) :
                        meetingViewed.state === 'accepted' ? (
                            <div className="flex flex-col gap-4">
                                <span className="text-center bg-cyan-700 border-2 border-teal-900 rounded px-1 font-semibold">Aceptada</span>
                                <button className={`bg-slate-500 hover:bg-slate-600 rounded py-1 px-2 ${allowRoleAbove(userData.roles,1) && cureDate(meeting.date).ddMMyyy === cureDate(new Date()).ddMMyyy }`} onClick={(e) => handleDone(e, meetingViewed.id)}>¿Realizada?</button>
                            </div>
                        ) :
                        meetingViewed.state === 'rejected' ? (
                            <span className="bg-rose-700 border-2 border-rose-900 rounded px-1 font-semibold">Rechazada</span>
                        ) :
                        meetingViewed.state === 'done' ? (
                            <span className="bg-lime-700 border-2 border-lime-900 rounded px-1 font-semibold">Realizada</span>
                        ) :
                        meetingViewed.state === 'notdone' ? (
                            <span className="bg-gray-700 border-2 border-lime-900 rounded px-1 font-semibold">No realizada</span>
                        ) :
                        meetingViewed.state === 'canceled' ? (
                            <span className="bg-amber-700 border-2 border-orange-900 rounded px-1 font-semibold">Cancelada</span>
                        ) : (<p>?</p>)
                    }</div>
                ) : (
                    <div className="py-1 text-white">{
                        meetingViewed.state === 'pending' ? (
                            <div className="flex flex-col gap-4">
                                <button className="bg-slate-500 hover:bg-slate-600 rounded py-1 px-2" onClick={(e) => handleAccept(e, meetingViewed.id)}>Aceptar</button>
                                <button className="bg-slate-500 hover:bg-slate-600 rounded py-1 px-2" onClick={(e) => handleReject(e, meetingViewed.id)}>Rechazar</button>
                            </div>
                        ) :
                        meetingViewed.state === 'accepted' ? (
                            <div className="flex flex-col gap-4">
                                <span className="text-center bg-teal-700 border-2 border-teal-900 rounded px-1 font-semibold">Aceptada</span>
                                <button className={`bg-slate-500 hover:bg-slate-600 rounded py-1 px-2 ${allowRoleAbove(userData.roles,1) && cureDate(meeting.date).ddMMyyy === cureDate(new Date()).ddMMyyy }`} onClick={(e) => handleDone(e, meetingViewed.id)}>¿Realizada?</button>
                            </div>
                        ) :
                        meetingViewed.state === 'rejected' ? (
                            <span className="bg-rose-700 border-2 border-rose-900 rounded px-1 font-semibold">Rechazada</span>
                        ) :
                        meetingViewed.state === 'done' ? (
                            <span className="bg-lime-700 border-2 border-lime-900 rounded px-1 font-semibold">Realizada</span>
                        ) :
                        meetingViewed.state === 'notdone' ? (
                            <span className="bg-gray-700 border-2 border-lime-900 rounded px-1 font-semibold">No realizada</span>
                        ) :
                        meetingViewed.state === 'canceled' ? (
                            <span className="bg-orange-700 border-2 border-orange-900 rounded px-1 font-semibold">Cancelada</span>
                        ) : (<p>?</p>)
                    }</div>
                )}
            </div>
        </div>
    );
}

export default MeetingCard;
