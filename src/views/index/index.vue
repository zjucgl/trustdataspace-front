<template>
  <div class="login">
    <div class="login_box">
      <button class="button button_type_1" @click="login">登陆</button>
      <button class="button button_type_2" @click="register">注册</button>
    </div>
  </div>
  <div class="banner">
    <img src="./images/banner_1.png" />
  </div>
  <div class="box box_type_gray">
    <div class="son_box box1">
      <div class="hr_1" />
      <div class="hr_2" />
      <div class="left">
        <img src="./images/tips.png" />
      </div>
      <div class="right">
        <div class="block" style="margin-top: 0px">
          <div class="img"><img src="./images/icon_1.png" /></div>
          <div class="font">文物数字化工具</div>
        </div>
        <div class="block" style="margin-top: 0px">
          <div class="img"><img src="./images/icon_2.png" /></div>
          <div class="font">古籍数字化工具</div>
        </div>
        <div class="block" style="margin-top: 0px">
          <div class="img"><img src="./images/icon_3.png" /></div>
          <div class="font">文化数据解码工具</div>
        </div>
        <div class="block" style="margin-top: 0px">
          <div class="img"><img src="./images/icon_4.png" /></div>
          <div class="font">文化基因提取（图片）</div>
        </div>
        <div class="block">
          <div class="img"><img src="./images/icon_5.png" /></div>
          <div class="font">文化基因提取（音频）</div>
        </div>
        <div class="block">
          <div class="img"><img src="./images/icon_6.png" /></div>
          <div class="font">文化基因提取（视频）</div>
        </div>
        <div class="block">
          <div class="img"><img src="./images/icon_7.png" /></div>
          <div class="font">文化数据治理工具</div>
        </div>
        <div class="block">
          <div class="img"><img src="./images/icon_8.png" /></div>
          <p class="font">文化血缘追踪工具</p>
        </div>
      </div>
    </div>
  </div>
  <div class="box_type_white" style="padding: 64px 0">
    <div class="son_box box2">
      <div class="grid grid-cols-12 gap-2">
        <div
          v-for="item in fileList"
          :key="item.id"
          class="col-span-3"
          style="height: 330px; cursor: pointer"
          @click="login(item)"
        >
          <el-image
            style="width: 100%; height: 306px"
            :src="addr + item.baseUrl"
            fit="contain"
            class="no-pointer-events"
            lazy
          >
            <template #error>
              <div class="image-slot">非图片文件</div>
            </template>
          </el-image>
          <div class="demonstration">
            {{ item.id }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">◎ 2025 浙江大学宁波理工学院</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { router, resetRouter } from "@/router";
import { getConfig } from "@/config";
import { getWorkFileByNameList } from "@/api/utils/workfile";
import { getCachedCatalogList } from "@/api/catalog/catalog";
const login = (item: any) => {
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  console.log("item=", item);
  router.push({ path: "/login", query: { id: item.id } });
  //router.push("/login");
  resetRouter();
};
const register = () => {
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  router.push({ path: "/register" });
  resetRouter();
};
function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName}` : className;
}
const addr = "http://211.91.61.25:29000";
const fileList = ref([
  {
    id: "敦煌文献 P",
    type: "png",
    baseUrl: "/data/敦煌文献 P.2666v《 单方》.png"
  }
]);
const catalogList = ref([]);
const setCatalogList = () => {
  const searchJson = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "QuerySpec"
  };
  getCachedCatalogList(searchJson)
    .then(res => {
      //convetData(res);
      convetCatalogData(res);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      setFilePreview();
    });
};
setCatalogList();
const convetCatalogData = (data: Array<any>) => {
  const res = [];
  const list = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i]["dcat:dataset"].length > 0) {
      for (let j = 0; j < data[i]["dcat:dataset"].length; j++) {
        list.push(data[i]["dcat:dataset"][j]);
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (typeof item["dcat:dataset"] !== "undefined") {
      for (let j = 0; j < item["dcat:dataset"].length; j++) {
        const dataset = item["dcat:dataset"][j];
        res.push(dataset["@id"]);
      }
    }
  }
  catalogList.value = res;
};
const setFilePreview = () => {
  getWorkFileByNameList(catalogList.value).then(res => {
    // fileList.value = res.result;
    fileList.value = res.result.slice().reverse(); // 使用 slice() 复制数组并反转
    console.log("fileList=", fileList.value);
  });
};
</script>
<style scoped>
* {
  margin: 0px;
  padding: 0px;
  font-size: 0px;
  box-sizing: border-box;
  position: relative;
}

.login {
  width: 100%;
  height: 72px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 100;
}
.login .login_box {
  width: 80%;
  min-width: 1000px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.login .login_box .button {
  width: 72px;
  height: 32px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 300;
  font-size: 16px;
  line-height: 32px;
  font-style: normal;
  border-radius: 16px;
  border: none;
  background: none;
  margin-left: 16px;
  cursor: pointer;
  outline: none;
}
.login .login_box .button_type_1 {
  border: 1px solid #2d6cc8;
  color: #2d6cc8;
}
.login .login_box .button_type_2 {
  background: linear-gradient(200deg, #dacfff 0%, #2d6cc8 100%);
  font-family:
    PingFangSC,
    PingFang SC;
  color: #ffffff;
}

.banner {
  width: 100%;
}
.banner > img {
  width: 100%;
}

.box {
  width: 100%;
  padding: 48px 0px;
}
.box_type_white {
  background: #fff;
}
.box_type_gray {
  background: #f5f9fd;
}
.son_box {
  width: 80%;
  min-width: 1000px;
  margin: 0 auto;
}
.son_box .hr_1 {
  width: 7.5%;
  height: 4px;
  background: #00427b;
  position: absolute;
  top: 0px;
  left: 0px;
}
.son_box .hr_2 {
  width: 15%;
  height: 2px;
  background: #00427b;
  position: absolute;
  top: 20px;
  left: 0px;
}

.box1 {
  width: 80%;
  min-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box1 .left {
  width: 25%;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box1 .left > img {
  width: 100%;
}
.box1 .right {
  width: 65%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.box1 .right .block {
  width: 25%;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.box1 .right .block .img {
  width: 96px;
  height: 96px;
}
.box1 .right .block .img > img {
  width: 100%;
  height: 100%;
}
.box1 .right .block .font {
  margin-top: 26px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #282e35;
  line-height: 20px;
  font-style: normal;
}

.box2 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.box2 .block {
  width: 100%;
  margin-bottom: 64px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.box2 .block .img {
  width: 60%;
}
.box2 .block .img > img {
  width: 100%;
  height: 100%;
}
.box2 .block .font {
  width: 40%;
}
.box2 .block .font > div {
  width: 80%;
  margin-left: 10%;
}
.box2 .block .font .title {
  height: 32px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 550;
  font-size: 20px;
  color: #13161a;
  line-height: 32px;
  text-align: left;
  font-style: normal;
}
.box2 .block .font .text {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #282e35;
  line-height: 24px;
  text-align: left;
  font-style: normal;
  margin-top: 20px;
}

.footer {
  width: 100%;
  height: 24px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #84909e;
  line-height: 24px;
  text-align: left;
  font-style: normal;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 40px;
  margin-bottom: 32px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.el-icon {
  font-size: 30px;
}
.demonstration {
  display: block;
  color: black;
  text-align: center;
  font-size: 16px;
}
</style>
