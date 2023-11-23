import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";

const CustomLink = ({ to, title, className = "", href }) => {
    const location = useLocation();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Compare the actual route with value of "to"
        setIsActive(location.pathname === to);
    }, [location.pathname, to]);

    return (
        <Link href={href} to={to} className={`${className} relative group`}>
            {title}
            <span className={`
        h-[2px] inline-block bg-azure
        absolute left-0 -bottom-1.5
        group-hover:w-full transition-[width] ease duration-300
        ${isActive ? 'w-full' : 'w-0'} transition-[width] ease duration-300
        `}
            >&nbsp;</span>
        </Link>
    );
}

export default CustomLink;