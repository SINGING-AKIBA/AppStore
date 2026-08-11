<template>
  <div class="user-layout-wrapper">
    <div class="container">
        <div class="layout-select-lang">
            <SelectLang />
        </div>
        <div class="user-layout-header">
            <div class="title">
                <img src="@/assets/logo.png" :alt="config.layout.title" />
                {{ config.login.title || config.layout.title }}
            </div>
            <div class="desc">{{ config.login.description }}</div>
        </div>
        <router-view />
        <div class="user-layout-footer">
            <div class="links">
                <a :href="item.href" :key="index" v-for="(item,index) in config.login.links">{{ item.title }}</a>
            </div>
            <div class="copyright">
                <a href="https://beian.miit.gov.cn/" target="_blank">{{ config.login.copyright }}</a>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import config from '@/config';
import SelectLang from '@/components/SelectLang/SelectLang.vue';

</script>
<style scoped lang="less">
.user-layout-wrapper {
    height: 100vh;
    background:#f0f2f5 url('@/assets/background.svg') no-repeat 50%;
    .container {
        .layout-select-lang{
            padding: 10px;
            text-align: right;
        }
        .user-layout-header {
            padding: 68px 0 32px;
            text-align: center;
            .title {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 33px;
                height: 44px;
                line-height: 44px;
                font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
                color: rgba(0, 0, 0, .65);
                img {
                    width: 44px;
                    height: 44px;
                    margin-right: 10px;
                }
            }
            .desc {
                margin-top: 12px;
                color: rgba(0, 0, 0, .45);
                font-size: 14px;
            }
        }
        .user-layout-footer {
            padding: 0 16px;
            margin: 48px 0 32px;
            text-align: center;
            .links {
                margin-bottom: 8px;
                a {
                    color: rgba(0, 0, 0, .45);
                    transition: all 0.3s;
                    &:not(:last-child) {
                       margin-right: 40px;
                    }
                }
            }
            .copyright {
                a{
                    color: rgba(0, 0, 0, .45);
                    font-size: 14px;
                }
            }
        }
    }
}

</style>