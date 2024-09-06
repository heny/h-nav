#!/bin/bash

# 获取当前时间戳
timestamp=$(date +%Y%m%d%H%M%S)

# 修改assets/js下的所有js文件名
for file in assets/js/*.js; do
    new_name=$(dirname "$file")/${timestamp}_$(basename "$file")
    mv "$file" "$new_name"
    sed -i "s|$(basename "$file")|$(basename "$new_name")|g" index.html
done

# 添加修改后的文件到git
git add assets/js/*.js index.html