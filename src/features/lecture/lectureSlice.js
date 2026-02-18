import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getLectureSno = createAsyncThunk(
  "lectures/getLectureSno",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get('/lecture/sno');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLectureList = createAsyncThunk(
  "lectures/getLectureList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get('/lecture', {params: {...query}});

      if(response.status !== 200) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLectureDetail = createAsyncThunk(
  "lectures/getLectureDetail",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get(`/lecture/${id}`);

      if(response.status !== 200){
        throw new Error(response.error);
      }

      return response.data.data;
    } catch (error) {
      dispatch(showToastMessage({message: '강의를 불러오는데 오류가 발생했습니다. 관리자에게 문의하세요.', detail: error.message, status: 'error'}));
      return rejectWithValue(error.message);
    }
  }
);

export const createLecture = createAsyncThunk(
  "lectures/createLecture",
  async (formData, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await api.post('/lecture', formData);

      if(response.status !== 200){
        throw new Error(response.error);
      }

      dispatch(showToastMessage({message: '강의 등록 완료', status: 'success'}));
      const userId = getState()?.user?.user?._id;
      dispatch(getLectureList({ page: 1, userId }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLecture = createAsyncThunk(
  "lectures/deleteLecture",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await api.delete(`/lecture/${id}`);

      if(response.status !== 200){
        throw new Error(response.error);
      }

      dispatch(showToastMessage({message: '강의 삭제 성공', status: 'success'}));
      const userId = getState()?.user?.user?._id;
      dispatch(getLectureList({ page: 1, userId }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editLecture = createAsyncThunk(
  "lectures/editLecture",
  async ({ id, ...formData }, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await api.put(`/lecture/${id}`, formData);

      if(response.status !== 200){
        throw new Error(response.error);
      }

      dispatch(showToastMessage({message: '강의 수정 성공', status: 'success'}));
      const userId = getState()?.user?.user?._id;
      dispatch(getLectureList({ page: 1, userId }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMainLectureList = createAsyncThunk(
  "lectures/getMainLectureList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/lecture/main');

      if(response.status !== 200) {
        throw new Error(response.error);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 슬라이스 생성
const lectureSlice = createSlice({
  name: "lectures",
  initialState: {
    lectureList: [],
    selectedLecture: null,
    lectureSno: '',
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
    webLecture: [],
    aiLecture: [],
    dbLecture: [],
    devLecture: [],
    javaLecture: [],
    springLecture: []
  },
  reducers: {
    setSelectedLecture: (state, action) => {
      state.selectedLecture = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(getLectureSno.pending, (state) => {
      state.error = "";
    })
    .addCase(getLectureSno.fulfilled, (state, action) => {
      state.lectureSno = action.payload.sno;
    })
    .addCase(getLectureSno.rejected, (state, action) => {
      state.error = action.payload;
    })
    .addCase(createLecture.pending, (state) => {
      state.loading = true;
    })
    .addCase(createLecture.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.success = true;
    })
    .addCase(createLecture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase(getLectureList.pending, (state) => {
      state.loading = true;
    })
    .addCase(getLectureList.fulfilled, (state, action) => {
      state.loading = false;
      state.lectureList = action.payload.data;
      state.totalPageNum = action.payload.totalPageNum;
      state.error = '';
    })
    .addCase(getLectureList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(editLecture.pending, (state) => {
      state.loading = true;
    })
    .addCase(editLecture.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = '';
    })
    .addCase(editLecture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase(deleteLecture.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteLecture.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = '';
    })
    .addCase(deleteLecture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase(getMainLectureList.pending, (state) => {
      state.loading = true;
    })
    .addCase(getMainLectureList.fulfilled, (state, action) => {
      state.loading = false;
      state.webLecture = action.payload.webLecture;
      state.aiLecture = action.payload.aiLecture;
      state.dbLecture = action.payload.dbLecture;
      state.devLecture = action.payload.devLecture;
      state.javaLecture = action.payload.javaLecture;
      state.springLecture = action.payload.springLecture;
      state.error = '';
    })
    .addCase(getMainLectureList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(getLectureDetail.pending, (state) => {
      state.loading = true;
    })
    .addCase(getLectureDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedLecture = action.payload;
      state.error = '';
    })
    .addCase(getLectureDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setSelectedLecture, setFilteredList, clearError } =
  lectureSlice.actions;
export default lectureSlice.reducer;
