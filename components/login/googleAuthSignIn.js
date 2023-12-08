// import { Button, Image, Text } from "@nextui-org/react";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";
import { login } from '../../utils/auth';

const WrappedAll = ({ setFormError, setLoading, router, page }) => {

  const successLoginFunction = async (response) => {
    const authres = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      }
    );
    const userObject = authres.data;
    console.log("userObject :", userObject);
    const name = userObject.given_name
    const email = userObject.email
    if (userObject.email_verified) {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'auth/google_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.data) {
          login(responseData.data.token)
          router.push('/payment');
        } else {
          // setError('Error happend. Please contact Admin')
        }
      }
    } else {
      // setFormError({
      //   status: "error",
      //   message: "email verified failed! please verify your email.",
      // });
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => successLoginFunction(tokenResponse),
  });

  return (
    <button
      type="button"
      className="btn btn-outline-dark w-100 mb-4 fw-bold"
      width="100%"
      onClick={() => googleLogin()}
    >
      <span>
        <img
          className="img-thumbnail bg-transparent border-0"
          src="/Google logo.svg"
        ></img>
      </span> {page} with Google 

    </button>
  );
};

const GoogleSignIn = ({ setFormError, setLoading, page }) => {
  const router = useRouter();

  return (
    <GoogleOAuthProvider clientId="477818064906-889udqnt1cs4irip4j7shatgihose6r0.apps.googleusercontent.com" >
      <WrappedAll router={router} page={page} />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;


