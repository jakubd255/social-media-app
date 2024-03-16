import {useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import React from "react";



const SettingsPage: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);

    if(user) return(
        <div className="flex flex-1 mt-2">
            <Outlet/>
        </div>
    );
}

export default SettingsPage;