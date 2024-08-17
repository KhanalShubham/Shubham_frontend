import React from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../assets/css/Category.css';

interface Item {
    id: number;
    itemName: string;
    itemImage: string;
    itemDescription: string;
    itemPerPrice: number;
    itemQuantity: number;
    // Add more properties as needed
}

const Category: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem("userId");
    const { categoryName } = useParams<{ categoryName: string }>();
    const navigate = useNavigate();

    // Fetch products based on brand name
    const { data: items, isLoading, isError } = useQuery<Item[]>({
        queryKey: ['getProductsByCategory', categoryName],
        queryFn: () =>
            axios
                .get(`http://localhost:8082/item/getItemsByCategoryName/${categoryName}`)
                .then((response) => {
                    console.log('API Response:', response.data);
                    return response.data;
                }),
    });

    console.log('items:', items);
    console.log('isLoading:', isLoading);
    console.log('isError:', isError);

    const handleProductClick = (productId: number) => {
        // Use the navigate function to go to the product details page
        navigate(`/products/${productId}`);
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching products.</div>;
    }

    return (
        <div className={'ctgr-container'}>
            <div className={'ctgr-header'}>
                <div className={'ctgr-logo'}>
                    <a href="/dashboard">
                        <img width={100} src={"../images/Logo.png"} alt="Logo"/>
                    </a>
                </div>
                <div className={'ct-btn_before'}>
                    <button>Brands</button>
                    <button>Categories</button>
                    <Link to="/Contactus">
                        <button>Contact Us</button>
                    </Link>
                    <Link to="/Aboutus">
                        <button>About Us</button>
                    </Link>
                </div>

                <div className={'ctgr-searchbar'}>
                    <input type={'text'} placeholder={'Search Product'}/>
                </div>
                <div className={'ctgr-search_button'}>
                    <button>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                <div className={'ctgr-btn-wrapper'}>
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
                    <Link to="/Myaccount">
                        <button>My Account</button>
                    </Link>
                    <Link to="/">
                        <button>Sign Out</button>
                    </Link>
                </div>
            </div>

            <div className={'ctgr-main-content'}>
                <h1>{categoryName} Products</h1>
                <div className={'ctgr-product-list grid-view'}>
                    {Array.isArray(items) && items.length > 0 ? (
                        items.map((item) => (
                            <div key={item.id} className={'product-card'} onClick={() => handleProductClick(item.id)}>
                                <div className={'item-image'}>
                                    <img src={"data:image/png;base64, " + item?.itemImage} width={100} alt={item?.itemName} />
                                </div>
                                <div className={'item-details'}>
                                    <h2>{item.itemName}</h2>
                                    <p>{item.itemDescription}</p>
                                    <p>Price: Rs.{item.itemPerPrice}</p>
                                    {/* Add more details as needed */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products found for category '{categoryName}'</p>
                    )}
                </div>
            </div>
            <div className={'ctgr-footer'}>
                <div className={'ctgr-get-help'}>
                    <h1>GET HELP</h1>
                    <Link to="/Customercare">
                        <button>Customer Care</button>
                    </Link>
                    <Link to="/Payment">
                        <button>Payment Options</button>
                    </Link>
                    <Link to="/returnandrefundpolicy">
                        <button>Return and Refund Policy</button>
                    </Link>
                    <Link to="/PrivacyPolicy">
                        <button>Privacy Policy</button>
                    </Link>
                    <Link to="/Termsandcondition">
                        <button>Terms and Conditions</button>
                    </Link>
                    <span>@2023 Lugahub Pvt. Ltd. All Rights Reserved</span>
                </div>
                <div className={'ctgr-about-us'}>
                    <h1>LUGAHUB</h1>
                    <Link to="/Aboutus">
                        <button>About Us</button>
                    </Link>
                    <Link to="/Contactus">
                        <button>Contact Us</button>
                    </Link>
                    <Link to="/Careers">
                        <button>Careers</button>
                    </Link>
                </div>
                <div className={'ctgr-logos'}>
                    <span>Connect with us:</span>
                    <a
                        href="https://www.facebook.com/profile.php?id=61555012223662&is_tour_dismissed=true"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img width={43} src={'images/fb.png'} alt="Facebook"/>
                    </a>

                    <a
                        href="https://www.instagram.com/luga.hub69/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img width={43} src={'images/insta.png'} alt="Instagram"/>
                    </a>
                    <a
                        href="https://www.threads.net/@luga.hub69"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img width={43} src={'images/thread.png'} alt="Threads"/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Category;
