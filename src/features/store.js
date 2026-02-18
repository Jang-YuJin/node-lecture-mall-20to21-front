import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import uiSlice from "./common/uiSlice";
import lectureSlice from "./lecture/lectureSlice";
import cartSlice from "./cart/cartSlice";
import orderSlice from "./order/orderSlice";
import mainBannerSlice from "./mainBanner/mainBannerSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    lecture: lectureSlice,
    cart: cartSlice,
    ui: uiSlice,
    order: orderSlice,
    mainBanner: mainBannerSlice
  },
});
export default store;
