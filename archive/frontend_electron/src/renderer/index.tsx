import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import { Provider } from "react-redux";
import store from "../redux/store";
import "./index.scss";

if (module.hot) {
  // 配置热更新
  module.hot.accept();
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
