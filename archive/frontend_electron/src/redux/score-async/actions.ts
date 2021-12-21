import { Dispatch } from "redux";
import { addScore, desScore } from "../score/actions";

export const asyncAddScore = () => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(addScore());
    }, 1000);
  };
};
export const asyncDesScore = () => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(desScore());
    }, 1000);
  };
};
