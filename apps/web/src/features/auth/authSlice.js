import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

const keepSession = (payload) => {
  if (payload.accessToken) localStorage.setItem("resume-signal-token", payload.accessToken);
  return payload.user;
};

function requestMessage(error, fallback) {
  return error.response?.data?.message || (error.message === "Network Error"
    ? "Cannot reach the API. Start the backend and try again."
    : fallback);
}

export const signup = createAsyncThunk("auth/signup", async (body, { rejectWithValue }) => {
  try {
    return keepSession((await api.post("/auth/signup", body)).data);
  } catch (error) {
    return rejectWithValue(requestMessage(error, "Sign up failed."));
  }
});
export const login = createAsyncThunk("auth/login", async (body, { rejectWithValue }) => {
  try {
    return keepSession((await api.post("/auth/login", body)).data);
  } catch (error) {
    return rejectWithValue(requestMessage(error, "Sign in failed."));
  }
});
export const loadMe = createAsyncThunk("auth/me", async () => (await api.get("/auth/me")).data.user);
export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("resume-signal-token");
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle", error: "", checked: false },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadMe.fulfilled, (state, action) => { state.user = action.payload; state.checked = true; })
      .addCase(loadMe.rejected, (state) => { state.user = null; state.checked = true; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.checked = true; })
      .addMatcher(
        (action) => ["auth/signup/pending", "auth/login/pending"].includes(action.type),
        (state) => { state.status = "loading"; state.error = ""; }
      )
      .addMatcher(
        (action) => ["auth/signup/fulfilled", "auth/login/fulfilled"].includes(action.type),
        (state, action) => { state.user = action.payload; state.status = "ready"; state.checked = true; }
      )
      .addMatcher(
        (action) => ["auth/signup/rejected", "auth/login/rejected"].includes(action.type),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message || "Authentication failed.";
        }
      );
  }
});

export default authSlice.reducer;
