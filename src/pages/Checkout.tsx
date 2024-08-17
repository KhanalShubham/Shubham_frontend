import React from 'react';
import "../assets/css/Checkout.css";
import {Link} from "react-router-dom";
import axios from "axios";
import { useState } from 'react';
import {useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation,useQuery} from "@tanstack/react-query";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem("userId");
    const apiCall = useMutation({
        mutationKey: ["POST_wishlist_ITEM"],
        mutationFn: async (payload) => {
            try {
                console.log(payload);
                const response = await axios.post("http://localhost:8082/wishlist-item/save", payload, {
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                });
                return response.data;
            } catch (error) {
                throw error; // You may want to handle errors appropriately based on your application's needs
            }
        }
    });

    const apihit = useMutation({
        mutationKey: ["POST_cart_ITEM"],
        mutationFn: (payload) => {
            console.log(payload);
            return axios.post("http://localhost:8082/cart/save", payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
        },
        onSuccess() {
            setTimeout(() => {
                toast.success('Item added to cart successfully!');
            }, 0);
        },
        onError(error) {
            console.error(error);
            setTimeout(() => {
                toast.warning('Please select both color and size before adding to cart.');
            }, 0);
        },
    });
    const userId = localStorage.getItem("userId");
    const buttonclick = async () => {
        if(!localStorage.getItem("userId")){
            toast.error("Please login before!")
            return;
        }
        const payload = {
            itemId: id_p,
            color: selectedColor, // Replace with your actual state variable for color
            size: selectedSize,   // Replace with your actual state variable for size
            quantity: quantity ,   // Quantity from the state
            userId:userId
        };
        // Assuming `apiCall.mutate` is an asynchronous function
        await apihit.mutate(payload);
        console.log(dataById);
    };

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(''); // Initial value is an empty string, replace with your default color
    const [selectedSize, setSelectedSize] = useState('');   // Initial value is an empty string, replace with your default size
    const [heartColor, setHeartColor] = useState('black'); // Initial heart color

    const handleColorSelection = (color) => {
        setSelectedColor(color);
        const colorOptions = document.querySelectorAll('.coloroptions span');
        colorOptions.forEach((option) => {
            const borderStyle = color === option.innerText ? '2px solid black' : '2px solid grey';
            option.style.border = borderStyle;
        });
    };

    const handleSizeSelection = (size) => {
        const sizeOptions = document.querySelectorAll('.sizeoptions span');
        sizeOptions.forEach((option) => {
            const borderStyle = size === option.innerText ? '2px solid black' : '2px solid grey';
            option.style.border = borderStyle;
        });


        setSelectedSize(size);
    };

    const handleButtonClick = async () => {
        if(!localStorage.getItem("userId")){
            toast.error("Please login before!")
            return;
        }
        // Assuming `apiCall.mutate` is an asynchronous function
        await apiCall.mutate({ itemId: id_p,userId:localStorage.getItem("userId") });

        // Update the heart color to red
        setHeartColor('red');

        // Assuming `apiCall` fetches data and sets it to the `dataById` state
        console.log(dataById);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const {id_p} =useParams();
    console.log(id_p)
    const { data: dataById } = useQuery({
        queryKey: ['GETBYID'],
        queryFn() {
            return axios.get(`http://localhost:8082/item/getById/${id_p}`);
        },
        enabled: !!id_p,
    });
    const navigate= useNavigate()
    const {register,handleSubmit} = useForm({
        values: id_p ? dataById?.data : {},
    });
    return (
        <div className={"ck-container"}>
            <div className={"ck-header"}>
                <div className={"ck-logo"}>
                    <a href="/dashboard">
                        <img
                            width={100}
                            src={"../images/logo.png"}
                            alt="Logo"
                        />
                    </a>
                </div>
                {/*<div className={"ck-btn_before"}>*/}
                {/*    <button>Brands</button>*/}
                {/*    <button>Categories</button>*/}
                {/*    <Link to="/Contactus">*/}
                {/*        <button>Contact Us</button>*/}
                {/*    </Link>*/}
                {/*    <Link to="/Aboutus">*/}
                {/*        <button>About Us</button>*/}
                {/*    </Link>*/}
                {/*</div>*/}
                <div className={"ck-searchbar"}>
                    <input type={"text"} placeholder={"Search Product"}/>
                </div>
                <div className={"ck-search_button"}>
                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div className={"ck-btn-wrapper"}>
                    <Link to={"/cart"}><button><i className="fa-solid fa-cart-shopping cart-icon"></i>Cart</button></Link>
                    <Link to="/wishlist"><button><i className="fa-regular fa-heart"></i>Wishlist</button></Link>
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
            <div className={"ck-body"}>
                <form onSubmit={handleSubmit(onsubmit)}>
                <div className={"descc"}>
                    <div className={"ck-image-sec"}>
                        <div className={"image-sec"}>
                            {dataById?.data && dataById?.data.itemImage && (
                                <img
                                    src={`data:image/png;base64, ${dataById.data.itemImage}`}
                                    width={100}
                                    alt="itemImage"
                                    {...register("itemImage")}
                                />
                            )}
                        </div>
                        <div className={"ck-buttons"}>
                            <button className={"add"} onClick={buttonclick}>Add to cart</button>
                            <button className="wish" onClick={handleButtonClick}>
                                Favourite
                                <i className="fa-solid fa-heart" style={{ color: heartColor }} ></i>
                            </button>
                        </div>


                    </div>
                    <form>
                    <div className={"ck-description"}>
                        <div className={"desc1"}>
                            <div className={"desc6"}>
                                <input type={"text"}{...register("itemName")} disabled />
                            </div>
                            <div className={"desc7"}>
                                <input type={"text"} {...register("itemDescription")} disabled/>
                            </div>
                            <div className={"desc8"}>
                                <p>Rs. <input {...register("itemPerPrice")} disabled /></p>
                            </div>
                        </div>
                        <div className={"desc2"}>
                            <div className={"desc3"}>
                                <p>Color:</p>
                                <div className={"coloroptions"}>
                                    <span onClick={() => handleColorSelection('Black')}>Black</span>
                                    <span onClick={() => handleColorSelection('White')}>White</span>
                                    <span onClick={() => handleColorSelection('Grey')}>Grey</span>
                                    <span onClick={() => handleColorSelection('Navy Blue')}>Navy Blue</span>
                                </div>
                            </div>
                            <div className={"desc4"}>
                                <p>Size:</p>
                                <div className={"sizeoptions"}>
                                    <span onClick={() => handleSizeSelection('XS')}  className={selectedSize === 'XS' ? 'selectedSize' : ''}>XS</span>
                                    <span onClick={() => handleSizeSelection('S')}  className={selectedSize === 'S' ? 'selectedSize' : ''}>S</span>
                                    <span onClick={() => handleSizeSelection('M')}  className={selectedSize === 'M' ? 'selectedSize' : ''}>M</span>
                                    <span onClick={() => handleSizeSelection('L')}  className={selectedSize === 'L' ? 'selectedSize' : ''}>L</span>
                                    <span onClick={() => handleSizeSelection('XL')}  className={selectedSize === 'XL' ? 'selectedSize' : ''}>XL</span>
                                    <span onClick={() => handleSizeSelection('2XL')}  className={selectedSize === '2XL' ? 'selectedSize' : ''}>2XL</span>
                                </div>
                            </div>
                            <div className={"desc5"}>
                                <p>Quantity:</p>
                                <div className={"quantity-counter"}>
                                    <button type="button" onClick={handleDecrement}>-</button>
                                    <span>{quantity}</span>
                                    <button  type="button" onClick={handleIncrement}>+</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    </form>
                    <ToastContainer/>
                </div>
                </form>
            </div>
            {/*<div className={"ck-footer"}>*/}
            {/*    <div className={"ck-get-help"}>*/}
            {/*        <h1>GET HELP</h1>*/}
            {/*        <Link to="/Customercare"><button>Customer Care</button></Link>*/}
            {/*        <Link to="/Payment"><button>Payment Options</button></Link>*/}
            {/*        <Link to="/ReturnandRefund"><button>Return and Refund Policy</button></Link>*/}
            {/*        <Link to="/PrivacyPolicy"><button>Privacy Policy</button></Link>*/}
            {/*        <Link to="/Termsandcondition"><button>Terms and Conditions</button></Link>*/}
            {/*        <span>@2023 Lugahub Pvt. Ltd. All Rights Reserved</span>*/}
            {/*    </div>*/}
            {/*    <div className={"ck-about-us"}>*/}
            {/*        <h1>LUGAHUB</h1>*/}
            {/*        <Link to="/Aboutus"><button>About Us</button></Link>*/}
            {/*        <Link to="/Contactus"><button>Contact Us</button></Link>*/}
            {/*        <Link to="/Careers"><button>Careers</button></Link>*/}
            {/*    </div>*/}
            {/*    <div className={"ck-logos"}>*/}
            {/*        <span>Connect with us:</span>*/}
            {/*        <a href="https://www.facebook.com/profile.php?id=61555012223662&is_tour_dismissed=true"*/}
            {/*           target="_blank" rel="noopener noreferrer">*/}
            {/*            <img*/}
            {/*                width={43}*/}
            {/*                src={"../images/fb.png"}*/}
            {/*                alt="Facebook"*/}
            {/*            />*/}
            {/*        </a>*/}

            {/*        <a href="https://www.instagram.com/luga.hub69/"*/}
            {/*           target="_blank" rel="noopener noreferrer">*/}
            {/*            <img*/}
            {/*                width={43}*/}
            {/*                src={"../images/insta.png"}*/}
            {/*                alt="Facebook"*/}
            {/*            />*/}
            {/*        </a>*/}
            {/*        <a href="https://www.threads.net/@luga.hub69"*/}
            {/*           target="_blank" rel="noopener noreferrer">*/}
            {/*            <img*/}
            {/*                width={43}*/}
            {/*                src={"../images/thread.png"}*/}
            {/*                alt="X"*/}
            {/*            />*/}
            {/*        </a>*/}
            {/*    </div>*/}

            {/*</div>*/}
        </div>

    );
};

export default Checkout;
