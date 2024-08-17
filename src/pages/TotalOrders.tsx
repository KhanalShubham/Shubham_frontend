import {Link} from "react-router-dom";
import "../assets/css/TotalOrders.css";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import React from "react";
// import React from "react";
function TotalOrders() {
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
    const {data}=useQuery({
        queryKey:["GET_Cart-ITEM_ALL"],
        queryFn(){
            return axios.get("http://localhost:8082/cart/getAll")
        }
    })

    const {data:getApiOfOrders}=useQuery({
        queryKey:["GET_ORDERS_DATA"],
        queryFn(){
            return axios.get("http://localhost:8082/order/getAll",{
                headers:{
                    "authorization":"Bearer "+localStorage.getItem("token")
                }
            })
        }
    })
    return (
        <div className={"to-container"}>
            <div className={"to-buttons"}>
                <div className={"to-top"}>
                    <a href="/admin/products">
                        <img src={"../images/Logo.png"}
                             width={100}
                             alt={"logo"}
                        />

                    </a>
                    <span>E-commerce</span>
                    <i className="fa-solid fa-bars"></i>
                </div>
                <div className={"to-btn"}>
                    <div className="ap-dropdown">
                        <button className="ap-dropbtn"><i className="fa-solid fa-clipboard"></i>Products<i className="fa-solid fa-caret-down" style={{ marginLeft: '57px' }}></i></button>
                        <div className="ap-dropdown-content">
                            <a href="/admin/products">View Product</a>
                            <a href="/admin/addproduct">Add Product</a>

                        </div>
                    </div>
                    {/*<button className={"products"}><i className="fa-solid fa-list"></i>Categories</button>*/}
                    <div className="cgr-dropdown">
                        <button className="cgr-dropbtn"><i className="fa-solid fa-list"></i>Categories<i className="fa-solid fa-caret-down" style={{ marginLeft: '40px' }}></i></button>
                        <div className="cgr-dropdown-content">
                            <a href="/admin/viewcategory">View Category</a>
                            <a href="/admin/addcategory">Add Category</a>
                        </div>
                    </div>
                    {/*<button className={"products"}><i className="fa-solid fa-tag"></i>Brands</button>*/}
                    <div className="brd-dropdown">
                        <button className="brd-dropbtn"><i className="fa-solid fa-tag"></i>Brands<i className="fa-solid fa-caret-down" style={{ marginLeft: '69px' }}></i></button>
                        <div className="brd-dropdown-content">
                            <a href="/admin/viewbrand">View Brand</a>
                            <a href="/admin/addbrand">Add Brand</a>
                        </div>
                    </div>
                    <Link to={"/admin/totalorders"}><button className={"products"}><i className="fa-solid fa-cart-shopping"></i>Total Orders</button></Link>
                    <Link to={"/admin/users"}><button className={"products"}><i className="fa-solid fa-users"></i>Users</button></Link>
                    {/*<button className={"products"}><i className="fa-solid fa-user"></i>Profile</button>*/}
                    <div className="pr-dropdown">
                        <button className="pr-dropbtn"><i className="fa-solid fa-user"></i>Profile<i className="fa-solid fa-caret-down" style={{ marginLeft: '70px' }}></i></button>
                        <div className="pr-dropdown-content">
                            {/*<a href="/admin/profile">View Profile</a>*/}
                            <a href="/admin/editprofile">Edit Profile</a>
                            <a href="/admin/changepassword">Change Password</a>
                        </div>
                    </div>
                    {/*<Link to={"/admin/aboutus"}><button className={"products"}><i className="fa-regular fa-address-card"></i>About Us</button></Link>*/}
                    <Link to={"/login"}><button onClick={()=>{
                        localStorage.clear();
                        window.location.href="/login"
                    }} className={"products"}><i className="fa-solid fa-arrow-right"></i>Log Out</button></Link>
                </div>
            </div>
            <div className={"to-display"}>
                <h2>Total Orders</h2>
                <table   id="productTable">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer ID</th>
                        <th>Customer Details</th>
                        <th>Product Details</th>
                        <th>Total Price</th>
                        <th>Payment Status</th>
                        <th>Delivery Date</th>
                        <th>Delivery Time</th>
                        <th>Delivery Status</th>
                    </tr>
                    </thead>
                    <tbody id="productTableBody">
                    {getApiOfOrders?.data?.map(i=>(
                        <tr>
                            <td>{i?.id}</td>
                            <td>{i?.user?.id}</td>
                            <td>
                                <p>{i?.user.firstName} {i?.user.lastName}</p>
                                <p>{i?.user.username} </p>
                            </td>
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
    )
}
export default TotalOrders;
