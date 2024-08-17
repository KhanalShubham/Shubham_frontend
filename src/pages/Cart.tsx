import "../assets/css/Cart.css";
import React, { useState,useEffect } from 'react';
import {Link} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import KhaltiCheckout from "khalti-checkout-web";


const Cart: React.FC = () => {
    const verifyPayment = async (token,amount) => {
        const data = {
            "token": token,
            "amount": amount
        };
        const config = {
            headers: { 'Authorization': 'test_secret_key_73f0da7ebb3d492494f1a9cffe7ea95e' }
        };

        try {
            const response = await axios.post("https://khalti.com/api/v2/payment/verify/", data, config);
            console.log(response.data);
            // Handle the response data as needed
        } catch (error) {
            console.error(error);
            // Handle the error as needed
        }
    };

    useEffect(() => {
        const config = {
            publicKey: "test_public_key_ef85baf701e246258574c72f348d31af",
            productIdentity: '1234567890',
            productName: 'tshirt',
            productUrl: 'http://lugahub.com/buy/tshirt',
            eventHandler: {
                onSuccess: (payload) => {
                    console.log('Payment successful:', payload);

                    // Assuming that payload.token contains the transaction token
                    const transactionToken = payload.token;

                    const transactionAmount = payload.amount;

                    // Call verifyPayment with the transaction token and amount
                    verifyPayment(transactionToken, transactionAmount);

                    toast.success('Payment successful'); // Show toast on success
                },
                onError: (error) => {
                    console.error('Payment error:', error);
                    toast.error('Payment error'); // Show toast on error
                },
                onClose: () => {
                    console.log('Widget is closing');
                },
            },
            paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
        };

        const checkout = new KhaltiCheckout(config);
        const btn = document.getElementById('payment-button');

        if (btn) {
            btn.onclick = () => {
                // Minimum transaction amount must be 10, i.e., 1000 in paisa.
                checkout.show({ amount: calculateGrandTotal() });
            };
        }
    }, []);
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [isConfirmPurchaseVisible, setConfirmPurchaseVisible] = useState(false);

    // Function to handle the click on the Cash On Delivery container
    const handleCashClick = () => {
        // Toggle the visibility of the Confirm Purchase container
        setConfirmPurchaseVisible(true);
    };

    const handleconfirm = () => {
        setShowPaymentMethod(true);
    };

    const isLoggedIn = !!localStorage.getItem("userId");
    const calculateSubtotal = () => {
        const subtotal = data?.data.reduce((acc, item) => acc + (item.quantity * item.item.itemPerPrice), 0);
        return subtotal || 0;
    };

    const calculateGrandTotal = () => {
        const deliveryCharge = 100;
        const grandTotal = calculateSubtotal() + deliveryCharge;
        return grandTotal || 0;
    };
    const userId = localStorage.getItem("userId");

    const {data,refetch}=useQuery({
        queryKey:["GET_Cart-ITEM_BY_USERID",userId],
        queryFn(){
            return axios.get(`http://localhost:8082/cart/getByUserId/${userId}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            })
        }
    })

    const deleteApi = useMutation({
        mutationKey: ["DELETE-CART_ITEM"],
        mutationFn(id: number) {
            return axios.delete("http://localhost:8082/cart/deleteById/"+id, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            })
        },
        onSuccess() {
            refetch();
            setTimeout(() => {
                toast.success('Item removed successfully!');
            }, 0);
        },
        onError(error) {
            toast.error(`Error deleting category: ${error.message}`);
        },
    });
    const handleDelete = (id: number) => {
        confirmAlert({
            title: (
                <div style={{ fontSize: '16px' }}>
                    Remove from cart
                </div>
            ),
            message: (
                <div style={{ fontSize: '14px' }}>
                    Are you sure you want to delete this item?
                </div>
            ),
            buttons: [
                {
                    label: (
                        <div style={{ fontSize: '12px' }}>
                            Cancel
                        </div>
                    ),
                    onClick: () => {
                    }
                },
                {
                    label: (
                        <div style={{ fontSize: '12px' }}>
                            Confirm
                        </div>
                    ),
                    onClick: () => deleteApi.mutate(id)
                }
            ]
        });
    };

    const checkoutApi=useMutation({
        mutationKey:["CHECKOUT_API"],
        mutationFn(payload){
            return axios.post("http://localhost:8082/order/saveAll",payload,{
                headers:{
                    "authorization":"Bearer "+localStorage.getItem("token")
                }
            })
        },
        onSuccess: () => {
            alert("Item ordered successfully!");
        }
    })
    const handleCheckout=(data)=>{

        let date =new Date()
        console.log(data)
        const payload= data.map(i=>{
            return {
                userId:localStorage.getItem("userId"),
                itemId:i?.item?.id,
                paymentStatus:"pending",
                deliveryStatus:"pending",
                deliveryTime:date.getTime(),
                deliveryDate: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`,
                quantity:i?.quantity,
                size:i?.size,
                color:i?.color
            }
        })

        checkoutApi.mutate(payload,{
            onSuccess(res){
                console.log(res)
                window.location.href="/myorders"
            },
            onError(err){
                console.log(err)
            }
        })

    }

    return (
        <div className={"c-container"}>
            <div className={"c-header"}>

                <div className={"c-logo"}>
                    <a href="/dashboard">
                        <img
                            width={100}
                            src={"images/logo.png"}
                            alt="Logo"
                        />
                    </a>
                </div>
                {/*<div className={"c-btn_before"}>*/}
                {/*    <button>Brands</button>*/}
                {/*    <button>Categories</button>*/}
                {/*    <Link to="/Contactus"><button>Contact Us</button></Link>*/}
                {/*    <Link to="/Aboutus"><button>About Us</button></Link>*/}
                {/*</div>*/}
                <div className={"c-searchbar"}>
                    <input type={"text"} placeholder={"Search Product"} />
                </div>
                <div className={"c-search_button"}>
                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div className={"c-btn-wrapper"}>
                    <button><i className="fa-solid fa-cart-shopping cart-icon"></i>Cart</button>
                    <Link to={"/wishlist"}><button><i className="fa-regular fa-heart"></i>Wishlist</button></Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/myaccount">
                                <button>My Account</button>
                            </Link>
                            <Link to="/login">
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
            <div className={"c-body"}>
                <div className={"c-container"}>
                    <div className={"c-title"}>
                        <h2>My Cart</h2>
                    </div>

                    {data?.data.length > 0 ? (
                        <div className={"c-table"}>
                            <table>
                                <thead>
                                <tr>
                                    <th>Product Image</th>
                                    <th>Product Name</th>
                                    <th>Product Description</th>
                                    <th>Product Price</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data?.data.map((i) => (
                                    <tr key={i.id}>
                                        <td>
                                            <img src={"data:image/png;base64, " + i?.itemImage} width={100} alt={i?.itemName} />
                                        </td>
                                        <td><p>{i?.item.itemName}</p></td>
                                        <td><p>{i?.item.itemDescription}</p></td>
                                        <td><p>Rs. {i?.item.itemPerPrice}</p></td>
                                        <td><p>{i?.color}</p></td>
                                        <td><p>{i?.size}</p></td>
                                        <td><p>{i?.quantity}</p></td>
                                        <td><p>Rs. {i?.quantity * i?.item.itemPerPrice}</p></td>
                                        <td>
                                            <button className={"c-delete"} onClick={() => handleDelete(i?.id)}><i className="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={"no-item"}>
                            <img src={"../images/empty-cart.png"} alt={"empty-cart"} width={100}/>
                            <p>There are no items in your cart.</p>
                            <Link to="/dashboard"><button>Continue Shopping</button></Link>
                        </div>
                    )}
                    <div className={"bill"}>
                        <table>
                            <tbody>
                            <tr>
                                <th>Subtotal:</th>
                                <td><p>Rs. {calculateSubtotal()}</p></td>
                            </tr>
                            </tbody>
                            <tbody>
                            <tr>
                                <th>Delivery Charge:</th>
                                <td>Rs.100</td>
                            </tr>
                            </tbody>
                            <tbody>
                            <tr className="highlighted-row">
                                <th>Grand Total:</th>
                                <td>Rs. {calculateGrandTotal()}</td>
                            </tr>
                            </tbody>
                            <tbody>
                            <tr className={"proceed"}>
                                <th></th>
                                {/*<td><button onClick={()=>handleCheckout(data?.data)}>Check Out</button></td>*/}
                                <td><button onClick={handleconfirm}>Check Out</button></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    {showPaymentMethod && (
                        <div className={"main"}>
                            <div className="payment-method" style={{ marginLeft: '320px' }}>
                                <div className={"select"}>
                                    <label>Select Payment Method</label>
                                </div>
                                <div className={"cash"} onClick={handleCashClick}>
                                    <img src={"../images/COD.png"} alt={"cashondelivery"} width={100}/>
                                    <p>Cash On Delivery</p>
                                </div>
                                {isConfirmPurchaseVisible && data?.data.length > 0 && (
                                    <div className="confirm-order">
                                        <p>Cash transactions are accommodated by our courier at the time of delivering the goods to your door.</p>
                                        <button onClick={() => handleCheckout(data?.data)}>Confirm Purchase</button>
                                    </div>
                                )}
                                <div id={"payment-button"} className={"khalti"}>
                                    <img src={"../images/khalti.jpg"} alt={"khalti"} width={100}/>
                                    <p >Khalti Digital Wallet</p>

                                </div>
                            </div>
                            <div className={"Order-summary"}>
                                <div className={"Bill"} style={{marginTop:"70px",marginLeft:"200px" }}>
                                    <h1>Order Summary</h1>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <th>Subtotal:</th>
                                            <td><p>Rs. {calculateSubtotal()}</p></td>
                                        </tr>
                                        </tbody>
                                        <tbody>
                                        <tr>
                                            <th>Delivery Charge:</th>
                                            <td>Rs. 100</td>
                                        </tr>
                                        </tbody>
                                        <tbody>
                                        <tr className="highlighted-row">
                                            <th>Grand Total:</th>
                                            <td>Rs. {calculateGrandTotal()}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    <ToastContainer autoClose={4000}/>
                </div>
            </div>
            {/*<div className={"c-footer"}>*/}
            {/*    <div className={"c-get-help"}>*/}
            {/*        <h1>GET HELP</h1>*/}
            {/*        <Link to="/Customercare"><button>Customer Care</button></Link>*/}
            {/*        <Link to="/Payment"><button>Payment Options</button></Link>*/}
            {/*        <Link to="/returnandrefundpolicy"><button>Return and Refund Policy</button></Link>*/}
            {/*        <Link to="/PrivacyPolicy"><button>Privacy Policy</button></Link>*/}
            {/*        <Link to="/Termsandcondition"><button>Terms and Conditions</button></Link>*/}
            {/*        <span>@2023 PlantDecor Pvt. Ltd. All Rights Reserved</span>*/}

            {/*    </div>*/}
            {/*    <div className={"c-about-us"}>*/}
            {/*        <h1>Plant Decor</h1>*/}
            {/*        <Link to="/Aboutus"><button>About Us</button></Link>*/}
            {/*        <Link to="/Contactus"><button>Contact Us</button></Link>*/}
            {/*        <Link to="/Careers"><button>Careers</button></Link>*/}

            {/*    </div>*/}
            {/*    <div className={"c-logos"}>*/}
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

export default Cart;
