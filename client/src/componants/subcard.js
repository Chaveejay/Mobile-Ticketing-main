import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation

const Subcard = ({ Price, Name, Description, Feature1, Feature2, Feature3, amount }) => {
    const navigate = useNavigate();

    const handleBuyNow = () => {
        // Redirect to payment page with the amount to be paid
        navigate('/payment', { state: { amount } });
    };

    return (
        <div className='card'>
            <h2>{Name}</h2>
            <p className='price1'>{Price}</p>
            <p className='desc'>{Description}</p>
            <div className='features'>
                <ul>
                    <li>{Feature1}</li>
                    <li>{Feature2}</li>
                    <li>{Feature3}</li>
                </ul>
            </div>

            <button className='try' onClick={handleBuyNow}>
                Buy Now
            </button>
        </div>
    );
};

export default Subcard;
