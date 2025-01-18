import Service from "./config";
//get
const get = (config) => {
  return Service({
    ...config,
    method: "get",
    params: config.date,
  });
};
//post
const post = (config) => {
  return Service({
    ...config,
    method: "post",
    date: config.date,
  });
};

export default {
  get,
  post,
};
