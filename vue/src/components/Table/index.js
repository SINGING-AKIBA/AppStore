import { defineComponent, ref, computed, onMounted, watch,h } from 'vue'
import T, { tableProps } from 'ant-design-vue/es/table/Table.js'
import { useRoute,useRouter } from 'vue-router'
import { Alert } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import {get} from 'lodash'

const STable = defineComponent({
  name: 's-table',
  props: Object.assign({}, tableProps(),{
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 15
    },
    showSizeChanger: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    showPagination: {
      type: [String, Boolean],
      default: true
    },
    pageURI: {
      type: Boolean,
      default: false
    },
    scroll: {
      type: [Boolean, Object],
      default: {x:true}
    }
  }),
  slots: Object,
  setup(props, { emit, slots,attrs }) {
    const localLoading = ref(false)
    const localDataSource = ref([])
    const localPagination = ref({})
    const selectedRows = ref([])
    const selectedRowKeys = ref([])
    const needTotalList = ref([])
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    /**
     * 初始化分页配置项
     */
    const initPagination = () => {
      const { page } = props.pageURI ? route.query : {}
      const localPageNum = props.pageURI && (page && parseInt(page)) || props.pageNum
      localPagination.value = ['auto', true].includes(props.showPagination) ? {
        current: localPageNum,
        pageSize: props.pageSize,
        showSizeChanger: props.showSizeChanger,
        onChange: (page,pageSize) => {
          loadData({current: page, pageSize: pageSize},{},{})
        },
        showTotal:total=>`共${total}条数据`
      } : false
    }

    // 加载数据方法
    const loadData = (pagination, filters, sorter) => {
      localLoading.value = true
      const parameter = {
        page: pagination?.current || localPagination.value.current || props.pageNum,
        pageSize: pagination?.pageSize || localPagination.value.pageSize || props.pageSize,
        ...(sorter?.field && { sortField: sorter.field }),
        ...(sorter?.order && { sortOrder: sorter.order }),
        ...filters
      }

      props.data(parameter).then(r => {
        // 删除数据后当前页面数据为空，自动跳转到前一页
        if (r.data.length === 0 && props.showPagination && localPagination.value.current > 1) {
          localPagination.value.current--
          loadData()
          return
        }
        localDataSource.value = r.data
        localPagination.value = {
          ...localPagination.value,
          current: r.current_page,
          total: r.total,
          pageSize: pagination?.pageSize || localPagination.value.pageSize
        }
        localLoading.value = false
      })
    }

    // 初始化总计列表
    const initTotalList = columns => {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    }

    // 更新选中项统计
    const updateSelect = (Keys, Rows) => {
      selectedRows.value = Rows
      selectedRowKeys.value = Keys
      needTotalList.value = needTotalList.value.map(item => ({
        ...item,
        total: selectedRows.reduce((sum, val) => {
          const total = sum + parseInt(get(val, item.dataIndex))
          return isNaN(total) ? 0 : total
        }, 0)
      }))
    }

    // 清空已选项
    const clearSelected = () => {
      if (props.rowSelection) {
        props.rowSelection.onChange([], [])
        updateSelect([], [])
      }
    }

    // 处理清空事件
    const renderClear = callback => {
      if (selectedRowKeys.value.length <= 0) return null;
      return h('a', {
        onClick: () => {
          callback();
          clearSelected();
        },
        style: "margin-left: 24px"
      }, t('Clear'));
    }

    // 渲染警报
    const renderAlert = () => {
      const needTotalItems = needTotalList.value.map(item => (
        h('span', { style: "margin-right: 12px" }, [
          `${item.title}${t('Total')} `,
          h('a', { style: "font-weight: 600" }, !item.customRender ? item.total : item.customRender(item.total))
        ])
      ));
    
      const clearItem = typeof props.alert.clear === 'boolean' && props.alert.clear ? (
        renderClear(clearSelected)
      ) : (props.alert !== null && typeof props.alert.clear === 'function') ? (
        renderClear(props.alert.clear)
      ) : null;
    
      return h(Alert, {
        closable: true,
        message: h('div', {}, [
          h('span', { style: "margin-right: 12px" }, [
            t('Selected'),
            h('a', { style: "font-weight: 600" }, selectedRows.value.length)
          ]),
          ...needTotalItems,
          clearItem
        ])
      });
    }

    const rowSelection = props.rowSelection ? computed(() =>{ return{
      ...props.rowSelection,
      selectedRowKeys: selectedRowKeys.value,
      selectedRows: selectedRows.value,
      onChange: (keys, rows) => {
        props.rowSelection.onChange && props.rowSelection.onChange(keys, rows)
        updateSelect(keys, rows)
      },
    }}) : null;

    // 监听分页变化
    watch(() => localPagination.value.current, val => {
      if (props.pageURI) {
        router.push({
          ...route,
          params: {
            ...route.params,
            pageNo: val
          }
        })
        selectedRowKeys.value = []
        selectedRows.value = []
      }
    })

    watch(() => props.pageNum, val => {
      localPagination.value.current = val
    })

    watch(() => props.pageSize, val => {
      localPagination.value.pageSize = val
    })

    watch(() => props.showSizeChanger, val => {
      localPagination.value.showSizeChanger = val
    })
    onMounted(() => {
      initPagination()
      needTotalList.value = initTotalList(props.columns)
      loadData()
    })

    const refresh = (bool = false) => {
      if (bool) {
        localPagination.value = {
          ...localPagination.value,
          current: 1,
          pageSize: props.pageSize
        }
      }
      loadData()
    }

    return {
      localLoading,
      localDataSource,
      localPagination,
      selectedRows,
      selectedRowKeys,
      needTotalList,
      renderAlert,
      refresh,
      props,
      rowSelection
    }
  },
  render() {
    const tableProps = {
      ...this.props,
      loading: this.localLoading,
      dataSource: this.localDataSource,
      pagination: this.localPagination,
      rowSelection: this.rowSelection
    };
    return h('div', { class: "table-wrapper" },[
      typeof this.props.alert === 'object' && this.props.alert !== null && this.props.alert.show && this.renderAlert(),
      h(T, tableProps, this.$slots)
    ]);
  },
  install(app, options){
    app.component('s-table', this)
  }
})

export default STable