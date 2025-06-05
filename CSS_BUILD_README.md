# CSS构建系统使用说明

本项目使用Gulp来构建组件库的CSS文件，支持多主题自动构建。

## 功能特性

- 🎨 **多主题支持**: 自动构建浅色(light)和深色(dark)主题
- 📦 **自动压缩**: 同时生成普通版本和压缩版本的CSS
- 🗺️ **Source Maps**: 生成source map文件便于调试
- 👀 **文件监听**: 支持监听文件变化自动重新构建
- 🔄 **智能切换**: 通过动态替换主题文件实现多主题构建

## 构建命令

### 安装依赖
```bash
npm install
```

### 构建CSS文件
```bash
# 构建所有主题的CSS文件
npm run build-css

# 构建并监听文件变化
npm run build-css-watch
```

### Gulp任务
```bash
# 清理输出目录
gulp clean

# 构建CSS
gulp buildCSS

# 监听文件变化
gulp watch

# 默认任务（清理+构建）
gulp
```

## 输出文件

构建完成后，会在 `dist/css/` 目录下生成以下文件：

```
dist/css/
├── style-light.css          # 浅色主题 - 普通版本
├── style-light.min.css      # 浅色主题 - 压缩版本  
├── style-light.css.map      # 浅色主题 - Source Map
├── style-dark.css           # 深色主题 - 普通版本
├── style-dark.min.css       # 深色主题 - 压缩版本
└── style-dark.css.map       # 深色主题 - Source Map
```

## 使用方式

### 在HTML中使用
```html
<!-- 浅色主题 -->
<link rel="stylesheet" href="dist/css/style-light.min.css">

<!-- 深色主题 -->
<link rel="stylesheet" href="dist/css/style-dark.min.css">
```

### 在Angular中使用
```typescript
// 在angular.json中配置
"styles": [
  "dist/css/style-light.css"
]

// 或者在组件中动态切换
@Component({
  template: `
    <div [attr.data-theme]="currentTheme">
      <!-- 组件内容 -->
    </div>
  `
})
export class AppComponent {
  currentTheme = 'light'; // 或 'dark'
  
  switchTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    // 动态加载对应的CSS文件
    this.loadThemeCSS(this.currentTheme);
  }
  
  private loadThemeCSS(theme: string) {
    const linkId = 'theme-css';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (link) {
      link.href = `dist/css/style-${theme}.min.css`;
    } else {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `dist/css/style-${theme}.min.css`;
      document.head.appendChild(link);
    }
  }
}
```

## 主题配置

### 添加新主题

1. 在 `projects/project/src/style/variables/` 目录下创建新的主题文件，如 `theme-custom.less`
2. 在 `gulpfile.js` 中的 `themes` 数组中添加新主题配置：

```javascript
const themes = [
  {
    name: 'light',
    import: './theme-light.less'
  },
  {
    name: 'dark', 
    import: './theme-dark.less'
  },
  {
    name: 'custom',
    import: './theme-custom.less'
  }
];
```

### 修改主题变量

直接编辑对应的主题文件：
- 浅色主题: `projects/project/src/style/variables/theme-light.less`
- 深色主题: `projects/project/src/style/variables/theme-dark.less`

修改后运行构建命令即可生成新的CSS文件。

## 文件结构

```
projects/project/src/style/
├── variables/
│   ├── index.less           # 变量入口文件（构建时动态修改）
│   ├── base.less           # 基础变量
│   ├── components.less     # 组件变量
│   ├── theme-light.less    # 浅色主题变量
│   └── theme-dark.less     # 深色主题变量
├── style.less              # 样式入口文件
├── button.less             # 按钮组件样式
├── cascader.less           # 级联选择器样式
└── ...                     # 其他组件样式
```

## 工作原理

1. **动态主题切换**: 构建时临时修改 `variables/index.less` 文件，替换主题导入
2. **Less编译**: 使用gulp-less将Less文件编译为CSS
3. **CSS优化**: 使用gulp-clean-css进行代码压缩和优化
4. **Source Map**: 生成source map文件便于开发调试
5. **文件恢复**: 构建完成后自动恢复原始的变量文件

## 注意事项

- 构建过程中会临时修改 `variables/index.less` 文件，但会在构建完成后自动恢复
- 如果构建过程中出现错误，系统会自动恢复原始文件
- 建议在修改样式文件时使用 `build-css-watch` 命令进行实时监听
- 新增组件样式时，记得在 `style.less` 中添加对应的 `@import` 语句

## 故障排除

### 构建失败
1. 检查Less语法是否正确
2. 确认所有变量都已定义
3. 检查文件路径是否正确

### 样式不生效
1. 确认CSS文件路径正确
2. 检查样式优先级
3. 使用浏览器开发者工具调试

### 主题切换问题
1. 确认主题文件存在
2. 检查变量定义是否完整
3. 验证构建输出是否正常 