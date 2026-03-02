import { get, post, uploadFile } from "./http";

export const commonApi = {
  getHealth(params = {}) {
    return get("/health", params);
  },
  getExampleList(params = {}) {
    return get("/api/common/get-content-detail.html", params);
  },
  postExampleData(data = {}) {
    return post("/api/common/get-content-detail.html", data);
  },
  uploadExampleFile(file, extraData = {}) {
    return uploadFile("/example/upload", file, "file", extraData);
  },
};
