import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { login } from '../utils/auth';
import { useRouter } from "next/router";
import Layout from "../components/notlogged/Layout";

export default function Home() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        console.log('Signup successful');
        const responseData = await response.json();
        // console.log('Response data:', responseData);
        if (responseData && responseData.data) {
          login(responseData.data.token)
          router.push('/payment');
        } else {
          setError('Error happend. Please contact Admin')
        }

      } else {
        console.log('Signup failed');
        const responseData = await response.json();
        // console.log(responseData.error)
        if (responseData && responseData.error) {
          setError(responseData.error)
        }
      }
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div>
      <Layout>
        <div
          className="body-content d-flex justify-content-center mt-5 bg-light"
          style={{ backgroundColor: "#FFF" }}
        >
          <div
            className="card shadow p-3 mb-5 rounded"
            style={{ maxWidth: 730, backgroundColor: "#FFF" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <h2 className="card-title text-center text-uppercase fw-bold">
                  Sign Up
                </h2>
                <div className="text-danger mb-2">
                  {error}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fw-bold"
                  >
                    Name *
                  </label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fw-bold"
                  >
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    width="100%"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fw-bold"
                  >
                    Password *
                  </label>
                  <input
                    required
                    type="password"
                    className="form-control"
                    placeholder="Create a password"
                    width="100%"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary text-uppercase w-100 fw-bold"
                    width="100%"
                  >
                    Sign Up
                  </button>
                </div>

                <div className="mb-4">
                  <button
                    type="button"
                    className="btn btn-outline-dark w-100 fw-bold"
                    width="100%"
                  >
                    <span>
                      <img
                        className="img-thumbnail bg-transparent border-0"
                        src="/Google logo.svg"
                      ></img>
                    </span>
                    Sign in with Google
                  </button>
                </div>

                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark w-100 fw-bold"
                    width="100%"
                  >
                    <span>
                      <img
                        className="img-thumbnail bg-transparent border-0 "
                        src="/fb-logo.svg"
                      ></img>
                    </span>
                    Sign in with Facebook
                  </button>
                </div>

                <div className="mb-3">
                  <p className="text-center">
                    By continuing your agree to our privacy policy and terms and
                    conditions.
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-center">
                    Already have an account?
                    <span>
                      <a className="text-primary" href="#">
                        {" "}
                        Sign in
                      </a>
                    </span>
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
