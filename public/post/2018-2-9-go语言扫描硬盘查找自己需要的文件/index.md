# Go语言扫描硬盘查找自己需要的文件


### 用到的包
[regexp](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/chapter02/02.4.html)
[os](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/chapter06/06.1.html)
[string](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/chapter02/02.1.html)
[strconv](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/chapter02/02.3.html)

<!--more-->
### 扫描路径函数

```go
func getFilelist(path string,re string){
	err:=filepath.Walk(path,func (path string,f os.FileInfo,err error) error {
		if (f==nil){return err}
		if f.IsDir(){return nil}
		fmt.Println(path)
		//正则匹配路径名和需要查找的文件名
		ok,_:=regexp.MatchString(re,path)
		if ok{
				list=append(list,path)
		}
		WriteFile(list)
		//for k,v:=range list{
		//	fmt.Println(k,"==> 查找路径:",v)
		//}
		return nil
	})
	if err!=nil{
		fmt.Printf("filepath.Walk() returned %v\n",err)
	}
}
```

### 写入文件保存

```go
func WriteFile(file []string){
	//保存文件名
	filename:="./output.txt"
	//判断文件是否存在，存在即删除
	_,err := os.Stat(filename)
	if err == nil{
		os.Remove(filename)
	}
	//打开此文件
	fd,_:=os.OpenFile(filename,os.O_RDWR|os.O_CREATE|os.O_APPEND,0644)
	//循环值并且转换类型
	for k,v:=range file{
		content:=strings.Join([]string{strconv.Itoa(k),"==> 查找路径:",v,"\n"},"")
		buf:=[]byte(content)
		fd.Write(buf)
	}
	defer fd.Close()
}
```

### 入口函数

[flag包详解](https://books.studygolang.com/The-Golang-Standard-Library-by-Example/chapter13/13.1.html)
```go
func main(){
	flag.Parse()
	root,re:=flag.Arg(0),flag.Arg(1)
	getFilelist(root,re)
}
```

