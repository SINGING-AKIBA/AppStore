const { parseName } = require('../utils');
import { Column } from '../models/Column';
export class Form {
  /**
   * 生成 input 表单
   */
  input(field: Column, attrKey = '', type = 'text', min = '', max = '', before = '', after = '') {
    const minAttr = min ? `min="${min}"` : '';
    const maxAttr = max ? `max="${max}"` : '';
    const beforeAttr = before ? `addon-before="${before}"` : '';
    const afterAttr = after ? `addon-after="${after}"` : '';

    const input = `<a-input v-model:value="formData.${field.tscName}" placeholder="请输入${field.options.comment}" type="${type}" ${maxAttr} ${minAttr} ${afterAttr} ${beforeAttr} />`;
    return this.createFormItem(field, input);
  }

  inputNumber(field: Column, precision = 0, min = '', max = '', before = '', after = '') {
    const minAttr = min ? `min="${min}"` : '';
    const maxAttr = max ? `max="${max}"` : '';
    const beforeAttr = before ? `addon-before="${before}"` : '';
    const afterAttr = after ? `addon-after="${after}"` : '';
    const precisionStr = precision > 0 ? `precision="${precision}"` : '';

    const inputNumber = `<a-input-number v-model:value="formData.${field.tscName}" placeholder="请输入${field.options.comment}" ${precisionStr} ${maxAttr} ${minAttr} ${afterAttr} ${beforeAttr}/>`;
    return this.createFormItem(field, inputNumber);
  }

  /**
   * 生成 select 表单
   */
  select(field, attrKey = '', mode = 'default') {
    let option = '{&option&}';
    let defaultOption = '';
    let searchAttrs = '';
    let defaultValue = field.default;
    if (defaultValue && typeof defaultValue === 'string' && defaultValue.startsWith('() =>')) {
      const match = defaultValue.match(/() => (.*)/);
      if (match) {
        let val = match[2];
        if (val.startsWith('[')) {
          const arr = JSON.parse(val);
          defaultValue = mode === 'multiple' ? arr : arr[0];
        } else if (val.startsWith('"') && val.endsWith('"')) {
          defaultValue = val.slice(1, -1);
        } else {
          defaultValue = val;
        }
      }
    }
    if (field.commentParams) {
      option = '';
      for (const [k, v] of Object.entries(field.commentParams)) {
        const isInt = Number(k) > -1 ? ':' : '';
        option += `<a-select-option ${isInt}value="${k}">${v}</a-select-option>`;
      }
    } else {
      // 自动判断 multiple
      if (mode === 'default' && field.tscName.endsWith('s')) {
        mode = 'multiple';
      }
      if (mode !== 'multiple' && defaultValue != null) {
        defaultOption = `<a-select-option value="${defaultValue}">默认值</a-select-option>`;
      }
      let fun = field.tscName.replace(/_ids?$/, '');
      fun = parseName(fun, 1, false);
      searchAttrs = ':filter-option="false" show-search @search="' + fun + 'Search"';
    }

    const select = `<a-select v-model:value="formData.${field.tscName}" placeholder="请选择${field.options.comment}" mode="${mode}" allowClear ${searchAttrs}>${defaultOption}${option}</a-select>`;
    return this.createFormItem(field, select);
  }

  radio(field: Column, attrKey = '') {
    return this.select(field, attrKey, 'default');
  }

  checkbox(field: Column, attrKey = '') {
    return this.select(field, attrKey, 'multiple');
  }

  switch(field: Column, attrKey = '') {
    return this.select(field, attrKey);
  }

  /**
   * 生成 textarea 表单
   */
  textarea(field: Column, max = 65535) {
    const textarea = `<a-textarea v-model:value="formData.${field.tscName}" placeholder="请输入${field.options.comment}" />`;
    return this.createFormItem(field, textarea);
  }

  editor(field: Column) {
    const editor = `<ueditor v-model="formData.${field.tscName}" />`;
    return this.createFormItem(field, editor);
  }

  /**
   * 生成图片表单
   */
  image(field: Column, attrKey) {

    const multiple = this.getMultiple(field);
    let getUrl = '';
    if (field.tscType == 'string') {
      getUrl = "getUrl";
    }
    attrKey = this.createAttribute(field, attrKey);
    const image = `<select-image v-model="formData.${field.tscName}" ${multiple} ${getUrl} :defaultList="detailData && detailData.${attrKey} ? [detailData.${attrKey}] : []"/>`;
    return this.createFormItem(field, image);
  }

  protected getMultiple(field: Column) {
    return field.tscName.endsWith('s') ? 'multiple' : '';
  }
  protected createAttribute(field: Column, attrKey = '') {
    if (attrKey !== '') {
      return attrKey;
    }
    return parseName(field.tscName, 1, false);
  }

  video(field: Column, attrKey) {
    attrKey = this.createAttribute(field, attrKey);
    const multiple = this.getMultiple(field);
    const video = `<select-video v-model="formData.${field.tscName}" ${multiple} :defaultList="detailData && detailData.${attrKey} ? detailData.${attrKey} : []"/>`;
    return this.createFormItem(field, video);
  }

  date(field: Column) {
    let format = '';
    const type = field.type as string;

    if (type === 'date') {
      format = 'format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"';
    } else if (['datetime', 'timestamp'].includes(type)) {
      format = 'format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"';
    } else if (['int', 'bigint'].includes(type)) {
      format = 'format="YYYY-MM-DD" valueFormat="X"';
    } else if (type === 'time') {
      format = 'format="HH:mm:ss" valueFormat="HH:mm:ss"';
    } else if (type === 'year') {
      format = 'format="YYYY" valueFormat="YYYY"';
    }

    const date = `<a-date-picker v-model:value="formData.${field.tscName}" ${format} />`;
    return this.createFormItem(field, date);
  }

  createFormItem(field: Column, content) {
    let nameAttr;
    if (field.tscName.includes('.')) {
      const parts = field.tscName.split('.');
      nameAttr = `:name="['${parts[0]}', index, '${parts[1]}']"`;
    } else {
      nameAttr = `name="${field.tscName}"`;
    }

    const indent8 = '        '; // 8 spaces
    const indent10 = '          '; // 10 spaces

    return `${indent8}<a-form-item ${nameAttr} label="${field.options.comment}" {%rules%}>\n${indent10}${content}\n${indent8}</a-form-item>`;
  }

  createTabPane(title = '基本信息', index = 1) {
    const indent8 = '        ';
    return `${indent8}<a-tab-pane :key="${index}" tab="${title}"></a-tab-pane>\n`;
  }

  createTabPaneContent(content, index = 1) {
    const indent6 = '      ';
    return `${indent6}<div class="tab-pane-content" v-show="tabKey==${index}">\n${content}\n${indent6}</div>\n`;
  }
}