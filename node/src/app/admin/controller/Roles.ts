import { Get, Post, Inject, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { CasbinEnforcerService } from '@midwayjs/casbin';

@SmileController("/admin/roles", { tagName: "admin/角色管理" })
export class Roles extends Base {
    @Inject()
    casbin: CasbinEnforcerService;

    private readonly ADMIN_ROLE = 'admin';
    private readonly DEFAULT_ACTION = 'smile';

    /**
     * 获取所有角色列表
     */
    @Get("/get_all_roles")
    async get_all_roles() {
        let roles;
        if (this.ctx.user.is_super == 1) {
            roles = await this.casbin.getAllRoles();
        } else {
            roles = await this.casbin.getRolesForUser(this.getUserName());
        }
        this.success(roles);
    }

    /**
     * 获取指定角色的权限
     */
    @Post("/get_permissions_for_user")
    async get_permissions_for_user(@Body() body: any) {
        try {
            const { role_name } = body;
            if (!role_name) {
                return this.error("请选择角色");
            }
            const permissions = await this.casbin.getPermissionsForUser(role_name);
            this.success(permissions);
        } catch (error) {
            this.error("获取权限失败");
        }
    }

    /**
     * 添加新角色
     */
    @Post("/add")
    async add(@Body() body: any) {
        const name = body.name;
        const permissions = body.roles;
        // 参数验证
        if (!name || !name.trim()) {
            return this.error("请填写角色名称");
        }
        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return this.error("请至少选择一个权限");
        }
        await this.casbin.addRoleForUser(this.getUserName(), name);
        for (const perm of this.formatPermissions(permissions)) {
            const [resource, action] = perm;
            await this.casbin.addPolicy(name, resource, action);
        }

        return this.success('角色添加成功');
    }

    /**
     * 编辑角色
     */
    @Post("/edit")
    async edit(@Body() body: any) {
        const name = body.name;
        const permissions = body.roles;
        // 参数验证
        if (!name || !name.trim()) {
            return this.error("请提供角色名称");
        }
        if (!permissions || !Array.isArray(permissions)) {
            return this.error("请选择权限");
        }
        await this.casbin.deletePermissionsForUser(name);
        for (const perm of this.formatPermissions(permissions)) {
            const [resource, action] = perm;
            await this.casbin.addPolicy(name, resource, action);
        }
        return this.success('角色编辑成功');

    }

    /**
     * 删除角色
     */
    @Post("/delete")
    async delete(@Body() body: any) {
        const { name } = body;
        if (!name || !name.trim()) {
            return this.error("请选择要删除的角色");
        }
        const row = await this.casbin.deleteRoleForUser(this.getUserName(), name);
        return row ? this.success('角色删除成功') : this.error('角色删除失败');
    }

    /**
     * 格式化权限列表
     * 将 "controller/action" 格式的权限字符串转换为标准格式
     */
    private formatPermissions(permissions: string[]): [string, string][] {
        return permissions.map(perm => {
            if (perm.startsWith('/')) {
                perm = perm.substring(1);
            }
            let [resource, action] = perm.toLowerCase().split("/");
            if (action === '' || action === undefined) {
                action = this.DEFAULT_ACTION;
            }
            return [resource.trim(), action.trim()];
        });
    }

    protected getUserName() {
        return this.ctx.user.is_super == 1 ? this.ADMIN_ROLE : this.ctx.user.username;
    }
}