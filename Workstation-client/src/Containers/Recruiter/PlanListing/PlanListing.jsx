import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../../Services/Interceptor/recruiterInterceptor.js';
import Swal from 'sweetalert2';
import './PlanListing.css';
import { RecruiterAuth } from '../../../Context/RecruiterContext.jsx';

const PlanListing = () => {
  const [plans, setPlans] = useState([]);
  const {recruiter}=useContext(RecruiterAuth)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get('/recruiter-getPlans');
        setPlans(response.data.plans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://checkout.razorpay.com/v1/checkout.js`;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const { data } = await axiosInstance.post('/recruiter-createOrder', { amount: plan.amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID , 
        amount: data.amount,
        currency: 'INR',
        name: plan.planName,
        description: 'Plan Purchase',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const paymentVerification = await axiosInstance.post('/recruiter-verifyPayment', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              email: recruiter.email,
              amount:plan.amount,
              planId:plan._id
            });

            if (paymentVerification.data.success) {
                await Swal.fire({
                    title: 'Payment Successful!',
                    text: 'Your payment has been processed successfully.',
                    icon: 'success',
                    confirmButtonText: 'Go to home',
                    allowOutsideClick: false
                  });
            
              window.location.href = '/recruiter-home';
            } else {
              alert('Payment verification failed.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification error.');
          }
        },
        prefill: {
          email: recruiter.email, 
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong while processing the payment.');
    }
  };

  return (
    <div className="planslisting-container">
      <h2 className="planslisting-title">Pick the Best Plan</h2>
      <p className="planslisting-subtitle">
        Take your desired plan to get access to our content easily. We offer special license offers to our users.
      </p>
      <div className="planslisting-grid">
        {plans.map(plan => (
          <div className="planslisting-card" key={plan._id}>
            <h3 className="planslisting-name">{plan.planName}</h3>
            <p className="planslisting-amount">${plan.amount} <span className="planslisting-per-month"></span></p>
            <p className="planslisting-description">{plan.description}</p>
            <p className="planslisting-planType">
              Duration: {plan.planType === 'duration' ? `${plan.planDuration} Months` : 'Lifetime'}
            </p>
            <button className="planslisting-button" onClick={() => handlePayment(plan)}>Select Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanListing;
