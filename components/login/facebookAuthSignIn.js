import axios from "axios";
import { useRouter } from "next/router";
import { login } from '../../utils/auth';
import FacebookAuth from "react-facebook-auth";


const FacebookSignIn = () => {
  const router = useRouter();

  const authenticate = async (response) => {
    const userObject = response;
    console.log(userObject);

    if (userObject.accessToken && userObject.userID) {
      const name = userObject.name
      const email = userObject.email
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
    }
  }

  const CustomFacebookButton = ({ onClick }) => (
    <button
      type="button"
      className="btn btn-outline-dark w-100 mb-4 fw-bold"
      width="100%"
      onClick={onClick}
    >
      <span>
        <img
          className="img-thumbnail bg-transparent border-0"
          src="/fb-logo.svg"
        ></img>
      </span>
      Sign in with Facebook
    </button>
  );

  return (
    <div>
      <FacebookAuth
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
        callback={authenticate}
        component={CustomFacebookButton}
        onFailure={(error) => {
          console.log("Login Failed.  ", error);
        }}
      />
    </div>
  );
};

export default FacebookSignIn;


