import { BaseEntity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import dayjs from 'dayjs';

/**
 * 时间转换器
 */
export const transformerTime = {
    to(value) {
        return value ? dayjs(value).unix() : dayjs().unix();
    },
    from(value) {
        value = Math.max(0, value)
        return dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss');
    },
};

/**
 * Json转换器
 */
export const transformerJson = {
    to: value => value,
    from: value => {
        // 确保从数据库返回的是对象
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
        return value;
    },
};
export abstract class Base extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { comment: 'ID' })
    id: number;

    @Index()
    @Column({ transformer:transformerTime,unsigned: true, comment: '创建时间' })
    create_time: number;

    @Index()
    @Column({ transformer:transformerTime,unsigned:true, comment: '更新时间' })
    update_time: number;

    @Column({ comment: '删除时间',unique:true,default:0 })
    delete_time: number;
    
    @Column({ comment: '删除状态',unsigned:true,default:0,select:false })
    is_delete: number;
}