export default {
    plugins: {
      // 使用 postcss-preset-env 来支持最新的 CSS 特性
      'postcss-preset-env': {
        // 设置目标浏览器版本，也可以是类似 "last 2 versions" 的字符串
        browsers: ['> 0.5%', 'last 2 versions'],
        // 启用 stage 2+ 的特性（包括未来的 CSS 规范）
        stage: 2,
        // 确保所有功能都已加载，即使它们默认被禁用
        features: {
          'custom-properties': false, // 如果不需要自定义属性转换，可以禁用以提高性能
        },
      },
  
      // 使用 Autoprefixer 自动添加前缀
      'autoprefixer': {},
  
      // 在生产环境中使用 cssnano 进行压缩和优化
      'cssnano': process.env.NODE_ENV === 'production' ? {
        preset: 'default',
      } : false,
    }
  };