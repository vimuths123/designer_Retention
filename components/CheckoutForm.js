import React from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { checkLogin, getToken } from '../utils/auth';
import { useRouter } from "next/router";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const savePayment = async (paymentIntent, token) => {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "payment/save_payment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        paymentIntent: paymentIntent
      }),
    });

    if(response.ok){
      router.push('/');
    }

  }

  React.useEffect(() => {

    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          // savePayment(paymentIntent, getToken())
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const response = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: process.env.NEXT_PUBLIC_FRONTEND_URL,
        payment_method_data: {
          billing_details: {
            address: {
              country: 'US'
            }
          }
        }
      },
      redirect: 'if_required'
    });

    if (!response.error) {
      console.log(response.paymentIntent);
      savePayment(response.paymentIntent, getToken());

    } 

   
    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message);
    // } else {
    //   setMessage("An unexpected error occurred.");
    // }

    setIsLoading(false);
  };



  const paymentElementOptions = {
    layout: "tabs",
    paymentMethodOrder: ['card'],
    fields: {
      billingDetails: {
        // name: 'auto',
        // email: 'auto',
        address: {
          country: 'never'
        }
      }
    }
  };





  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.target.value)}
      /> */}
      <label className="stripe_label">Name</label>
      <input className="stripe_input" type="text" id="name" placeholder="Enter your name" />

      <label className="stripe_label">Email</label>
      <input className="stripe_input" type="text" id="email" placeholder="Enter your email" />

      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button className="btn btn-primary mt-2" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}