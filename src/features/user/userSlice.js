import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', {email, pwd: password});
      sessionStorage.setItem('token', response.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, lvl, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post('/user', {email, name, pwd: password, lvl})

      //성공
      dispatch(showToastMessage({message: '회원가입을 성공했습니다.', status: 'success'}));
      navigate('/login');
      
      return response.data.data;
    } catch (error) {
      //실패
      dispatch(showToastMessage({message: '회원가입에 실패했습니다.', detail: error.message, status: 'error'}));
      rejectWithValue(error.message);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/me');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: !!sessionStorage.getItem("token"),
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logout: (state) => {
      state.user = null;
      sessionStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.registrationError = null;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.registrationError = action.payload;
    })
    .addCase(loginWithEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginWithEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.loginError = null;
    })
    .addCase(loginWithEmail.rejected, (state, action) => {
      state.loading = false;
      state.loginError = action.payload;
    })
    .addCase(loginWithToken.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginWithToken.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    })
    .addCase(loginWithToken.rejected, (state) => {
      state.loading = false;
      state.user = null;
      sessionStorage.removeItem("token");
    })
  },
});
export const { clearErrors, logout } = userSlice.actions;
export default userSlice.reducer;
