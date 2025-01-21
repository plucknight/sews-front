<template>
  <div class="map_page">
    <div id="map">
      <div class="leftContent">
        <div class="zoom">级别：{{ currentZoom }}</div>
        <div class="zone">区域：{{ currentName }}</div>
        <div class="code">code：{{ currentCode }}</div>
      </div>
      <div class="centerContent">
        <span class="lng">中心经度：{{ mapcenter.lng }}</span>
        <span class="lat">中心维度：{{ mapcenter.lat }}</span>
      </div>
      <el-button size="mini" @click.stop="getJson('home')" class="home_btn"
        >返回主界面</el-button
      >
      <el-button size="mini" @click.stop="getJson('back')" class="back_btn"
        >返回上一层</el-button
      >
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
export default {
  name: "home",
  data() {
    return {
      geoJSONlayer: {},
      map: {},
      provinceZoom: 5, // 省级别
      cityZoom: 7, // 市级别
      areaZoom: 9, // 区级别
      townZoom: 11, // 镇级别
      currentZoom: 5, // 当前级别
      markers: [],
      initCode: "100000", // 初始code
      currentCode: "100000", //当前code
      initName: "全国", //初始name
      currentName: "全国", //当前name
      currentlatlng: [],
      defaultlatlng: [113.88308, 22.55329], // [经度,维度]
      mapcenter: {
        lng: "",
        lat: "",
      },
      superiorCodeArr: [], //上一级的code
      superiorNameArr: [], //上一级的name
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.initMap();
      this.getJson();
      this.getmarkers();
    });
  },
  methods: {
    // 初始化地图
    initMap() {
      let map = L.map("map", {
        minZoom: 5,
        maxZoom: 18,
        center: [this.defaultlatlng[1], this.defaultlatlng[0]],
        zoom: this.provinceZoom,
        zoomControl: true,
        attributionControl: false,
        crs: L.CRS.EPSG3857,
      });
      var center = map.getCenter(); // 获取新的中心点
      this.mapcenter = center;

      this.map = map; //data上需要挂载
      window.map = map;
      L.tileLayer(
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
      ).addTo(map);
      map.on("click", (e) => {});

      map.on("zoomend", (e) => {
        //获取当前放大或者缩小的等级
        let scale = e.target.getZoom();
        this.currentZoom = scale;
      });
      map.on("moveend", () => {
        var center = map.getCenter(); // 获取新的中心点
        this.mapcenter.lng = center.lng.toFixed(6);
        this.mapcenter.lat = center.lat.toFixed(6);
      });
    },
    // 显示高亮地图
    getJson(val) {
      let code = val;
      if (code == "home") {
        code = this.initCode;
        this.superiorCodeArr = [];
        this.superiorNameArr = [];
        this.currentName = this.initName;
        let lnglatArr = [this.defaultlatlng[1], this.defaultlatlng[0]];
        map.flyTo(lnglatArr, this.provinceZoom);
        this.geoJSONlayer && this.geoJSONlayer.remove();
      }

      if (code == "back") {
        if (this.superiorCodeArr.length === 0) return;
        code = this.superiorCodeArr[this.superiorCodeArr.length - 1];
        this.superiorCodeArr.pop();
        this.superiorNameArr.pop();
        this.currentName =
          this.superiorNameArr.length > 0
            ? this.superiorNameArr[this.superiorNameArr.length - 1]
            : this.initName;
        let zoom =
          this.superiorCodeArr.length === 0
            ? this.provinceZoom
            : this.superiorCodeArr.length === 1
            ? this.cityZoom
            : this.superiorCodeArr.length === 2
            ? this.areaZoom
            : this.townZoom;
        this.currentZoom = zoom;
        let lnglatArr = [this.currentlatlng[1], this.currentlatlng[0]];
        map.flyTo(lnglatArr, zoom);
        this.geoJSONlayer && this.geoJSONlayer.remove();
      }

      if (!code) {
        code = this.initCode;
      }
      this.currentCode = code;
      axios
        .get(`./json/${code}.geojson`)
        .then((res) => {
          var all = [
            "#f7acbc",
            "#deab8a",
            "#817936",
            "#444693",
            "#ef5b9c",
            "#fedcbd",
          ];
          if (res.status === 200) {
            this.geoJSONlayer = L.geoJSON(res.data, {
              style: () => {
                return {
                  color: "white",
                  fillColor: all[Math.floor(Math.random() * all.length)],
                  weight: 1,
                  fillOpacity: 0.5,
                };
              },
              onEachFeature: (feature, layer) => {
                feature.properties &&
                  feature.properties.name &&
                  layer.bindTooltip(feature.properties.name, {
                    direction: "bottom",
                    className: "my_tooltip",
                    permanent: true,
                  });
              },
            })
              .on("click", (e) => {
                let proObj = null;
                if (e.layer && e.layer.feature && e.layer.feature.properties) {
                  proObj = e.layer.feature.properties;
                }
                if (proObj?.childrenNum > 0 && proObj.adcode) {
                  this.currentCode = proObj.adcode;
                  this.currentName = proObj.name;
                  this.superiorNameArr.push(proObj.name);
                  let tempAcroutes = [
                    ...this.superiorCodeArr,
                    ...proObj.acroutes,
                  ];
                  this.superiorCodeArr = Array.from(new Set(tempAcroutes));
                  let zoom =
                    this.superiorCodeArr.length === 1
                      ? this.cityZoom
                      : this.superiorCodeArr.length === 2
                      ? this.areaZoom
                      : this.townZoom;
                  this.currentZoom = zoom;

                  if (proObj.center) {
                    // 根据点击的管辖市区镇的中心经纬度
                    this.currentlatlng = proObj.center;
                    map.flyTo([proObj.center[1], proObj.center[0]], zoom);
                  } else {
                    // 根据点击所在点的经纬度
                    this.currentlatlng = [e.latlng.lng, e.latlng.lat];
                    map.flyTo([e.latlng.lat, e.latlng.lng], zoom);
                  }

                  // 移除数据
                  this.geoJSONlayer && this.geoJSONlayer.remove();
                  // 重新加载数据
                  this.getJson(proObj.adcode);
                } else {
                  this.$message.warning("没有数据");
                }
              })
              .addTo(map);
          }
        })
        .catch((err) => {
          // 请求失败时的处理逻辑
          console.log(err);
        });
    },
    // 获取所有的markers
    async getmarkers() {
      let list = [
        { dev_latitude: 22.15329, dev_longitude: 113.12308 },
        { dev_latitude: 22.25229, dev_longitude: 113.21308 },
        { dev_latitude: 22.35129, dev_longitude: 113.38138 },
        { dev_latitude: 22.45429, dev_longitude: 113.48318 },
        { dev_latitude: 22.55529, dev_longitude: 113.58328 },
        { dev_latitude: 22.65629, dev_longitude: 113.68358 },
        { dev_latitude: 24.75729, dev_longitude: 113.78398 },
        { dev_latitude: 25.75729, dev_longitude: 114.78398 },
        { dev_latitude: 26.75729, dev_longitude: 115.78398 },
        { dev_latitude: 27.75729, dev_longitude: 116.78398 },
        { dev_latitude: 28.75729, dev_longitude: 117.78398 },
      ];
      list.map((v) => {
        this.addmarker(v);
      });
    },
    // 添加marker
    addmarker(options) {
      var marker = L.marker([options.dev_latitude, options.dev_longitude], {
        icon: L.icon({ iconUrl: "/img/marker-icon.png", iconSize: [25, 40] }),
      }).addTo(map);

      marker.on("mouseover", async (e) => {
        let lng = e.latlng.lng;
        let lat = e.latlng.lat;

        var lnglatXY = [lng, lat]; //已知点坐标
        var geocoder = new AMap.Geocoder({
          city: "广州", //城市设为北京，默认：“全国”
          radius: 1000, //范围，默认：500
        });
        var currentAddress;
        geocoder.getAddress(lnglatXY, (status, result) => {
          if (status === "complete" && result.info === "OK") {
            currentAddress = result.regeocode.formattedAddress.slice(3);
          } else {
            currentAddress = "暂无位置";
          }

          marker.bindPopup(`${currentAddress}`).openPopup();
        });
      });
      this.markers.push(marker);
    },
  },
};
</script>

<style lang="scss" scoped>
.map_page {
  height: 100%;
  width: 100%;

  #map {
    height: 100%;
    width: 100%;
    position: relative;

    .leftContent {
      position: absolute;
      top: 80px;
      left: 10px;
      z-index: 999;

      .zoom,
      .zone,
      .code {
        padding: 0 10px;
        background-color: #fff;
        font-size: 20px;
        margin-bottom: 5px;
      }
    }

    .centerContent {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      background-color: #fff;
      font-size: 20px;

      .lng,
      .lat {
        padding: 0 10px;
      }

      .lng {
        margin-right: 10px;
      }
    }

    .back_btn,
    .home_btn {
      position: absolute;
      top: 50px;
      right: 20px;
      z-index: 999;
    }

    .home_btn {
      top: 10px;
    }
  }
}

::v-deep .my_tooltip {
  color: #fff;
  background: transparent;
  border: none;
  font-size: 18px;
  box-shadow: none;
}
</style>
