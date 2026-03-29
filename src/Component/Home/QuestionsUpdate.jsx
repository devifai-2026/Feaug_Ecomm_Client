import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import updatesApi from '../../apis/updatesApi';

const QuestionsUpdate = () => {
    const navigate = useNavigate();
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        updatesApi.getActiveUpdates({
            onSuccess: (response) => {
                const data = response.data?.updates || response.data || [];
                if (data.length > 0) {
                    setUpdates(data.map((item) => ({
                        title: item.title,
                        category: item.category,
                        author: item.author,
                        publishDate: item.publishDate,
                        image: item.image || null,
                        link: item.link || null,
                    })));
                }
            },
            onError: () => {},
        });
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleClick = (update) => {
        if (update.link) {
            navigate(update.link);
        }
    };

    if (updates.length === 0) return null;

    return (
        <div className='max-w-[90%] mx-auto mt-16'>
            <div className='flex flex-col'>
                <h2 className='text-2xl font-bold mb-8 text-center'>Latest Updates</h2>
                <div className='space-y-6'>
                    {updates.map((update, index) => (
                        <div
                            key={index}
                            className='relative group cursor-pointer overflow-hidden'
                            onClick={() => handleClick(update)}
                        >
                            <div className='flex items-center gap-3'>
                                {update.image && (
                                    <div className='relative overflow-hidden'>
                                        <img
                                            className='h-60 md:h-40 w-40 object-cover transition-all duration-300 group-hover:scale-105'
                                            src={update.image}
                                            alt={update.title}
                                        />
                                    </div>
                                )}
                                <div className='space-y-3 flex-1'>
                                    <p className='uppercase text-orange-900 text-sm font-medium'>{update.category}</p>
                                    <p className='text-sm md:text-base uppercase font-semibold'>{update.title}</p>
                                    <div className='space-y-1'>
                                        <p className='text-gray-500 text-xs'>{update.author}</p>
                                        <p className='text-gray-500 text-xs'>{formatDate(update.publishDate)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 group-hover:border-2 border-black transition-all duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionsUpdate;
