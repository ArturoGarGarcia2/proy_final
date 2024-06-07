import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ContextComponent from "../context/ContextComponent";
import { allowRoleAbove, getRoleType } from "../utils/functions";
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';

const handleRedirect = () => {
    window.location.href = 'http://localhost:8000/register';
}

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode, userData, logged, setLogged, setUserData } = useContext(ContextComponent);

    const handleLogout = () => {
        setLogged(false);
        setUserData({});
        localStorage.removeItem('token');
    }

    return (
        <header className={`z-10 w-full h-[10%] lg:h-[7%] flex gap-4 items-center fixed top-0 left-0 ${darkMode ? 'bg-slate-900 text-slate-50' : 'bg-slate-100 text-black'} justify-between px-10 border-b-2 border-gray-300`}>
            <div></div>
            <div></div>
            <div></div>
            <div>
                <div className={`${location.pathname.startsWith('/project/') && allowRoleAbove(userData.roles, 1) || location.pathname.startsWith('/budget/') || location.pathname.startsWith('/newProduct') ? 'block' : 'hidden'}`}>
                    <button onClick={() => navigate(-1)}>Volver atrás</button>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div>
                    <p className="text-xl font-bold">{logged ? userData.name : 'No estás logueado'}</p>
                </div>
                <div className={`${!logged ? 'block' : 'hidden'} text-xl`}>
                    Haz <Link className="hover:text-gray-400 text-indigo-800 cursor-pointer hover:underline" to='login'>login</Link> o <a className="hover:text-gray-400 text-xl text-indigo-800 cursor-pointer hover:underline" onClick={handleRedirect}>regístrate</a>
                </div>
                {logged && (
                    <>
                    <div className={`text-3xl rounded-full ${getRoleType(userData.roles) === 0 ? 'bg-indigo-400' : getRoleType(userData.roles) === 1 ? 'bg-rose-500' : 'bg-emerald-500'} p-2 h-12 w-12 font-bold flex items-center justify-center`}>
                        {userData.name && userData.name.trim().substring(0, 1)}
                    </div>
                    <li className={`${!logged ? 'hidden' : 'block'}`}>
                        <a className={`hover:text-gray-400 text-xl text-black cursor-pointer hover:underline`} onClick={handleLogout}>
                            {darkMode ? (<LogoutSharpIcon style={{ fontSize: 35, color: 'white' }} className='hover:opacity-70' />) : (<LogoutSharpIcon style={{ fontSize: 35, color: 'black' }} className='hover:opacity-70' />)}
                        </a>
                    </li>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
