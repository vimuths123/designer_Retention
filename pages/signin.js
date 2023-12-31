import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { signIn } from "next-auth/react"
import { useState } from "react";
import { useRouter } from "next/router";
import { login } from '../utils/auth';
import Layout from "../components/notlogged/Layout";
import Link from 'next/link';
import GoogleSignIn from "../components/login/googleAuthSignIn";
import FacebookAuth from "react-facebook-auth";
import FacebookSignIn from "../components/login/facebookAuthSignIn";


export default function Home({ providers }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  // const handleSignIn = async () => {
  //   await signIn('google');
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the login API with username and password
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const responseData = await response.json();
      if (responseData && responseData.data) {
        login(responseData.data.token)
        router.push('/payment');
      } else {
        setError('Error happend. Please contact Admin')
      }
    } else {
      const responseData = await response.json();
      if (responseData && responseData.error) {
        setError(responseData.error)
      }
    }
  };


  return (
    <div>
      <Layout>
        <div
          className="body-content d-flex justify-content-center pt-5 bg-white"
          style={{ backgroundColor: "#FFF" }}
        >
          <div
            className="card shadow p-3 mb-5 rounded"
            style={{ maxWidth: 730, backgroundColor: "#FFF" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <h2 className="card-title text-center text-uppercase fw-bold">
                  Sign In
                </h2>

                <div className="text-danger mb-2">
                  {error}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fw-bold"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleFormControlInput2"
                    placeholder="Enter your email"
                    width="100%"
                    height="85%"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fw-bold"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleFormControlInput3"
                    placeholder="Enter your email password"
                    width="100%"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary text-uppercase w-100 mb-4 mt-3 fw-bold"
                >
                  Sign in with Email
                </button>

                <p className="text-center">Not a member? <Link href="/signup">Register</Link></p>

                <GoogleSignIn page="Sign In" />

                <FacebookSignIn />

                <div className="mb-3">
                  <p className="text-center">
                    By continuing your agree to our privacy policy and terms and
                    conditions.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>

    </div>
  );
}


