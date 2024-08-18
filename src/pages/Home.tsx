import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import "../assets/css/Home.css";
import Carousel from "react-bootstrap/Carousel";
import React, {useState} from "react";

function Home() {
    const isLoggedIn = !!localStorage.getItem("userId");
    const navigate = useNavigate();
    // const {brandName} = useParams();
    const {categoryName} = useParams();

    // Fetching all items
    const {data} = useQuery({
        queryKey: ["GET_ITEM_ALL"],
        queryFn() {
            return axios.get("http://localhost:8082/item/getAll");
        }
    });

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
        <div className={"home-container"}>
            <div className={"home-header"}>
                <div className={"home-logo"}>
                    <a href="/dashboard">
                        <img src="images/logo" alt="Logo" style={{ width: '40px', height: '40px' }} />
                    </a>
                </div>


                <div className={"home-btn-cat"}>
                    <div className={"home-categories-dropdown"}>
                        <button onClick={toggleCategoryDropdown}>Category</button>
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

                <div className={"home-btn-wrapper"}>
                    <Link to={"/cart"}>
                        <button><i className="fa-solid fa-cart-shopping cart-icon"></i>Cart</button>
                    </Link>
                    <Link to={"/wishlist"}>
                        <button><i className="fa-regular fa-heart"></i>Wishlist</button>
                    </Link>
                    <Link to="/Login">
                        <button>Sign In</button>
                    </Link>
                    <Link to="/Register">
                        <button>Sign Up</button>
                    </Link>
                </div>
            </div>
            <div className={"home-body"}>
                <div className={"home-dash1"}>
                    <div className={"home-img-dash1"}>
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
                    <div className={"home-product-dash1"}>
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
                <div className={"home-dash2"}>
                    <div className={"home-img-dash2"}>
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
                    <div className={"home-product-dash2"}>
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
        </div>


    );
};


export default Home;