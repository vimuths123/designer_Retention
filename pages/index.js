import React, { useEffect, useState } from 'react'
import Head from "next/head";
import Image from "next/image";
import UserInput from '../components/UserInput';
import AiInput from '../components/AiInput';
import { checkLogin, getToken } from '../utils/auth';
import { useRouter } from 'next/router';
import Layout from '../components/logged/Layout';
// import LoggedHeader from '../components/LoggedHeader';
// import Header from "../components/logged/Header";
const { v4: uuidv4 } = require('uuid');


const Index = () => {

    const newChatClk = () => {
        clearChat()
        router.push({
            pathname: '/'
        });
    }

    const clearChat = () => {
        setAppendedComponents([])
        setChatInput('')
    }

    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + "...";
        } else {
            return str;
        }
    }

    const router = useRouter();

    useEffect(() => {
        if (!checkLogin()) {
            router.push('/signin');
        }

        getUserChats()
    }, [])

    var token = getToken()

    const [chatInput, setChatInput] = useState('');
    const [userChats, setUserChats] = useState([]);
    const [categorizedChats, setCategorizedChats] = useState({
        today: [],
        last3Days: [],
        last7Days: [],
    });
    const [newChat, setNewChat] = useState(true);
    const [chatkey, setChatkey] = useState('');

    const filterDates = (chats) => {
        // Get the current date
        const currentDate = new Date();

        // Calculate the date for "Last 3 Days"
        const last3DaysDate = new Date();
        last3DaysDate.setDate(currentDate.getDate() - 3);

        // Calculate the date for "Last 7 Days"
        const last7DaysDate = new Date();
        last7DaysDate.setDate(last3DaysDate.getDate() - 7);

        // Group chat messages into categories
        const todayChats = [];
        const last3DaysChats = [];
        const last7DaysChats = [];

        chats.forEach((chat) => {
            const createdAtDate = new Date(chat.createdAt);
            if (createdAtDate.toDateString() === currentDate.toDateString()) {
                todayChats.push(chat);
            } else if (createdAtDate >= last3DaysDate && createdAtDate < currentDate) {
                last3DaysChats.push(chat);
            } else if (createdAtDate >= last7DaysDate && createdAtDate < last3DaysDate) {
                last7DaysChats.push(chat);
            }
        });

        // Return an object containing all three categories
        return {
            today: todayChats,
            last3Days: last3DaysChats,
            last7Days: last7DaysChats,
        };
    };


    const getUserChats = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "chat/prevoius_chats", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData && responseData.user) {
                    const categorizedChatsData = await filterDates(responseData.user?.Chats);
                    // console.log(categorizedChatsData)

                    setCategorizedChats(categorizedChatsData);
                    setUserChats(responseData.user?.Chats.reverse())
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }



    const [appendedComponents, setAppendedComponents] = useState([]);

    const handleChatInputChange = (e) => {
        setChatInput(e.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            submitQuestion()
        }
    }

    const setImageMessage = async (sender, content, getImage, chatkey, newchat) => {
        let image;
        if (getImage) {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "chat/get_prompt_img", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': token
                },
                body: JSON.stringify({
                    prompt: chatInput,
                    token: token
                    // category: "landingpage"
                })
            });


            if (response.ok) {
                const responseData = await response.json();
                if (responseData && responseData.image) {
                    image = await responseData.image;

                    if (sender == "User") {
                        const userMessage = <UserInput message={sender + ': ' + content} />;
                        setAppendedComponents(prevComponents => [...prevComponents, userMessage]);
                    } else if (sender == "Ai") {
                        const aiMessage = <AiInput message={sender + ': ' + content} image={image} />
                        setAppendedComponents(prevComponents => [...prevComponents, aiMessage]);
                    }

                    console.log(image)

                    try {
                        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "chat/save_chat", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token: token,
                                content: content,
                                imageUrl: image,
                                chatkey: chatkey,
                                sender: sender,
                                newchat: newchat
                            }),
                        });
                    } catch (error) {
                        console.error('An error occurred:', error);
                    }
                }
            }
        }
    }

    const setMessage = async (sender, content, getImage, chatkey, newchat) => {
        if (sender == "User") {
            const userMessage = <UserInput message={sender + ': ' + content} />;
            setAppendedComponents(prevComponents => [...prevComponents, userMessage]);
        } else if (sender == "Ai") {
            const aiMessage = <AiInput message={sender + ': ' + content} />
            setAppendedComponents(prevComponents => [...prevComponents, aiMessage]);
        }

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "chat/save_chat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    content: content,
                    imageUrl: '',
                    chatkey: chatkey,
                    sender: sender,
                    newchat: newchat
                }),
            });
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


    const submitQuestion = async () => {
        clearChat()

        const uniqueRandomId = uuidv4();
        setNewChat(false)
        setChatkey(uniqueRandomId)



        await Promise.all([
            setMessage('User', chatInput, '', uniqueRandomId, true),
            setMessage('Ai', 'Noted on that... Please wait in a bit, Thanks!', '', uniqueRandomId, false),
            setImageMessage('Ai', 'Thank you for waiting! Kindly see the results below:', true, uniqueRandomId, false),
        ]);
        getUserChats()
    }

    const getOldChat = async (chatkey) => {
        clearChat()
        router.push({
            pathname: '/',
            query: { chatkey: chatkey }
        });
        

        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "chat/get_chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                chatkey: chatkey,
            }),
        })

        if (response.ok) {
            const responseData = await response.json();
            if (responseData && responseData.chat && responseData.chat.Messages) {
                const messages = responseData.chat.Messages;
                console.log(messages)
                messages.forEach(message => {
                    if (message.owner == "User") {
                        const userMessage = <UserInput message={message.content} />
                        setAppendedComponents(prevComponents => [...prevComponents, userMessage]);
                    } else if (message.owner == "Ai") {
                        const aiMessage = <AiInput message={message.content} image={message.image_url}/>
                        setAppendedComponents(prevComponents => [...prevComponents, aiMessage]);
                    }
                })
            }
        } else {
            console.log('error happened')
        }
    }

    return (
        <Layout>
            {/* <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head> */}

            <div
                className="container-fluid bg-light"
                style={{ backgroundColor: "#FFFFFF" }}
            >

                <div>
                    <div className="row" style={{ height: "calc(100vh - 100px)" }}>
                        <div className="col-md-3 bg-white" style={{ height: "calc(100vh - 100px)", overflow: "scroll" }}>
                            <button className="new-chat mt-3" id="sidebarNewChat_btn" onClick={newChatClk}>
                                + New Chat
                            </button>

                            <div className="mt-4">
                                {/* <p className="tyni-heading1 mx-3 ">Today</p> */}
                                <p className="tyni-heading1 mx-3 ">Previous Chats</p>
                                <ul className="text-start">
                                    {userChats?.map((item, index) => (
                                        <li className='hover-pointer' key={item.id} onClick={() => getOldChat(item.chatkey)}>
                                            <span className="custom-li-style" key={item.id}></span> {truncateString(item.prompt, 22)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* <div className="mt-4">
                                <p className="tyni-heading1 mx-3 ">Yesterday</p>
                                <ul className="text-start">
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <p className="tyni-heading1 mx-3 ">Previous 7 Days</p>
                                <ul className="text-start">
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                    <li>

                                        <span className="custom-li-style"></span> Lorem Ipsum
                                        Sit Dolor...
                                    </li>
                                </ul>
                            </div> */}
                        </div>

                        <div className="col-md-9 position-relative" style={{ height: "calc(100vh - 100px)", background: "#F8F9FA", overflow: "hidden" }}>
                            <div style={{ height: "calc(100vh - 100px)", overflow: "scroll" }} className='right_alignments'>
                                {appendedComponents.map((component, index) => (
                                    <div className='' key={index}>{component}</div>
                                ))}
                            </div>
                            <div>
                                <div className='bg-white right_alignments w-100 position-absolute bottom-0 pb-5'>
                                    <div className='text-center'>
                                        <input
                                            style={{ height: 60 }}
                                            type="text"
                                            id="user-input"
                                            value={chatInput}
                                            onChange={handleChatInputChange}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type your message..."
                                        />

                                        <button id="send-button" style={{ height: 60 }} onClick={submitQuestion}>
                                            <Image
                                                src="/group_1000003745.png"
                                                alt="My Image"
                                                width={25}
                                                height={25}
                                                className="me-2 cment_nofill"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Index