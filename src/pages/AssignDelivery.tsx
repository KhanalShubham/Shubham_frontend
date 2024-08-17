import {Link, useNavigate, useParams} from "react-router-dom";
import "../assets/css/AssignDelivery.css";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
function AssignDelivery() {
    const { id_p } = useParams();
    console.log(id_p)
    const { data: dataById } = useQuery({
        queryKey: ['GETBYID'],
        queryFn() {
            return axios.get(`http://localhost:8082/brand/getById/${id_p}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
        },
        enabled: !!id_p,
    });
    return (

        <div className={"assign-container"}>
            <div className={"assign-buttons"}>
                <div className={"assign-top"}>
                    <img src={"../images/Logo.png"}
                         width={100}
                         alt={"logo"}
                    />
                    <span>LugaHub</span>
                    <i className="fa-solid fa-bars"></i>
                </div>
                <div className={"assign-btn"}>
                    <div className="ap-dropdown">
                        <button className="ap-dropbtn"><i className="fa-solid fa-clipboard"></i>Products<i className="fa-solid fa-caret-down" style={{ marginLeft: '57px' }}></i></button>
                        <div className="ap-dropdown-content">
                            <a href="/admin/products">View Product</a>
                            <a href="/admin/addproduct">Add Product</a>

                        </div>
                    </div>
                    <div className="cgr-dropdown">
                        <button className="cgr-dropbtn"><i className="fa-solid fa-list"></i>Categories<i className="fa-solid fa-caret-down" style={{ marginLeft: '40px' }}></i></button>
                        <div className="cgr-dropdown-content">
                            <a href="/admin/viewcategory">View Category</a>
                            <a href="/admin/addcategory">Add Category</a>
                        </div>
                    </div>
                    <div className="brd-dropdown">
                        <button className="brd-dropbtn"><i className="fa-solid fa-tag"></i>Brands<i className="fa-solid fa-caret-down" style={{ marginLeft: '69px' }}></i></button>
                        <div className="brd-dropdown-content">
                            <a href="/admin/viewbrand">View Brand</a>
                            <a href="/admin/addbrand">Add Brand</a>
                        </div>
                    </div>
                    <Link to={"/admin/totalorders"}><button className={"products"}><i className="fa-solid fa-cart-shopping"></i>Total Orders</button></Link>
                    {/*<Link to={"/admin/aboutus"}><button className={"products"}><i className="fa-solid fa-boxes-packing"></i>Assign Delivery</button></Link>*/}
                    <Link to={"/admin/users"}><button className={"products"}><i className="fa-solid fa-users"></i>Users</button></Link>
                    <div className="pr-dropdown">
                        <button className="pr-dropbtn"><i className="fa-solid fa-user"></i>Profile<i className="fa-solid fa-caret-down" style={{ marginLeft: '70px' }}></i></button>
                        <div className="pr-dropdown-content">
                            <a href="/admin/profile">View Profile</a>
                            <a href="/admin/editprofile">Edit Profile</a>
                            <a href="/admin/changepassword">Change Password</a>
                        </div>
                    </div>
                    <Link to={"/admin/aboutus"}><button className={"products"}><i className="fa-regular fa-address-card"></i>About Us</button></Link>
                    <Link to={"/login"}><button onClick={()=>{
                        localStorage.clear();
                        window.location.href="/login"
                    }} className={"products"}><i className="fa-solid fa-arrow-right"></i>Log Out</button></Link>
                </div>
            </div>

            <div className="assign-display">
                <h2>Assign Delivery</h2>
                <label>Order Id</label>
                <input type="text" placeholder="Enter Order Id" />
                <label>Delivery Date</label>
                <input type="date" id="deliveryDate" name="deliveryDate" required />
                <label>Delivery Time</label>
                <input type="time" id="deliveryTime" name="deliveryTime" required/>
                <label>Delivery Status</label>
                <select defaultValue="" >
                    <option value="" disabled>Select Delivery Status</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>On the way</option>
                    <option>Delivered</option>
                </select>
                <button>Update Status</button>


            </div>
        </div>
    )
}

export default AssignDelivery;