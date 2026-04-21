import { signup } from "./services/authService.js";


const user = {
  name: "raymond",
  username: "ryz",
  password: "ray123",
  email: "ryz@ucla.edu"
}


signup(user)