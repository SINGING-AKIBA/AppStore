<template>
  <div class="actions">
    <template v-if="showEdit" v-permission="`${path}.edit`">
      <a-tooltip :title="$t('edit')">
        <a-button type="primary" size="small" @click="handleEdit">
          <EditOutlined />
        </a-button>
      </a-tooltip>
    </template>
    <template v-if="showDelete" v-permission="`${path}.delete`">
      <a-tooltip :title="$t('delete')">
        <a-button type="danger" size="small" @click="handleDelete">
          <DeleteOutlined />
        </a-button>
      </a-tooltip>
    </template>
    <template v-if="showView" v-permission="`${path}.detail`">
      <a-tooltip :title="$t('view')">
        <a-button type="default" size="small" @click="handleView">
          <ReadOutlined />
        </a-button>
      </a-tooltip>
    </template>

    <slot></slot>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
let path = route.name.split(".").slice(0, -1).join(".");

/**
 * record column text index
 */
const props = defineProps({
  data: {
    type: [Object, null],
    required: true,
  },
  edit: {
    type: Function,
  },
  delete: {
    type: Function,
  },
  view: {
    type: Function,
  },
  showEdit: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  showView: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["edit", "delete", "view"]);
const handleEdit = () => {
  if (props.edit) {
    props.edit(props.data);
    return;
  }
  emit("edit", props.data);
};
const handleDelete = () => {
  if (props.delete) {
    props.delete(props.data);
    return;
  }
  emit("delete", props.data);
};
const handleView = () => {
  if (props.view) {
    props.view(props.data);
    return;
  }
  emit("view", props.data);
  router.push({
    path: "detail",
    query: {
      id: props.data.id||0,
    },
  });
};
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>