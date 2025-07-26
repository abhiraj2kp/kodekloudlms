import { createAsyncThunk } from '@reduxjs/toolkit';
import { HomeService } from '@data/services/home.service';

export const getCoursesList = createAsyncThunk(
  'getCoursesList',
  async ({ payload }: { payload: any }, thunkAPI) => {
    try {
      const apiResponse = await HomeService.getCoursesList(payload);
      return thunkAPI.fulfillWithValue(apiResponse);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getCoursesDetails = createAsyncThunk(
  'getCoursesDetails',
  async ({ payload }: { payload: any }, thunkAPI) => {
    try {
      const apiResponse = await HomeService.getCoursesDetails(payload);
      return thunkAPI.fulfillWithValue(apiResponse);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);