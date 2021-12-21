// 声明State的接口，并初始化起始State（用于reducer的初始化，必需步骤）
export interface ScoreState {
  value: number
}

export const initScoreState: ScoreState = {
  value: 90
}
