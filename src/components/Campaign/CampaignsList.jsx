import React from 'react';
import CampaignCard from './CampaignCard';

const campaigns = [
    {
        title: "Help Me Breathe Again",
        category: "Medical & Healing",
        goal: 5000,
        raised: 5000,
        donors: 76,
        image: "https://www.aims.gov.au/sites/default/files/styles/featured/public/2022-07/whales_2000px_banner-2.jpg?itok=sOy0UZhB",
        description: "Hello everyone, I'm Emily Grace. I never imagined that COVID-19 would.",
    },
    {
        title: "Save the Whales",
        category: "Animals",
        goal: 10000,
        raised: 1000,
        donors: 150,
        image: "https://www.aims.gov.au/sites/default/files/styles/featured/public/2022-07/whales_2000px_banner-2.jpg?itok=sOy0UZhB",
        description: "Join us in saving the whales. Every contribution matters to marine life.",
    },
    {
        title: "Charity for Homeless",
        category: "Charity",
        goal: 20000,
        raised: 5000,
        donors: 320,
        image: "https://www.aims.gov.au/sites/default/files/styles/featured/public/2022-07/whales_2000px_banner-2.jpg?itok=sOy0UZhB",
        description: "Help us provide food and shelter to the homeless during this winter season.",
    },
    {
        title: "Charity for Homeless",
        category: "Charity",
        goal: 20000,
        raised: 5000,
        donors: 320,
        image: "https://www.aims.gov.au/sites/default/files/styles/featured/public/2022-07/whales_2000px_banner-2.jpg?itok=sOy0UZhB",
        description: "Help us provide food and shelter to the homeless during this winter season.",
    },
    {
        title: "Charity for Homeless",
        category: "Charity",
        goal: 20000,
        raised: 5000,
        donors: 320,
        image: "https://www.aims.gov.au/sites/default/files/styles/featured/public/2022-07/whales_2000px_banner-2.jpg?itok=sOy0UZhB",
        description: "Help us provide food and shelter to the homeless during this winter season.",
    },
    {
        title: "Charity for Homeless",
        category: "Charity",
        goal: 20000,
        raised: 5000,
        donors: 320,
        image: "https://www.aims.gov.au/sites/default/files/styles/featured/public/2022-07/whales_2000px_banner-2.jpg?itok=sOy0UZhB",
        description: "Help us provide food and shelter to the homeless during this winter season.",
    },
];

const CampaignsList = () => {
    return (
        <div className="container mx-auto px-8 lg:px-16">
            <h1 className="text-3xl font-bold text-center mb-4 mt-4 text-slate-700">
                Campaigns Available for Donation
            </h1>
            <div className="flex justify-center items-center gap-3 h-full pb-4">
                <button className='btns'>Charity</button>
                <button className='btns'>Animals</button>
                <button className='btns'>Medical</button>
                <button className='btns'>Personal</button>
            </div>
            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-6 lg:gap-x-1 px-4 border pb-100">
                {campaigns.map((campaign, index) => (
                    <CampaignCard key={index} {...campaign} />
                ))}
            </div>


        </div>
    );
};


export default CampaignsList;
