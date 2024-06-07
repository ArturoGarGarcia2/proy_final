import { useContext, useEffect, useState } from "react";
import ApiService from "../utils/ApiService";
import Spinner from "../components/Spinner";
import { getRoleType } from "../utils/functions";
import Swal from "sweetalert2";
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import ContextComponent from "../context/ContextComponent";

const api = new ApiService('http://127.0.0.1:8000/api');

const AdminPage = () => {
    const { darkMode } = useContext(ContextComponent);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [roleChanges, setRoleChanges] = useState({});
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState(true);

    const loadData = async () => {
        try {
            const response = await api.get('users', localStorage.getItem('token'));
            if (response['@context'] === '/api/contexts/Error') {
                console.log('error en', response);
            } else {
                setUsers(response['hydra:member']);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setRoleChanges(prev => ({
            ...prev,
            [userId]: newRole
        }));
    };

    const saveChanges = async () => {
        setLoading(true);
        try {
            for (const [userId, newRole] of Object.entries(roleChanges)) {
                const newRoleChanged = newRole === 0 
                    ? ['ROLE_USER'] 
                    : newRole === 1 
                        ? ['ROLE_AGENT'] 
                        : ['ROLE_ADMIN'];
                const response = await api.patch('users',userId, { roles: newRoleChanged }, localStorage.getItem('token'));
                if (response['@context'] === '/api/contexts/Error') {
                    console.log('error en', response);
                } else {
                    setUsers(prevUsers => prevUsers.map(user => user.id === parseInt(userId) ? { ...user, roles: newRoleChanged } : user));
                }
            }
            setRoleChanges({});
            Swal.fire({
                icon: 'success',
                text: 'Se han guardado los cambios correctamente'
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field) => {
        const isSameField = sortField === field;
        const newSortDirection = isSameField ? !sortDirection : true;
        setSortField(field);
        setSortDirection(newSortDirection);
        const sortedUsers = [...users].sort((a, b) => {
            if (a[field] < b[field]) return newSortDirection ? -1 : 1;
            if (a[field] > b[field]) return newSortDirection ? 1 : -1;
            return 0;
        });
        setUsers(sortedUsers);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {loading && (<Spinner />)}
            {!loading && (
                <div className="w-4/5 m-auto my-10">
                    <h1 className="font-bold text-3xl mt-20 my-10 underline">Panel de Administración:</h1>
                    <table className="text-center w-full border border-black">
                        <thead>
                            <tr className={`text-lg [&>*]:w-1/5 ${darkMode? 'bg-slate-900':'bg-slate-400'} border-b-2 border-black`}>
                                <th onClick={() => handleSort('name')} className="cursor-pointer">
                                    Nombre
                                    {sortField === 'name' && (
                                        <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th onClick={() => handleSort('email')} className="cursor-pointer">
                                    Email
                                    {sortField === 'email' && (
                                        <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th>Rol</th>
                                <th onClick={() => handleSort('address')} className="cursor-pointer">
                                    Dirección
                                    {sortField === 'address' && (
                                        <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                                <th onClick={() => handleSort('phone')} className="cursor-pointer">
                                    Número
                                    {sortField === 'phone' && (
                                        <ArrowUpwardSharpIcon title="Proyectos" style={{ fontSize: 20, color: 'black' }} className={`${sortDirection ? 'rotate-180':'rotate-0'}`}/>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`cursor-pointer ${darkMode ? '[&>tr:nth-child(2n+1)]:bg-slate-700 hover:[&>tr:nth-child(2n+1)]:bg-slate-500' : '[&>tr:nth-child(2n+1)]:bg-slate-100 hover:[&>tr:nth-child(2n+1)]:bg-slate-300'} ${darkMode ? '[&>tr:nth-child(2n)]:bg-slate-800 hover:[&>tr:nth-child(2n)]:bg-slate-500' : '[&>tr:nth-child(2n)]:bg-slate-200 hover:[&>tr:nth-child(2n)]:bg-slate-300'}`}>
                            {users.length !== 0 ? users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="flex justify-center">
                                            {[0, 1, 2].map(roleValue => (
                                                <label key={roleValue} className="flex items-center mx-1">
                                                    <input
                                                        type="radio"
                                                        name={`role-${user.id}`}
                                                        value={roleValue}
                                                        checked={roleChanges[user.id] !== undefined 
                                                            ? roleChanges[user.id] === roleValue 
                                                            : getRoleType(user.roles) === roleValue}
                                                        onChange={() => handleRoleChange(user.id, roleValue)}
                                                    />
                                                    {roleValue}
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{user.address}</td>
                                    <td>{user.phone}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5">No existen usuarios</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {Object.keys(roleChanges).length > 0 && (
                        <div className="flex justify-end mt-4">
                            <button 
                                className="bg-blue-500 text-white py-2 px-4 rounded" 
                                onClick={saveChanges}
                            >
                                Guardar cambios
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AdminPage;
