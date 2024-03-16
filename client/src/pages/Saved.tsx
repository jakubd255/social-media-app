import React from "react";
import {Outlet} from "react-router-dom";



const Saved: React.FC = () => {
    document.title = "Saved - Social App";

    return(
        <div className="flex flex-1 justify-center">
            <Outlet context={{
                choice: "saved",
                message: "You haven't saved posts yet"}}
            />
        </div>
    );
}

export default Saved;