// 1. 声明ActionType的类型
import { Action } from "redux";

export const ADD_SCORE = "ADD_SCORE";
export type ADD_SCORE = typeof ADD_SCORE;

export type DES_SCORE = typeof DES_SCORE;
export const DES_SCORE = "DES_SCORE";

// 2. 声明Action的接口
// 可以参考这个reference，自动构建action，但不是ts: https://cn.redux.js.org/docs/recipes/ReducingBoilerplate.html
export type ScoreActionType = ADD_SCORE | DES_SCORE;

export interface ScoreAction extends Action {
  type: ScoreActionType;
}
