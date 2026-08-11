<template>
  <a-card>
    <a-form :model="form" :rules="rules" ref="ruleForm" @finish="handleSubmit" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }">
      <a-form-item label="默认上传方式" name="default">
        <a-radio-group v-model:value="form.default">
          <a-radio value="local">本地</a-radio>
          <a-radio value="qiniu">七牛云</a-radio>
          <a-radio value="aliyun">阿里云</a-radio>
          <a-radio value="qcloud">腾讯云</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 动态显示配置 -->
      <div v-show="form.default === 'qiniu'">
        <a-form-item label="存储空间名称 Bucket：" :name="['gateways','qiniu','bucket']">
          <a-input v-model:value="form.gateways.qiniu.bucket" />
        </a-form-item>
        <a-form-item label="ACCESS_KEY AK：" :name="['gateways','qiniu','ak']">
          <a-input v-model:value="form.gateways.qiniu.ak" />
        </a-form-item>
        <a-form-item label="SECRET_KEY SK：" :name="['gateways','qiniu','sk']">
          <a-input v-model:value="form.gateways.qiniu.sk" />
        </a-form-item>
        <a-form-item label="空间域名 Domain：" :name="['gateways','qiniu','domain']">
          <a-input v-model:value="form.gateways.qiniu.domain" />
        </a-form-item>
        <a-form-item label="所属地域：" :name="['gateways','qiniu','region']">
          <a-select v-model:value="form.gateways.qiniu.region">
            <a-select-option value="z0">华东</a-select-option>
            <a-select-option value="z1">华北</a-select-option>
            <a-select-option value="z2">华南</a-select-option>
            <a-select-option value="na0">北美</a-select-option>
            <a-select-option value="as0">东南亚</a-select-option>
            <a-select-option value="cn-east-2">华东-浙江2</a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <div v-show="form.default === 'aliyun'">
        <a-form-item label="存储空间名称 Bucket：" :name="['gateways','aliyun','bucket']">
          <a-input v-model:value="form.gateways.aliyun.bucket" />
        </a-form-item>
        <a-form-item label="AccessKeyId：" :name="['gateways','aliyun','key_id']">
          <a-input v-model:value="form.gateways.aliyun.key_id" />
        </a-form-item>
        <a-form-item label="AccessKeySecret：" :name="['gateways','aliyun','secret']">
          <a-input v-model:value="form.gateways.aliyun.secret" />
        </a-form-item>
        <a-form-item label="空间域名 Domain：" :name="['gateways','aliyun','domain']">
          <a-input v-model:value="form.gateways.aliyun.domain" />
        </a-form-item>
        <a-form-item label="所属地域：" :name="['gateways','aliyun','region']">
          <a-select v-model:value="form.gateways.aliyun.region">
            <a-select-option value="CN_HANGZHOU">华东 1（杭州）</a-select-option>
            <a-select-option value="CN_SHANGHAI">华东 2（上海）</a-select-option>
            <a-select-option value="CN_QINGDAO">华北 1（青岛）</a-select-option>
            <a-select-option value="CN_BEIJING">华北 2（北京）</a-select-option>
            <a-select-option value="CN_ZHANGJIAKOU">华北 3（张家口）</a-select-option>
            <a-select-option value="CN_HUHEHAOTE">华北 3（张家口）</a-select-option>
            <a-select-option value="CN_WULANCHABU">华北 6（乌兰察布）</a-select-option>
            <a-select-option value="CN_SHENZHEN">华南 1（深圳）</a-select-option>
            <a-select-option value="CN_HEYUAN">华南 2（河源）</a-select-option>
            <a-select-option value="CN_GUANGZHOU">华南 3（广州）</a-select-option>
            <a-select-option value="CN_CHENGDU">西南 1（成都）</a-select-option>
            <a-select-option value="CN_HONGKONG">中国（香港）</a-select-option>
            <a-select-option value="US_WEST_1">美国（硅谷）</a-select-option>
            <a-select-option value="US_EAST_1">美国（弗吉尼亚）</a-select-option>
            <a-select-option value="AP_SOUTHEAST_1">亚太东南 1（新加坡）</a-select-option>
            <a-select-option value="AP_SOUTHEAST_2">亚太东南 2（悉尼）</a-select-option>
            <a-select-option value="AP_SOUTHEAST_3">亚太东南 3（吉隆坡）</a-select-option>
            <a-select-option value="AP_SOUTHEAST_5">亚太东南 5（雅加达）</a-select-option>
            <a-select-option value="AP_SOUTHEAST_6">亚太东南 6（马尼拉）</a-select-option>
            <a-select-option value="AP_NORTHEAST_1">亚太东北 1（日本）</a-select-option>
            <a-select-option value="AP_SOUTH_1">亚太南部 1（孟买）</a-select-option>
            <a-select-option value="EU_CENTRAL_1">欧洲中部 1（法兰克福）</a-select-option>
            <a-select-option value="EU_WEST_1">英国（伦敦）</a-select-option>
            <a-select-option value="ME_EAST_1">中东东部 1（迪拜）</a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <div v-show="form.default === 'qcloud'">
        <a-form-item label="存储空间名称 Bucket：" :name="['gateways','qcloud','bucket']">
          <a-input v-model:value="form.gateways.qcloud.bucket" />
        </a-form-item>
        <a-form-item label="所属地域：" :name="['gateways','qcloud','region']">
          <a-input v-model:value="form.gateways.qcloud.region" />
        </a-form-item>
        <a-form-item label="SecretId：" :name="['gateways','qcloud','secret_id']">
          <a-input v-model:value="form.gateways.qcloud.secret_id" />
        </a-form-item>
        <a-form-item label="SecretKey：" :name="['gateways','qcloud','secret_key']">
          <a-input v-model:value="form.gateways.qcloud.secret_key" />
        </a-form-item>
        <a-form-item label="空间域名 Domain：" :name="['gateways','qcloud','domain']">
          <a-input v-model:value="form.gateways.qcloud.domain" />
        </a-form-item>
      </div>
      <a-form-item :wrapper-col="{ offset: 4 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { message } from 'ant-design-vue';
import { getSettings, setSettings } from "@/api/Setting";

defineOptions({
  inheritAttrs: false,
  name: 'setting.Agreement'
})

const form = reactive({
  default: 'local',
  gateways:{
    qiniu: {
      bucket:'',
      ak:'',
      sk:'',
      domain:'',
      region:'',
    },
    aliyun: {
      bucket:'',
      key_id:'',
      secret:'',
      domain:'',
      region:'',
    },
    qcloud: {
      bucket:'',
      secret_id:'',
      secret_key:'',
      domain:'',
      region:'',
    },
  }
});

const rules = reactive({
  default: [{ required: true, message: '请选择默认上传方式', trigger: 'change' }],
  gateways:{
    qiniu:{
      'bucket': [{ required: true, message: '请输入空间名 Bucket', trigger: 'blur' }],
      'ak': [{ required: true, message: '请输入 ACCESS_KEY AK', trigger: 'blur' }],
      'sk': [{ required: true, message: '请输入 SECRET_KEY SK', trigger: 'blur' }],
      'domain': [{ required: true, message: '请输入空间域名 Domain', trigger: 'blur' }],
      'region': [{ required: true, message: '请选择所属地域', trigger: 'change' }]
    },
    aliyun:{
      'bucket': [{ required: true, message: '请输入空间名 Bucket', trigger: 'blur' }],
      'key_id': [{ required: true, message: '请输入 AccessKeyId', trigger: 'blur' }],
      'secret': [{ required: true, message: '请输入 AccessKeySecret', trigger: 'blur' }],
      'domain': [{ required: true, message: '请输入空间域名 Domain', trigger: 'blur' }],
      'region': [{ required: true, message: '请选择所属地域', trigger: 'change' }]
    },
    qcloud:{
      'bucket': [{ required: true, message: '请输入存储空间名称 Bucket', trigger: 'blur' }],
      'region': [{ required: true, message: '请输入所属地域', trigger: 'blur' }],
      'secret_id': [{ required: true, message: '请输入 SecretId', trigger: 'blur' }],
      'secret_key': [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
      'domain': [{ required: true, message: '请输入空间域名 Domain', trigger: 'blur' }]
    }

  }
});


const loading = ref(false);
const ruleForm = ref(null);

onMounted(() => {
  getConfig();
});

const getConfig = async () => {
  try {
    const res = await getSettings({ key: "storage_setting" });
    Object.assign(form, res.data);
  } catch (error) {
    console.error("获取设置失败", error);
  }
};  

const handleSubmit = async (values) => {
  loading.value = true;
  try {
    await setSettings({ data:values, key: "storage_setting" });
    message.success("保存成功");
  } catch (error) {
    console.error("提交失败", error);
  } finally {
    loading.value = false; 
  }
};
</script>

<style scoped>
/* Your styles here */
</style>