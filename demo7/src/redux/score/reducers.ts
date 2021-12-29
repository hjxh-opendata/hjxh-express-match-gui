// 定义reducer函数
import { initScoreState, ScoreState } from "./state";
import { ScoreAction } from "./actionTypes";

export const scoreReducer = (
  state = initScoreState,
  action: ScoreAction
): ScoreState => {
  switch (action.type) {
    case "ADD_SCORE":
      return { value: state.value + 1 };
    case "DES_SCORE":
      return { value: state.value - 1 };
    default:
      return state;
  }
};
