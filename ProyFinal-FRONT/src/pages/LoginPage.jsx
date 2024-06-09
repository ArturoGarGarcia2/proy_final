import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../utils/ApiService";
import ContextComponent from "../context/ContextComponent";
import Spinner from "../components/Spinner";

const api = new ApiService();

const LoginPage = () => {
    const { setLogged, setUserData } = useContext(ContextComponent);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev =>({ ...prev, [name]: value }));
    };

    const login = async () => {
        setLoading(true);

        try{
            const response = await api.post('login_check', formData);

            if(response.token){
                setLogged(true);
                localStorage.removeItem('token');
                localStorage.setItem('token', response.token);
                const userDataResponse = await api.get('users', localStorage.getItem('token'));
                setUserData(userDataResponse['hydra:member'].filter((user) => user.email.trim().toLowerCase() === formData.username.trim().toLowerCase())[0]);
                navigate('/');
            } else {
                console.error('Credenciales inválidas');
            }

        } catch(error) {
            console.error('Ha surgido un error', error);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    }

    const handleRedirect = () => {
        window.location.href = 'http://localhost:8000/register';
    }

    return (
        <>
        {loading && (<Spinner/>)}
        {!loading && (
            <>
            <main className="hidden lg:flex">
                <div className="w-1/4">
                    <div className="w-4/5 mx-auto mt-40">
                        {/* <Link to='/'>Volver</Link> */}

                        <h1 className="text-2xl font-bold mb-40">Inicio de sesión</h1>
                        <form id="registrationForm" className="
                            flex flex-col items-center w-full
                            
                            [&>div>input]:bg-gray-300 [&>div>input]:rounded-sm [&>div>input]:border-2
                            [&>div>input]:border-gray-500 [&>div>input]:focus:outline-none
                            [&>div>input]:py-1 [&>div>input]:px-3 
                            
                            [&>div>label]:py-1 [&>div>label]:px-3 [&>div>label]:font-semibold
                            
                            [&>div>*]:w-full

                            [&>div]:my-1 [&>div]:mx-3 [&>div]:py-1 [&>div]:px-3 [&>div]:w-full
                            ">
                            <div>
                                <label htmlFor="username">Email:</label><br/>
                                <input type="email" id="username" name="username" value={formData.username} onChange={handleChange} onKeyPress={handleKeyPress}/><br/>
                            </div>
                            <div>
                                <label htmlFor="password">Contraseña:</label><br/>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} onKeyPress={handleKeyPress}/><br/><br/>
                            </div>
                            <button className="bg-slate-500 hover:bg-slate-600 py-1 px-2 rounded text-white" type="button" onClick={login}>Iniciar sesión</button>
                        </form>

                        <p className="text-center mt-10">Si no tienes cuenta, <a className="text-blue-700 underline cursor-pointer" onClick={handleRedirect}>regístrate</a></p>
                    </div>

                </div>
                <div
                    className="h-screen w-3/4 relative bg-local bg-cover bg-center"
                    style={{ backgroundImage: `url('/fondo_login.jpg')` }}>
                </div>
            </main>

            <main className="block lg:hidden">
                <div
                    className="h-screen bg-local bg-cover bg-center pt-40"
                    style={{ backgroundImage: `url('/fondo_login.jpg')` }}>
                    <div className="w-3/4 mx-auto bg-white p-4">
                        {/* <Link to='/'>Volver</Link> */}

                        <h1 className="text-2xl font-bold m-auto">Registro de Usuario:</h1>
                        <form id="registrationForm" className="
                            flex flex-col items-center
                            
                            [&>div>input]:bg-gray-300 [&>div>input]:rounded-sm [&>div>input]:border-2
                            [&>div>input]:border-gray-500 [&>div>input]:focus:outline-none
                            [&>div>input]:py-1 [&>div>input]:px-3 
                            
                            [&>div>label]:py-1 [&>div>label]:px-3 [&>div>label]:font-semibold
                            
                            [&>div]:my-1 [&>div]:mx-3 [&>div]:py-1 [&>div]:px-3
                            ">
                            <div>
                                <label htmlFor="username">Email:</label><br/>
                                <input type="email" id="username" name="username" value={formData.username} onChange={handleChange} onKeyPress={handleKeyPress}/><br/>
                            </div>
                            <div>
                                <label htmlFor="password">Contraseña:</label><br/>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} onKeyPress={handleKeyPress}/><br/><br/>
                            </div>
                            <button className="bg-slate-500 hover:bg-slate-600 py-1 px-2 rounded text-white" type="button" onClick={login}>Iniciar sesión</button>
                        </form>
                    </div>
                </div>
            </main>
            </>
        )}
        </>
    )
}

export default LoginPage;
