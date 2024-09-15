import axios from "axios";

export const createPaymentLink = async (amount, count) => {
    try {
        // Send the POST request to your server with the totalPrice in the request body
        const res = await axios.post('http://localhost:3001/api/create-payment-link', {
            amount,
            count
        });

        return res.data;
    } catch (error) {
        // Log and handle any errors
        console.error('Error creating payment link:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to handle it in the calling function if necessary
    }
};

// export const getTransactionDetails = async (id) => {
//     try {
//         const response = await axios.post('http://localhost:3001/api/payment-success', { id });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching transaction details from the server:', error);
//         throw new Error(error.response ? error.response.data.error : 'Error fetching transaction details.');
//     }
// };
