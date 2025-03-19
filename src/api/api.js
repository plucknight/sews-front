import api from "@/api/config.js";
//模型接口

export const getAllModels = () => {
  return api.get("/models/getAllModels");
};
export const getModelById = (model_id) => {
  return api.get(`/models/${model_id}`);
};
export const deleteModelById = (model_id) => {
  return api.get(`/models/delete/${model_id}`);
};
export const addModel = (modelInfo) => {
  return api.post(`/models/addModel`, modelInfo);
};
export const updateModel = (modelId, modelInfo) => {
  return api.post(`/models/update/${modelId}`, modelInfo);
};
//设备接口
export const getAllDevices = () => {
  return api.get("/devices/getAllDevices");
};
export const getDeviceById = (device_id) => {
  return api.get(`/devices/${device_id}`);
};
export const deleteDeviceById = (device_id) => {
  return api.get(`/devices/deleteDevice/${device_id}`);
};
export const addDevice = (device) => {
  return api.post(`/devices/addDevice`, device);
};
export const updateDevice = (device_id, device) => {
  return api.post(`/devices/update/${device_id}`, device);
};

//设备维护
export const getMaintenanceRecords = () => {
  return api.get("/devicesMaintenance/getMaintenanceRecords");
};
export const getMaintenanceByDeviceId = (deviceId) => {
  return api.get(`/devicesMaintenance/device/${deviceId}`);
};
export const getMaintenanceById = (maintenanceId) => {
  return api.get(`/devicesMaintenance/${maintenanceId}`);
};
export const getMaintenanceByIdAndDeviceId = (deviceId, maintenanceId) => {
  return api.get(
    `/devicesMaintenance/device/${deviceId}/maintenance/${maintenanceId}`
  );
};
export const addDeviceMaintenance = (deviceMaintenance) => {
  return api.post(
    `/devicesMaintenance/addDeviceMaintenance`,
    deviceMaintenance
  );
};
//预警规则
export const getAllWarningRules = () => {
  return api.get("/warningRules/getAllWarningRules");
};
export const getWarningRuleById = (rule_id) => {
  return api.get(`/warningRules/${rule_id}`);
};
export const deleteWarningRuleById = (rule_id) => {
  return api.get(`/warningRules/delete/${rule_id}`);
};
export const addWarningRule = (warningRule) => {
  return api.post(`/warningRules/addWarningRule`, warningRule);
};
export const updateWarningRule = (warningRule) => {
  return api.post(`/warningRules/update`, warningRule);
};

//预警记录
export const getAllWarningInfo = () => {
  return api.get("/warning/getAllWarningInfo");
};
export const getWarningInfoById = (warning_id) => {
  return api.get(`/warning/${warning_id}`);
};
export const deleteWarningInfoById = (warning_id) => {
  return api.get(`/warning/delete/${warning_id}`);
};
export const addWarningInfo = (warningInfo) => {
  return api.post(`/warning/addwarningInfo`, warningInfo);
};
export const updateWarningInfo = (warningInfo) => {
  return api.post(`/warning/update`, warningInfo);
};

//图片

export const getAllMonitoringPhotos = () => {
  return api.get("/monitoringPhoto/getAllMonitoringPhotos");
};
export const getMonitoringPhotoById = (deviceId) => {
  return api.get(`/monitoringPhoto/device/${deviceId}`);
};

//admin
export const getAllAdmins = () => {
  return api.get("/admin/list");
};
export const getAdminInfo = () => {
  return api.get("/admin/id");
};
export const getAllPermissions = () => {
  return api.get("/adminPermission/list");
};
//气象数据接口
export const getAllWeatherData = () => {
  return api.get("/weather/getAllWeatherData");
};

export const login = (data) => {
  return api.post("/admin/login", data); // 登录接口
};

export const mapDevice = () => {
  return api.get("/prediction-results/getAll");
};

export const uploadOnnxModel = (onnxFile) => {
  return api.post(`/minio/upload`, onnxFile);
};
