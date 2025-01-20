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
  return api.get(`/devices/delete/${device_id}`);
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

export const login = (data) => {
  return api.post("/login", data); // 登录接口
};
