const gulp = require('gulp');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const fs = require('fs');
const path = require('path');

// 配置路径
const paths = {
    styles: {
        src: 'projects/project/src/style/style.less',
        variablesIndex: 'projects/project/src/style/variables/index.less',
        dest: 'dist/project/assets/css'
    }
};

// 主题配置
const themes = [
    {
        name: 'light',
        import: './theme-light.less'
    },
    {
        name: 'dark',
        import: './theme-dark.less'
    }
];

// 清理目标目录
function clean() {
    return del([paths.styles.dest]);
}

// 动态创建主题变量文件内容
function createThemeVariables(themeImport) {
    return `// ============================================================================
// 样式变量入口文件
// ============================================================================

// 导入基础变量（非颜色）
@import './base.less';

// ===== 主题切换 =====
// 当前主题: ${themeImport}
${themeImport}

// 导入组件变量
@import './components.less';
`;
}

// 为特定主题构建CSS
function buildThemeCSS(theme) {
    return new Promise((resolve, reject) => {
        // 读取原始variables/index.less文件
        const originalContent = fs.readFileSync(paths.styles.variablesIndex, 'utf8');

        // 创建主题特定的变量内容
        const themeContent = createThemeVariables(`@import '${theme.import}';`);

        // 临时写入主题变量文件
        fs.writeFileSync(paths.styles.variablesIndex, themeContent);

        // 构建CSS
        gulp.src(paths.styles.src)
            .pipe(sourcemaps.init())
            .pipe(less({
                paths: [path.join(__dirname, 'node_modules')]
            }))
            .on('error', (err) => {
                console.error(`Less compilation error for ${theme.name} theme:`, err.message);
                // 恢复原始文件
                fs.writeFileSync(paths.styles.variablesIndex, originalContent);
                reject(err);
            })
            .pipe(cleanCSS({
                level: 2,
                format: 'beautify'
            }))
            .pipe(rename(`${theme.name}.css`))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.styles.dest))
            .on('end', () => {
                // 恢复原始variables/index.less文件
                fs.writeFileSync(paths.styles.variablesIndex, originalContent);
                console.log(`✅ ${theme.name} theme CSS generated successfully`);
                resolve();
            })
            .on('error', (err) => {
                // 恢复原始文件
                fs.writeFileSync(paths.styles.variablesIndex, originalContent);
                reject(err);
            });
    });
}

// 构建压缩版CSS
function buildMinifiedCSS(theme) {
    return new Promise((resolve, reject) => {
        // 读取原始variables/index.less文件
        const originalContent = fs.readFileSync(paths.styles.variablesIndex, 'utf8');

        // 创建主题特定的变量内容
        const themeContent = createThemeVariables(`@import '${theme.import}';`);

        // 临时写入主题变量文件
        fs.writeFileSync(paths.styles.variablesIndex, themeContent);

        // 构建压缩CSS
        gulp.src(paths.styles.src)
            .pipe(less({
                paths: [path.join(__dirname, 'node_modules')]
            }))
            .on('error', (err) => {
                console.error(`Less compilation error for ${theme.name} theme (minified):`, err.message);
                // 恢复原始文件
                fs.writeFileSync(paths.styles.variablesIndex, originalContent);
                reject(err);
            })
            .pipe(cleanCSS({
                level: 2
            }))
            .pipe(rename(`${theme.name}.min.css`))
            .pipe(gulp.dest(paths.styles.dest))
            .on('end', () => {
                // 恢复原始variables/index.less文件
                fs.writeFileSync(paths.styles.variablesIndex, originalContent);
                console.log(`✅ ${theme.name} theme minified CSS generated successfully`);
                resolve();
            })
            .on('error', (err) => {
                // 恢复原始文件
                fs.writeFileSync(paths.styles.variablesIndex, originalContent);
                reject(err);
            });
    });
}

// 构建所有主题的CSS
async function buildCSS() {
    console.log('🚀 开始构建CSS文件...');

    // 检查目标目录是否存在，不存在则创建
    if (!fs.existsSync(paths.styles.dest)) {
        fs.mkdirSync(paths.styles.dest, { recursive: true });
    }

    // 依次构建每个主题
    for (const theme of themes) {
        console.log(`📦 正在构建 ${theme.name} 主题...`);

        try {
            // 构建普通版本
            await buildThemeCSS(theme);

            // 构建压缩版本
            await buildMinifiedCSS(theme);

        } catch (error) {
            console.error(`❌ 构建 ${theme.name} 主题失败:`, error.message);
            throw error;
        }
    }

    console.log('🎉 所有主题CSS构建完成！');
}

// 监听文件变化
function watchFiles() {
    console.log('👀 开始监听文件变化...');

    // 监听所有Less文件
    gulp.watch([
        'projects/project/src/style/**/*.less'
    ], gulp.series(clean, buildCSS));
}

// 导出任务
exports.clean = clean;
exports.buildCSS = buildCSS;
exports.watch = watchFiles;

// 默认任务
exports.default = gulp.series(clean, buildCSS);

// 构建并监听
exports['build-css'] = gulp.series(clean, buildCSS);
exports['build-css-watch'] = gulp.series(clean, buildCSS, watchFiles); 