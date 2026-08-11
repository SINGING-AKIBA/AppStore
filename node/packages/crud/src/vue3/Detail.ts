import { EOL } from "os";
import { parseName } from "../Utils";
export class Detail {
  /**
   * 通用字段展示项
   * @param {Object} field - 字段信息对象
   * @param {string|boolean} attrKey - 可选的属性键（用于关联数据）
   * @returns {string}
   */
  item(field, attrKey = '') {
    let value = `detailData.${field.tscName}`;
    if (field.form_type === 'date') {
      const formatMap = {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
        datetime: 'YYYY-MM-DD HH:mm:ss',
        timestamp: 'YYYY-MM-DD HH:mm:ss',
        int: 'YYYY-MM-DD HH:mm:ss'
      };
      const format = formatMap[field.type] || 'YYYY-MM-DD HH:mm:ss';

      // 特殊处理：非时间戳字段的 int 类型需 *1000 转为毫秒（dayjs 要求）
      const isIntNotTimestamp = field.type === 'int' &&
        !['create_time', 'update_time', 'create_at', 'update_at'].includes(field.tscName);
      const multiplier = isIntNotTimestamp ? '*1000' : '';

      value = `dayjs(detailData.${field.tscName}${multiplier}).format('${format}')`;
    } else if (field.commentParams) {
      // 枚举映射：如 {1: '男', 2: '女'}[value]
      const enumObj = JSON.stringify(field.commentParams);
      value = `${enumObj}[detailData.${field.tscName}]`;

    } else if (attrKey) {
      value = attrKey;
    }

    const indent8 = '        '; // 8 spaces
    return `${indent8}<a-descriptions-item label="${field.options.comment}">{{${value}}}</a-descriptions-item>\n`;
  }

  html(field, attrKey = '') {
    const indent8 = '        ';
    const content = `${indent8}<a-descriptions-item ><div v-html="detailData.${field.tscName}"></div></a-descriptions-item>`;
    return EOL + this.descriptions(content, field.options.comment, 20);
  }

  image(field, attrKey) {
    const indent8 = '        ';
    const image = field.tscType === 'string'
      ? `<a-image v-for="i in (detailData.${field.tscName} ? detailData.${field.tscName}.split(','):[])" :src="i" :key="i" />`
      : `<a-image :src="detailData?.${parseName(field.tscName, 1, false)}?.url" />`;
    const content = `${indent8}<a-descriptions-item ><div class='table-image'>${image}</div></a-descriptions-item>`;
    return EOL + this.descriptions(content, field.options.comment, 20);
  }

  video(field, attrKey) {
    const indent8 = '        ';
    const content = `${indent8}<a-descriptions-item ><video v-for="i in detailData.${attrKey} " width='240px' height='120px' controls :src="i.url||i" :key="i.url||i"></video></a-descriptions-item>`;
    return EOL + this.descriptions(content, field.options.comment, 20);
  }

  textarea(field, attrKey = '') {
    const indent8 = '        ';
    const content = `${indent8}<a-descriptions-item >{{detailData.${field.tscName}}}</a-descriptions-item>`;
    return EOL + this.descriptions(content, field.options.comment, 20);
  }

  switch(field) { return this.item(field); }
  checkbox(field) { return this.item(field); }
  select(field, append = '') { return this.item(field, append); }
  radio(field) { return this.item(field); }
  input(field) { return this.item(field); }
  date(field) { return this.item(field); }
  inputNumber(field) { return this.item(field); }

  /**
   * 包裹 descriptions 容器
   * @param {string} content - 内容
   * @param {string} name - 标题
   * @param {number} column - 列数
   * @returns {string}
   */
  descriptions(content, name = '基本信息', column = 4) {
    const indent6 = '      '; // 6 spaces
    return `${indent6}<a-descriptions title="${name}" :column="${column}">\n${content}\n${indent6}</a-descriptions>\n`;
  }

  /**
   * 用于 1对多 / 多对多 数据表格展示
   * @param {string} index - 关联表名（如 'users'）
   * @param {string} slot - 自定义插槽内容
   * @param {string} title - 表格标题
   * @returns {string}
   */
  table(index, slot = '', title = '') {
    const indent8 = '        ';
    let str = `${indent8}<a-descriptions-item><a-table :columns="${index}Columns" :dataSource="detailData.${index}" :scroll="{ x: 'max-content' }" ref="table" rowKey="id"><template #bodyCell="item">\n`;
    str += slot + EOL;
    str += `${indent8}</template></a-table></a-descriptions-item>\n`;
    return this.descriptions(str, title, 24);
  }
}