import { useNavigate } from "react-router-dom"
import { cureDate } from "../utils/functions"


const MeetingPageComponent = ({data}) => {
    const navigate = useNavigate()

    const handleRedirect = (id) => {
        navigate(`/project/${id}`)
    }

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

    return (
        <>
            {data.map(data => (
                <tr key={data.meeting.id} onClick={()=>handleRedirect(data.project.id)}>
                    <td>
                    {cureDate(data.meeting.date).ddMMyyyy}
                    <br />
                    {cureDate(data.meeting.date).HHmm}
                    </td>

                    <td>
                    {data.meeting.place}
                    </td>

                    <td>
                    {data.client.name}
                    </td>

                    <td className="hidden lg:table-cell text-white">
                    {
                    data.meeting.state === 'pending' ? (
                        <span className="bg-blue-700 border-2 border-teal-900 rounded px-1 font-semibold">Pendiente</span>
                    ) :
                    data.meeting.state === 'accepted' ? (
                        <span className="bg-cyan-700 border-2 border-teal-900 rounded px-1 font-semibold">Aceptada</span>
                    ) :
                    data.meeting.state === 'rejected' ? (
                        <span className="bg-rose-700 border-2 border-red-900 rounded px-1 font-semibold">Rechazada</span>
                    ) :
                    data.meeting.state === 'done' ? (
                        <span className="bg-lime-700 border-2 border-lime-900 rounded px-1 font-semibold">Realizada</span>
                    ) :
                    data.meeting.state === 'notdone' ? (
                        <span className="bg-gray-700 border-2 border-lime-900 rounded px-1 font-semibold">No realizada</span>
                    ) :
                    data.meeting.state === 'canceled' ? (
                        <span className="bg-amber-700 border-2 border-orange-900 rounded px-1 font-semibold">Cancelada</span>
                    ) : (<p>?</p>)}
                    </td>
                </tr>
            ))}
        </>
    )
}

export default MeetingPageComponent