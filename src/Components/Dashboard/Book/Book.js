import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dashboard from '../Dashboard/Dashboard';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import css from './Book.css'
import { UserContext } from '../../../App';
import Payment from '../Payment/Payment';
import { useHistory, useParams } from 'react-router';
const stripePromise = loadStripe('pk_test_51If0TFDmVveQ22MLEHYuBEsb313PqBhn8eJKj3QdzHIbpHdPPEkNQYGPS76s8hXMSXFk1tPgQylzo41eafkfVD6100bTe9kQGS');
const Book = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    const { register, handleSubmit, watch, errors } = useForm();
    const [orderData , setOrderData] = useState({})
    const [userInfo , setUserInfo] = useState('')
   const history = useHistory()
  const {_id}= useParams()
    useEffect(()=>{
        fetch(`https://immense-beyond-89177.herokuapp.com/dashboard/book/${_id}`)
        .then(res=>res.json())
        .then(data=>setOrderData(data))
        
    },[_id])
    
    const onSubmit =data => {
        setUserInfo(data);
        console.log(data);
    }
  

  const handlePayment=(id)=>{
        const paymentData = {
            ...userInfo,
            paymentId:id,
            ...orderData,
            orderStatus: 'Pending',
        orderTime: new Date()
    }
    fetch('https://immense-beyond-89177.herokuapp.com/dashboard/addorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
        .then(res => res.json())
        .then(data => {
            if (data) {
                alert('Your Order Placed Successfully');
                history.push('/');
            }
        })
  }


 


    const cardStyle = {
        marginTop: '0',
        width: '700px'
    }
    return (
        <div>
            <Dashboard />


         { !userInfo &&   <div >
                <div class=" text-center ">
                    <span style={{ fontSize: '25px' }}>Checkout Your Order</span>
                </div>
                <div class="row mr-0">
                    <div class="col-lg-7 mx-auto">
                        <div style={cardStyle} class="card mt-2 mx-auto p-4 bg-light">
                            <div class="card-body bg-light ml-4">
                                <div class="container">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div class="controls">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group"> <label for="form_name">Your First Name*</label> <input id="form_name" {...register("clientFirstName")} type="text" name="clientFirstName" class="form-control" placeholder="Please enter First Name " required="required" data-error="First Name is required." /> </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group"> <label for="form_company">Your Last Name*</label> <input id="form_company" {...register("clientLastName")} type="text" name="clientLastName" class="form-control" placeholder="Please enter Last Name" required="required" data-error="Last Name is required." /> </div>
                                                </div>
                                            </div>


                                            <div class="row">
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group"> <label for="form_message">Home Adress *</label> <textarea id="form_message" {...register("adress")} name="adress" class="form-control" placeholder="Please provide Your Adress" rows="1" required="required" data-error="Please, write your adress"></textarea> </div>
                                                </div>

                                                <div className="row">
                                                    <h6 className='mt-3'>Order Details</h6>
                                                <div className="col-md-6 mt-3">
                                                    <h4>{orderData.title}</h4>
                                                </div>
                                                <div style={{marginTop:'-20px'}} className="col-md-6">
                                                        <h5>Service Price</h5>
                                                        <h6>{orderData.servicePrice}</h6>                                                
                                                </div>
                                                </div>


                                                <div className="row mt-3">
                                                    <div class="form-check col-md-6">
                                                        <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                                                        <label class="form-check-label" for="exampleRadios1">
                                                            Pay With  Stripe
                                                        </label>
                                                    </div>
                                                    <div class="form-check col-md-6">
                                                        <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                                                        <label class="form-check-label" for="exampleRadios2">
                                                            Pay With Paypal
                                                        </label>
                                                    </div>
                                                </div>


                                                <div className="stripe">

                                                {/* <Elements  stripe={stripePromise}>
                                                <CardElement  />
                                               </Elements> */}


                                                </div>


                                                <div class="col-md-12 mt-4"> <input type="submit" class="btn btn-danger btn-send pt-2 btn-block " value="Next" /> </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>  }

              { userInfo && 
                    <Payment  handlePayment={handlePayment}></Payment>
                 } 
        </div>
    );
};

export default Book;