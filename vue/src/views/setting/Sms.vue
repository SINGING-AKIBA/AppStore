<template>
  <a-card>
    <a-form :model="form" :rules="rules" @finish="handleSubmit" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
      <!-- 调试模式 -->
      <a-form-item label="调试模式" name="debug">
        <a-radio-group v-model:value="form.debug">
          <a-radio value="1">开启</a-radio>
          <a-radio value="0">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 条件显示调试码输入框 -->
      <a-form-item v-show="form.debug === '1'" label="调试码" name="debug_code" extra="默认为10086">
        <a-input v-model:value="form.debug_code"></a-input>
      </a-form-item>
      <!-- 短信平台选择 -->
      <a-form-item label="短信平台" name="default">
        <a-radio-group v-model:value="form.default">
          <a-radio value="rongheyun">融合云</a-radio>
          <a-radio value="qcloud">腾讯云</a-radio>
          <a-radio value="aliyun">阿里云</a-radio>
          <a-radio value="baidu">百度云</a-radio>
          <a-radio value="qiniu">七牛云</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 动态显示所选平台配置 -->
      <div v-show="form.default === 'rongheyun'">
        <a-form-item label="账号" :name="['gateways','rongheyun','username']">
          <a-input v-model:value="form.gateways.rongheyun.username" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="密码" :name="['gateways','rongheyun','password']">
          <a-input type="password" v-model:value="form.gateways.rongheyun.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="签名" :name="['gateways','rongheyun','signature']">
          <a-input v-model:value="form.gateways.rongheyun.signature" placeholder="请输入签名" />
        </a-form-item>
      </div>

      <div v-show="form.default === 'qcloud'">
        <a-form-item label="AppId" :name="['gateways','qcloud','sdk_app_id']">
          <a-input v-model:value="form.gateways.qcloud.sdk_app_id" placeholder="请输入AppId" />
        </a-form-item>
        <a-form-item label="SECRET ID" :name="['gateways','qcloud','secret_id']">
          <a-input v-model:value="form.gateways.qcloud.secret_id" placeholder="请输入SECRET ID" />
        </a-form-item>
        <a-form-item label="SECRET KEY" :name="['gateways','qcloud','secret_key']">
          <a-input v-model:value="form.gateways.qcloud.secret_key" placeholder="请输入SECRET KEY" />
        </a-form-item>
        <a-form-item label="短信签名" :name="['gateways','qcloud','sign_name']">
          <a-input v-model:value="form.gateways.qcloud.sign_name" placeholder="请输入短信签名" />
        </a-form-item>
      </div>

      <div v-show="form.default === 'aliyun'">
        <a-form-item label="ACCESS KEY" :name="['gateways','aliyun','access_key_id']">
          <a-input v-model:value="form.gateways.aliyun.access_key_id" placeholder="请输入ACCESS KEY" />
        </a-form-item>
        <a-form-item label="SECRET KEY" :name="['gateways','aliyun','access_key_secret']">
          <a-input v-model:value="form.gateways.aliyun.access_key_secret" placeholder="请输入SECRET KEY" />
        </a-form-item>
        <a-form-item label="签名" :name="['gateways','aliyun','sign_name']">
          <a-input v-model:value="form.gateways.aliyun.sign_name" placeholder="请输入签名" />
        </a-form-item>
        <a-form-item label="短信内容" :name="['gateways','aliyun','template_content']">
          <a-textarea v-model:value="form.gateways.aliyun.template_content" placeholder="请输入短信内容"></a-textarea>
        </a-form-item>
      </div>

      <div v-show="form.default === 'baidu'">
        <a-form-item label="ACCESS KEY" :name="['gateways','baidu','ak']">
          <a-input v-model:value="form.gateways.baidu.ak" placeholder="请输入ACCESS KEY" />
        </a-form-item>
        <a-form-item label="SECRET KEY" :name="['gateways','baidu','sk']">
          <a-input v-model:value="form.gateways.baidu.sk" placeholder="请输入SECRET KEY" />
        </a-form-item>
        <a-form-item label="域名" :name="['gateways','baidu','domain']">
          <a-input v-model:value="form.gateways.baidu.domain" placeholder="请输入域名" />
        </a-form-item>
        <a-form-item label="INVOKE ID" :name="['gateways','baidu','invokeid']">
          <a-input v-model:value="form.gateways.baidu.invokeid" placeholder="请输入INVOKE ID" />
        </a-form-item>
      </div>

      <div v-show="form.default === 'qiniu'">
        <a-form-item label="ACCESS KEY" :name="['gateways','qiniu','access_key']">
          <a-input v-model:value="form.gateways.qiniu.access_key" placeholder="请输入ACCESS KEY" />
        </a-form-item>
        <a-form-item label="SECRET KEY" :name="['gateways','qiniu','secret_key']">
          <a-input v-model:value="form.gateways.qiniu.secret_key" placeholder="请输入SECRET KEY" />
        </a-form-item>
      </div>

      <!-- 模板ID -->
      <a-form-item label="模板ID" name="template_id">
        <a-input v-model:value="form.template_id" placeholder="请输入模板ID" />
      </a-form-item>
      

      <!-- 提交按钮 -->
      <a-form-item :wrapper-col="{ offset: 4 }">
        <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">提交</a-button>
      </a-form-item>
    </a-form>      
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted ,watch} from 'vue';
import { message } from 'ant-design-vue';
import { getSettings, setSettings } from '@/api/Setting';

defineOptions({
  inheritAttrs: false,
  name: 'setting.Sms'
})

// 定义默认的平台配置结构
const defaultGatewayConfig = {
  rongheyun: {
    username: '',
    password: '',
    signature: '',
  },
  qcloud: {
    sdk_app_id: '',
    secret_id: '',
    secret_key: '',
    sign_name: '',
  },
  aliyun: {
    access_key_id: '',
    access_key_secret: '',
    sign_name: '',
    template_content: '',
  },
  baidu: {
    ak: '',
    sk: '',
    domain: '',
    invokeid: '',
  },
  qiniu: {
    access_key: '',
    secret_key: '',
  },
};

// Form model
const form = reactive({
  debug: '0',
  debug_code: '',
  default: 'rongheyun',
  template_id: '',
  gateways: { ...defaultGatewayConfig }
});

// Loading state
const loading = ref(false);

// Validation rules (simplified for this example)
const rules = {
  template_id: [{ required: true, message: '请输入模板ID' }],
  default: [{ required: true, message: '请选择默认平台' }],
  debug: [{ required: true, message: '请选择调试模式' }],
  gateways:{
    rongheyun:{
      username: [{ required: true, message: '请输入账号' }],
      password: [{ required: true, message: '请输入密码' }],
      signature: [{ required: true, message: '请输入签名' }]
    },
    qcloud:{
      sdk_app_id: [{ required: true, message: '请输入AppId' }],
      secret_id: [{ required: true, message: '请输入SECRET ID' }],
      secret_key: [{ required: true, message: '请输入SECRET KEY' }],
      sign_name: [{ required: true, message: '请输入短信签名' }]
    },
    aliyun:{
      access_key_id: [{ required: true, message: '请输入ACCESS KEY' }],
      access_key_secret: [{ required: true, message: '请输入SECRET KEY' }],
      sign_name: [{ required: true, message: '请输入签名' }],
      template_content: [{ required: true, message: '请输入短信内容' }]
    },
    qiniu:{
      access_key: [{ required: true, message: '请输入ACCESS KEY' }],
      secret_key: [{ required: true, message: '请输入SECRET KEY' }]
    },
    baidu:{
      ak: [{ required: true, message: '请输入ACCESS KEY' }],
      sk: [{ required: true, message: '请输入SECRET KEY' }],
      domain: [{ required: true, message: '请输入域名' }],
      invokeid: [{ required: true, message: '请输入INVOKE ID' }]
    },
  }
};

// 确保所有网关配置都存在
const ensureGatewayConfigs = (config) => {
  Object.keys(defaultGatewayConfig).forEach(key => {
    if (!config[key]) {
      config[key] = { ...defaultGatewayConfig[key] };
    } else {
      // 确保所有必需字段都存在
      Object.keys(defaultGatewayConfig[key]).forEach(field => {
        if (config[key][field] === undefined) {
          config[key][field] = defaultGatewayConfig[key][field];
        }
      });
    }
  });
};

// Fetch settings on mount
onMounted(async () => {
  try {
    const res = await getSettings({ key: "sms_setting" });
    
    // 确保返回的数据结构完整
    if (res.data && res.data.gateways) {
      ensureGatewayConfigs(res.data.gateways);
    }
    
    Object.assign(form, res.data);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }
});

// Handle form submission
const handleSubmit = async (values) => {
  try {
    loading.value = true;
    await setSettings({ data:values, key: "sms_setting" });
    message.success("保存成功");
  } catch (error) {
    message.error("保存失败，请重试。");
    console.error('Failed to save settings:', error);
  } finally {
    loading.value = false;
  }
};

// 监听default变化，确保对应平台配置已初始化
watch(() => form.default, (newVal) => {
  if (!form.gateways[newVal]) {
    form.gateways[newVal] = { ...defaultGatewayConfig[newVal] };
  }
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>