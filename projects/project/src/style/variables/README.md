# 主题系统使用说明

## 目录结构

```
variables/
├── base.less              # 基础变量（非颜色）
├── theme-light.less       # 亮色主题
├── theme-dark.less        # 暗色主题
├── theme-switcher.less    # CSS变量主题切换器
├── components.less        # 组件变量
├── index.less             # 变量入口文件
└── README.md             # 使用说明
```

## ✅ 最新更新 (2024)

### 完成的颜色变量重构
1. **替换所有硬编码颜色值**：已将 `components.less` 和 `base.less` 中的所有硬编码颜色值（如 `#1890ff`、`rgba(0,0,0,0.1)` 等）替换为语义化的主题变量
2. **扩展颜色变量系统**：新增了60+个扩展颜色变量，覆盖各种使用场景：
   - 按钮波纹效果：`@color-button-ripple`
   - 开关组件：`@color-switch-bg`、`@color-switch-handle-shadow`
   - 下拉组件：`@color-select-empty-icon`、`@color-select-group-title-bg`
   - 弹窗组件：`@color-popover-title-border`、`@color-popover-arrow-shadow`
   - 菜单组件：`@color-menu-*` 系列变量
   - 表格组件：`@color-table-*` 系列变量
   - 时间组件：`@color-date-timer-*` 系列变量
   - 焦点状态：`@color-focus-primary`、`@color-focus-error`、`@color-focus-warning`
   - 阴影和边框：`@color-shadow-*`、`@color-border-*` 系列变量

3. **主题切换器更新**：更新 `theme-switcher.less` 文件，确保CSS变量包含所有新增的颜色变量

4. **完全语义化**：现在所有组件都使用语义化的颜色变量，支持完整的主题切换功能

### 受益的组件
- ✅ Button（按钮）
- ✅ Input（输入框）
- ✅ Select（选择器）
- ✅ Checkbox（复选框）
- ✅ Radio（单选框）
- ✅ Switch（开关）
- ✅ Modal（模态框）
- ✅ Drawer（抽屉）
- ✅ Message（消息）
- ✅ Tooltip（提示框）
- ✅ Popover（弹窗）
- ✅ Menu（菜单）
- ✅ Table（表格）
- ✅ Tabs（标签页）
- ✅ Tag（标签）
- ✅ Tree（树形控件）
- ✅ Cascader（级联选择器）
- ✅ DateTimer（日期时间选择器）
- ✅ DropMenu（下拉菜单）
- ✅ NumberInput（数字输入框）
- ✅ Segmented（分段器）
- ✅ Slider（滑块）
- ✅ TreeSelect（树选择器）

## 快速开始

### 方法一：静态主题切换（推荐用于构建时）

1. **使用亮色主题（默认）**
   ```less
   // index.less
   @import './base.less';
   @import './theme-light.less';  // 亮色主题
   @import './components.less';
   ```

2. **使用暗色主题**
   ```less
   // index.less
   @import './base.less';
   @import './theme-dark.less';   // 暗色主题
   @import './components.less';
   ```

### 方法二：动态主题切换（推荐用于运行时）

1. **引入CSS变量切换器**
   ```less
   @import './theme-switcher.less';
   ```

2. **JavaScript切换主题**
   ```javascript
   // 切换到暗色主题
   document.documentElement.setAttribute('data-theme', 'dark');
   // 或者
   document.body.classList.add('theme-dark');

   // 切换到亮色主题
   document.documentElement.removeAttribute('data-theme');
   // 或者
   document.body.classList.remove('theme-dark');
   ```

3. **React/Angular组件示例**
   ```typescript
   // Angular 示例
   export class ThemeSwitcherComponent {
     isDark = false;

     toggleTheme() {
       this.isDark = !this.isDark;
       if (this.isDark) {
         document.documentElement.setAttribute('data-theme', 'dark');
       } else {
         document.documentElement.removeAttribute('data-theme');
       }
     }
   }
   ```

## 主题变量说明

### 颜色系统

#### 主要颜色
- `@color-primary`: 主色调
- `@color-secondary`: 辅助色
- `@color-tertiary`: 第三色
- `@color-success`: 成功色
- `@color-warning`: 警告色
- `@color-danger`: 危险色
- `@color-error`: 错误色

#### 文本颜色
- `@color-text-primary`: 主要文本色
- `@color-text-secondary`: 次要文本色
- `@color-text-disabled`: 禁用文本色
- `@color-text-placeholder`: 占位符文本色

#### 背景色
- `@color-bg-base`: 基础背景色
- `@color-bg-light`: 浅色背景
- `@color-bg-container`: 容器背景
- `@color-bg-elevated`: 提升背景
- `@color-bg-disabled`: 禁用背景

#### 边框色
- `@color-border-base`: 基础边框色
- `@color-border-light`: 浅色边框
- `@color-border-secondary`: 次要边框色

#### 扩展颜色变量
- `@color-button-ripple`: 按钮波纹效果
- `@color-switch-bg`: 开关背景色
- `@color-focus-primary`: 主要焦点色
- `@color-shadow-light`: 浅色阴影
- `@color-hover-bg`: 悬停背景色
- ... 更多详见各主题文件

### 非颜色变量

#### 尺寸
- `@height-base`: 基础高度 (32px)
- `@height-lg`: 大尺寸高度 (40px)
- `@height-sm`: 小尺寸高度 (24px)
- `@height-xs`: 超小尺寸高度 (20px)

#### 圆角
- `@border-radius-base`: 基础圆角 (4px)
- `@border-radius-sm`: 小圆角 (2px)
- `@border-radius-lg`: 大圆角 (6px)

#### 间距
- `@spacing-xs`: 4px
- `@spacing-sm`: 8px
- `@spacing-md`: 16px
- `@spacing-lg`: 24px
- `@spacing-xl`: 32px

## 自定义主题

### 创建新主题

1. **复制现有主题文件**
   ```bash
   cp theme-light.less theme-custom.less
   ```

2. **修改颜色变量**
   ```less
   // theme-custom.less
   @color-primary: #your-color;
   @color-bg-base: #your-bg-color;
   // ... 其他颜色
   ```

3. **在index.less中引入**
   ```less
   @import './theme-custom.less';
   ```

### 主题设计原则

1. **对比度**: 确保文本与背景有足够的对比度
2. **一致性**: 保持颜色系统的逻辑一致性
3. **可访问性**: 遵循WCAG可访问性标准
4. **品牌色**: 主色调应该体现品牌特色

## 最佳实践

1. **使用语义化变量**: 优先使用 `@color-text-primary` 而不是具体的颜色值
2. **主题测试**: 在两种主题下都要测试组件的显示效果
3. **渐进增强**: 优先保证亮色主题的完整性，然后适配暗色主题
4. **性能考虑**: 大型应用建议使用静态主题切换，小型应用可以使用动态切换

## 待优化项目

### 文档组件
- `src/doc/` 目录下的组件示例文件仍使用硬编码颜色值
- 建议后续统一替换为主题变量以保持一致性

### 业务组件
- 部分业务组件可能仍存在硬编码颜色值
- 建议逐步迁移到主题变量系统

## 常见问题

### Q: 如何添加新的颜色变量？
A: 在主题文件中添加新变量，然后在components.less中使用。

### Q: 如何处理图片在暗色主题下的显示？
A: 可以使用CSS filter或者准备两套图片资源。

### Q: 主题切换时有闪烁怎么办？
A: 确保CSS变量的transition设置合理，避免初始加载时的主题跳跃。

## 参考资源

- [CSS自定义属性 (CSS变量)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--*)
- [Material Design 主题](https://material.io/design/color/the-color-system.html)
- [Ant Design 主题](https://ant.design/docs/react/customize-theme-cn) 