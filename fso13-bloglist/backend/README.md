Backend app deployed at https://fly.io/apps/fso13-bloglist-backend

// which backend features (services) require authentication (user login) and which do not?
// 1. login
// 2. create new user
// 3. get all users
// 4. get one user
// 5. delete user
// 6. update user
// 7. create new blog
// 8. get all blogs
// 9. get one blog
// 10. delete blog
// 11. update blog
// 12. like blog
// 13. comment blog

// How this system authentication works?
// 1. user login
// 2. user gets token
// 3. user sends token with every request
// 4. server verifies token
// 5. server sends response

// How to implement this system?
// 1. create login form
// 2. create register form
// 3. create user service
// 4. create user controller
// 5. create user model
// 6. create user router
// 7. create login route
// 8. create register route
// 9. create user login controller
// 10. create user register controller
// 11. create user login service
// 12. create user register service
// 13. create user login model
// 14. create user register model
// 15. create user login router
// 16. create user register router

// Visualize the system? (draw a diagram)
How each parts fit together?


// Authentication mechanism: 
// Token-based authentication with server-side session
// server will store the session data (login token) in a postgresql database


// I decided to build the fullstack app with MVC architecture
// MVC > traditional 3-tier architecture (=> n-tier) > distributed computing

// MVC architecture
// 1. Model: data layer
// 2. View: presentation layer
// 3. Controller: logic layer

// 3-tier architecture
// 1. Presentation tier
// 2. Application tier
// 3. Data tier

// n-tier architecture
// 1. Presentation tier
// 2. Application tier
// 3. Data tier
// 4. Business logic tier
// 5. Integration tier
// 6. Security tier
// 7. Management tier
// 8. Development tier
// 9. Testing tier
// 10. Deployment tier
// 11. Network tier
// 12. User interface tier
// 13. Client tier
// 14. Server tier
// 15. Storage tier
// 16. Compute tier
// 17. Database tier
// 18. Application tier
// 19. Web tier
// 20. Mobile tier ....

// Distributed computing
// 1. Client-server model
// 2. Peer-to-peer model
// 3. 3-tier architecture
// 4. n-tier architecture
// 5. Cloud computing
// 6. Grid computing
// 7. Cluster computing
// 8. Utility computing
// 9. Fog computing
// 10. Edge computing
// 11. Mobile computing
// 12. Social computing
// 13. Ubiquitous computing

// 3-tier architecture vs n-tier architecture
// 3-tier architecture:
// 1. Presentation tier
// 2. Application tier
// 3. Data tier

// n-tier architecture:
// 1. Presentation tier
// 2. Application tier
// 3. Data tier
// 4. Business logic tier
...




