import { useContext, useEffect, useState } from "react";
import ApiService from "../utils/ApiService";
import { cureDate } from "../utils/functions";
import Spinner from "../components/Spinner";
import ContextComponent from "../context/ContextComponent";
import MeetingPageComponent from "../components/MeetingPageComponent";
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';

const api = new ApiService();

const MeetingsPage = () => {
    const { darkMode } = useContext(ContextComponent);
    const [loading, setLoading] = useState(true);
    const [meetings, setMeetings] = useState([]);
    const [nextMeetings, setNextMeetings] = useState([]);
    const [pendingMeetings, setPendingMeetings] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });

    const loadData = async () => {
        try {
            const response = await api.get('meeting', localStorage.getItem('token'));
            if (response['@context'] === '/api/contexts/Error') {
                console.error('error en', response);
            } else {
                const preData = response.result;

                const data = preData.sort((a, b) => new Date(a.meeting.date) - new Date(b.meeting.date));
                setMeetings(data);

                const now = new Date();
                const fiveDaysLater = new Date();
                fiveDaysLater.setDate(now.getDate() + 5);
                const preFilteredNextMeetings = data.filter(d => {
                    const meetingDate = new Date(d.meeting.date);
                    return meetingDate >= now && meetingDate <= fiveDaysLater;
                });
                const filteredNextMeetings = preFilteredNextMeetings.filter(d => d.meeting.state === 'pending' || d.meeting.state === 'accepted');
                setNextMeetings(filteredNextMeetings);

                const filteredPendingMeetings = data.filter(d => d.meeting.state === 'pending');
                setPendingMeetings(filteredPendingMeetings);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedMeetings = (data) => {
        if (sortConfig !== null) {
            data.sort((a, b) => {
                if (a.meeting[sortConfig.key] < b.meeting[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a.meeting[sortConfig.key] > b.meeting[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return data;
    };

    const renderSortIcon = (key) => {
        if (sortConfig.key === key) {
            return <ArrowUpwardSharpIcon style={{ fontSize: 20, color: 'white', transform: sortConfig.direction === 'ascending' ? 'rotate(0deg)' : 'rotate(180deg)' }} />;
        }
        return null;
    };

    return (
        <>
            {loading && (<Spinner />)}
            {!loading && (
                <div className="w-4/5 m-auto pt-10">
                    <h1 className="text-4xl font-bold mb-8">Citas:</h1>

                    <div className={`
                    flex flex-col lg:flex-row gap-4 flex-wrap justify-evenly
                    [&>div]:w-full lg:[&>div.chiqui]:w-[45%]
                    [&>div>table]:text-center [&>div>table]:border [&>div>table]:border-black [&>div>table]:w-full
                    [&>div>table>thead]:text-white [&>div>table>thead]:border-b-2 [&>div>table>thead]:border-black [&>div>table>thead]:text-lg
                    ${darkMode ?
                        '[&>div>table>thead]:bg-slate-800'
                        :
                        '[&>div>table>thead]:bg-slate-500'
                    }
                    [&>div>table>thead>tr>*]:py-2
                    [&>div>table>thead>tr>*]:font-semibold
                    ${darkMode ?
                        '[&>div>table>tbody>tr:nth-child(2n)]:bg-slate-700 [&>div>table>tbody>tr:nth-child(2n-1)]:bg-slate-600 hover:[&>div>table>tbody>tr]:bg-slate-500'
                        :
                        '[&>div>table>tbody>tr:nth-child(2n)]:bg-slate-300 [&>div>table>tbody>tr:nth-child(2n-1)]:bg-slate-200 hover:[&>div>table>tbody>tr]:bg-slate-400'}
                    [&>div>table>tbody>tr>*]:py-2
                    `}>
                        <div className="my-4 chiqui">
                            <h2 className="text-2xl underline mb-2">Citas de los próximos 5 días:</h2>
                            {nextMeetings.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th onClick={() => requestSort('date')}>
                                                Fecha {renderSortIcon('date')}
                                            </th>
                                            <th onClick={() => requestSort('place')}>
                                                Lugar {renderSortIcon('place')}
                                            </th>
                                            <th onClick={() => requestSort('client.name')}>
                                                Cliente {renderSortIcon('client.name')}
                                            </th>
                                            <th className="hidden lg:table-cell" onClick={() => requestSort('state')}>
                                                Estado {renderSortIcon('state')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <MeetingPageComponent data={sortedMeetings(nextMeetings)} />
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay citas en los próximos 5 días.</p>
                            )}
                        </div>
                        <div className="my-4 chiqui">
                            <h2 className="text-2xl underline mb-2">Citas pendientes:</h2>
                            {pendingMeetings.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th onClick={() => requestSort('date')}>
                                                Fecha {renderSortIcon('date')}
                                            </th>
                                            <th onClick={() => requestSort('place')}>
                                                Lugar {renderSortIcon('place')}
                                            </th>
                                            <th onClick={() => requestSort('client.name')}>
                                                Cliente {renderSortIcon('client.name')}
                                            </th>
                                            <th className="hidden lg:table-cell" onClick={() => requestSort('state')}>
                                                Estado {renderSortIcon('state')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <MeetingPageComponent data={sortedMeetings(pendingMeetings)} />
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay citas pendientes.</p>
                            )}
                        </div>
                        <div className="my-4">
                            <h2 className="text-2xl underline mb-2">Todas las citas:</h2>
                            {meetings.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th onClick={() => requestSort('date')}>
                                                Fecha {renderSortIcon('date')}
                                            </th>
                                            <th onClick={() => requestSort('place')}>
                                                Lugar {renderSortIcon('place')}
                                            </th>
                                            <th onClick={() => requestSort('client.name')}>
                                                Cliente {renderSortIcon('client.name')}
                                            </th>
                                            <th className="hidden lg:table-cell" onClick={() => requestSort('state')}>
                                                Estado {renderSortIcon('state')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <MeetingPageComponent data={sortedMeetings(meetings)} />
                                    </tbody>
                                </table>
                            ) : (
                                <p>No hay citas.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MeetingsPage;
