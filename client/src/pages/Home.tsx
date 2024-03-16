import React from "react";
import {Outlet} from "react-router-dom";



const Home: React.FC = () => {
    document.title = "Social App";

    return(
        <div className="flex flex-1 justify-center">
            <Outlet
                context={{
                    choice: null,
                    message: "Users you follow and groups you belong to don't have posts yet"
                }}
            />
        </div>
    );
}

export default Home;