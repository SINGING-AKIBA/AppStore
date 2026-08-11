<template>
	<div class="list">
		<div class="item" v-for="(item,k) in (params.dataType == 'api' ? list :params.list)" :key="k">
			<div>
				<img class='goods-image' :src="item.imageList[0].url" />
			</div>
			<div class="title-box">
				<div class="title">{{item.title}}</div>
				<div class="subtitle">{{item.short_play_desc||item.categoryList[0].name}}</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import _ from 'lodash'
	import { ref, onMounted} from 'vue'
	const props = defineProps({
		params: {
			type: Object
		}
	})
	const list = ref([]);
	const page = ref(1);
		
	onMounted(()=>{
		getData()
	})
	function getData(){
		index(props.params.query).then(res=>{
			list.value = res.data.data;
		})
	}
</script>
<style lang="less" scoped>
.list{
	column-gap: 10px;	
	column-count:3;
	box-sizing: border-box;
	.item{
		overflow: hidden;
		break-inside: avoid;
		margin-bottom: 10px;
		padding-bottom: 5px;
		border-radius: 5px;
		background-color: #ffffff;
		.goods-image{
		   width: 100%;
       height: 150px;
       border-radius: 10px;
	    }
		.title-box{
			box-sizing: border-box;
			padding-left: 10px;
			padding-right: 10px;
      .title,.subtitle{
        white-space: nowrap;
        text-overflow: ellipsis;
      }
			.title{
				font-size: 12px;
			}
			.subtitle{
				font-size: 10px;
				color: #b1b1b1;
			}
		}
	}
	
}

</style>
