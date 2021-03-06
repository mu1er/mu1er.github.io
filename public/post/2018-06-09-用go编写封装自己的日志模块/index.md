# 用Go编写封装自己的日志模块



今天为大家带来一篇用Go如何封装自己的日志模块。orz~

既然是日志模块，第一步肯定是定义日志级别，不然什么消息都打印，对资源消耗很大。
这里使用`iota`常量计数器定义了四个级别,使用iota能简化定义，在定义枚举时很有用。
<!--more-->

```go
### 定义日志级别
const (
	LevelError = iota
	LevelWarning
	LevelInfo
	LevelDebug
)
//定义日志结构体
type logging struct {
	level int
	file  *os.File
}

//定义logging类型变量
var logFile logging
```
等级设置我们使用了一个函数.参数必须为`int`类型
```go
func setLevel(level int) {
	logFile.level = level
}
```
### 初始化
```go
//Logger类型表示一个活动状态的记录日志的对象，它会生成一行行的输出写入一个io.Writer接口。
//每一条日志操作会调用一次io.Writer接口的Write方法。Logger类型的对象可以被多个线程安全的同时使用，它会保证对io.Writer接口的顺序访问。
var loggerf *log.Logger
//初始化
func init() {
	//初始化级别为LevelDebug
	logFile.level = LevelDebug
	//这块直接 log.New
	//创建一个Logger。参数out设置日志信息写入的目的地。参数prefix会添加到生成的每一条日志前面。参数flag定义日志的属性(时间、文件等等)
	//`prefix`在这块留空，下面输出函数可以设置为级别,减少了代码的冗杂
	loggerf = log.New(os.Stdout, "", log.Llongfile|log.Ltime|log.Ldate)
}
```
### 输出函数定义
```go
//获取当前函数所在的路径，文件名和行号
// func CallerFunc() string {
// 	filename, file, line, ok := runtime.Caller(0)
// 	if !ok {
// 		return ""
// 	}
// 	return "FileName:" + runtime.FuncForPC(filename).Name() + " Path:" + file + " Line:" + strconv.Itoa(line)
// }
// 当时`info`级别想要输出文件名，路径，错误行号等用了上面的函数，结果周师傅说，`log`包里面有个New函数，里面可以直接定义上面需要的信息
//按照格式打印日志
func Debugf(format string, v ...interface{}) {
	if logFile.level >= LevelDebug {
		//log里的函数都自带有mutex
		//这里获取一次锁
		loggerf.Printf("[DEBUG] "+format, v...)
	}
}

//Infof
func Infof(format string, v ...interface{}) {
	if logFile.level >= LevelInfo {
		loggerf.Printf("[INFO] "+format, v...)
	}
}

//Warningf
func Warningf(format string, v ...interface{}) {
	if logFile.level >= LevelWarning {
		loggerf.Printf("[WARNING] "+format, v...)
	}
}

//Errorf
func Errorf(format string, v ...interface{}) {
	if logFile.level >= LevelError {
		loggerf.Printf("[ERROR] "+format, v...)
	}
}

//标准输出
//Println存在输出会换行
//这里采用Print输出方式
func Debug(v ...interface{}) {
	if logFile.level >= LevelDebug {
		loggerf.Print("[DEBUG] " + fmt.Sprintln(v...))
	}
}

//Info
func Info(v ...interface{}) {
	if logFile.level >= LevelInfo {
		loggerf.Print("[INFO] " + fmt.Sprintln(v...))
	}
}

//Warning
func Warning(v ...interface{}) {
	if logFile.level >= LevelWarning {
		loggerf.Print("[DEBUG] " + fmt.Sprintln(v...))
	}
}

//Error
func Error(v ...interface{}) {
	if logFile.level >= LevelError {
		loggerf.Print("[DEBUG] " + fmt.Sprintln(v...))
	}
}
```
### 输出到文件
```go
//获取当前程序所在的路径
func getwd() (string, error) {
	path, err := os.Getwd()
	if err != nil {
		return "", errors.New(fmt.Sprintln("Getwd Error:", err))
	}
	filepathstr := filepath.Join(path, "logs")
	err = os.MkdirAll(filepathstr, 0755)
	if err != nil {
		return "", errors.New(fmt.Sprintln("Create Dirs Error:", err))
	}
	return filepathstr, nil
}
//创建日志文件
//制定创建路径和日志名
func Init(path, logname string, level int) error {
	if path == "" {
		filePath, _ := getwd()
		filepathstr := filepath.Join(filePath, logname)
		logfile, err := os.Create(filepathstr)
		if err != nil {
			return errors.New(fmt.Sprintln("Create File Error:", err))
		}
		logFile.file = logfile
		setLevel(level)
	} else if logname == "" {
		filepathstr := path
		err := os.MkdirAll(filepathstr, 0644)
		if err != nil {
			return errors.New(fmt.Sprintln("Create Dirs Error:", err))
		}
		logname = filepath.Join(filepathstr, "logs.log")
		logfile, err := os.Create(logname)
		if err != nil {
			return errors.New(fmt.Sprintln("Create File Error:", err))
		}
		logFile.file = logfile
		setLevel(level)
	} else {
		filepathstr := path
		err := os.MkdirAll(filepathstr, 0644)
		if err != nil {
			return errors.New(fmt.Sprintln("Create Dirs Error:", err))
		}
		logname = filepath.Join(filepathstr, logname)
		logfile, err := os.Create(logname)
		if err != nil {
			return errors.New(fmt.Sprintln("Create File Error:", err))
		}
		logFile.file = logfile
		setLevel(level)
	}
	//log.Llongfile|log.Ltime|log.Ldata 返回文件信息，时间和代码信息不需要重新写函数获取
	//初始化一个*log.Logger
	loggerf = log.New(logFile.file, "", log.Llongfile|log.Ltime|log.Ldate)
	return nil
}
```

以上代码大家可以再整合或者再次封装，可能会更方便快捷。我这里只是提供了一个我自己在封装日志模块所考虑的地方与最后的思路.
[详细代码地址](https://github.com/auuunya/gomini/blob/master/logger)

