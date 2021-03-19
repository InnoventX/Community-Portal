import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import "./Categories.css";

const Categories = (props) => {

    // Ctaegories state
    const [categories,setCategorite]=useState(["Arduino","RPI","Augmented Reality","Virtual reality","ROS","Dron Tech","my tech"]);

    // mapping all the categories into the Links
    const allCategories = categories.map((category , index) => {
        return (
            <Link key={index} to={`/questions/${category}`} className="single-category">{category}</Link>
        )  
    });

    return(
        // Showing all the categories section
        <React.Fragment>
            <h6 className="category-heading">ALL CATEGORIES</h6>
            <div className="categories-div">
                {allCategories}
            </div>
        </React.Fragment>
    );
}

export default Categories;
