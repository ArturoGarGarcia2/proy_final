import { useContext, useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import ApiService from "../../utils/ApiService";
import Swal from "sweetalert2";
import ContextComponent from "../../context/ContextComponent";
import MiniSpinner from "../MiniSpinner";

const api = new ApiService();

const MeetingComponent = ({meetingEndpoints,project}) => {
    const { userData } = useContext(ContextComponent);
    const [loading, setLoading] = useState(true)
    const [meetings, setMeetings] = useState([])

    const handleNewMeeting = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Seleccione una fecha y lugar',
            html: `
                <label>
                    <input type="datetime-local" id="newMeetingDateInput" name="date" class="swal2-input" placeholder="Aquí la fecha" required>
                    <input type="text" id="newMeetingPlaceInput" name="place" class="swal2-input" placeholder="Aquí la dirección" required>
                </label>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    [document.getElementById('newMeetingDateInput').name]: document.getElementById('newMeetingDateInput').value,
                    [document.getElementById('newMeetingPlaceInput').name]: document.getElementById('newMeetingPlaceInput').value,
                    state: 'pending',
                    project:project['@id'],
                    createdBy: userData['@id'],
                }
            },
            didOpen: () => {
                const input1 = document.getElementById('newMeetingDateInput');
                const input2 = document.getElementById('newMeetingPlaceInput');
                const confirmButton = Swal.getConfirmButton();
    
                const validateInputs = () => {
                    const dateValue = input1.value;
                    const placeValue = input2.value;
                    
                    // Comprobar que ambos campos no estén vacíos
                    if (dateValue && placeValue) {
                        // Obtener la fecha actual y la fecha ingresada
                        const today = new Date();
                        const inputDate = new Date(dateValue);
    
                        // Comparar las fechas
                        if (inputDate >= today.setHours(0, 0, 0, 0)) {
                            confirmButton.removeAttribute('disabled');
                        } else {
                            confirmButton.setAttribute('disabled', 'disabled');
                        }
                    } else {
                        confirmButton.setAttribute('disabled', 'disabled');
                    }
                };
    
                input1.addEventListener('input', validateInputs);
                input2.addEventListener('input', validateInputs);
    
                // Initial check to disable the button if inputs are empty initially
                validateInputs();
            }
        });
    
        if (formValues) {
            const response = await api.post('meetings',formValues,localStorage.getItem('token'))
            if(response['@context'] === '/api/contexts/Error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response['hydra:description'],
                });
            }else{
                setMeetings(prev => [...prev,response].sort((a, b) => new Date(a.date) - new Date(b.date)))
                Swal.fire({
                    icon:'success',
                    title: '¡Listo!',
                    text: 'La cita se ha creado correctamente',
                })
            }
        }
    }

    const loadData = async () => {
        try {
            const uniqueMeetingEndpoints = new Set(meetingEndpoints);
            const fetchedMeetings = [];
            for (const meetingEndpoint of uniqueMeetingEndpoints) {
                const response = await api.get(meetingEndpoint.substring(5), localStorage.getItem('token'));
                if (response['@context'] === '/api/contexts/Error') {
                    console.error('error en', meetingEndpoint);
                } else {
                    fetchedMeetings.push(response);
                }
            }
            setMeetings(fetchedMeetings.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } catch (error) {
            console.error(error);
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
                <h1 className='text-xl font-bold'>Citas del proyecto:</h1>
                <div>
                <button className={`bg-slate-600 hover:bg-slate-700 py-1 px-3 rounded-md text-white ${!isInactive() && !loading? 'block' : 'hidden'}`} onClick={handleNewMeeting}>Pedir cita</button>
                </div>
            </div>
        {loading && (<MiniSpinner/>)}
        {!loading && (
            <>
            <div className='flex flex-wrap gap-2 justify-evenly lg:justify-start mb-10'>
                {meetingEndpoints.length !== 0 ? meetings.map(meeting => (
                    <MeetingCard key={meeting.id} meeting={meeting} id={meeting.id}/>
                )
                ) : (
                    <p>No hay citas</p>
                )}
            </div>
            </>
        )}
        </>
    )
}

export default MeetingComponent