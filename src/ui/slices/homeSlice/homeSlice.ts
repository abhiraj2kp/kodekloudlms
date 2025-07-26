import { getCoursesDetails, getCoursesList } from './homeThunk';
import { createSlice } from '@reduxjs/toolkit';
import { homeInitialState } from '@data/initialStates/homeInitialState';

export const homeSlice = createSlice({
  name: 'home',
  initialState:homeInitialState,
  reducers: {
    updateHomeCourses: (state, action) => {
      const { type, payload } = action;
      
      if (payload.metadata.page == 1) {
        state.courseData = {
          ...state.courseData,
          ...payload,
        };
      } else {
        state.courseData = {
          ...state.courseData,
          isLoading: false,
          metadata: payload.metadata,
          courses: [...state.courseData.courses, ...payload.courses],
        };
      }
    },
    updateCourseDetails: (state, action) => {
      const { type, payload } = action;
      state.courseData.courseDetails = {
        ...state.courseData.courseDetails,
        [payload.courseId]: payload.details,
      };
      state.courseData.isLoadingDetails =false
      return state
    },
  },
  extraReducers(builder) {
    builder.addCase(getCoursesList.pending, state => {
      return {
        ...state,
        courseData : {
          ...state.courseData,
          isLoading : true
        }
      };
    });
    builder.addCase(getCoursesList.fulfilled, (state, action) => {
      return {
        ...state,
        courseData : {
          ...state.courseData,
          isLoading : false
        }
      };
    });
    builder.addCase(getCoursesList.rejected, (state, action) => {
      return {
        ...state,
        courseData : {
          ...state.courseData,
          isLoading : false
        }
      };
    });

    builder.addCase(getCoursesDetails.pending, state => {
      return {
        ...state,
        courseData : {
          ...state.courseData,
          isLoadingDetails : true
        }
      };
    });
    builder.addCase(getCoursesDetails.fulfilled, (state, action) => {
      return {
        ...state,
        courseData : {
          ...state.courseData,
          isLoadingDetails : false
        }
      };
    });
    builder.addCase(getCoursesDetails.rejected, (state, action) => {
      return {
        ...state,
        courseData : {
          ...state.courseData,
          isLoadingDetails : false
        }
      };
    });

  },
});

export const homeAction = homeSlice.actions;
