import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { deadlinesApi } from './deadlinesApi';
import { isDeadline, type Deadline, type NewDeadline } from './types';

interface DeadlinesState {
  items: Deadline[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DeadlinesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchDeadlines = createAsyncThunk<
  Deadline[],
  void,
  { rejectValue: string; state: { deadlines: DeadlinesState } }
>(
  'deadlines/fetchDeadlines',
  async (_, { rejectWithValue }) => {
    const response: unknown = await deadlinesApi.getDeadlines();

    if (!Array.isArray(response) || !response.every(isDeadline)) {
      return rejectWithValue('Dữ liệu deadline từ máy chủ không hợp lệ.');
    }

    return response;
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().deadlines;
      return status === 'idle' || status === 'failed';
    },
  },
);

const deadlinesSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    addDeadline(state, action: PayloadAction<NewDeadline>) {
      state.items.unshift({
        ...action.payload,
        id: crypto.randomUUID(),
        completed: false,
      });
    },
    toggleDeadline(state, action: PayloadAction<string>) {
      const deadline = state.items.find((item) => item.id === action.payload);
      if (deadline) deadline.completed = !deadline.completed;
    },
    deleteDeadline(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDeadlines.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDeadlines.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Không thể tải danh sách deadline.';
      });
  },
});

export const { addDeadline, toggleDeadline, deleteDeadline } = deadlinesSlice.actions;
export default deadlinesSlice.reducer;
