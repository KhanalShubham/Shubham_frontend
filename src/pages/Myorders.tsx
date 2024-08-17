import React from 'react';
import "../assets/css/Myorders.css";
import {Link} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
const Myorders: React.FC = () => {
    const calculatedSubtotal = () => {
        // Assuming data is an array of items with a property itemTotalPrice
        const subtotal = data?.data.reduce((acc, item) => acc + (item.quantity * item.item.itemPerPrice), 0);
        return subtotal || 0;
    };
    const calculatedGrandTotal = () => {
        // Assuming delivery charge is a fixed value of Rs. 200
        const deliveryCharge = 100;
        const grandTotal = calculatedSubtotal() + deliveryCharge;
        return grandTotal || 0;
    };
    const userId = localStorage.getItem("userId");

    const {data:getApiOfOrdersofusers}=useQuery({
        queryKey:["GET_Cart-ITEM_BY_USERID",userId],
        queryFn(){
            return axios.get(`http://localhost:8082/order/getByUserId/${userId}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            })
        }
    })
    const isLoggedIn = !!localStorage.getItem("userId");
    return (
        <div className={"mo-container"}>
            <div className={"mo-header"}>

                <div className={"mo-logo"}>
                    <a href="/dashboard"> {/* Replace "/dashboard" with the actual URL of your dashboard page */}
                        <img
                            width={100}
                            src={"images/logo.png"}
                            alt="Logo"
                        />
                    </a>
                </div>
                {/*<div className={"mo-btn_before"}>*/}
                {/*    /!*<button>Brands</button>*!/*/}
                {/*    <button>Categories</button>*/}
                {/*    <Link to="/Contactus"><button>Contact Us</button></Link>*/}
                {/*    <Link to="/Aboutus"><button>About Us</button></Link>*/}
                {/*</div>*/}

                <div className={"mo-searchbar"}>
                <input type={"text"} placeholder={"Search Product"} />
                </div>
                <div className={"mo-search_button"}>
                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div className={"mo-btn-wrapper"}>
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
            <div className={"mo-body"}>
                <div className={"mo-profile-first"}>
                    <div className={"mo-manage-my-account"}>
                        <h2>Manage My Account</h2>
                        <Link to="/MyAccount"><button>My profile</button></Link>
                    </div>
                    <div className={"mo-my-orders"}>
                        <h2>My Orders</h2>
                        <Link to="/Myorders"><button>My Orders</button></Link>
                    </div>
                </div>
                <div className={"mo-profile-second"}>
                    <div className={"mo-section1"}>
                        <h3>My orders</h3>
                    </div>
                    <div className={"order-table"}>
                        <table   id="productTable">
                            <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product Details</th>
                                <th>Total Price</th>
                                <th>Payment Status</th>
                                <th>Delivery Date</th>
                                <th>Delivery Time</th>
                                <th>Delivery Status</th>
                            </tr>
                            </thead>
                            <tbody id="productTableBody">
                            {getApiOfOrdersofusers?.data?.map(i=>(
                                <tr>
                                    <td>{i?.id}</td>
                                    <td>
                                        <img src={"data:image/png;base64, " + i?.itemImage} width={100} alt={i?.itemName} />
                                        <p>{i?.item.itemName}</p>
                                        <p>{i?.item.itemDescription}</p>
                                        <p>Rs. {i?.item.itemPerPrice}</p>
                                        <p>Color:{i?.color}</p>
                                        <p>Quantity:{i?.quantity} </p>
                                        <p>Size:{i?.size}</p>
                                    </td>
                                    <td>
                                        <p>Rs.{i?.quantity * i?.item.itemPerPrice + 100}</p>
                                    </td>
                                    <td>
                                        <p>{i?.paymentStatus}</p>
                                    </td>
                                    <td>
                                        <p>{i?.deliveryDate}</p>
                                    </td>
                                    <td>
                                        <p>{i?.deliveryTime}</p>
                                    </td>
                                    <td>
                                        <p>{i?.deliveryStatus}</p>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/*<div className={"mo-footer"}>*/}
            {/*    <div className={"mo-get-help"}>*/}
            {/*        <h1>GET HELP</h1>*/}
            {/*        <Link to="/Customercare"><button>Customer Care</button></Link>*/}
            {/*        <Link to="/Payment"><button>Payment Options</button></Link>*/}
            {/*        <Link to="/returnandrefundpolicy"><button>Return and Refund Policy</button></Link>*/}
            {/*        <Link to="/PrivacyPolicy"><button>Privacy Policy</button></Link>*/}
            {/*        <Link to="/Termsandcondition"><button>Terms and Conditions</button></Link>*/}
            {/*        <span>@2023 Lugahub Pvt. Ltd. All Rights Reserved</span>*/}
            {/*    </div>*/}
                {/*<div className={"mo-about-us"}>*/}
                {/*    <h1>LUGAHUB</h1>*/}
                {/*    <Link to="/Aboutus"><button>About Us</button></Link>*/}
                {/*    <Link to="/Contactus"><button>Contact Us</button></Link>*/}
                {/*    <Link to="/Careers"><button>Careers</button></Link>*/}





                {/*</div>*/}
            {/*    <div className={"mo-logos"}>*/}
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

export default Myorders;
