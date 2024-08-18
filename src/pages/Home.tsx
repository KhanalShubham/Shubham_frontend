import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import "../assets/css/Home.css";
import Carousel from "react-bootstrap/Carousel";
import React, {useState} from "react";

function Home() {
    // Check if the user is logged in
    const isLoggedIn = !!localStorage.getItem("userId");

    // For navigation between pages
    const navigate = useNavigate();

    // Get the category name from the URL parameters
    const { categoryName } = useParams();

    // Fetching all items using React Query
    const { data } = useQuery({
        queryKey: ["GET_ITEM_ALL"],
        queryFn() {
            return axios.get("http://localhost:8082/item/getAll");
        }
    });

    // Fetching all categories
    const { data: categoryData } = useQuery({
        queryKey: ["GET_CATEGORY_ALL"],
        queryFn() {
            return axios.get("http://localhost:8082/category/getAll");
        }
    });

    // State to store search input
    const [searchData, setSearchData] = useState();

    // Fetch search results when user searches by product name
    const { data: searchByName, refetch } = useQuery({
        queryKey: ["SEARCHBYNAME"],
        queryFn: () => {
            return axios.get("http://localhost:8082/item/searchByName/" + searchData);
        },
        enabled: false, // Disable automatic fetching until the search is triggered
    });

    // Handle search button click
    const handleSearch = () => {
        refetch(); // Trigger search query
    };

    // State for handling category selection
    const [selectedCategory, setSelectedCategory] = useState("");
    const [addedCategories, setAddedCategories] = useState({ data: [] });

    // Fetch products based on selected category
    const { data: productsByCategory, refetch: refetchProductsByCategory } = useQuery({
        queryKey: ["GET_PRODUCTS_BY_CATEGORY", selectedCategory],
        queryFn: () => {
            return axios.get(`http://localhost:8082/item/getItemsByCategoryName/${categoryName}`);
        },
        enabled: false, // Disable automatic fetching until a category is selected
    });

    // Handle category selection from the dropdown
    const handleCategorySelection = (categoryName) => {
        if (categoryName === "") {
            setAddedCategories({ data: [] });
            setSelectedCategory("");
        } else {
            setSelectedCategory(categoryName);
            refetchProductsByCategory(); // Fetch products by the selected category
            navigate(`/categories/${categoryName}`, { state: { categoryName } });
        }
    };

    // State to manage category dropdown open/close
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // Toggle the category dropdown
    const toggleCategoryDropdown = () => {
        setIsCategoryDropdownOpen((prev) => !prev);
    };

    return (
        <div className="home-container">
            {/* Header Section */}
            <div className="home-header">
                {/* Logo */}
                <div className="home-logo">
                    <a href="/dashboard">
                        <img src="images/logo" alt="Logo" style={{ width: '40px', height: '40px' }} />
                    </a>
                </div>

                {/* Categories Dropdown */}
                <div className="home-btn-cat">
                    <div className="home-categories-dropdown">
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

                {/* Search Bar */}
                <div className="s-searchbar">
                    <input
                        type="text"
                        placeholder="Search Product"
                        onChange={(e) => setSearchData(e.target.value)}
                    />
                </div>
                <div className="s-search_button">
                    <button type="submit" onClick={handleSearch}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                {/* Buttons for Cart, Wishlist, Login, and Register */}
                <div className="home-btn-wrapper">
                    <Link to="/cart">
                        <button><i className="fa-solid fa-cart-shopping cart-icon"></i>Cart</button>
                    </Link>
                    <Link to="/wishlist">
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

            {/* Body Section */}
            <div className="home-body">
                {/* Carousel and Product Listings */}
                <div className="home-dash1">
                    {/* Image Carousel */}
                    <div className="home-img-dash1">
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

                    {/* Product Listings */}
                    <div className="home-product-dash1">
                        {/* Display search results if available */}
                        {searchData && searchByName?.data && searchByName.data.length > 0 ? (
                            searchByName.data.map((i) => (
                                <div onClick={() => navigate("/products/" + i?.id)} className="item-section" key={i.itemId}>
                                    <div className="item-image">
                                        <img src={"data:image/png;base64, " + i?.itemImage} width={100} alt={i?.itemName} />
                                    </div>
                                    <div className="item-info">
                                        <p>{i?.itemName}</p>
                                        <p>{i?.itemDescription}</p>
                                    </div>
                                    <div className="item-desc">
                                        <div className="item--desc-detail">
                                            <p>Rs.{i?.itemPerPrice}</p>
                                        </div>
                                        <div className="item-quantity">
                                            <p>Stock:({i?.itemQuantity})</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Display a message when no products are found
                            searchData ? (
                                <div className="product-not-found-message">
                                    <p>Product not found.</p>
                                </div>
                            ) : (
                                // Display all products
                                data?.data.length > 0 ? (
                                    data?.data.slice(0, 12).map((i) => (
                                        <div onClick={() => navigate("/products/" + i?.id)} className="item-section" key={i.itemId}>
                                            <div className="item-image">
                                                <img src={"data:image/png;base64, " + i?.itemImage} width={100} alt={i?.itemName} />
                                            </div>
                                            <div className="item-info">
                                                <p>{i?.itemName}</p>
                                                <p>{i?.itemDescription}</p>
                                            </div>
                                            <div className="item-desc">
                                                <div className="item--desc-detail">
                                                    <p>Rs.{i?.itemPerPrice}</p>
                                                </div>
                                                <div className="item-quantity">
                                                    <p>Stock:({i?.itemQuantity})</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="product-not-found-message">
                                        {searchData && <p>Product not found.</p>}
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>

                {/* Additional Carousel and Products */}
                <div className="home-dash2">
                    <div className="home-img-dash2">
                        <Carousel fade>
                            <Carousel.Item interval={1000}>
                                <img className="d-block w-100" src="images/99.png" alt="First slide" />
                            </Carousel.Item>
                            <Carousel.Item interval={1000}>
                                <img className="d-block w-100" src="images/GGG.png" alt="Second slide" />
                            </Carousel.Item>
                            <Carousel.Item interval={1000}>
                                <img className="d-block w-100" src="images/00.png" alt="Third slide" />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;