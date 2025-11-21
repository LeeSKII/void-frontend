<template>
  <div>yus sso</div>
  {{ res }}
  {{ reports }}
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as dd from "dingtalk-jsapi"; // 此方式为整体加载，也可按需进行加载
import axios from "axios";
import router from "@/router";
let res = ref();
let userInfo = ref();
let reports = ref();
const corpId = import.meta.env.VITE_CORP_ID;

onMounted(async () => {
  //router.push({ path: "/notfound", query: { token } });
  res.value = await dd.runtime.permission.requestAuthCode({
    corpId,
  });

  const code = res.value.code;
  //由后端接口使用yus的接口提供身份验证，获取token(可用)
  const authUrl =
    import.meta.env.VITE_SERVICE_URL + `/node/ext/yus/sso/getToken/${code}`;

  const tokenInfo = await axios.get(authUrl);

  const token = tokenInfo.data.token;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  window.localStorage.setItem("token", token);
  const url =
    import.meta.env.VITE_SERVICE_URL +
    `/node/auth/yus/market/report/weekly/2023-04`;
  const reportRes = await axios.get(url);
  reports.value = reportRes.data;
  window.localStorage.setItem("token", userInfo.value.data.access_token);
  router.push({ path: "/market/weekly/report/" });
  debugger;
});
</script>

<style></style>
