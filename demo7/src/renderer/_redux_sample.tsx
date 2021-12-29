import * as React from "react";
import {useEffect} from "react";
import {connect} from "react-redux";
import {AppState} from "../redux/store";
import {addScore, desScore} from "../redux/score/actions";
import {asyncAddScore, asyncDesScore} from "../redux/score-async/actions";
import {ScoreAction} from "../redux/score/actionTypes";
import {ScoreAsyncAction} from "../redux/score-async/actionTypes";
import {ipcRenderer} from "electron";
import {CollName, Msg, QueryReq} from "../main/const";

export interface AppProps {
  score: number;
  addScore: () => ScoreAction;
  desScore: () => ScoreAction;
  asyncAddScore: () => ScoreAsyncAction;
  asyncDesScore: () => ScoreAsyncAction;
}

export const App = (props: AppProps) => {

    ipcRenderer.on(Msg.db_query_res, (item) => {
        console.log(`received item:  ${item}`)
    })

    useEffect(() => {
        console.log("started sending request to main process")
        const queryReq: QueryReq = {
            collName: CollName.items,
            query: {
                limit: 10,
                skip: 0,
                query: {}
            }
        }
        ipcRenderer.send(Msg.db_query_req, queryReq)
        console.log("sent db query request")
    }, [])

  return (
    <div className={""}>
      <h1>your score is: {props.score}</h1>
      <div>
        <button onClick={props.addScore}>ADD</button>
        <button onClick={props.desScore}>DES</button>
      </div>
      <div>
        <button onClick={props.asyncAddScore}>ADD_ASYNC</button>
        <button onClick={props.asyncDesScore}>DES_ASYNC</button>
      </div>
    </div>
  );
};

const mapState = (state: AppState) => ({
  score: state.score.value,
});

const mapDispatch = {
  addScore,
  desScore,
  asyncAddScore,
  asyncDesScore,
};

export default connect(mapState, mapDispatch)(App);

