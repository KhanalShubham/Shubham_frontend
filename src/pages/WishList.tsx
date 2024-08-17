import React, {useId} from 'react';
import "../assets/css/WishList.css";
import {Link} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Aboutus: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem("userId");
    const userId = localStorage.getItem("userId");

    const { data,refetch } = useQuery({
        queryKey: ["GET_WISHLIST-ITEM_BY_USER_ID", userId],
        queryFn: () =>
            axios.get(`http://localhost:8082/wishlist-item/getByUserId/${userId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
            })
    });
    const deleteApi = useMutation({
        mutationKey: ["DELETE-WISHLIST_ITEM"],
        mutationFn(id: number) {
            return axios.delete("http://localhost:8082/wishlist-item/deleteById/"+id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
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
                    Remove from wishlist
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
                        // No action on cancel or you can add a cancel action if needed
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



    console.log(data?.data)
    return (

        <div className={"wl-container"}>
            <div className={"wl-header"}>

                <div className={"wl-logo"}>
                    <a href="/dashboard"> {/* Replace "/dashboard" with the actual URL of your dashboard page */}
                        <img
                            width={100}
                            src={"images/logo.png"}
                            alt="Logo"
                        />
                    </a>
                </div>
                {/*<div className={"wl-btn_before"}>*/}
                {/*    <button>Brands</button>*/}
                {/*    <button>Categories</button>*/}
                {/*    <Link to="/Contactus"><button>Contact Us</button></Link>*/}
                {/*    <Link to="/Aboutus"><button>About Us</button></Link>*/}
                {/*</div>*/}
                <div className={"wl-searchbar"}>
                    <input type={"text"} placeholder={"Search Product"} />
                </div>
                <div className={"wl-search_button"}>
                    <button><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div className={"wl-btn-wrapper"}>
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
            <div className={"wl-body"}>
                <div className={"wl-container"}>
                    <div className={"wl-title"}>
                        <h2>My Wishlist</h2>
                    </div>

                    <div className={"wishlist-table"}>
                        <table>
                            <thead>
                            <tr>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Product Description</th>
                                <th>Product Price</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.data.map((i) => (
                                <tr>
                                    <td>
                                        <img src={"data:image/png;base64, " + i?.itemImage} width={100} alt={i?.itemName} />
                                    </td>
                                    <td><p>{i?.item.itemName}</p></td>
                                    <td><p>{i?.item.itemDescription}</p></td>
                                    <td><p>{i?.item.itemPerPrice}</p></td>
                                    <td>

                                        <button className={"wl-delete"} onClick={()=>handleDelete(i?.id)} ><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>

                        </table>

                    </div>
                    <ToastContainer autoClose={4000}/>

                </div>
            </div>
            {/*<div className={"wl-footer"}>*/}
            {/*    <div className={"wl-get-help"}>*/}
            {/*        <h1>GET HELP</h1>*/}
            {/*        <Link to="/Customercare"><button>Customer Care</button></Link>*/}
            {/*        <Link to="/Payment"><button>Payment Options</button></Link>*/}
            {/*        <Link to="/returnandrefundpolicy"><button>Return and Refund Policy</button></Link>*/}
            {/*        <Link to="/PrivacyPolicy"><button>Privacy Policy</button></Link>*/}
            {/*        <Link to="/Termsandcondition"><button>Terms and Conditions</button></Link>*/}
            {/*        <span>@2023 Lugahub Pvt. Ltd. All Rights Reserved</span>*/}

            {/*    </div>*/}
            {/*    <div className={"wl-about-us"}>*/}
            {/*        <h1>LUGAHUB</h1>*/}
            {/*        <Link to="/Aboutus"><button>About Us</button></Link>*/}
            {/*        <Link to="/Contactus"><button>Contact Us</button></Link>*/}
            {/*        <Link to="/Careers"><button>Careers</button></Link>*/}




            {/*    </div>*/}
            {/*    <div className={"wl-logos"}>*/}
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

export default Aboutus;
