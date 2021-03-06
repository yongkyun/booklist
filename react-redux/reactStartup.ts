import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./site-styles.css";

import { renderUI } from "applicationRoot/renderUI";
import { createElement } from "react";
import queryString from "query-string";
import getPublicUser from "graphQL/getPublicUser.graphql";

export type MutationType = { runMutation: any; dispatch: any; running: any };

import "util/ajaxUtil";

import createHistory from "history/createBrowserHistory";
import setupServiceWorker from "./util/setupServiceWorker";
import { isLoggedIn, graphqlClient } from "applicationRoot/rootReducer";
import { AppState } from "applicationRoot/appState";

setupServiceWorker();

let currentModule;
let publicUserCache = {};

export const history = createHistory();

const validModules = new Set(["books", "scan", "home", "activate", "view", "subjects", "settings", "styledemo"]);
let initial = true;

export const getModulePromise = moduleToLoad => {
  switch (moduleToLoad.toLowerCase()) {
    case "activate":
      return import(/* webpackChunkName: "small-modules" */ "./modules/activate/activate");
    case "authenticate":
      return import(/* webpackChunkName: "small-modules" */ "./modules/authenticate/authenticate");
    case "books":
      return import(/* webpackChunkName: "books-module" */ "./modules/books/books");
    case "home":
      return import(/* webpackChunkName: "home-module" */ "./modules/home/home");
    case "scan":
      return import(/* webpackChunkName: "scan-module" */ "./modules/scan/scan");
    case "subjects":
      return import(/* webpackChunkName: "subject-module" */ "./modules/subjects/subjects");
    case "styledemo":
      return import(/* webpackChunkName: "styledemo-module" */ "./modules/styledemo/styledemo");
    case "settings":
      return import(/* webpackChunkName: "small-modules" */ "./modules/settings/settings");
  }
};

renderUI();

export function loadCurrentModule(app: AppState, { setModule, setPublicInfo }) {
  let location = history.location;
  let originalModule = location.pathname.replace(/\//g, "").toLowerCase();
  let moduleToLoad = originalModule || "home";
  let publicModule = moduleToLoad === "view" || moduleToLoad == "activate";

  let { logged_in, userId: currentUserId } = isLoggedIn();
  let loggedIn = logged_in && currentUserId;

  if (!loggedIn && !publicModule) {
    if (originalModule && moduleToLoad != "home") {
      moduleToLoad = "authenticate";
    } else {
      moduleToLoad = "home";
    }
  } else {
    if (!validModules.has(moduleToLoad)) {
      history.push("/books");
      return;
    }
  }

  if (publicModule) {
    var userId = getCurrentHistoryState().searchState.userId;

    //switching to a new public viewing - reload page
    if (!initial && app.publicUserId != userId) {
      window.location.reload();
      return;
    }

    var publicUserPromise = userId ? publicUserCache[userId] || (publicUserCache[userId] = fetchPublicUserInfo(userId)) : null;

    if (moduleToLoad === "view") {
      moduleToLoad = "books";
    }
  } else if (app.publicUserId) {
    //leaving public viewing - reload page
    window.location.reload();
    return;
  }

  initial = false;

  if (moduleToLoad === currentModule) {
    return;
  }
  currentModule = moduleToLoad;

  let modulePromise = getModulePromise(moduleToLoad);

  Promise.all([modulePromise, publicUserPromise])
    .then(([{ default: moduleObject }, publicUserInfo]: [any, any]) => {
      if (currentModule != moduleToLoad) return;

      setModule(currentModule);

      if (publicUserInfo) {
        setPublicInfo({ ...publicUserInfo, userId });
      }
      renderUI(createElement(moduleObject.component));
    })
    .catch(() => {});
}

export function goto(module, search?) {
  if (currentModule !== module) {
    history.push({ pathname: `/${module}`, search: search || undefined });
  }
}

export function getCurrentHistoryState() {
  let location = history.location;
  return {
    pathname: location.pathname,
    searchState: queryString.parse(location.search)
  };
}

export function setSearchValues(state) {
  let { pathname, searchState: existingSearchState } = getCurrentHistoryState();
  let newState = { ...existingSearchState, ...state };
  newState = Object.keys(newState)
    .filter(k => newState[k])
    .reduce((hash, prop) => ((hash[prop] = newState[prop]), hash), {});

  history.push({
    pathname: history.location.pathname,
    search: queryString.stringify(newState)
  });
}

function fetchPublicUserInfo(userId) {
  return new Promise((res, rej) => {
    graphqlClient.runQuery(getPublicUser, { _id: userId, cache: 5 }).then(resp => {
      let publicUser = resp.data && resp.data.getPublicUser && resp.data.getPublicUser.PublicUser;
      publicUser ? res(publicUser) : rej();
    });
  });
}
