import { Action } from "redux";

export const ASYNC_ADD_SCORE = "ASYNC_ADD_SCORE";
export type ASYNC_ADD_SCORE = typeof ASYNC_ADD_SCORE;

export const ASYNC_DES_SCORE = "ASYNC_DES_SCORE";
export type ASYNC_DES_SCORE = typeof ASYNC_DES_SCORE;

export type ScoreAsyncActionType = ASYNC_ADD_SCORE | ASYNC_DES_SCORE;

export interface ScoreAsyncAction extends Action {
  type: ScoreAsyncActionType;
}
