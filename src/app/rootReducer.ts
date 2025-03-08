// app/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;