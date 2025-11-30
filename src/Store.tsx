import { configureStore } from "@reduxjs/toolkit";
import jwtReducer from "./Slices/JwtSlice";
import useReducer from "./Slices/UserSlice";

export default configureStore({
    reducer:{
        jwt:jwtReducer,
        user:useReducer
    }
})