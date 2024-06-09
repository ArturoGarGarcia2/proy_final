import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import ApiService from "../utils/ApiService";
import Spinner from "../components/Spinner";
import Swal from 'sweetalert2';
import ContextComponent from "../context/ContextComponent";

const api = new ApiService();

const NewBudgetPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [budget, setBudget] = useState("");
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);
    const { darkMode } = useContext(ContextComponent);

    const handleAddChapter = () => {
        setChapters([
            ...chapters,
            { description: "", unit: "m²", quantity: 0, pricePerUnit: 0, total: 0 }
        ]);
    };

    const handleChapterChange = (index, field, value) => {
        const newChapters = [...chapters];
        if (field === "quantity" || field === "pricePerUnit") {
            newChapters[index][field] = parseFloat(value);
        } else {
            newChapters[index][field] = value;
        }

        if (!isNaN(newChapters[index].quantity) && !isNaN(newChapters[index].pricePerUnit)) {
            newChapters[index].total = newChapters[index].quantity * newChapters[index].pricePerUnit;
        } else {
            newChapters[index].total = 0;
        }

        setChapters(newChapters);
    };

    const handleRemoveChapter = (index) => {
        const newChapters = chapters.filter((_, i) => i !== index);
        setChapters(newChapters);
    };

    const handleSubmit = async () => {
        const result = await Swal.fire({
            title: 'Guardar presupuesto',
            text: "¿Deseas enviarlo ya o guardarlo en oculto?",
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Enviar',
            denyButtonText: 'Guardarlo en oculto',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed || result.isDenied) {
            const subtotal = chapters.reduce((acc, chapter) => acc + chapter.total, 0);
        
            const total = subtotal * 1.21;
        
            const budgetData = {
                budget: {
                    title: budget,
                    project: `/api/projects/${projectId}`,
                    state: result.isConfirmed ? 'pending' : 'draft',
                    total: parseFloat(total.toFixed(2)),
                    createDate: new Date(),
                },
                chapters,
            };
        
            setLoading(true);
        
            try {
                // Envía la solicitud para crear el presupuesto
                const budgetResponse = await api.post(`budgets`, budgetData.budget, localStorage.getItem('token'));
        
                // Envía las solicitudes para crear los capítulos
                await Promise.all(budgetData.chapters.map(async (chapter) => {
                    await api.post('chapters', { ...chapter, budget: budgetResponse['@id'] }, localStorage.getItem('token'));
                }));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                navigate(-1);
            }
        }
    };

    const isFormValid = () => {
        if (!budget || chapters.length === 0) return false;
        return chapters.every(chapter => 
            chapter.description && 
            chapter.unit && 
            chapter.quantity > 0 && 
            chapter.pricePerUnit > 0
        );
    };

    return (
        <>
            {loading && (<Spinner/>)}
            <div className="mx-5">
                <h1 className="font-bold text-4xl my-5 mx-10 mt-20">Crear presupuesto:</h1>
                <div className="m-auto w-4/6">
                    <label htmlFor="budgetTitle" className="text-xl">Nombre del presupuesto:</label>
                    <input
                        className="m-3 p-1 rounded text-xl text-black w-full"
                        type="text"
                        id="budgetTitle"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>

                <table className="mt-6 m-auto">
                    <thead>
                        {chapters.length !== 0 && (
                            <tr>
                                <th>Descripción</th>
                                <th>Unidad</th>
                                <th>Cantidad</th>
                                <th>Precio por unidad</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="border-t-2 border-black">
                        {chapters.map((chapter, index) => (
                            <tr key={index} className={`[&>td>input]:p-1 [&>td>input]:rounded [&>td>select]:rounded text-center border-s border-black ${darkMode ? 'text-black [&:nth-child(2n+1)]:bg-slate-700 [&:nth-child(2n)]:bg-slate-800' : '[&:nth-child(2n+1)]:bg-slate-200 [&:nth-child(2n)]:bg-slate-300'} [&>*]:py-4 [&>*]:px-2 [&>*]:m-2`}>
                                <td>
                                    <input
                                        type="text"
                                        className="w-[30rem]"
                                        id={`chapterName-${index}`}
                                        value={chapter.description}
                                        onChange={(e) => handleChapterChange(index, "description", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        id={`chapterUnit-${index}`}
                                        value={chapter.unit}
                                        onChange={(e) => handleChapterChange(index, "unit", e.target.value)}
                                    >
                                        <option value="m²">m²</option>
                                        <option value="m">m</option>
                                        <option value="ml">ml</option>
                                        <option value="u">u</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id={`chapterQuantity-${index}`}
                                        value={chapter.quantity}
                                        onChange={(e) => handleChapterChange(index, "quantity", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id={`chapterPricePerUnit-${index}`}
                                        value={chapter.pricePerUnit}
                                        onChange={(e) => handleChapterChange(index, "pricePerUnit", e.target.value)}
                                    />
                                </td>
                                <td className={`${darkMode? 'text-white':'text-black'}`}>
                                    {chapter.total.toFixed(2)}€
                                </td>
                                <td className="border-x border-black">
                                    <button type="button" onClick={() => handleRemoveChapter(index)} className="bg-red-900 text-white py-1 px-1 rounded-sm">
                                    <DeleteSharpIcon title="Tienda" style={{ fontSize: 30, color: 'white' }}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {chapters.length !== 0 && (
                            <>
                                <tr className="border-t-2 border-black">
                                    <td>*Para poner valores decimales, usar "," (coma)</td>
                                    <td></td>
                                    <td></td>
                                    <td className={`ps-5 text-left border-s border-y border-black ${darkMode? 'bg-slate-800':'bg-slate-300'}`}>
                                        Total
                                    </td>
                                    <td className={`text-center border-e border-y border-black ${darkMode? 'bg-slate-800':'bg-slate-300'}`}>
                                        {chapters.reduce((acc, chapter) => acc + chapter.total, 0).toFixed(2)}€
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className={`ps-5 text-left border-s border-y border-black ${darkMode? 'bg-slate-700':'bg-slate-200'}`}>
                                        IVA - 21%
                                    </td>
                                    <td className={`text-center border-e border-y border-black ${darkMode? 'bg-slate-700':'bg-slate-200'}`}>
                                        {(chapters.reduce((acc, chapter) => acc + chapter.total, 0) * 0.21).toFixed(2)}€
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className={`ps-5 text-left border-s border-y border-b border-black ${darkMode? 'bg-slate-800':'bg-slate-300'}`}>
                                        Total con iva
                                    </td>
                                    <td className={`text-center border-e border-b border-y border-black ${darkMode? 'bg-slate-800':'bg-slate-300'}`}>
                                        {(chapters.reduce((acc, chapter) => acc + chapter.total, 0) * 1.21).toFixed(2)}€
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>

                <button type="button" onClick={handleAddChapter} className="bg-slate-500 text-white py-1 px-3 rounded-md m-5">
                    Añadir capítulo
                </button>

                <button type="button" onClick={handleSubmit} disabled={!isFormValid()} className="bg-slate-500 text-white py-1 px-3 rounded-md m-5">
                    Crear presupuesto
                </button>
            </div>
        </>
    );
};

export default NewBudgetPage;
