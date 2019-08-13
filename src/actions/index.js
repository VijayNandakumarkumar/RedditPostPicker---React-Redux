export const loadPage = state => {
  return {
    type: "loadPage",
    payload: state
  };
};

export const loadPageWithAfterBefore = state => {
  return {
    type: "loadPageWithAfterBefore",
    payload: state
  };
};

export const setFilesEmpty = state => {
  return {
    type: "setFilesEmpty",
    payload: state
  };
};
