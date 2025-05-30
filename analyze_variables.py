#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析components.less中定义的变量是否在对应的组件样式文件中被使用
"""

import os
import re
from collections import defaultdict

def read_file(file_path):
    """读取文件内容"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"读取文件失败: {file_path}, 错误: {e}")
        return ""

def extract_variables_from_components(components_file):
    """从components.less中提取所有变量定义"""
    content = read_file(components_file)
    variables = {}
    
    # 匹配变量定义的正则表达式
    pattern = r'^@([a-z-]+): ([^;]+);.*?//\s*(.*)$'
    
    for line in content.split('\n'):
        match = re.match(pattern, line.strip())
        if match:
            var_name, var_value, comment = match.groups()
            variables[f"@{var_name}"] = {
                'value': var_value.strip(),
                'comment': comment.strip(),
                'used': False
            }
    
    return variables

def find_variable_usage(style_directory, variables):
    """在样式文件中查找变量使用情况"""
    used_variables = set()
    
    # 遍历所有less文件
    for filename in os.listdir(style_directory):
        if filename.endswith('.less') and filename != 'components.less':
            file_path = os.path.join(style_directory, filename)
            content = read_file(file_path)
            
            # 查找变量使用
            for var_name in variables.keys():
                if var_name in content:
                    used_variables.add(var_name)
                    variables[var_name]['used'] = True
    
    return used_variables

def analyze_by_component_prefix(variables):
    """按组件前缀分析变量使用情况"""
    component_analysis = defaultdict(lambda: {'total': 0, 'used': 0, 'unused': []})
    
    for var_name, var_info in variables.items():
        # 提取组件前缀 (例如: @button-xxx -> button)
        match = re.match(r'^@([a-z-]+)-', var_name)
        if match:
            prefix = match.group(1)
            component_analysis[prefix]['total'] += 1
            
            if var_info['used']:
                component_analysis[prefix]['used'] += 1
            else:
                component_analysis[prefix]['unused'].append(var_name)
    
    return dict(component_analysis)

def main():
    # 文件路径
    base_path = "projects/project/src/style"
    components_file = os.path.join(base_path, "variables/components.less")
    style_directory = base_path
    
    print("🔍 开始分析 components.less 中的变量使用情况...\n")
    
    # 1. 提取所有变量定义
    print("📋 步骤1: 提取变量定义...")
    variables = extract_variables_from_components(components_file)
    print(f"   总共找到 {len(variables)} 个变量定义\n")
    
    # 2. 查找变量使用情况
    print("🔎 步骤2: 查找变量使用情况...")
    used_variables = find_variable_usage(style_directory, variables)
    print(f"   总共使用了 {len(used_variables)} 个变量\n")
    
    # 3. 按组件分析
    print("📊 步骤3: 按组件分析使用情况...")
    component_analysis = analyze_by_component_prefix(variables)
    
    # 4. 输出结果
    print("="*80)
    print("📈 变量使用情况分析报告")
    print("="*80)
    
    total_variables = len(variables)
    total_used = len(used_variables)
    total_unused = total_variables - total_used
    
    print(f"📊 总体统计:")
    print(f"   • 总变量数: {total_variables}")
    print(f"   • 已使用: {total_used} ({total_used/total_variables*100:.1f}%)")
    print(f"   • 未使用: {total_unused} ({total_unused/total_variables*100:.1f}%)")
    print()
    
    print("📋 按组件分类分析:")
    print("-" * 80)
    
    for component, stats in sorted(component_analysis.items()):
        used_count = stats['used']
        total_count = stats['total']
        unused_count = total_count - used_count
        usage_rate = used_count / total_count * 100 if total_count > 0 else 0
        
        print(f"🔸 {component.upper()}:")
        print(f"   总变量: {total_count} | 已使用: {used_count} | 未使用: {unused_count} | 使用率: {usage_rate:.1f}%")
        
        if stats['unused']:
            print(f"   未使用变量:")
            for var in stats['unused']:
                comment = variables[var]['comment']
                print(f"     • {var} // {comment}")
        print()
    
    # 5. 列出所有未使用的变量
    unused_vars = [var for var, info in variables.items() if not info['used']]
    if unused_vars:
        print("⚠️  所有未使用的变量列表:")
        print("-" * 80)
        for var in sorted(unused_vars):
            comment = variables[var]['comment']
            print(f"  {var} // {comment}")
    
    print("\n✅ 分析完成!")

if __name__ == "__main__":
    main() 