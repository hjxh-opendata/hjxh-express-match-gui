import { initScoreState } from "../score/state";
import { ScoreAsyncAction } from "./actionTypes";
import { asyncAddScore, asyncDesScore } from "./actions";

export const scoreAsyncReducer = (
  state = initScoreState,
  action: ScoreAsyncAction
) => {
  switch (action.type) {
    case "ASYNC_ADD_SCORE":
      return asyncAddScore();
    case "ASYNC_DES_SCORE":
      return asyncDesScore();
    default:
      return state;
  }
};
