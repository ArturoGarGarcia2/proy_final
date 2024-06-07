import { useState } from "react";
import { cureDate } from "../../utils/functions";

const NewsCard = ({ newsItem: item }) => {
    const [front, setFront] = useState(true);

    return (
        <div className="text-black relative w-[45%] lg:w-80 h-48 perspective-1000  cursor-pointer" onClick={() => setFront(prev => !prev)}>
            <div className={`relative w-full h-full transition-transform ease-out duration-300 transform ${!front ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full bg-white rounded p-4 flex flex-col transform">
                    <div className={`front ${!front ? 'hidden' : ''}`}>
                        <h1 className="font-bold">{item.title}</h1>
                        <p>{cureDate(item.date).ddMMyy} - {cureDate(item.date).HHmm}</p>
                    </div>
                    <div className={`${front ? 'hidden' : ''} rotate-y-180`}>
                        <p className="break-words whitespace-normal">{item.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsCard;
