// PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as UserService from "../../services/UserService";
import * as PayOsHistoryService from "../../services/PayOSHistoryService";
import { useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { VscCodeOss } from "react-icons/vsc";
import { toast } from "react-toastify";
const PaymentSuccess = () => {
  // State to store payment details
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const navigate = useNavigate();
  useEffect(() => {
    setUserName(user?.id);
  }, [user?.id]);

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
        // Fetch payment details from the server
        const response = await fetch(`http://localhost:3001/api/payment-success?orderCode=${orderCode}&status=${status}&id=${transactionId}&code=${code}&count=${count}&amount=${amount}`);
        const data = await response.json();
  
        if (response.ok) {
          setPaymentDetails(data.paymentDetails);
          
  
          if (userName && data.paymentDetails) {
            try {
              setIsLoading(true); 
              // Update user's count
              const updatedData = await UserService.updateUserCount(userName, data.paymentDetails.count);
              console.log('Count updated successfully:', updatedData);
              toast.success("Thanh Toán Thành Công");
  
              // Create history payment record
              const historypayosData = {
                orderCode: orderCode,
                transactionId:transactionId,
                status: status,
                count: count,
                amount: amount,
                infomationUserId: userName
              };
                console.log(historypayosData)
             
              await PayOsHistoryService.createHistoryPayos(historypayosData);
              console.log('History Payos record created successfully');
  
            } catch (err) {
              console.error('Error updating count or creating history payos:', err);
              setError('An error occurred while updating the count or creating history payos.');
            } finally {
              setIsLoading(false); // End loading
            }
          }
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
  }, [userName]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <section className="py-8 px-4 bg-gray-50 font-sans min-h-screen flex flex-col items-center">
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto gap-6">
        <div className="bg-white text-blue-600 w-full md:w-1/2 p-6 text-center shadow-md rounded-lg">
          <h1 className="text-2xl font-bold">Giao dịch thành công</h1>
          <img
            src="https://i.pinimg.com/originals/99/08/cf/9908cfb802de9a351da420173a7a433d.png"
            alt="Success"
            className="mx-auto my-4"
          />
          <p className="text-3xl font-extrabold text-green-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(paymentDetails.amount || 9216580000)}
          </p>
        </div>

        <div className="bg-white w-full md:w-1/2 shadow-md rounded-lg p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <VscCodeOss className="text-gray-700 text-xl" />
              <h2 className="text-lg font-semibold text-gray-800">Mã giao dịch</h2>
            </div>
            <div className="pl-7">
              
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Số hóa đơn:</span> 
                <span className='ml-20'>{paymentDetails?.transactionId }</span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Mã đơn hàng:</span> 
                <span className='ml-20'>{paymentDetails?.orderCode }</span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Số Lần:</span> 
                <span className='ml-20'>{paymentDetails?.count}</span>
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-4">
              <CiUser className="text-gray-700 text-xl" />
              <h2 className="text-lg font-semibold text-gray-800">Thông tin khách hàng</h2>
            </div>
            <div className="pl-7">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Tên khách hàng:</span> 
                <span className='ml-20'>{user?.name}</span>
                
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Số điện thoại:</span> 
                <span className='ml-20'> {user?.phone }</span>
               
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Email:</span> 
                <span className='ml-20'> {user?.email }</span>
               
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Địa Chỉ:</span> 
                <span className='ml-20'> {user?.address }</span>
               
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Ngày Mua:</span> 
                <span className='ml-20'>{new Date(user?.updatedAt).toLocaleDateString()}</span>
                
              </p>
             
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full max-w-3xl mx-auto py-3 mt-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300"
      >
       Hoàn Tất Thanh Toán
      </button>
    </section>
  );
};

export default PaymentSuccess;
