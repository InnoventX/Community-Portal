import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import "./Categories.css";

const Categories = (props) => {

    const [categories,setCategorite]=useState(["Arduino","RPI","Augmented Reality","Virtual reality","ROS","Dron Tech","my tech"]);

    const allCategories = categories.map((category) => {
        return (
            <Link to={`/questions/${category}`} className="single-category">{category}</Link>
        )  
    });

    return(
        <React.Fragment>
            <h6 className="category-heading">ALL CATEGORIES</h6>
            <div className="categories-div">
                {allCategories}
            </div>
        </React.Fragment>
    );
}

export default Categories;