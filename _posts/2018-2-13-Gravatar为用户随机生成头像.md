---
layout: post
title: Gravatar为用户随机生成头像
categories: []
---

# What Is Gravatar?
[Gravatar](http://cn.gravatar.com/)是Globally Recognized Avatar的缩写,是gravatar推出的一项服务，意为“全球通用头像”。如果在Gravatar的服务器上放置了你自己的头像，那么在任何支持Gravatar的blog或者留言本上留言时，只要提供你与这个头像关联的email地址，就能够显示出你的Gravatar头像来。

### 例:
![](http://www.gravatar.com/avatar/11?s=256&d=identicon)
![](http://www.gravatar.com/avatar/13?s=256&d=monsterid)
![](http://www.gravatar.com/avatar/14?s=256&d=retro)


只需 HTTP 请求 `http://www.gravatar.com/avatar/{hash}?s=256&d=identicon`

+ `hash`: 一个随机数
+ `s` : 图片像素
+ `d` : 图片风格(当前可选:identicon、monsterid、wavatar、retro、robohash 等)
