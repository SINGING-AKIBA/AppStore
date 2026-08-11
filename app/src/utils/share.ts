// 定义分享数据接口
interface ShareData {
  title: string;
  content: string;
  imageUrl?: string;
  path: string;
}
// 获取当前页面路径和参数
const getPagePath = async (): Promise<string> => {
  let path = '/pages/index/index';
  const user = {user_id:1,schools_id:1,teams_id:1};
  
  const currentPage = pages[pages.length - 1];
  path = currentPage.route || path;
  
  const opt = (currentPage as any).options || {};
  const params = { ...opt,shools:user.schools_id,teams:user.teams_id};
  console.log(params);

  
  const queryString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
    
  if (queryString) {
    path = `${path}?${queryString}`;
  }
  return path;
};

// 分享 mixin
export const shareMixin = {
  data() {
    return {
      appShare: {
        title: '',
        content: '',
        path: '/pages/index/index',
      } as ShareData
    };
  },
  
  async onShareAppMessage(): Promise<ShareData> {
    return {
      //@ts-ignore
      ...this.appShare,
      path: await getPagePath()
    };
  },
  
  async onShareTimeline(): Promise<ShareData> {
    return {
      //@ts-ignore
      ...this.appShare,
      path: await getPagePath()
    };
  }
};

export default shareMixin;