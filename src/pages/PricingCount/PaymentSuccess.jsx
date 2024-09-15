// PaymentSuccess.js
import React, { useEffect, useState } from 'react';

const PaymentSuccess = () => {
  // State to store payment details
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch payment details on component mount
  useEffect(() => {
    // Extract query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const orderCode = queryParams.get('orderCode');
    const status = queryParams.get('status');
    const transactionId = queryParams.get('id');
    const code = queryParams.get('code');
    const amount = queryParams.get('amount');
    const count = queryParams.get('count');

    // Fetch payment details from the server
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/payment-success?orderCode=${orderCode}&status=${status}&id=${transactionId}&code=${code}&count=${count}&amount=${amount}`);
        const data = await response.json();

        if (response.ok) {
          setPaymentDetails(data.paymentDetails);
        } else {
          setError(data.error || 'Failed to fetch payment details.');
        }
      } catch (err) {
        setError('An error occurred while fetching payment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  // Render the component
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Payment Success</h1>
      {paymentDetails ? (
        <div>
          <p><strong>Order Code:</strong> {paymentDetails.orderCode}</p>
          <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
          <p><strong>Status:</strong> {paymentDetails.status}</p>
          <p><strong>Amount:</strong> {paymentDetails.amount}</p>
          <p><strong>Code:</strong> {paymentDetails.code}</p>
          <p><strong>Count:</strong> {paymentDetails.count}</p> {/* Display count */}
        </div>
      ) : (
        <p>No payment details available.</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
