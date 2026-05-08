import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  userName: string;
  authUser: boolean;
  themeSelected: 'light' | 'dark';
  selectedKS: string | null;
};

export const initialState: UserState = {
  userName: '',
  authUser: false,
  themeSelected: 'light',
  selectedKS: null,
};

export interface Init {
  themeSelected: UserState['themeSelected'];
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setAuthUser: (state, action: PayloadAction<boolean>) => {
      state.authUser = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeSelected = action.payload;
    },
    setSelectedKS: (state, action: PayloadAction<string>) => {
      state.selectedKS = action.payload;
    },
    init: (state, action: PayloadAction<Init>) => {
      state.themeSelected = action.payload.themeSelected;
    },
  },
});

export default userSlice.reducer;
export const { actions } = userSlice;
