import React from "react";
import {Outlet, useOutletContext} from "react-router-dom";



const GroupAdminPage: React.FC = () => {
    const context = useOutletContext<any>();

    if(context) return(
        <div className="flex flex-1 justify-center">
            <Outlet context={context}/>
        </div>
    );
}

export default GroupAdminPage;