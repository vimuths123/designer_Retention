import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { checkLogin, getToken } from '../utils/auth';
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Header from '../components/Header';
import Layout from "../components/logged/Layout";

export default function Home() {
  var token = getToken()
  // --------------------------

  const [chatInput, setChatInput] = useState('');
  const [userChats, setUserChats] = useState([]);
  const [categorizedChats, setCategorizedChats] = useState({
    today: [],
    last3Days: [],
    last7Days: [],
  });

  

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }


  const newChatClk = () => {
    clearChat()
    router.push({
      pathname: '/chat2'
    });
  }

  useEffect(() => {
    getUserChats()

  }, [])


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


  // --------------------------

  const router = useRouter();
  // const [user, setUser] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  const [newsUpdates, setNewsUpdates] = useState(false);
  const [tipsTutorials, setTipsTutorials] = useState(false);
  const [userResearch, setUserResearch] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [userPayments, setUserPayments] = useState([]);
  const [currenPrice, setCurrenPrice] = useState('00.00');

  function addPrice(price) {
    setCurrenPrice(price);
  }

  useEffect(() => {
    if (!checkLogin()) {
      router.push('/signin');
    } else {

      const fetchData = async () => {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/profile", {
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
              // console.log(responseData.user)
              // setUser(responseData.user);
              setName(responseData.user?.name)
              setEmail(responseData.user?.email)
              setImage(responseData.user?.image)

              setNewsUpdates(responseData.user?.news_updates)
              setTipsTutorials(responseData.user?.tips_tutorials)
              setUserResearch(responseData.user?.user_research)
              setReminders(responseData.user?.reminders)


              setUserPayments(responseData.user?.Payments)
              if(responseData.user?.Payments){
                setCurrenPrice(responseData.user?.Payments[0]?.amount)
              }
            }
          } else {
            const responseData = await response.json();
            if (responseData.error == 'jwt expired') {
              router.push('/signin?redirect=session_expired');
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };

      fetchData();
    }
  }, [])

  const updateProfile = async () => {
    try {

      var token = getToken()

      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/update_profile", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          name: name,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success('User updated!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } else {

      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const uploadImage = async (event) => {
    const selectedFile = event.target.files[0];
    var token = getToken()

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('token', token);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/update_profile_img", {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Image uploaded successfully');
          const responseData = await response.json();
          if (responseData && responseData.imageUrl) {
            setImage(responseData.imageUrl)
          }
        } else {
          console.error('Error uploading image');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  const saveNotifications = async (event) => {
    var token = getToken()

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/update_profile_notifications", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newsUpdates: newsUpdates,
          tipsTutorials: tipsTutorials,
          userResearch: userResearch,
          reminders: reminders,
        }),
      });

      if (response.ok) {
        console.log('Notifications uploaded successfully');
        const responseData = await response.json();
        if (responseData && responseData.user) {

        }
      } else {
        console.error('Error uploading image');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const cancelNotifications = () => {
    setNewsUpdates(false)
    setTipsTutorials(false)
    setUserResearch(false)
    setReminders(false)
  }

  return (
    <Layout>
      <div
        className="container-fluid bg-light"
        style={{ backgroundColor: "#FFFFFF" }}
      >

        <ToastContainer />
        <div className="row">
          <div className="container max814-2">
            <div className="row">
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
              </div>
              <div
                className="col-9"
                style={{ backgroundColor: "#F2F5FF", color: "#000" }}
              >
                <div className="container">
                  <div className="card text-center">
                    <div
                      className="card-header "
                      style={{ backgroundColor: "white" }}
                    >
                      <ul
                        className="nav  nav-pills mb-3"
                        id="pills-tab"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link active"
                            href="#profile"
                            id="pills-profile-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-profile"
                            type="button"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="true"
                          >
                            Settings
                          </a>
                        </li>

                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link "
                            href="#notifcation"
                            id="pills-notification-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-notification"
                            type="button"
                            role="tab"
                            aria-controls="pills-notification"
                            aria-selected="fales"
                          >
                            Notification
                          </a>
                        </li>

                        <li className="nav-item" role="presentation">
                          <a
                            className="nav-link "
                            href="#billing"
                            id="pills-billing-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-billing"
                            type="button"
                            role="tab"
                            aria-controls="pills-billing"
                            aria-selected="false"
                          >
                            Billing
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div
                      className="card-body tab-content"
                      id="pills-tabContent"
                    >
                      {/* ======section1 -id="profile" ====== */}

                      <section
                        className="tab-pane fade show active"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                      >
                        <div className="row" style={{ marginTop: 30 }}>
                          <div className=" col-12 col-xs-12 col-md-12 col-lg-5 col-xl-5">
                            <h4
                              className="card-title"
                              style={{ marginTop: 25 }}
                            >
                              Profile
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 10,
                              }}
                            >
                              <div
                                className="img "
                                style={{
                                  // backgroundColor: "blue",
                                  // backgroundImage: "url('/user-img1.png')",
                                  borderRadius: 50,
                                  width: 100,
                                  height: 100,
                                }}
                              >
                                <img
                                  src={image}
                                  alt="Logo"
                                  width="72%"
                                  height="auto"
                                  className="d-inline-block align-text-top rounded-circle"
                                />
                              </div>
                              {/* <Image src="/assets/images/Ellipse 179 (1)" width={400} height={200} alt="" /> */}
                            </div>
                            <h5
                              className="card-title"
                              style={{ marginTop: 10 }}
                            >
                              {name}
                            </h5>

                            <p className="card-text" style={{ marginTop: 25 }}>
                              Admin
                            </p>
                            <label className="file-upload-button">
                              <input type="file" accept="image/*" onChange={uploadImage} />
                              Edit Profile
                            </label>

                            {/* <button
                              style={{
                                border: 2,
                                backgroundColor: "white",
                                marginTop: 25,
                              }}
                            >
                              {" "}
                              <a
                                href="#"
                                className="btn btn-outline-dark "
                                style={{ textDecoration: "none" }}
                              >
                                Edit Profile
                              </a>
                            </button> */}
                          </div>

                          <div className="col-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
                            <div className="container">
                              <p style={{ float: "left", marginBottom: 2 }}>
                                BASIC INFO
                              </p>
                              <br />
                              <hr />
                              <br />
                              <form action="/action_page.php">
                                <div className="form-group">
                                  <label
                                    htmlFor="name"
                                    style={{
                                      float: "left",
                                      marginTop: 10,
                                      marginBottom: 10,
                                    }}
                                  >
                                    Name*
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={name}
                                    placeholder="Name"
                                    name="name"
                                    onChange={(e) => setName(e.target.value)}
                                  />
                                </div>

                                <div className="form-group">
                                  <label
                                    htmlFor="email"
                                    style={{
                                      float: "left",
                                      marginTop: 10,
                                      marginBottom: 10,
                                    }}
                                  >
                                    Email*
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Email address"
                                    value={email}
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </div>

                                <div className="form-group">
                                  <label
                                    htmlFor="pwd"
                                    style={{
                                      float: "left",
                                      marginTop: 10,
                                      marginBottom: 10,
                                    }}
                                  >
                                    Password (Keep empty if you don&apos;t need to change)
                                  </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="pwd"
                                    placeholder={password}
                                    name="pwd"
                                    onChange={(e) => setPassword(e.target.value)}
                                  />
                                </div>



                                <div
                                  style={{
                                    display: "inline-flex",
                                    float: "right",
                                    marginTop: 20,
                                    marginBottom: 20,
                                  }}
                                >
                                  <button
                                    type="submit"
                                    className="btn btn-outline-dark"
                                    style={{ width: 100 }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={updateProfile}
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ marginLeft: 15, width: 100 }}
                                  >
                                    Save
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ===section2 id="notification" ===== */}
                      <section
                        className="tab-pane fade"
                        id="pills-notification"
                        role="tabpanel"
                        aria-labelledby="pills-notification-tab"
                      >
                        <div className="row">
                          <div className="row">
                            <div className=" col-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
                              <div className="form-check">
                                {" "}
                                <div
                                // style={{ float: "left" }}
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    checked={newsUpdates}
                                    onChange={() => setNewsUpdates(!newsUpdates)}
                                  // style={{ paddingLeft: 20, margin: 20 }}
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckChecked"
                                    style={{ paddingRight: 100 }}
                                  >
                                    <h4 style={{ float: "left" }}>
                                      News and updates
                                    </h4>
                                    <br />
                                    <p style={{ float: "left" }}>
                                      News about products and features updates.
                                    </p>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className=" col-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
                              <div className="form-check">
                                {" "}
                                <div
                                // style={{ float: "left" }}
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    checked={tipsTutorials}
                                    onChange={() => setTipsTutorials(!tipsTutorials)}

                                  // id="flexCheckChecked"
                                  // style={{ paddingLeft: 20, margin: 20 }}
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckChecked"
                                    style={{ paddingRight: 100 }}
                                  >
                                    <h4 style={{ float: "left" }}>
                                      Tips and Tutorials
                                    </h4>
                                    <br />
                                    <p style={{ float: "left" }}>
                                      News about products and features updates.
                                    </p>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className=" col-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
                              <div className="form-check">
                                {" "}
                                <div
                                // style={{ float: "left" }}
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    checked={userResearch}
                                    onChange={() => setUserResearch(!userResearch)}
                                  // id="flexCheckChecked"
                                  // style={{ paddingLeft: 20, margin: 20 }}
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckChecked"
                                    style={{ paddingRight: 100 }}
                                  >
                                    <h4 style={{ float: "left" }}>
                                      User research
                                    </h4>
                                    <br />
                                    <p style={{ float: "left" }}>
                                      News about products and features updates.
                                    </p>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className=" col-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
                              <div className="form-check">
                                {" "}
                                <div>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    checked={reminders}
                                    onChange={() => setReminders(!reminders)}
                                  // id="flexCheckChecked"
                                  // style={{ paddingLeft: 20, margin: 20 }}
                                  />

                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckChecked"
                                    style={{ paddingRight: 100 }}
                                  >
                                    <h4 style={{ float: "left" }}>Reminders</h4>
                                    <br />
                                    <p style={{ float: "left" }}>
                                      News about products and features updates.
                                    </p>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="row"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 10,
                            marginBottom: 40,
                          }}
                        >
                          <div className="col-4">
                            <button
                              style={{
                                border: 10,
                                borderColor: "#0F6A91",
                                borderRadius: 10,
                                paddingTop: 10,
                                paddingRight: 15,
                                paddingBottom: 10,
                                paddingLeft: 15,
                                float: "right",
                              }}
                              onClick={cancelNotifications}
                            >
                              Cancel
                            </button>
                          </div>
                          <div className="col-4">
                            <button
                              style={{
                                border: 10,
                                borderRadius: 10,
                                paddingTop: 10,
                                paddingRight: 15,
                                paddingBottom: 10,
                                paddingLeft: 15,
                                float: "left",
                                backgroundColor: "#0F6A91",
                                color: "white",
                              }}
                              onClick={saveNotifications}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </section>

                      {/* ====section3=id="billing" === */}
                      <section
                        className="tab-pane fade"
                        id="pills-billing"
                        role="tabpanel"
                        aria-labelledby="pills-billing-tab"
                      >
                        <div className="row ps-3 credit_card">
                          <div className="col-12 col-xs-12 col-md-12 col-lg-7 col-xl-7">
                            <div className="row mb-4">
                              <div className="row ">
                                <h2 className="text-start fw-bold mb-4">Your Credit Card</h2>
                              </div>
                              <Cards
                                name={"Wiil B Baker"}
                                number={"**** **** **** 0000"}
                                expiry={"5/2025"}
                                cvc='***'
                                preview={true}
                                issuer={"visa"}
                              />


                              {/* <img src="Mask Group.svg" style={{width:350 , height:200}}/> */}
                              {/* <img
                                src="/MaskGroup.png"
                                alt=""
                                style={{ width: 350, height: 200 }}
                              />*/}
                            </div>
                            <div className="row ">
                              <h4 className="text-start fw-bold mb-4 mt-4">Payment History</h4>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                {userPayments?.map((item, index) => (
                                  <div key={index}>
                                    <div className="row" >
                                      <div className="col-3 m-1">
                                        <div
                                          style={{
                                            // fontSize: "14px",
                                            display: "flex",
                                            alignItems: "left",
                                            justifyContent: "left",
                                            float: "left",
                                          }}
                                        >
                                          <label className="container px-0">
                                            <span className="checkmark fw-bold">
                                              Payment
                                            </span>
                                          </label>
                                        </div>
                                      </div>

                                      {/* 2 */}
                                      <div className="col-2 m-1">
                                        <div
                                          style={{
                                            // fontSize: "12px",
                                            display: "flex",
                                            alignItems: "left",
                                            justifyContent: "left",
                                            float: "left",
                                            color: "green",
                                          }}
                                        >
                                          <label className="container px-0">
                                            <span className="checkmark">{item.status}</span>
                                          </label>
                                        </div>
                                      </div>

                                      <div className="col-3 m-1">
                                        <div
                                          style={{
                                            // fontSize: "12px",
                                            display: "flex",
                                            alignItems: "left",
                                            justifyContent: "left",
                                            float: "left",
                                          }}
                                        >
                                          <label className="container px-0">
                                            <span className="checkmark">
                                              {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                              {/* {item.createdAt} */}
                                              {/* Mar 20, 2021 */}
                                            </span>
                                          </label>
                                        </div>
                                      </div>

                                      {/* 4 */}
                                      <div className="col-1 m-1">
                                        <div
                                          style={{
                                            // fontSize: "12px",
                                            display: "flex",
                                            alignItems: "left",
                                            justifyContent: "left",
                                            float: "left",
                                            // color: "#EB5757",
                                          }}
                                        >
                                          <label className="container px-0">
                                            <span className="checkmark">
                                              {/* $140,20 */}
                                              ${Number(item.amount).toFixed(2)}
                                            </span>
                                          </label>
                                        </div>
                                      </div>

                                      <div className="col-1 m-1">
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "left",
                                            justifyContent: "left",
                                            float: "left",
                                          }}
                                        >
                                          <label className="container px-0" onClick={() => addPrice(Number(item.amount).toFixed(2))}>
                                            <span className="checkmark moreImg">
                                              <img
                                                src="/images/icon/more.png"
                                                alt=""
                                                style={{ width: 22, height: 22 }}
                                              />
                                            </span>
                                          </label>
                                        </div>
                                      </div>

                                    </div>
                                    <hr style={{ borderTop: "2px solid black" }} />
                                  </div>


                                ))}

                              </div>

                            </div>
                          </div>

                          <div className="col-12 col-xs-12 col-md-12 col-lg-5 col-xl-5">
                            <div className="left_payment">
                              <h3 className="mt-4"><b>Payment Detail</b></h3>

                              <div
                                className="img mt-4"
                                style={{
                                  borderRadius: 40,
                                  width: 80,
                                  height: 80,
                                  margin: "0 auto"
                                }}
                              >
                                <img
                                  src={image}
                                  alt="Logo"
                                  width="72%"
                                  height="auto"
                                  className="d-inline-block align-text-top rounded-circle"
                                />
                              </div>
                              <p><b>{name}</b></p>
                              <hr className="payhr mb-4" />
                              <span>Amount Due</span>
                              <h3 className="amntdueH">${Number(currenPrice).toFixed(2)}</h3>
                              <hr className="payhr mb-4 mt-4" />
                              <p className="mb-2">Billing Plan</p>
                              <h4 className="mb-5">Company Start</h4>
                            </div>
                          </div>

                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
