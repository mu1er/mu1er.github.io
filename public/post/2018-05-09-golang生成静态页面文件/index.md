# Golang生成静态页面文件


最近要在dingo添加一个功能，就是一键导出文章静态页面，在网上搜了很多，也请教了很多人，不过碍于自己的技术太菜听不怎么太明白，后来搜到一片文章，借用此篇文章和自己的一些测试终究是完成了这个功能。
文章作者写的生成器git地址:[blog-generator](https://github.com/zupzup/blog-generator)
<!--more-->

### 定义要渲染的模板路径
```go
func getTemplate() (*template.Template, error) {
	path, err := os.Getwd()
	if err != nil {
		fmt.Errorf("Path is Error")
	}
    #使用filepath包把当前路径和模板路径拼接在一起
	templatePath := filepath.Join(path, "staticPost", "template.html")
	t := template.New("template.html")
	t, err = t.ParseFiles(templatePath)
	if err != nil {
		return nil, fmt.Errorf("error reading template %v", err)
	}
	return t, nil
}
```
上面代码定义好要渲染的模板，如果有模板函数可以在`template.New()`后面`Funcs`注入模板函数
### 根据文章名称保存
```go
func WriteIndexHTML(name string, post *model.Post) error {
	t, err := getTemplate()
	path, _ := os.Getwd()
    #当时想一次创建好，结果发现os.create不能创建目录，所以又用mkdirall创建好所需要的目录
	err = os.MkdirAll(filepath.Join(path, "staticPost", "PostsView", name), 0777)
	if err != nil {
		panic(err)
	}
    #根据文章名称保存到指定路径
	filePath := filepath.Join(path, "staticPost", "PostsView", name, "index.html")
	#创建文章
    f, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("error creating file %s: %v", filePath, err)
	}
	defer f.Close()
	w := bufio.NewWriter(f)
    #td 是我想要传送给前台需要渲染的文章参数
	td := map[string]interface{}{
		"Title":   post.Title,
		"Post":    post,
		"Content": post,
	}
	if err := t.Execute(w, td); err != nil {
		return fmt.Errorf("error executing template %s: %v", filePath, err)
	}
	if err := w.Flush(); err != nil {
		return fmt.Errorf("error writing file %s: %v", filePath, err)
	}
	return nil
}
```
当时看上面大佬的写的代码有些复杂，有很多细节都写到了。在这块我只是简单把需要用的代码抠出来再做一次简化，如果有兴趣可以去看看上面git，做这个功能在网上泡了好几天，一直没有头绪，看了代码之后也就1~2个小时就把90%写出来了。

