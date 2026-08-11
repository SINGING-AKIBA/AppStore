<template>
    <div class="diy-window" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`,background: `${itemStyle.background}`}">
        <div v-if="itemStyle.layout > -1" :class="`col-list col-sm-${itemStyle.layout}`">
          <div  v-for="(item,index) in data" :key="index" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`}" class="list-item">
            <div class="link">
                <img class="image" :src="item.imgUrl" />
            </div>
          </div>
        </div>

        <div v-else class="window-box">
            <div class="left" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`}">
                <img class="image" :src="data[0].imgUrl" />
            </div>
            <div class="right" >
                <div class="top" v-if="data.length >= 2" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`}" >
                    <img class="image" :src="data[1].imgUrl" />
                </div>
                <div class="bottom">
                    <div v-if="data.length >= 3"  class="bottom-left" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`}" >
                        <img class="image" :src="data[2].imgUrl" />
                    </div>
                    <div v-if="data.length >= 4" class="bottom-right" :style="{ padding: `${itemStyle.paddingTop}px ${itemStyle.paddingLeft}px`}">
                        <img class="image" :src="data[3].imgUrl" />
                    </div>
                </div>
            </div>
        </div>

    </div>
  </template>
  
  <script setup>
    const props = defineProps({
        data:Array,
        itemStyle:Object,
    })
  </script>
  
  <style lang="less">
    .diy-window{
        box-sizing: border-box;
        .col-list::after{
            clear: both;
            content: ' ';
            display: table;
        }
        .col-list{
            .list-item{
                float: left;
                box-sizing: border-box;
            }
            .link{
                .image{
                    width: 100%;
                }
            }
        }
        .col-sm-2{
            .list-item{
                width: 50%;
            }
        }
        .col-sm-3{
            .list-item{
                width: 33.33333333%;
            }
        }
        .col-sm-4{
            .list-item{
                width: 25%;
            }
        }

        //橱窗
        .window-box{
            width: 100%;
            height: 0;
            padding-bottom: 50%;
            margin:0;
            position: relative;
            box-sizing: border-box;
            .left,.right{
                width: 50%;
                height: 100%;
                position: absolute;
                top: 0;
                box-sizing: border-box;
            }
            .image{
                    width: 100%;
                    height: 100%;
                }
            .left{
                left: 0;
            }
            .right{
                left: 50%;
                .top,.bottom{
                    width: 100%;
                    height: 50%;
                    position: relative;
                    left: 0;
                    box-sizing: border-box;
                }
                .top{
                    top: 0;
                }
                .bottom{
                    .bottom-left,.bottom-right{
                        width: 50%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        box-sizing: border-box;
                    }
                    .bottom-left{
                        left: 0;
                    }
                    .bottom-right{
                        left: 50%;
                    }
                }
            }
        }
        
    }
  </style>