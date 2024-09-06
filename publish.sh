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

# 修改assets/js下的所有js文件名
for file in assets/js/*.js; do
    filename=$(basename "$file")
    if [[ $filename =~ ^(.+)\.[0-9]{14}\.js$ ]]; then
        base_name="${BASH_REMATCH[1]}"
        new_name=$(dirname "$file")/${base_name}.${timestamp}.js
    else
        base_name="${filename%.js}"
        new_name=$(dirname "$file")/${base_name}.${timestamp}.js
    fi
    mv "$file" "$new_name"
    sed -i "s|$filename|$(basename "$new_name")|g" index.html
done

# 添加修改后的文件到git
git add assets/js/*.js index.html

# 提交更改
git-auto push -m "$commit_message"

echo "文件已更新并提交，提交信息：$commit_message"