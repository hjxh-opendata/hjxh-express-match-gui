import reduxThunk from "redux-thunk";
import reduxLogger from "redux-logger";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { scoreReducer } from "./score/reducers";
import {scoreAsyncReducer} from "./score-async/reducers";

const rootReducer = combineReducers({
  score: scoreReducer,
  scoreAsync: scoreAsyncReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

// 要注意，reduxThunk应该要放在reduxLogger之前，不然reduxLogger无法识别reduxThunk
const store = createStore(
  rootReducer,
  applyMiddleware(reduxThunk, reduxLogger)
);
export default store;

