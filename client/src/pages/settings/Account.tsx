import React from "react";
import DeleteAccount from "@/components/account/DeleteAccount";
import UpdateEmailOrUsername from "@/components/account/UpdateEmailOrUsername";
import UpdatePassword from "@/components/account/UpdatePassword";



const Account: React.FC = () => {
    document.title = "Account settings - SocialApp";
    
    return(
        <div className="flex flex-col gap-[40px] px-10">
            <UpdateEmailOrUsername/>
            <UpdatePassword/>
            <DeleteAccount/>
        </div>
    );
}

export default Account;