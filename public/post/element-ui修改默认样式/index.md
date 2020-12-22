# Element UI修改默认样式




最新在修改一个用户中心，前台是用Vue+Nuxt+ElementUI写的，在修改过程中发现不管样式怎么写，加父标签，elementui加载都会使用它自己的样式，于是看了看代码，
在这里记录下我是怎么修改它的默认样式的。

<!--more-->


例如：这是一段Tabs选项卡组建的代码

```
<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>
```

它在编译后生成的代码
```
<div class="el-tabs el-tabs--top">
    <div class="el-tabs__header is-top">
        <div class="el-tabs__nav-wrap is-top">
            <div class="el-tabs__nav-scroll">
                <div role="tablist" class="el-tabs__nav is-top" style="transform: translateX(0px);">
                    ......
                </div>
            </div>
        </div>
    </div>
    <div class="el-tabs__content">
        ......
    </div>
</div>
```
然后打开页面，打开开发者工具，查看生成编译后的代码，它会带有一些默认`class`属性名，然后我们可以在**Chrome**调整它的样式，觉得可以了连带**class**属性名复制到组建里面的``<style></style>``里面,如果要修改相同的样式后面一定要加`!important`，不然它是不会重写这个样式的.
例如:
```
# 修改前
.el-tabs el-tabs--top{
    background:#eee;
}
# 修改后
.el-tabs el-tabs--top{
    border:1px solid #eee;     // 默认样式没有的属性
    background:#fff !important;
}
```
在网上还看到有人说关于`<style>`后面要不要加`scoped`这个属性，在官方看了一下这个属性是关于全局和局部渲染的选项，加了之后你组建的样式只会渲染你当前组建里面的样式，不加的话，其他地方也用到这个样式的话，会对你当前组建有一定的影响，当然如果你全局样式也改得和局部一样的话，那么影响是不存在的。

