import React from "react";
import { createPaymentLink } from "../../services/PayOsService";

export default function PricingCount() {
  const goToPayOs = async (amount, count) => {
    try {
      // Call the createPaymentLink service with the selected amount
      const paymentLinkData = await createPaymentLink(amount, count);

      // Assuming the response contains a property `checkoutUrl` to redirect the user
      if (paymentLinkData.checkoutUrl) {
        // Redirect the user to the checkout URL
        window.location.href = paymentLinkData.checkoutUrl;
      } else {
        console.log('Checkout URL not found in response.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to create a payment link. Please try again later.');
    }
  };

  return (
    <div>
      <section>
        <div className="container max-w-full mx-auto py-12 px-6">
          <div className="max-w-full md:max-w-6xl mx-auto my-3 md:px-8">
            <div className="relative block flex flex-col md:flex-row items-center">
              <div className="w-11/12 max-w-sm sm:w-3/5 lg:w-1/3 sm:my-5 my-8 relative z-0 rounded-lg shadow-lg md:-mr-4">
                <div className="bg-white text-black rounded-lg shadow-inner shadow-lg overflow-hidden">
                  <div className="block text-left text-sm sm:text-md max-w-sm mx-auto mt-2 text-black px-8 lg:px-6">
                    <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
                      Gói Cơ Bản
                    </h1>
                    <h2 className="text-sm text-gray-500 text-center pb-6">99,999 VND</h2>
                    Nhận 2 lượt sử dụng. Thanh toán đơn giản và nhanh chóng.
                  </div>

                  <div className="flex flex-wrap mt-3 px-6">
                    <ul>
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700">
                          <svg
                            className="w-6 h-6 align-middle"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-lg ml-3">Không phí thiết lập</span>
                      </li>
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700">
                          <svg
                            className="w-6 h-6 align-middle"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-lg ml-3">Sử dụng nhanh chóng</span>
                      </li>
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700">
                          <svg
                            className="w-6 h-6 align-middle"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-lg ml-3">Sử dụng nhanh chóng</span>
                      </li>
                    </ul>
                  </div>
                  <div className="block flex items-center p-8 uppercase">
                    <button
                      onClick={() => goToPayOs(99999, 21)}
                      className="mt-3 text-lg font-semibold 
                      bg-black w-full text-white rounded-lg 
                      px-6 py-3 block shadow-xl hover:bg-gray-700"
                    >
                      Chọn
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md sm:w-2/3 lg:w-1/3 sm:my-5 my-8 relative z-10 bg-white rounded-lg shadow-lg">
                <div className="text-sm leading-none rounded-t-lg bg-gray-200 text-black font-semibold uppercase py-4 text-center tracking-wide">
                  Phổ Biến Nhất
                </div>
                <div className="block text-left text-sm sm:text-md max-w-sm mx-auto mt-2 text-black px-8 lg:px-6">
                  <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
                    Gói Chuyên Gia
                  </h1>
                  <h2 className="text-sm text-gray-500 text-center pb-6">
                    <span className="text-3xl">50,000 VND</span>
                  </h2>
                  Nhận 12 lượt sử dụng. Trải nghiệm tuyệt vời với chi phí hợp lý.
                </div>
                <div className="flex pl-12 justify-start sm:justify-start mt-3">
                  <ul>
                    <li className="flex items-center">
                      <div className="rounded-full p-2 fill-current text-green-700">
                        <svg
                          className="w-6 h-6 align-middle"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg ml-3">Không phí ẩn</span>
                    </li>
                    <li className="flex items-center">
                      <div className="rounded-full p-2 fill-current text-green-700">
                        <svg
                          className="w-6 h-6 align-middle"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg ml-3">Không phí ẩn</span>
                    </li>
                    <li className="flex items-center">
                      <div className="rounded-full p-2 fill-current text-green-700">
                        <svg
                          className="w-6 h-6 align-middle"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg ml-3">Không phí ẩn</span>
                    </li>
                  </ul>
                </div>

                <div className="block flex items-center p-8 uppercase">
                  <button
                    onClick={() => goToPayOs(50000, 10)}
                    className="mt-3 text-lg font-semibold 
                      bg-black w-full text-white rounded-lg 
                      px-6 py-3 block shadow-xl hover:bg-gray-700"
                  >
                    Chọn
                  </button>
                </div>
              </div>

              <div className="w-11/12 max-w-sm sm:w-3/5 lg:w-1/3 sm:my-5 my-8 relative z-0 rounded-lg shadow-lg md:-ml-4">
                <div className="bg-white text-black rounded-lg shadow-inner shadow-lg overflow-hidden">
                  <div className="block text-left text-sm sm:text-md max-w-sm mx-auto mt-2 text-black px-8 lg:px-6">
                    <h1 className="text-lg font-medium uppercase p-3 pb-0 text-center tracking-wide">
                      Gói Doanh Nghiệp
                    </h1>
                    <h2 className="text-sm text-gray-500 text-center pb-6">
                      100,000 VND
                    </h2>
                    Nhận 30 lượt sử dụng. Giải pháp tối ưu cho doanh nghiệp.
                  </div>
                  <div className="flex flex-wrap mt-3 px-6">
                    <ul>
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700">
                          <svg
                            className="w-6 h-6 align-middle"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-lg ml-3">Không phí thiết lập</span>
                      </li>
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700">
                          <svg
                            className="w-6 h-6 align-middle"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-lg ml-3">Không phí thiết lập</span>
                      </li>
                      <li className="flex items-center">
                        <div className="rounded-full p-2 fill-current text-green-700">
                          <svg
                            className="w-6 h-6 align-middle"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700 text-lg ml-3">Không phí thiết lập</span>
                      </li>
                    </ul>
                  </div>

                  <div className="block flex items-center p-8 uppercase">
                    <button
                      onClick={() => goToPayOs(100000, 20)}
                      className="mt-3 text-lg font-semibold 
                      bg-black w-full text-white rounded-lg 
                      px-6 py-3 block shadow-xl hover:bg-gray-700"
                    >
                      Chọn
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
