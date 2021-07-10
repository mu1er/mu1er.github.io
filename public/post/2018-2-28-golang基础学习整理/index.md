# Golang基础学习整理


1. `iota` iota是golang的一个关键字，此关键字用来声明enum的时候采用，默认从0开始，每遇到一个类似const就会重置为0。
2. 通过开头字母大小写来实现变量和函数的公有私有。例:
```go
//共有
var Name string
//私有
var name string
```
<!--more-->
3. 将数组作为函数参数进行传递时，实际传入的是该数组的副本。
4. 由于初始化数组时无法预知定义多大的空间，就需要使用类似动态数组的结构，go语言中采用`slice`来实现数组的切片，类似**python**中的切片，
`slice`是一个引用类型，它总是指向一个底层的**array**，`slice`的声明类似**array**，只是不需要长度。当引用改变其中的元素时，其他所有的引用也会相应改变。
常用内置函数: **len**获取长度，**cap**获取容量，**append**追加元素，并返回一个和`slice`一样类型的`slice`，**copy**函数从源`slice`的**src**中复制元素到目标dst，并且返回复制的元素个数。
5. map类似python中的字典，格式为map[keyType]valueType。map无序，必须通过key去获取。长度不固定，是一种引用类型。len函数
map不是安全的，在多个goroutine中使用时必须使用mutex lock
6. make用于内建类型（map，slice，channel）的内存分配。new用于各种类型的内存分配。
7. go中`switch`默认相当于每个`case`后面都加了`break`。但是可以通过加`fallthrough`强制执行后后面的代码。
8. `main`函数和`init`函数，在定义时不能有任何参数和返回值。
9. 导入包时加前缀_是为了引入该包，而不直接使用包里面的函数，只是调用包中的init函数。
10. `interface`是一组method签名的集合，可以通过`interface`来定义对象的一组行为。若某个对象实现了某个接口的所有方法，那么这个对象就实现了此接口。如果定义一个interface的变量，那么这个变量里面可以存实现这个interface的任意类型的对象。空interface可以存储任何类型的数值。
element.(type)只能在switch中使用，其他地方不能使用。
11. golang中的反射机制，就是能够检查程序在运行时的状态。



### 函数声明
func 函数名(参数列表)(返回值列表){
//函数体
}
##### 变量声明
- var 变量名 类型 = 表达式(类型和表达式可以省略其中一个)
- 多个变量声明: 
var (
变量名 类型
变量名 类型
)
##### 赋值
变量 = 表达式
`_`可以丢弃不需要的值
##### 常量
const 常量名 = 表达式
const(
常量名 类型
常量名 类型
)
批量声明的常量，除第一个外其它的常量的右边的初始化表达式都可以省略，默认使用前面常量的初始化表达式写法
`iota`常用语定义枚举值
> 总结:var 声明变量，const声明常量。声明时可以带类型。也可以不带类型，通过右推断.

##### 位运算
- `&` 位与and (左侧和右侧都为1，则为1；否则为0)
- `|` 位或 or(左侧或右侧只要有一个为1，结果为1；都为0结果才为0)
- `^` 位异或 xor (相同为0，不同为1)
- `&^` 位清空and not(右侧是0，左侧数不变;右侧是1，则左侧数清零)
- `<<` 左移
- `>>` 右移
##### 指针
var 变量名 `*类型`
```
eg:var ptr [MAX]*int    //指向数组的指针
/*
默认值 nil,没有NULL值
"&"取变量地址,“*”通过指针访问目标对象
不能对指针做加减乘除运算
不存在函数的指针
*/
var ptr *[3]int      //数组指针,保存了一个数组地址
var ptr [3]*int      //指针数组,每元素都是指针
```
##### type自定义类型
type 类型名字 底层类型
##### Switch
只有在case中明确添加**fallthrough**关键字，才会继续执行下一个case
不带条件表达式的`Switch`与**if...else**相同，遇到`false`停止
##### 数组
```go
var 数组名 [长度]类型
```
###### 数组切片
```go
var 数组切片 []类型      //声明无需定义长度
```
直接创建切片
```go
make([]Type,len[,cap])
```
切片可遍历，可修改，不可比较
```go
slice.copy(slice1,slice2)    //slice2赋值给slice1
```go
  包       功能
`strings`  提供了字符串查询、替换、比较、截断、拆分和合并等功能。
`bytes`    提供了很多与strings包类似的功能。因为字符串是只读的，逐步构建字符串会导致很多分配和复制，这种情况下，使用bytes.Buffer类型将会更有效。
`strconv`  提供了布尔类型、整数、浮点数和对应字符串的相互转换，还提供了双引号转义相关的转换。
`unicode`  提供了IsDigit、IsLetter、IsUpper和IsLower等功能，用于给字符分类。
##### 映射
声明:var 映射名称 map[键]值
只是声明一个map，它的初始值是nil，也就是没有引用任何哈希表。所以不能向一个nil值的map存入元素
创建:
```go
make(map[string]int)
make(map[string]int,100)  //初始存储能力100
make(map[string]int{"key":value,"key":value})
//添加
Map["key"]=value
//删除
delete(map,"key")
//查看是否存在此key
if v,ok := Map[key];!ok{
not key
}
```
##### 函数
func 函数名([形参列表])[返回值列表]{
//函数体
}
###### 可变参数
可接收任意数量的该类型参数
func Sum(vals ...int)int{
//函数体
}
###### 错误处理
func Foo(参数列表)(res list,err error){
//...
}
`defer`通常用于 **open/close**, **connect/disconnect**, **lock/unlock** 等这些成对的操作, 来保证在任何情况下资源都被正确释放
##### 结构体
```go
type 类型名称 struct{
//成员列表
}
```
###### 方法
```go
func  (变量名 类型)方法名称( [形参列表] ) [返回值列表]{
  // 方法体
}
```
###### 接口 `interface`
一个类型如果拥有一个接口需要的所有方法，那么这个类型就实现了这个接口。

