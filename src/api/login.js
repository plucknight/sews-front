import login from "./request";

const loginApi = (data) => {
  return login.post({
    url: "/login",
    data,
  });
};

export default loginApi;
