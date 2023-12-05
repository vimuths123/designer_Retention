import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { getToken } from '../../utils/auth';


function Layout({ children }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        var token = getToken()

        try {
            axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/profile", {
                token: token,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                setName(response.data.user?.name);
                setImage(response.data.user?.image);
            }).catch((error) => {
                console.error('An error occurred:', error);
            });

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }, []);

    return (
        <div>
            <Header name={name} image={image} />
            <main>
                {children}
            </main>
        </div>
    );
}

export default Layout;
