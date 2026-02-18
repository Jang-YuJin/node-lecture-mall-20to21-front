import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  totalPageNum: 1,
  success: false,
  banners: [],
  selectedBanner: null
};

// Async thunk actions
export const getMainBanners = createAsyncThunk(
  "mainBanner/getMainBanners",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get('/mainBanner', {params: {...query}});
      if(response.status !== 200) {
          throw new Error(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMainBanner = createAsyncThunk(
  "mainBanner/createMainBanner",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/mainBanner', formData);

      if(response.status !== 200){
        throw new Error(response.error);
      }

      dispatch(showToastMessage({message: '배너 등록 완료', status: 'success'}));
      dispatch(getMainBanners({ page: 1 }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editMainBanner = createAsyncThunk(
  "mainBanner/editMainBanner",
  async ({id, ...formData}, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/mainBanner/${id}`, formData);

      if(response.status !== 200){
        throw new Error(response.error);
      }

      dispatch(showToastMessage({message: '배너 수정 성공', status: 'success'}));
      dispatch(getMainBanners({ page: 1 }));

      return response.data.data;
    } catch (error) {
        
    }
  }
);

export const deleteMainBanner = createAsyncThunk(
  "mainBanner/deleteMainBanner",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/mainBanner/${id}`);

      if(response.status !== 200){
        throw new Error(response.error);
      }

      dispatch(showToastMessage({message: '배너 삭제 성공', status: 'success'}));
      dispatch(getMainBanners({ page: 1 }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mainBannerSlice = createSlice({
  name: "mainBanner",
  initialState,
  reducers: {
    setSelectedBanner: (state, action) => {
      state.selectedBanner = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(createMainBanner.pending, (state) => {
      state.loading = true;
    })
    .addCase(createMainBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.success = true;
    })
    .addCase(createMainBanner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase(getMainBanners.pending, (state) => {
        state.loading = true;
    })
    .addCase(getMainBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
        state.error = '';
    })
    .addCase(getMainBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(editMainBanner.pending, (state) => {
        state.loading = true;
    })
    .addCase(editMainBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = '';
    })
    .addCase(editMainBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
    })
    .addCase(deleteMainBanner.pending, (state) => {
        state.loading = true;
    })
    .addCase(deleteMainBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = '';
    })
    .addCase(deleteMainBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
    });
  },
});

export default mainBannerSlice.reducer;
export const { initialMainBanner, clearError, setSelectedBanner } = mainBannerSlice.actions;