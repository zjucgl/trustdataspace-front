<template>
  <!-- <head>
      <meta charset="UTF-8" />
      <title>可信文化数据空间</title>
      <link href="index.css" rel="stylesheet" />
    </head> -->

  <div class="login">
    <div class="login_box">
      <button class="button button_type_1" @click="login">登陆</button>
      <button class="button button_type_2">注册</button>
    </div>
  </div>
  <div class="banner">
    <img src="./images/banner_1.png" />
  </div>
  <div class="box box_type_white">
    <div class="son_box box1">
      <div class="hr_1"></div>
      <div class="hr_2"></div>
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
  <div class="box box_type_gray" style="padding: 64px 0">
    <div class="son_box box2">
      <div class="block">
        <div class="img"><img src="./images/pic_1.png" /></div>
        <div class="font">
          <div class="title">行业背景</div>
          <div class="text">
            作为“东方米兰”时尚之都的宁波，宁波拥有雅戈尔、太平鸟、申洲等龙头企业，已形成“纺织-设计-制造-零售”全产业链，对宁波经济增长和全球市场竞争力具有重要影响。
          </div>
        </div>
      </div>
      <div class="block" style="margin-bottom: 0px">
        <div class="font">
          <div class="title">空间简介</div>
          <div class="text">
            面向服装时尚创意产业的可信文化数据空间是一个融合数据安全、文化基因与智能分析的数字化生态系统。本空间基于共识规则，联结产业联盟的多方主体，以区块链、隐私计算、联邦学习等技术为基础，实现文化数据资源共享共用的数据流通利用基础设施，同时集成阳明文化、河姆渡文化、敦煌文化等区域多元文化基因，赋能文化数据要素的价值共创，实现数据驱动的时尚创新与产业升级。
          </div>
        </div>
        <div class="img"><img src="./images/pic_2.png" /></div>
      </div>
    </div>
  </div>
  <div class="box box_type_white" style="padding: 64px 0">
    <div class="son_box box2">
      <div class="block">
        <div class="img"><img src="./images/pic_3.png" /></div>
        <div class="font">
          <div class="title">“1+3+X”体系</div>
          <div class="text">
            1个可信基座：基于区块链+隐私计算的可信文化数据空间基础设施；<br />
            3类核心能力：数据确权流通、产业链协同创新、跨境数据合规；<br />
            X大应用场景：智能协同设计、可持续供应链、文化版权存证、创意数据湖源、跨境数据流通等创新应用服务场景。
          </div>
        </div>
      </div>
      <div class="block" style="margin-bottom: 0px">
        <div class="font">
          <div class="title">建设机制</div>
          <div class="text">
            整个建设采用政产学研用紧密合作机制，由宁波市数据局、市文化产业主管部门等提供政策支持，推动数据空间标准制定与产业试点，联合高校与研究机构、企业等建立可信文化数据空间共享联盟，促进服装时尚创意产业内数据合作，推动大数据与服装时尚的深度融合。
            <br />
            可信文化数据空间的组建各方包括：<br />
            · 可信文化数据空间运营者：浙大宁波理工学院、企业；<br />
            · 文化数据提供方：数字文化创新研究院、博物馆等文化机构；<br />
            · 文化数据使用方：服装时尚创意产业相关企业或相关组织等。
          </div>
        </div>
        <div class="img"><img src="./images/pic_4.png" /></div>
      </div>
    </div>
  </div>
  <div class="footer">◎ 2025 浙江大学宁波理工学院</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { router, resetRouter } from "@/router";
import { getConfig } from "@/config";
const login = () => {
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  router.push("/login");
  resetRouter();
};
function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName}` : className;
}
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
  min-height: 100px;
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
</style>
