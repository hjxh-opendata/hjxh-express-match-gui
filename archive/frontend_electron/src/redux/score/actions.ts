// 3. 声明Action的函数
import { ADD_SCORE, DES_SCORE } from "./actionTypes";

export const addScore = () => ({
  type: ADD_SCORE,
});
export const desScore = () => ({
  type: DES_SCORE,
});

