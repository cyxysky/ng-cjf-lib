#!/bin/bash

# 检查components.less中未使用的变量

echo "🔍 检查 components.less 中未使用的变量..."
echo

COMPONENTS_FILE="projects/project/src/style/variables/components.less"
STYLE_DIR="projects/project/src/style"

# 创建临时文件存储结果
UNUSED_VARS_FILE="unused_variables.txt"
> $UNUSED_VARS_FILE

echo "📋 未使用的变量列表:"
echo "================================"

# 从components.less中提取所有变量名
grep -o "^@[a-z-]*[a-z]" $COMPONENTS_FILE | while read var; do
    # 检查变量是否在其他less文件中被使用
    usage_count=$(grep -r "$var" $STYLE_DIR --include="*.less" --exclude="components.less" | wc -l)
    
    if [ $usage_count -eq 0 ]; then
        # 获取变量的注释
        comment=$(grep "^$var:" $COMPONENTS_FILE | sed 's/.*\/\/ *//')
        echo "❌ $var // $comment"
        echo "$var // $comment" >> $UNUSED_VARS_FILE
    fi
done

echo
echo "📊 检查完成！未使用的变量已保存到 $UNUSED_VARS_FILE" 