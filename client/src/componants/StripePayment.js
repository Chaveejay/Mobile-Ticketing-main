import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of the component to avoid recreating on every render
const stripePromise = loadStripe('pk_test_51PmtVV2MD4wZtHBHswLXfi3R98dI4gLQTCKeyWblGii8lGeopFthF0fWSwXAdCKAz2iZ6Vpr9y8wuMV2S3XhwnT200WNIctcig');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(10); 
  const [currency, setCurrency] = useState('usd'); 
  const [paymentMethodTypes, setPaymentMethodTypes] = useState(['card']); 
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);
  
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded
    }
  
    // Convert normal currency amount to cents
    const amountInCents = Math.round(amount * 100);
  
    const { error, paymentIntent } = await fetchPaymentIntent(amountInCents); // Pass amountInCents
    
    if (error) {
      setErrorMessage(error.message);
      setPaymentProcessing(false);
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
  
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  
    if (stripeError) {
      setErrorMessage(stripeError.message);
      setPaymentProcessing(false);
      return;
    }
  
    const { error: confirmError } = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: paymentMethod.id,
    });
  
    if (confirmError) {
      setErrorMessage(confirmError.message);
      setPaymentProcessing(false);
    } else {
      setPaymentSucceeded(true);
      setPaymentProcessing(false);
    }
  };
  
  const fetchPaymentIntent = async (amountInCents) => {
    const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents, // Send the amount in cents to the backend
        currency,
        payment_method_types: paymentMethodTypes,
      }),
    });
  
    return await response.json();
  };
  

  // Enhanced styles for a real-world payment gateway look
  const bodyStyle = {
    height: '100vh',
    margin: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    fontFamily: "'Roboto', sans-serif",
  };

  const containerStyle = {
    width: '400px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  };

  const cardElementStyle = {
    padding: '12px',
    border: '1px solid #e2e2e2',
    borderRadius: '8px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: paymentProcessing ? '#b3b3b3' : '#1827A4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: paymentProcessing ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '20px',
  };

  const successStyle = {
    color: 'green',
    fontSize: '16px',
    marginTop: '20px',
  };

  const footerStyle = {
    fontSize: '12px',
    color: '#888',
    marginTop: '20px',
  };

  const inputContainerStyle = {
    marginBottom: '20px',
    textAlign: 'left',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e2e2',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#424770',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  };

  const inputFocusStyle = {
    borderColor: '#1827A4',
    outline: 'none',
  };

  return (
    <div style={bodyStyle}>
      <div style={containerStyle}>
        <h2 style={headerStyle}>Secure Payment</h2>
        <form onSubmit={handleSubmit}>
          <div style={cardElementStyle}>
            <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', fontFamily: "'Roboto', sans-serif" } } }} />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="amount" style={labelStyle}>Amount:</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = inputFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = '#e2e2e2'}
            />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="currency" style={labelStyle}>Currency:</label>
            <input
              id="currency"
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = inputFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = '#e2e2e2'}
            />
          </div>
          <div style={inputContainerStyle}>
            <label htmlFor="paymentMethodTypes" style={labelStyle}>Payment Method Types:</label>
            <select
              id="paymentMethodTypes"
              value={paymentMethodTypes[0]} // Since it's a single select, we just use the first element
              onChange={(e) => setPaymentMethodTypes([e.target.value])}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = inputFocusStyle.borderColor}
              onBlur={(e) => e.target.style.borderColor = '#e2e2e2'}
            >
              <option value="card">Card</option>
              <option value="ideal">iDEAL</option>
              <option value="sepa_debit">SEPA Debit</option>
              <option value="bancontact">Bancontact</option>
              <option value="sofort">Sofort</option>
              <option value="alipay">Alipay</option>
            </select>
          </div>
          {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
          <button
            type="submit"
            style={buttonStyle}
            disabled={!stripe || paymentProcessing || paymentSucceeded}
          >
            {paymentProcessing ? 'Processing...' : 'Pay'}
          </button>
          {paymentSucceeded && <p style={successStyle}>Payment Succeeded!</p>}
        </form>
        <div style={footerStyle}>
          <p>Powered by Stripe</p>
        </div>
      </div>
    </div>
  );
};

const StripePayment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripePayment;
