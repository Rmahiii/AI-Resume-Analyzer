import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, apiNetworkErrorMessage } from "../../services/api.js";

function requestMessage(error, fallback) {
  return error.response?.data?.message || (error.message === "Network Error"
    ? apiNetworkErrorMessage()
    : fallback);
}

export const runAnalysis = createAsyncThunk("analysis/run", async ({ file, job }, { rejectWithValue }) => {
  const form = new FormData();
  form.append("resume", file);
  form.append("jobDescription", job.jobDescription);
  form.append("jobTitle", job.jobTitle);
  form.append("company", job.company);
  try {
    return (await api.post("/analyses", form)).data.analysis;
  } catch (error) {
    return rejectWithValue(requestMessage(error, "Analysis failed."));
  }
});

export const loadDashboard = createAsyncThunk("analysis/dashboard", async () =>
  (await api.get("/analyses/dashboard")).data
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState: { current: null, dashboard: null, status: "idle", error: "" },
  reducers: {
    selectReport(state, action) { state.current = action.payload; }
  },
  extraReducers(builder) {
    builder
      .addCase(runAnalysis.pending, (state) => { state.status = "loading"; state.error = ""; })
      .addCase(runAnalysis.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status = "ready";
      })
      .addCase(runAnalysis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Analysis failed.";
      })
      .addCase(loadDashboard.fulfilled, (state, action) => { state.dashboard = action.payload; });
  }
});

export const { selectReport } = analysisSlice.actions;
export default analysisSlice.reducer;
