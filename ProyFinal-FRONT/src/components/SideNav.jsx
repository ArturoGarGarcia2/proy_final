import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import ContextComponent from "../context/ContextComponent";
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HandymanSharpIcon from '@mui/icons-material/HandymanSharp';
import { allowRoleAbove, allowRoleEqual } from "../utils/functions";
import LightModeSharpIcon from '@mui/icons-material/LightModeSharp';
import DarkModeSharpIcon from '@mui/icons-material/DarkModeSharp';
import AdminPanelSettingsSharpIcon from '@mui/icons-material/AdminPanelSettingsSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';

const SideNav = () => {
    const navigate = useNavigate();
    const { wideMode, setWideMode, logged, darkMode, setDarkMode, userData } = useContext(ContextComponent);

    const handleClick = () => setWideMode(!wideMode);

    const handleHome = () => navigate('');

    const handleProject = () => {
        if (userData.projects.length > 0) {
            const project = userData.projects[0].split('/');
            const projectId = project[project.length - 1];
            navigate(`/project/${projectId}`);
        } else {
            navigate(`/newProject`);
        }
    }

    const handleProjects = () => navigate('/projects');

    const handleAdmin = () => navigate('/admin');

    const handleMeetings = () => navigate('/meetings');

    return (
        <aside className={`z-50 bg-[#01203C] flex lg:flex-col ${wideMode ? 'w-[130px]' : 'w-[350px]'} h-16 lg:h-full w-full lg:w-auto items-center justify-between duration-200`}>
            <div className="hidden lg:flex items-center self-start lg:self-auto h-24 mt-[-0.9rem] lg:mt-8">
                <img src="/logo.jpeg" className="w-12 h-12 lg:w-24 lg:h-24 mx-3" alt="" />
                <h1 className={`font-bold text-3xl my-10 w-1/2 text-white ${wideMode ? 'hidden' : 'hidden lg:block'}`}>Reformas Hee Hee</h1>
            </div>
            <button className="mb-20 text-white hidden lg:block font-bold text-4xl" onClick={handleClick}>
                {wideMode ? (<ArrowForwardIosIcon style={{ fontSize: 35, color: 'white' }} />) : (<ArrowBackIosNewIcon style={{ fontSize: 35, color: 'white' }} />)}
            </button>
            <nav className="h-4/5 ml-6 mt-[-1.5rem]">
                <ul className="[&>*]:my-6 flex lg:block gap-6">
                    <li className="flex items-center gap-4 cursor-pointer" onClick={handleHome}>
                        <HomeSharpIcon title="Home" style={{ fontSize: 35, color: 'white' }} className={`${wideMode ? 'hover:opacity-70' : ''}`} />
                        <span title="Home" className={`${wideMode ? 'hidden' : 'hidden lg:block'} hover:text-gray-400 text-xl text-white cursor-pointer hover:underline`}>Home</span>
                    </li>

                    <li className={`${logged && allowRoleEqual(userData.roles, 0) ? 'block' : 'hidden'} flex items-center gap-4 cursor-pointer`} onClick={handleProject}>
                        <HandymanSharpIcon title="Proyecto" style={{ fontSize: 35, color: 'white' }} className={`${wideMode ? 'hover:opacity-70' : ''}`} />
                        <span title="Proyecto" className={`${wideMode ? 'hidden' : 'hidden lg:block'} hover:text-gray-400 text-xl text-white cursor-pointer hover:underline`}>Proyecto</span>
                    </li>

                    <li className={`${logged && allowRoleAbove(userData.roles, 1) ? 'block' : 'hidden'} flex items-center gap-4 cursor-pointer`} onClick={handleProjects}>
                        <HandymanSharpIcon title="Proyectos" style={{ fontSize: 35, color: 'white' }} className={`${wideMode ? 'hover:opacity-70' : ''}`} />
                        <span title="Proyectos" className={`${wideMode ? 'hidden' : 'hidden lg:block'} hover:text-gray-400 text-xl text-white cursor-pointer hover:underline`}>Proyectos</span>
                    </li>

                    <li className={`${logged && allowRoleAbove(userData.roles, 1) ? 'block' : 'hidden'} flex items-center gap-4 cursor-pointer`} onClick={handleMeetings}>
                        <CalendarMonthSharpIcon title="Citas" style={{ fontSize: 35, color: 'white' }} className={`${wideMode ? 'hover:opacity-70' : ''}`} />
                        <span title="Citas" className={`${wideMode ? 'hidden' : 'hidden lg:block'} hover:text-gray-400 text-xl text-white cursor-pointer hover:underline`}>Citas</span>
                    </li>

                    <li className={`${logged && allowRoleAbove(userData.roles, 2) ? 'block' : 'hidden'} flex items-center gap-4 cursor-pointer`} onClick={handleAdmin}>
                        <AdminPanelSettingsSharpIcon title="Administración" style={{ fontSize: 35, color: 'white' }} className={`${wideMode ? 'hover:opacity-70' : ''}`} />
                        <span title="Administración" className={`${wideMode ? 'hidden' : 'hidden lg:block'} hover:text-gray-400 text-xl text-white cursor-pointer hover:underline`}>Administración</span>
                    </li>
                    {/* <li>
                        <a className={`hover:text-gray-400 text-xl text-white cursor-pointer hover:underline`} onClick={handleTest}>Test</a>
                    </li> */}
                </ul>
            </nav>
            <div className=" mt-10">
                <button
                    className={`mr-4 lg:mr-0 mb-9 transform transition-transform duration-500 ${
                        darkMode ? 'rotate-180' : 'rotate-0'
                    }`}
                    onClick={() => setDarkMode(prev => !prev)}
                >
                    {darkMode ? (
                        <>
                        <LightModeSharpIcon style={{ fontSize: 35, color: 'white' }} className='hover:opacity-70' />
                        </>
                    ) : (
                        <>
                        <DarkModeSharpIcon style={{ fontSize: 35, color: 'white' }} className='hover:opacity-70' />
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}

export default SideNav;
