import React, { useEffect, useState } from 'react';
import "../assets/css/EditProfile.css";
import { Link } from "react-router-dom";
import axios from "axios";


const EditProfile: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem("userId");
    const [userDetails, setUserDetails] = useState<any>({});
    const [editedDetails, setEditedDetails] = useState({
        firstName: 'string',
        lastName: 'string',
        email: 'string',
    });

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const userId = localStorage.getItem('userId');

            if (userId) {
                const response = await axios.get(`http://localhost:8082/user/getById/${userId}`);
                setUserDetails(response.data);

                // Set the initial values for editing
                setEditedDetails({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedDetails({
            ...editedDetails,
            [name]: value,
        });
    };

    const saveChanges = async () => {
        try {
            // Assuming there's an API endpoint to update user details
            const userId = localStorage.getItem('userId');
            if (userId) {
                await axios.put(`http://localhost:8082/user/update/${userId}`, editedDetails);
                // Optionally, you can refetch the updated details
                fetchUserDetails();
                console.log('Changes saved successfully!');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };


    return (
        <div className={"ep-container"}>
            <div className={"ep-header"}>

                <div className={"ep-logo"}>
                    <a href="/dashboard"> {/* Replace "/dashboard" with the actual URL of your dashboard page */}
                        <img
                            width={100}
                            src={"images/logo.png"}
                            alt="Logo"
                        />
                    </a>
                </div>
                {/*<div className={"ep-btn_before"}>*/}
                {/*    /!*<button>Brands</button>*!/*/}
                {/*    <button>Categories</button>*/}
                {/*    <Link to="/Contactus"><button>Contact Us</button></Link>*/}
                {/*    <Link to="/Aboutus"><button>About Us</button></Link>*/}

                {/*</div>*/}

                <div className={"ep-searchbar"}>
                    <input type={"text"} placeholder={"Search Product"} />
                </div>
                <div className={"ep-search_button"}>
                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div className={"ep-btn-wrapper"}>
                    <Link to={"/cart"}>
                        <button>
                            <i className="fa-solid fa-cart-shopping cart-icon"></i>Cart
                        </button>
                    </Link>
                    <Link to={'/wishlist'}>
                        <button>
                            <i className="fa-regular fa-heart"></i>Wishlist
                        </button>
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/myaccount">
                                <button>My Account</button>
                            </Link>
                            <Link to="/">
                                <button onClick={()=>{
                                    localStorage.clear();
                                    window.location.href="/login"
                                }}>Sign Out</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login"><button>Sign In</button></Link>
                            <Link to="/register"><button>Sign Up</button></Link>
                        </>
                    )}


                </div>


            </div>
            <div className={"ep-body"}>
                <div className={"ep-profile-first"}>
                    <div className={"ep-manage-my-account"}>
                        <h2>Manage My Account</h2>
                        <Link to="/MyAccount"><button>My profile</button></Link>
                    </div>
                    <div className={"ep-my-orders"}>
                        <h2>My Orders</h2>
                        <Link to="/Myorders"><button>My Orders</button></Link>
                    </div>
                </div>
                <div className={"ep-profile-second"}>
                    <div className={"ep-section1"}>
                        <h3>Edit profile</h3>
                    </div>

                    <div className={"ep-section2"}>
                        <div className={"ep-info"}>
                            <div className={"ep-part1"}>
                                <label>First Name:</label>
                                <input type={"text"} name="firstName" value={editedDetails.firstName}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className={"ep-part1"}>
                                <label>Last Name:</label>
                                <input type={"text"} name="lastName" value={editedDetails.lastName}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className={"ep-part1"}>
                                <label>Email Address:</label>
                                <input type={"text"} name="email" value={editedDetails.email}
                                       onChange={handleInputChange}/>
                            </div>

                        </div>
                        <div className={"ep-buttons"}>
                            <button onClick={saveChanges}>SAVE CHANGES</button>
                        </div>


                    </div>

                </div>
            </div>


            {/*<div className={"ep-footer"}>*/}
            {/*    <div className={"ep-get-help"}>*/}
            {/*        <h1>GET HELP</h1>*/}
            {/*        <Link to="/Customercare">*/}
            {/*            <button>Customer Care</button>*/}
            {/*        </Link>*/}
            {/*        <Link to="/Payment">*/}
            {/*            <button>Payment Options</button>*/}
            {/*        </Link>*/}
            {/*        <Link to="/returnandrefundpolicy">*/}
            {/*            <button>Return and Refund Policy</button>*/}
            {/*        </Link>*/}
            {/*        <Link to="/PrivacyPolicy">*/}
            {/*            <button>Privacy Policy</button></Link>*/}
            {/*        <Link to="/Termsandcondition"><button>Terms and Conditions</button></Link>*/}
            {/*        <span>@2023 Lugahub Pvt. Ltd. All Rights Reserved</span>*/}

            {/*    </div>*/}
            {/*    <div className={"ep-about-us"}>*/}
            {/*        <h1>LUGAHUB</h1>*/}
            {/*        <Link to="/Aboutus"><button>About Us</button></Link>*/}
            {/*        <Link to="/Contactus"><button>Contact Us</button></Link>*/}
            {/*        <Link to="/Careers"><button>Careers</button></Link>*/}



            {/*    </div>*/}
            {/*    <div className={"ep-logos"}>*/}
            {/*        <span>Connect with us:</span>*/}
            {/*        <a href="https://www.facebook.com/profile.php?id=61555012223662&is_tour_dismissed=true"*/}
            {/*           target="_blank" rel="noopener noreferrer">*/}
            {/*            <img*/}
            {/*                width={43}*/}
            {/*                src={"images/fb.png"}*/}
            {/*                alt="Facebook"*/}
            {/*            />*/}
            {/*        </a>*/}

            {/*        <a href="https://www.instagram.com/luga.hub69/"*/}
            {/*           target="_blank" rel="noopener noreferrer">*/}
            {/*            <img*/}
            {/*                width={43}*/}
            {/*                src={"images/insta.png"}*/}
            {/*                alt="Facebook"*/}
            {/*            />*/}
            {/*        </a>*/}
            {/*        <a href="https://www.threads.net/@luga.hub69"*/}
            {/*           target="_blank" rel="noopener noreferrer">*/}
            {/*            <img*/}
            {/*                width={43}*/}
            {/*                src={"images/thread.png"}*/}
            {/*                alt="X"*/}
            {/*            />*/}
            {/*        </a>*/}


            {/*    </div>*/}

            {/*</div>*/}
        </div>

    );
};

export default EditProfile;
