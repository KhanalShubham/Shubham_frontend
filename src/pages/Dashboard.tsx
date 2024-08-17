import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import "../assets/css/Dashboard.css";
import Carousel from "react-bootstrap/Carousel";
import React, {useState} from "react";

function Dashboard() {
    const isLoggedIn = !!localStorage.getItem("userId");
    const navigate = useNavigate();
    const {brandName} = useParams();
    const {categoryName} = useParams();

    // Fetching all items
    const {data} = useQuery({
        queryKey: ["GET_ITEM_ALL"],
        queryFn() {
            return axios.get("http://localhost:8082/item/getAll");
        }
    });

    // Fetching all brands
    // const {data: brandData} = useQuery({
    //     queryKey: ["GET_BRAND_ALL"],
    //     queryFn() {
    //         return axios.get("http://localhost:8082/brand/getAll");
    //     }
    // });

    // Fetching all categories
    const {data: categoryData} = useQuery({
        queryKey: ["GET_CATEGORY_ALL"],
        queryFn() {
            return axios.get("http://localhost:8082/category/getAll");
        }
    });

    const [searchData, setSearchData] = useState();
    const {data: searchByName, refetch} = useQuery({
        queryKey: ["SEARCHBYNAME"],
        queryFn: () => {
            return axios.get("http://localhost:8082/item/searchByName/" + searchData);
        },
        enabled: false,
    });

    const handleSearch = () => {
        refetch();
    };

    // const [selectedBrand, setSelectedBrand] = useState("");
    // const [addedBrands, setAddedBrands] = useState({data: []});
    //
    // const {data: productsByBrand, refetch: refetchProductsByBrand} = useQuery({
    //     queryKey: ["GET_PRODUCTS_BY_BRAND", brandName],
    //     queryFn: () => {
    //         return axios.get(`http://localhost:8082/item/getItemsByBrandName/${brandName}`);
    //     },
    //     enabled: false,
    // });
    //
    //
    // const handleBrandSelection = (brandName) => {
    //     if (brandName === "") {
    //         setAddedBrands({data: []});
    //         setSelectedBrand("");
    //     } else {
    //         setSelectedBrand(brandName);
    //         refetchProductsByBrand();
    //         navigate(`/brands/${brandName}`, {state: {brandName}});
    //     }
    // };
    //
    //
    // const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
    // const toggleBrandDropdown = () => {
    //     setIsBrandDropdownOpen((prev) => !prev);
    // }

    const [selectedCategory, setSelectedCategory] = useState("");
    const [addedCategories, setAddedCategories] = useState({ data: [] });

    const { data: productsByCategory, refetch: refetchProductsByCategory } = useQuery({
        queryKey: ["GET_PRODUCTS_BY_CATEGORY", selectedCategory],
        queryFn: () => {
            return axios.get(`http://localhost:8082/item/getItemsByCategoryName/${categoryName}`);
        },
        enabled: false,
    });

    const handleCategorySelection = (categoryName) => {
        if (categoryName === "") {
            setAddedCategories({ data: [] });
            setSelectedCategory("");
        } else {
            setSelectedCategory(categoryName);
            refetchProductsByCategory();
            navigate(`/categories/${categoryName}`, { state: { categoryName } });
        }
    };

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const toggleCategoryDropdown = () => {
        console.log("Toggling category dropdown");
        setIsCategoryDropdownOpen((prev) => !prev);
    }

    return (
        <div className={"db-container"}>
            <div className={"db-header"}>
                <div className={"db-logo"}>
                    <a href="/dashboard">
                        <img width={100} src={"images/logo.png"} alt="Logo"/>
                    </a>
                </div>
                {/*<div className={"db-btn_before"}>*/}
                {/*    <div className={"db-brands-dropdown"}>*/}
                {/*        <button onClick={toggleBrandDropdown}>Brands</button>*/}
                {/*        {isBrandDropdownOpen && (*/}
                {/*            <div className="custom-dropdown">*/}
                {/*                {selectedBrand === "" && (*/}
                {/*                    <div className="brand-list" onClick={(e) => e.stopPropagation()}>*/}
                {/*                        {brandData?.data.map((brand) => (*/}
                {/*                            <div*/}
                {/*                                key={brand.id}*/}
                {/*                                className="brand-item"*/}
                {/*                                onClick={() => handleBrandSelection(brand.brandName)}*/}
                {/*                            >*/}
                {/*                                {brand.brandName}*/}
                {/*                            </div>*/}
                {/*                        ))}*/}
                {/*                    </div>*/}
                {/*                )}*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*</div>*/}


                <div className={"db-btn-cat"}>
                    <div className={"db-categories-dropdown"}>
                        <button onClick={toggleCategoryDropdown}>Categories</button>
                        {isCategoryDropdownOpen && (
                            <div className="custom-dropdown-category">
                                <div className="category-list" onClick={(e) => e.stopPropagation()}>
                                    {categoryData?.data.map((category) => (
                                        <div
                                            key={category.id}
                                            className="category-item"
                                            onClick={() => handleCategorySelection(category.categoryName)}
                                        >
                                            {category.categoryName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Other buttons (Categories, About Us, and Contact Us) */}
                {/*<div className={"db-btn_after"}>*/}
                {/*    <Link to="/Contactus">*/}
                {/*        <button>Contact Us</button>*/}
                {/*    </Link>*/}
                {/*    <Link to="/Aboutus">*/}
                {/*        <button>About Us</button>*/}
                {/*    </Link>*/}
                {/*</div>*/}

                <div className={"s-searchbar"}>
                    <input
                        type={"text"}
                        placeholder={"Search Product"}
                        onChange={(e) => {
                            setSearchData(e.target.value);
                        }}
                    />
                </div>
                <div className={"s-search_button"}>
                    <button type="submit" onClick={handleSearch}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                <div className={"db-btn-wrapper"}>
                    <Link to={"/cart"}>
                        <button><i className="fa-solid fa-cart-shopping cart-icon"></i>Cart</button>
                    </Link>
                    <Link to={"/wishlist"}>
                        <button><i className="fa-regular fa-heart"></i>Wishlist</button>
                    </Link>
                    <Link to="/myaccount">
                        <button>My Account</button>
                    </Link>
                    <Link to="/">
                        <button onClick={()=>{
                            localStorage.clear();
                            window.location.href="/login"
                        }}>Sign Out</button>
                    </Link>
                </div>
            </div>
            <div className={"db-body"}>
                <div className={"db-dash1"}>
                    <div className={"db-img-dash1"}>
                        <Carousel>
                            <Carousel.Item interval={2000}>
                                <img
                                    className="d-block w-100"
                                    src="images/home1.jpg"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item interval={2000}>
                                <img
                                    className="d-block w-100"
                                    src="images/home2.jpg"
                                    alt="Second slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item interval={2000}>
                                <img
                                    className="d-block w-100"
                                    src="images/home4.jpg"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <div className={"db-product-dash1"}>
                        {searchData && searchByName?.data && searchByName.data.length > 0 ? (
                            searchByName.data.map((i) => (
                                <div onClick={() => {
                                    navigate("/products/" + i?.id)
                                }} className={"item-section"} key={i.itemId}>
                                    <div className={"item-image"}>
                                        <img src={"data:image/png;base64, " + i?.itemImage} width={100}
                                             alt={i?.itemName}/>
                                    </div>

                                    <div className={"item-info"}>
                                        <p>{i?.itemName}</p>
                                        <p>{i?.itemDescription}</p>
                                    </div>
                                    <div className={"item-desc"}>
                                        <div className={"item--desc-detail"}>
                                            <p>Rs.{i?.itemPerPrice}</p>
                                        </div>
                                        <div className={"item-quantity"}>
                                            <p>Stock:({i?.itemQuantity})</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            searchData ? (
                                <div className={"product-not-found-message"}>
                                    <p>Product not found.</p>
                                </div>
                            ) : (
                                data?.data.length > 0 ? (
                                    data?.data.slice(0, 12).map((i) => (
                                        <div onClick={() => {
                                            navigate("/products/" + i?.id)
                                        }} className={"item-section"} key={i.itemId}>
                                            <div className={"item-image"}>
                                                <img src={"data:image/png;base64, " + i?.itemImage} width={100}
                                                     alt={i?.itemName}/>
                                            </div>

                                            <div className={"item-info"}>
                                                <p>{i?.itemName}</p>
                                                <p>{i?.itemDescription}</p>
                                            </div>
                                            <div className={"item-desc"}>
                                                <div className={"item--desc-detail"}>
                                                    <p>Rs.{i?.itemPerPrice}</p>
                                                </div>
                                                <div className={"item-quantity"}>
                                                    <p>Stock:({i?.itemQuantity})</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={"product-not-found-message"}>
                                        {searchData && <p>Product not found.</p>}
                                    </div>
                                )
                            )
                        )}
                    </div>


                </div>
                <div className={"db-dash2"}>
                    <div className={"db-img-dash2"}>
                        <Carousel fade>
                            <Carousel.Item interval={1000}>
                                <img
                                    className="d-block w-100"
                                    src="images/99.png"
                                    alt="First slide"
                                />

                            </Carousel.Item>
                            <Carousel.Item interval={1000}>
                                <img
                                    className="d-block w-100"
                                    src="images/GGG.png"
                                    alt="Second slide"
                                />

                            </Carousel.Item>
                            <Carousel.Item interval={1000}>
                                <img
                                    className="d-block w-100"
                                    src="images/00.png"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <div className={"db-product-dash2"}>
                        {data?.data.slice(12).map((i) => (
                            // You can save or render the remaining images in home-product-dash2 or use them elsewhere
                            <div onClick={() => {
                                navigate("/products/" + i?.id)
                            }} className={"item-section"} key={i.itemId}>
                                <div className={"item-image"}>
                                    <img src={"data:image/png;base64, " + i?.itemImage} width={100}
                                         alt={i?.itemName}/>
                                </div>

                                <div className={"item-info"}>
                                    <p>{i?.itemName}</p>
                                    <p>{i?.itemDescription}</p>
                                </div>
                                <div className={"item-desc"}>
                                    <div className={"item--desc-detail"}>
                                        <p>Rs.{i?.itemPerPrice}</p>
                                    </div>
                                    <div className={"item-quantity"}>
                                        <p>Stock:({i?.itemQuantity})</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
            {/*<div className={"db-footer"}>*/}
            {/*    <div className={"db-get-help"}>*/}
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
            {/*            <button>Privacy Policy</button>*/}
            {/*        </Link>*/}
            {/*        <Link to="/Termsandcondition">*/}
            {/*            <button>Terms and Conditions</button>*/}
            {/*        </Link>*/}
            {/*        <span>@2023 Lugahub Pvt. Ltd. All Rights Reserved</span>*/}

            {/*    </div>*/}
            {/*/!*    <div className={"db-about-us"}>*!/*/}
            {/*/!*        <h1>LUGAHUB</h1>*!/*/}
            {/*/!*        <Link to="/Aboutus">*!/*/}
            {/*/!*            <button>About Us</button>*!/*/}
            {/*/!*        </Link>*!/*/}
            {/*/!*        <Link to="/Contactus">*!/*/}
            {/*/!*            <button>Contact Us</button>*!/*/}
            {/*/!*        </Link>*!/*/}
            {/*/!*        <Link to="/Careers">*!/*/}
            {/*/!*            <button>Careers</button>*!/*/}
            {/*/!*        </Link>*!/*/}
            {/*/!*    </div>*!/*/}
            {/*/!*    <div className={"db-logos"}>*!/*/}
            {/*/!*        <span>Connect with us:</span>*!/*/}
            {/*/!*        <a href="https://www.facebook.com/profile.php?id=61555012223662&is_tour_dismissed=true"*!/*/}
            {/*/!*           target="_blank" rel="noopener noreferrer">*!/*/}
            {/*/!*            <img*!/*/}
            {/*/!*                width={43}*!/*/}
            {/*/!*                src={"images/fb.png"}*!/*/}
            {/*/!*                alt="Facebook"*!/*/}
            {/*/!*            />*!/*/}
            {/*/!*        </a>*!/*/}

            {/*/!*        <a href="https://www.instagram.com/luga.hub69/"*!/*/}
            {/*/!*           target="_blank" rel="noopener noreferrer">*!/*/}
            {/*/!*            <img*!/*/}
            {/*/!*                width={43}*!/*/}
            {/*/!*                src={"images/insta.png"}*!/*/}
            {/*/!*                alt="Facebook"*!/*/}
            {/*/!*            />*!/*/}
            {/*/!*        </a>*!/*/}
            {/*/!*        <a href="https://www.threads.net/@luga.hub69"*!/*/}
            {/*/!*           target="_blank" rel="noopener noreferrer">*!/*/}
            {/*/!*            <img*!/*/}
            {/*/!*                width={43}*!/*/}
            {/*/!*                src={"images/thread.png"}*!/*/}
            {/*/!*                alt="X"*!/*/}
            {/*/!*            />*!/*/}
            {/*/!*        </a>*!/*/}


            {/*/!*    </div>*!/*/}

            {/*</div>*/}
        </div>


    );
};


export default Dashboard;