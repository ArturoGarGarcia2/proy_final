import { useEffect, useState } from "react";
import ApiService from "../../utils/ApiService";
import MiniSpinner from "../MiniSpinner";

const api = new ApiService('http://127.0.0.1:8000/api');

const ChapterComponent = ({ chapterEndpoint }) => {
    const [chapter, setChapter] = useState({});
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const response = await api.get(chapterEndpoint.substring(5), localStorage.getItem('token'));
            if (response['@context'] === '/api/contexts/Error') {
                console.log('error en', response);
            } else {
                setChapter(response);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [chapterEndpoint]);

    if (loading) {
        return (
            <tr>
                <td colSpan="5"><MiniSpinner/></td>
            </tr>
        );
    }

    return (
        <tr className="chapter">
            <td>{chapter.description}</td>
            <td>{chapter.unit}</td>
            <td>{chapter.quantity}</td>
            <td>{chapter.pricePerUnit}</td>
            <td>{chapter.total}</td>
        </tr>
    );
};

export default ChapterComponent;
