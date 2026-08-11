<template>
	<div class="list">
	  <div class="item" v-for="(item, k) in (params.dataType === 'api' ? article : params.list)" :key="k">
		<div class="image-box">
		  <a-image class="image" :src="item.coverImageList[0].url" alt="cover"/>
		</div>
		<div class="title-box">
		  <div class="title">{{ item.title }}</div>
		  <div class="subtitle">{{ item.subtitle }}</div>
		</div>
	  </div>
	</div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { index } from '@/api/Article';
const props = defineProps({
params: {
	type: Object,
	required: true,
},
});

const article = ref([]);

onMounted(() => {
if (props.params.dataType === 'api') {
	index(props.params.query).then(res => {
	article.value = res.data.data;
	});
}
});
</script>
<style lang="less" scoped>
.list{
	.item{
		display: flex;
		background-color: #ffffff;
		padding: 10px 0;
		margin-bottom: 10px;
		.image-box{
			float: left;
			width: 35%;
			height: 100px;
			overflow: hidden;
			.image{
				width: 100%;
				height:auto;
			}
		}
		.title-box{
			box-sizing: border-box;
		    padding-left: 10px;
			width: 65%;
			float: left;
			.title{
				min-height: 45px;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.subtitle{
				font-size: 10px;
			  color:#b3b2b2;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
			}
		}
	}
}
</style>
