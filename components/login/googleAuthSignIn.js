// import { Button, Image, Text } from "@nextui-org/react";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";

const WrappedAll = ({ setFormError, setLoading, router }) => {
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
    console.log("userObject :",userObject);
    if (userObject.email_verified) {
      
    } else {
      setFormError({
        status: "error",
        message: "email verified failed! please verify your email.",
      });
    }
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => successLoginFunction(tokenResponse),
  });

  return (
    <button
      type="button"
      className="btn btn-outline-dark w-100 mb-4 fw-bold"
      width="100%"
      onClick={() => login()}
    >
      <span>
        <img
          className="img-thumbnail bg-transparent border-0"
          src="/Google logo.svg"
        ></img>
      </span>
      Sign in with Google
    </button>
  );
};

const GoogleSignIn = ({ setFormError, setLoading }) => {
  const router = useRouter();

  return (
    <GoogleOAuthProvider clientId="477818064906-889udqnt1cs4irip4j7shatgihose6r0.apps.googleusercontent.com" >
      <WrappedAll router={router} />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;


