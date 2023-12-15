import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
// import styles from "../styles/Home.module.css";
import { checkLogin, getToken } from '../utils/auth';
import { useRouter } from "next/router";
import CheckoutForm from "../components/CheckoutForm";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Layout from "../components/logged/Layout";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Payment() {

  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!checkLogin()) {
      router.push('/signin');
    }
  }, [])

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "payment/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "package" }],
        token: getToken()
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };





  return (
    <div>
      <Layout>
        <div className="row">
          <h1 className="text-center text-primary text-uppercase fw-bold mb-5 mt-3">
            Enter Your Payment Details Below
          </h1>
        </div>



        <div
          className="row d-flex justify-content-center mt-6 "
          style={{ backgroundColor: "transparent" }}
        >

          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 bg   ">
            <div>
              <div
                className="card mb-2 p-4 shadow p-3 mb-5 bg-white rounded "
              >
                <div className="card.content">
                  <h4 className="mb-5">Payment Information</h4>
                  {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm />
                    </Elements>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12  ">
            <div
              className="card mb-2 p-4 shadow p-3 mb-5 bg-white rounded "
            // style={{ top: -200 }}
            >
              <div className="card.content">
                <h4 className=" text-left  mb-2 text-muted">
                  You have to pay
                </h4>
                <h1> $99/mo</h1>

                <hr />

                <h6 className="font-weight-bold">What’s included</h6>

                <ul
                  style={{
                    listStyleType: "disc",
                    margin: 0,
                    paddingLeft: 18,
                    color: "#2F70A6",
                  }}
                >
                  <li>
                    <span style={{ color: "black" }}>
                      6-Month Data History
                    </span>
                  </li>
                  <li>
                    <span style={{ color: "black" }}>
                      100% support
                    </span>
                  </li>
                  <li>
                    <span style={{ color: "black" }}>
                      Custom Reports
                    </span>
                  </li>
                  <li>
                    <span style={{ color: "black" }}>
                      Funnel Optimization
                    </span>
                  </li>
                  <li>
                    <span style={{ color: "black" }}>
                      Pretium vulputate sapien
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </Layout>
    </div>
  );
}
