import { Repository } from "typeorm";
import { Provide, Inject } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Menu as MenuModel } from "@/app/common/model/Menu";
import type { Context } from "@midwayjs/koa";
import { CasbinEnforcerService } from '@midwayjs/casbin';

@Provide()
export class Menu extends Base {
  @InjectEntityModel(MenuModel)
  model: Repository<MenuModel>;
  @Inject()
  ctx: Context;
  @Inject()
  casbin: CasbinEnforcerService;
  protected selectFields:string[];
  protected filterWhere() {
    return {
      equal:['id'],
      in: ['id'],
    }
  }

  async index(params: any) {
    const list = await this.model.find({
      where: { status: 10, },
      order: { weigh: "asc" },
    });
    let menus;
    if (list.length > 0) {
      menus = await this.filterMenu(list);
      console.log(JSON.stringify(menus));
      menus = await this.treeData(menus);
      return params.list ? await this.listMenu(menus) : await this.formatMenu(menus);
    } else {
      return [];
    }
  }

  async filterMenu(mnus: MenuModel[]) {
    const user = this.ctx.user;
    if (user.is_super == 1) {
      return mnus;
    }
    const menus: MenuModel[] = [];
    for (const menu of mnus) {
      const path = menu.path.split('/').filter(Boolean);
      const controller = path[0].toLowerCase();
      const action = (path[1] || 'smile').toLowerCase();
      if (await this.casbin.enforce(user.username, controller, action)) {
        menus.push(menu);
      }
    }
    return menus;
  }

  //格式菜单
  async formatMenu(menus: any[]) {
    if (!menus || menus.length === 0) {
      return [];
    }
    return menus.map(menu => {
      const result = this.createRouter(menu);
      result['children'] = [];
      menu.children.map(child => {
        if (!result['redirect'] && child.show == 10 && child.type == 20) {
          result['redirect'] = child.path;
        }
        result['children'].push(this.createRouter(child));
        child.children.map(p => {
          result['children'].push(this.createRouter(p));
        })
      })
      return result;
    })
  }

  protected listMenu(menus: any[]) {
    if (!menus || menus.length === 0) {
      return [];
    }
    return menus.map(menu => {
      const result = this.createRouter(menu);
      result['children'] = [];
      menu.children.map(child => {
        if (!result['redirect'] && child.type == 20) {
          result['redirect'] = child.path;
        }
        const childMenu = this.createRouter(child);
        childMenu['permission'] = [];
        child.children.map(p => {
          childMenu['permission'].push(this.createRouter(p));
        })
        result['children'].push(childMenu);
      })
      return result;
    })


  }
  protected async treeData(menus: MenuModel[], rootId: number = 0) {
    if (!Array.isArray(menus) || menus.length === 0) return [];
    const tree = [];
    for (const m of menus) {
      if (Number(m.pid) == rootId) {
        m['children'] = await this.treeData(menus, m.id);
        tree.push(m);
      }
    }
    return tree;
  }

  public createRouter(param) {
    const name = param.path
      .replace(/^\/+|\/+$/g, '')
      .replace(/\//g, '.');

    const targetMap = {
      10: '',
      20: '_blank',
      30: '_top',
      40: '_parent'
    };

    return {
      path: param.path,
      name: name,
      component: param.pid === 0 ? 'RouteView' : '',
      id: param.id,
      weigh: param.weigh,
      type: param.type,
      status: param.status,
      meta: {
        title: param.title,
        icon: param.icon,
        target: targetMap[param.target] || '',
        show: param.show === 10
      }
    };
  }
  async delete(param: any){
    const menu = await this.model.findOne({where:{id: param.id}});
    const child = await this.model.count({where:{pid: menu.id}});
    if(child > 0){
      throw new Error('共有'+child+'个菜单请先删除子菜单');
    }
    const res = await this.model.delete(param.id);
    if(res.affected > 0){
      return true;
    }else{
      throw new Error('删除失败');
    }
  }
}
