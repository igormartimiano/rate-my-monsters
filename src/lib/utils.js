import qs from "qs";

export const getQs = (path) => {
  if (path.indexOf("?") === -1) {
    return;
  }

  return path.substring(path.indexOf("?") + 1, path.length);
};

export const parseQsWithCommas = (path) =>
  qs.parse(getQs(path), { comma: true });
