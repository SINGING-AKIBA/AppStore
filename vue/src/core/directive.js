import { useUserStore } from '@/stores/user';

let cachedPermissions = null;
let cachedStore = null;
function getPermissionsFromStore() {
  const store = useUserStore();
  if (store !== cachedStore || cachedPermissions === null) {
    cachedStore = store;
    cachedPermissions = new Set(store.getPermissions.map(p => p.toLowerCase())); // 使用 Set 提升
  }
  return cachedPermissions;
}

function checkPermissionInternal(requiredPermissions) {
  const userPermissions = getPermissionsFromStore();
  return requiredPermissions.some(permission => userPermissions.has(permission));
}


function parsePermissions(arg) {
  if (!arg) {
    console.error('[Vue Permission Directive] Missing permission argument');
    return null;
  }

  let permissionsToCheck = [];
  if (typeof arg === 'string') {
    permissionsToCheck = arg.includes(',') ? arg.split(',').map(p => p.trim()) : [arg.trim()];
  } else if (Array.isArray(arg)) {
    permissionsToCheck = [...arg]; // 创建副本，避免意外修改原数组
  } else {
    console.error('[Vue Permission Directive] Permission argument must be a string, array of strings, or comma-separated string');
    return null;
  }

  return permissionsToCheck.map(p => p.toLowerCase()).filter(p => p);
}


function setElementVisibility(el, visible, originalDisplayStyle = '') {
  if (visible) {
    // 恢复元素原本的 display 样式，而不是简单地设为空字符串
    el.style.display = originalDisplayStyle;
  } else {
    // 保存原始 display 样式，以便恢复
    if (el.style.display !== 'none' && !el._originalDisplayStyle) {
      el._originalDisplayStyle = el.style.display;
    }
    el.style.display = 'none';
  }
}

const permission = {

  mounted(el, binding) {
    const permissionsToCheck = parsePermissions(binding.arg || binding.value);
    if (!permissionsToCheck) {
      setElementVisibility(el, false); // 参数无效时，隐藏元素
      return;
    }

    const hasPermission = checkPermissionInternal(permissionsToCheck);
    el._originalDisplayStyle = window.getComputedStyle ? window.getComputedStyle(el).display : '';
    setElementVisibility(el, hasPermission, el._originalDisplayStyle);
  },

  updated(el, binding) {
    const permissionsToCheck = parsePermissions(binding.arg || binding.value);
    if (!permissionsToCheck) {
      setElementVisibility(el, false);
      return;
    }

    const currentPermissions = el._currentPermissionSet;
    const newPermissionsSet = permissionsToCheck.join('|'); // 简单的字符串比较
    if (currentPermissions === newPermissionsSet) {
        return;
    }
    el._currentPermissionSet = newPermissionsSet; // 更新缓存的权限字符串

    const hasPermission = checkPermissionInternal(permissionsToCheck);
    setElementVisibility(el, hasPermission, el._originalDisplayStyle);
  },

  unmounted(el) {
    el._originalDisplayStyle = null;
    el._currentPermissionSet = null;

  }
};

export default permission;