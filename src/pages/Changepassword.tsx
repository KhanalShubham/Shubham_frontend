import React from 'react';
import "../assets/css/Changepassword.css";
import {Link} from "react-router-dom";
const Changepassword: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem("userId");
    return (
        <div className={"cp-container"}>
            <div className={"cp-header"}>

                <div className={"cp-logo"}>
                    <a href="/dashboard"> {/* Replace "/dashboard" with the actual URL of your dashboard page */}
                        <img
                            width={100}
                            src={"images/logo.png"}
                            alt="Logo"
                        />
                    </a>
                </div>
                {/*<div className={"cp-btn_before"}>*/}
                {/*    /!*<button>Brands</button>*!/*/}
                {/*    <button>Categories</button>*/}
                {/*    <Link to="/Contactus">*/}
                {/*        <button>Contact Us</button>*/}
                {/*    </Link>*/}
                {/*    <Link to="/Aboutus">*/}
                {/*        <button>About Us</button>*/}
                {/*    </Link>*/}
                {/*</div>*/}

                <div className={"cp-searchbar"}>
                    <input type={"text"} placeholder={"Search Product"}/>
                </div>
                <div className={"cp-search_button"}>
                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div className={"cp-btn-wrapper"}>
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
            <div className={"cp-body"}>
                <div className={"cp-profile-first"}>
                    <div className={"cp-manage-my-account"}>
                        <span>Manage My Account</span>
                        <Link to="/MyAccount"><button>My profile</button></Link>
                    </div>
                    <div className={"cp-my-orders"}>
                        <span>My Orders</span>
                        <Link to="/Myorders"><button>My Orders</button></Link>
                    </div>
                </div>
                <div className={"cp-profile-second"}>
                    <div className={"cp-section1"}>
                        <h3>Change password</h3>

                    </div>
                    <div className={"cp-section2"}>
                        <div className={"cp-entryfield"}>
                            <div className={"cp-field1"}>
                                <label>Current password</label>
                                <input type={"password"} placeholder={"Current password"} />

                            </div>
                            <div className={"cp-field2"}>
                                <label>New password</label>
                                <input type={"password"} placeholder={"New password"} />

                            </div>
                            <div className={"cp-field3"}>
                                <label>Confirm password</label>
                                <input type={"password"} placeholder={"Confirm password"} />

                            </div>
                        </div>

                        <div className={"cp-buttons"}>
                            <button>SAVE CHANGES</button>

                        </div>


                    </div>

                </div>
            </div>




            <div className={"cp-footer"}>
                <div className={"cp-get-help"}>
                    <h1>GET HELP</h1>
                    <Link to="/Customercare"><button>Customer Care</button></Link>
                    <Link to="/Payment"><button>Payment Options</button></Link>
                    <Link to="/returnandrefundpolicy"><button>Return and Refund Policy</button></Link>
                    <Link to="/PrivacyPolicy"><button>Privacy Policy</button></Link>
                    <Link to="/Termsandcondition"><button>Terms and Conditions</button></Link>
                    <span>@2023 Lugahub Pvt. Ltd. All Rights Reserved</span>

                </div>
                <div className={"cp-about-us"}>
                    <h1>LUGAHUB</h1>
                    <Link to="/Aboutus"><button>About Us</button></Link>
                    <Link to="/Contactus"><button>Contact Us</button></Link>
                    <Link to="/Careers"><button>Careers</button></Link>



                </div>
                <div className={"cp-logos"}>
                    <span>Connect with us:</span>
                    <a href="https://www.facebook.com/profile.php?id=61555012223662&is_tour_dismissed=true"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            width={43}
                            src={"images/fb.png"}
                            alt="Facebook"
                        />
                    </a>

                    <a href="https://www.instagram.com/luga.hub69/"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            width={43}
                            src={"images/insta.png"}
                            alt="Facebook"
                        />
                    </a>
                    <a href="https://www.threads.net/@luga.hub69"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            width={43}
                            src={"images/thread.png"}
                            alt="X"
                        />
                    </a>


                </div>

            </div>
        </div>

    );
};

export default Changepassword;
