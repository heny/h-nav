#!/bin/bash

# 如果任何命令失败，立即退出脚本
set -e

# 检查是否提供了提交信息
if [ $# -eq 0 ]; then
    echo "请提供提交信息"
    exit 1
fi

# 获取提交信息
commit_message="$1"

# 获取当前时间戳
timestamp=$(date +%Y%m%d%H%M%S)

# 文件更新函数
update_file() {
    local file="$1"
    local ext="${file##*.}"
    filename=$(basename "$file")
    
    # 检查文件是否有变更
    if git diff --quiet "$file"; then
        echo "文件未变更，跳过: $file"
        return
    fi
    
    if [[ $filename =~ ^(.+)\.[0-9]{14}\.$ext$ ]]; then
        base_name="${BASH_REMATCH[1]}"
        new_name=$(dirname "$file")/${base_name}.${timestamp}.$ext
    else
        base_name="${filename%.$ext}"
        new_name=$(dirname "$file")/${base_name}.${timestamp}.$ext
    fi
    mv "$file" "$new_name" || { echo "移动文件失败: $file"; exit 1; }
    sed -i "s|$filename|$(basename "$new_name")|g" index.html || { echo "更新 index.html 失败"; exit 1; }
    echo "文件已更新: $file -> $new_name"
}

# 递归更新 assets 目录下的所有文件
update_assets() {
    local dir="$1"
    for file in "$dir"/*; do
        if [ -f "$file" ]; then
            update_file "$file"
        elif [ -d "$file" ]; then
            update_assets "$file"
        fi
    done
}

# 更新 assets 目录下的所有文件
update_assets "assets"

# 提交更改
git-auto push -m "$commit_message" || { echo "Git 提交失败"; exit 1; }

echo "文件已更新并提交，提交信息：$commit_message"