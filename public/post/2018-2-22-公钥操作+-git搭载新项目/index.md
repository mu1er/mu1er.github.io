# 公钥操作+ git搭载新项目


### 一.公钥操作： ###
1. 生成公钥

```bash
ssh-keygen -t rsa -C "ma1ive@qq.com"
```
2.查看公钥

```bash
cat ~/.ssh/id_rsa.pub
```
<!--more-->

### 二.git搭载新项目：

1.在服务器建立g该项目的git目录    
```bash
mkdir 项目名称
```
2.初始化该目录
```bash
git init --bare --shared
```
3.复制相似项目下的文件，至该项目下
```bash
.git clone git@git.wiapp.cn;
```
4.复制.gititnory


5.修改项目中的config.py,使项目名称保持一致


6.进入根目录下的/etc/lighttpd/conf-enabled/中，复制一个.conf 文件并进行修改	

7.删除该文件下的model文件夹，复制引用同一数据库下项目中的modle

8.更改权限

9.git add 该项目文件，后git add .ignory

10.进行端口匹配


