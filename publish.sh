#!/bin/bash

# 检查是否提供了提交信息
if [ $# -eq 0 ]; then
    echo "请提供提交信息"
    exit 1
fi

# 获取提交信息
commit_message="$1"

# 获取当前时间戳
timestamp=$(date +%Y%m%d%H%M%S)

# 更新 JS 文件
for file in assets/js/*.js; do
    update_file "$file" "js"
done

# 更新 CSS 文件
for file in assets/css/*.css; do
    update_file "$file" "css"
done

# 更新 SCSS 文件
for file in assets/scss/*.scss; do
    update_file "$file" "scss"
done

# 文件更新函数
update_file() {
    local file="$1"
    local ext="$2"
    filename=$(basename "$file")
    if [[ $filename =~ ^(.+)\.[0-9]{14}\.$ext$ ]]; then
        base_name="${BASH_REMATCH[1]}"
        new_name=$(dirname "$file")/${base_name}.${timestamp}.$ext
    else
        base_name="${filename%.$ext}"
        new_name=$(dirname "$file")/${base_name}.${timestamp}.$ext
    fi
    mv "$file" "$new_name"
    sed -i "s|$filename|$(basename "$new_name")|g" index.html
}

# 提交更改
git-auto push -m "$commit_message"

echo "文件已更新并提交，提交信息：$commit_message"