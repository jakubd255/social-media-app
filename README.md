# SocialApp
Social media portal built using MERN Stack with TypeScript. 
Written as project for Internet Engineering classes.


## Features
- Login and registration system
- User Profile
- Follow system - like in Instagram or Twitter
- Account can be private or public
- Community groups - public, private or hidden, with user roles
- File upload and video streaming
- Surveys
- Comments
- Dark mode


## Used technologies
- React.js
- Redux Toolkit
- shadcn - UI Framework
- TailwindCSS
- ReactHookForm and Zod - for form validation
- Node.js
- Express.js
- MongoDB
- Multer - for image upload


## How to run locally
1. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

2. Create a MongoDB database
3. Set up environmental variables

* Create a **.env** inside the **server** directory and configure it with the necessary environmental variables

```
PORT = 8000
MONGO_URI = URI_TO_YOUR_MONGO_DATABASE
ACCESS_TOKEN = RANDOM_CHARACTER_SEQUENCE
ADMIN_PASSWORD = 12345678
```

4. Run the application 
    * When there's no admin user in the database, it will be created at startup

```bash
# In the server directory
npm run dev

# In the client directory
npm run dev
```

5. Log in as admin
```
email: admin@admin.com
username: admin
password: ADMIN_PASSWORD
``` 


## Screenshots

### Log in / Register
![](/client/screenshots/login.png)  
![](/client/screenshots/register.png)  

### Posts
![](/client/screenshots/post-article.png)  
![](/client/screenshots/post-images.png)  
![](/client/screenshots/post-survey.png)  
![](/client/screenshots/post-form.png)  

### Comments
![](/client/screenshots/comments.png)

### Profile
![](/client/screenshots/profile.png)  
![](/client/screenshots/profile-about.png)  
![](/client/screenshots/profile-gallery.png)  
![](/client/screenshots/profile-followers.png)  
![](/client/screenshots/profile-edit-form.png)  
![](/client/screenshots/profile-private.png)  
![](/client/screenshots/profile-private2.png)  
![](/client/screenshots/profile-requests.png)  

### Groups
![](/client/screenshots/groups.png)  
![](/client/screenshots/group-form.png)  
![](/client/screenshots/group-public-join.png)  
![](/client/screenshots/group-private-join.png)  
![](/client/screenshots/group-discussion.png)  
![](/client/screenshots/group-members.png)  
![](/client/screenshots/group-about.png)  

### Group settigns - if group member is admin
![](/client/screenshots/group-details.png)  
![](/client/screenshots/group-rules.png)  
![](/client/screenshots/group-privilages.png)  
![](/client/screenshots/group-privilages-delete.png)  

### Account settings
![](/client/screenshots/settings-account.png)  
![](/client/screenshots/settings-privacy.png)  
