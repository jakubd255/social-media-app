import UserModel from "../models/users";
import bcrypt from "bcrypt";



const createAdmin = async () => {
    if((await UserModel.count({admin: true}).exec()) === 0) {
        const user = {
            fullname: "Admin",
            username: "admin",
            email: "admin@admin.com",
            password: process.env.ADMIN_PASSWORD as string,
            admin: true
        };
    
        const {password} = user;
    
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(password, salt);
    
        const newUser = new UserModel(user);
        await newUser.save();
    
        console.log("Admin user has been created");
    }
}

export default createAdmin;