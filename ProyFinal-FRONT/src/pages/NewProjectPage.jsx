import { useContext, useState, useEffect } from 'react';
import ContextComponent from '../context/ContextComponent';
import ApiService from '../utils/ApiService';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Swal from 'sweetalert2';

const api = new ApiService();

const NewProjectPage = () => {
    const { userData, setUserData, darkMode } = useContext(ContextComponent);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const maxSteps = 5;
    const [formData, setFormData] = useState({
        address: '',
        ownership: '',
        surface: '',
        type: '',
        description: '',
    });
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        // Validar el formulario cada vez que formData cambie
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const { address, ownership, surface, type, description } = formData;
        if (address && ownership && surface && type && description) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if(step !== maxSteps){
            setStep(prev => prev + 1);
        }
    };
    
    const handlePrevStep = (e) => {
        e.preventDefault();
        if(step !== 1){
            setStep(prev => prev - 1);
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!isFormValid) return; // Si el formulario no es válido, no envía el formulario
        const newProject = {
            ...formData,
            surface: parseFloat(formData.surface),
            client: userData['@id'],
            budgets: [],
            meetings: [],
            news: [],
            state: 'created',
        };
        const response = await api.post('projects', newProject, localStorage.getItem('token'));
        const project = response['@id'];
        setUserData(prev => ({...prev,projects:[...prev.projects, project]}));
        await api.patch('users', userData.id, {projects:[...userData.projects, project]}, localStorage.getItem('token'));
        navigate(`/project/${response.id}`);
        Swal.fire({
            icon:'success',
            title: '¡Enhorabuena!',
            text: 'Estás un paso más cerca de tener el hogar de tus sueños, pide cita para que nuestro equipo se ponga en contacto contigo'
        })
    };

    return (
        <div
            className="min-h-full w-full relative bg-cover bg-bottom overflow-hidden flex items-center justify-center"
            style={{
                backgroundImage: `url('/fondo_intro.jpg')`,
                backgroundRepeat: 'no-repeat',
            }}>
            <div className={`max-h-[25rem] min-h-[25rem] w-1/4 ${darkMode? 'bg-slate-800 text-white':'bg-slate-100 text-black'} rounded-md p-6 flex flex-col justify-center items-center`}>
                <form className="flex flex-col gap-4 h-4/5 justify-between w-4/6">
                    <div>
                        {/* Input para la calle */}
                        <div className={step === 1 ? 'block' : 'hidden'}>
                            <label className="block text-xl font-semibold">Calle:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                placeholder="Introduce la calle"
                                required
                            />
                            <span className='text-xs'>*No tiene por qué ser la misma de residencia</span>
                        </div>
                        {/* Casillas de propietario o alquiler */}
                        <div className={step === 2 ? 'block' : 'hidden'}>
                            <label className="block text-xl font-semibold">Propiedad:</label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="ownership"
                                        value="owner"
                                        checked={formData.ownership === 'owner'}
                                        onChange={handleRadioChange}
                                        className="form-radio"
                                        required
                                    />
                                    <span className="ml-2">Propietario</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="ownership"
                                        value="rent"
                                        checked={formData.ownership === 'rent'}
                                        onChange={handleRadioChange}
                                        className="form-radio"
                                        required
                                    />
                                    <span className="ml-2">Alquiler</span>
                                </label>
                            </div>
                        </div>
                        {/* Input numérico para los metros cuadrados */}
                        <div className={step === 3 ? 'block' : 'hidden'}>
                            <label className="block text-xl font-semibold">Metros cuadrados:</label>
                            <input
                                type="number"
                                name="surface"
                                value={formData.surface}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                placeholder="Introduce los metros cuadrados"
                                required
                            />
                        </div>
                        {/* Casillas de reforma completa o parcial */}
                        <div className={step === 4 ? 'block' : 'hidden'}>
                            <label className="block text-xl font-semibold">Reforma:</label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="complete"
                                        checked={formData.type === 'complete'}
                                        onChange={handleRadioChange}
                                        className="form-radio"
                                        required
                                    />
                                    <span className="ml-2">Completa</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="partial"
                                        checked={formData.type === 'partial'}
                                        onChange={handleRadioChange}
                                        className="form-radio"
                                        required
                                    />
                                    <span className="ml-2">Parcial</span>
                                </label>
                            </div>
                        </div>
                        {/* Input para la descripción */}
                        <div className={step === 5 ? 'block' : 'hidden'}>
                            <label className="block text-xl font-semibold">Idea del proyecto:</label>
                            <textarea
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                placeholder="Cuéntanos un poco qué quieres hacer"
                                required
                            />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-center gap-2 mb-8'>
                            <button className={`p-1 w-1/4 bg-slate-500 text-white rounded hover:bg-slate-600 ${step===1 ? 'opacity-20' : ''}`} onClick={handlePrevStep} disabled={step===1}>
                                <ArrowForwardIosIcon className='rotate-180' style={{ fontSize: 35, color: 'white' }} />
                            </button>
                            <div className='w-1/3 text-center bg-a-500'>{step}/{maxSteps}</div>
                            <button className={`p-1 w-1/4 bg-slate-500 text-white rounded hover:bg-slate-600 ${step===maxSteps ? 'opacity-20' : ''}`} onClick={handleNextStep} disabled={step===maxSteps}>
                                <ArrowForwardIosIcon style={{ fontSize: 35, color: 'white' }} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            className={`p-2 ${isFormValid ? 'bg-slate-500 hover:bg-slate-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded`}
                            onClick={handleSubmitForm}
                            disabled={!isFormValid}
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewProjectPage;
