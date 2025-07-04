# Go 语言完整学习指南

## 目录
1. [Go 语言简介](#go-语言简介)
2. [环境配置和安装](#环境配置和安装)
3. [Go 基础语法](#go-基础语法)
4. [数据类型](#数据类型)
5. [控制结构](#控制结构)
6. [函数](#函数)
7. [结构体和方法](#结构体和方法)
8. [接口](#接口)
9. [并发编程](#并发编程)
10. [包和模块](#包和模块)
11. [错误处理](#错误处理)
12. [文件操作](#文件操作)
13. [网络编程](#网络编程)
14. [Web开发](#web开发)
15. [数据库操作](#数据库操作)
16. [测试](#测试)
17. [性能优化](#性能优化)
18. [部署和运维](#部署和运维)
19. [最佳实践](#最佳实践)
20. [高级主题](#高级主题)

## Go 语言简介

### 什么是 Go？
Go（又称 Golang）是 Google 开发的开源编程语言，由 Robert Griesemer、Rob Pike 和 Ken Thompson 于 2009 年首次发布。

### Go 的特点
- **简洁性**：语法简单，易于学习
- **高效性**：编译速度快，运行效率高
- **并发性**：内置并发支持（goroutines）
- **可靠性**：强类型系统，垃圾回收
- **跨平台**：支持多种操作系统和架构

### Go 的应用领域
- 云计算和微服务
- 网络编程和分布式系统
- 区块链开发
- DevOps 工具
- 命令行工具
- Web 后端开发

## 环境配置和安装

### 1. Go 安装
```bash
# Windows
# 下载 .msi 安装包：https://golang.org/dl/

# macOS
brew install go

# Linux
wget https://golang.org/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

### 2. 环境变量配置
```bash
# 设置 GOPATH（可选，Go 1.11+ 支持模块）
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# 设置 Go 代理（加速下载）
export GOPROXY=https://goproxy.cn,direct
export GOSUMDB=sum.golang.google.cn
```

### 3. 验证安装
```bash
go version
go env
```

### 4. IDE 推荐
- **VS Code** + Go 插件
- **GoLand**（JetBrains）
- **Vim/Neovim** + vim-go
- **Emacs** + go-mode

## Go 基础语法

### 1. Hello World
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

### 2. 包声明
```go
// 每个 Go 文件都必须以 package 声明开始
package main // 可执行程序的入口包

// 其他包示例
package utils
package models
```

### 3. 导入包
```go
import "fmt"                    // 单个导入
import "os"

import (                        // 批量导入
    "fmt"
    "os"
    "strings"
)

import (
    "fmt"
    f "fmt"                     // 别名导入
    . "fmt"                     // 点导入（不推荐）
    _ "database/sql/driver"     // 匿名导入
)
```

### 4. 变量声明
```go
// 完整声明
var name string = "John"
var age int = 25

// 类型推断
var name = "John"
var age = 25

// 短变量声明（只能在函数内使用）
name := "John"
age := 25

// 多变量声明
var (
    name string = "John"
    age  int    = 25
    city string = "New York"
)

// 多变量赋值
name, age := "John", 25
```

### 5. 常量
```go
const Pi = 3.14159
const (
    Sunday = iota   // 0
    Monday          // 1 
    Tuesday         // 2
    Wednesday       // 3
    Thursday        // 4
    Friday          // 5
    Saturday        // 6
)

// 类型化常量
const MaxInt int = 1000
const Message string = "Hello"
```

### 6. 基本语法规则
- 语句结尾不需要分号
- 左花括号必须在同一行
- 变量名使用驼峰命名法
- 公共标识符首字母大写
- 私有标识符首字母小写

## 数据类型

### 1. 基础类型

#### 布尔类型
```go
var isActive bool = true
var isComplete bool = false

// 零值为 false
var flag bool // false
```

#### 数值类型
```go
// 整数类型
var i8 int8 = 127           // -128 到 127
var i16 int16 = 32767       // -32768 到 32767
var i32 int32 = 2147483647  // -2^31 到 2^31-1
var i64 int64 = 9223372036854775807 // -2^63 到 2^63-1

var ui8 uint8 = 255         // 0 到 255
var ui16 uint16 = 65535     // 0 到 65535
var ui32 uint32 = 4294967295 // 0 到 2^32-1
var ui64 uint64 = 18446744073709551615 // 0 到 2^64-1

// 平台相关类型
var i int = 42              // 32 或 64 位
var ui uint = 42            // 32 或 64 位
var ptr uintptr = 0         // 指针大小

// 浮点类型
var f32 float32 = 3.14      // IEEE-754 32位
var f64 float64 = 3.14159265359 // IEEE-754 64位

// 复数类型
var c64 complex64 = 1 + 2i
var c128 complex128 = 1 + 2i
```

#### 字符串类型
```go
var str string = "Hello, World!"
var multiLine string = `这是一个
多行字符串
支持换行`

// 字符串操作
str1 := "Hello"
str2 := "World"
result := str1 + ", " + str2    // 连接

// 字符串长度
length := len(str)              // 字节长度
runeCount := len([]rune(str))   // 字符长度（支持 Unicode）

// 字符串遍历
for i, char := range str {
    fmt.Printf("索引: %d, 字符: %c\n", i, char)
}
```

### 2. 复合类型

#### 数组
```go
// 声明和初始化
var arr1 [5]int                    // 零值数组
var arr2 = [5]int{1, 2, 3, 4, 5}  // 完整初始化
var arr3 = [...]int{1, 2, 3}      // 自动推断长度
var arr4 = [5]int{1, 2}           // 部分初始化，其余为零值

// 二维数组
var matrix [3][3]int = [3][3]int{
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9},
}

// 数组操作
arr := [5]int{1, 2, 3, 4, 5}
fmt.Println(len(arr))           // 长度
fmt.Println(arr[0])             // 访问元素
arr[0] = 10                     // 修改元素

// 数组遍历
for i := 0; i < len(arr); i++ {
    fmt.Println(arr[i])
}

for index, value := range arr {
    fmt.Printf("索引: %d, 值: %d\n", index, value)
}
```

#### 切片（Slice）
```go
// 创建切片
var slice1 []int                    // 零值切片（nil）
var slice2 = []int{1, 2, 3, 4, 5}  // 直接初始化
var slice3 = make([]int, 5)         // 长度为5，容量为5
var slice4 = make([]int, 5, 10)     // 长度为5，容量为10

// 从数组创建切片
arr := [5]int{1, 2, 3, 4, 5}
slice5 := arr[1:4]              // [2, 3, 4]
slice6 := arr[:3]               // [1, 2, 3]
slice7 := arr[2:]               // [3, 4, 5]
slice8 := arr[:]                // [1, 2, 3, 4, 5]

// 切片操作
slice := []int{1, 2, 3}
fmt.Println(len(slice))         // 长度
fmt.Println(cap(slice))         // 容量

// 添加元素
slice = append(slice, 4)        // [1, 2, 3, 4]
slice = append(slice, 5, 6, 7)  // [1, 2, 3, 4, 5, 6, 7]

// 切片合并
slice1 := []int{1, 2, 3}
slice2 := []int{4, 5, 6}
result := append(slice1, slice2...) // [1, 2, 3, 4, 5, 6]

// 复制切片
source := []int{1, 2, 3, 4, 5}
dest := make([]int, len(source))
copy(dest, source)

// 删除元素
slice := []int{1, 2, 3, 4, 5}
// 删除索引为2的元素
slice = append(slice[:2], slice[3:]...) // [1, 2, 4, 5]
```

#### 映射（Map）
```go
// 创建映射
var map1 map[string]int                    // 零值映射（nil）
var map2 = make(map[string]int)            // 空映射
var map3 = map[string]int{                 // 初始化映射
    "apple":  5,
    "banana": 3,
    "orange": 8,
}

// 映射操作
m := make(map[string]int)
m["key1"] = 10                  // 添加/修改
m["key2"] = 20

value := m["key1"]              // 获取值
value, ok := m["key1"]          // 获取值和存在性检查

delete(m, "key1")               // 删除键值对

// 遍历映射
for key, value := range m {
    fmt.Printf("键: %s, 值: %d\n", key, value)
}

// 只遍历键
for key := range m {
    fmt.Println("键:", key)
}

// 只遍历值
for _, value := range m {
    fmt.Println("值:", value)
}
```

#### 指针
```go
// 指针声明和使用
var x int = 42
var p *int = &x             // 获取 x 的地址

fmt.Println(*p)             // 解引用，输出 42
*p = 100                    // 通过指针修改值
fmt.Println(x)              // 输出 100

// 指针的零值是 nil
var ptr *int
if ptr == nil {
    fmt.Println("指针为 nil")
}

// new 函数
ptr = new(int)              // 分配内存，返回指针
*ptr = 42

// 指针数组和数组指针
arr := [3]int{1, 2, 3}
var ptrArr *[3]int = &arr   // 数组指针

var arrPtr [3]*int          // 指针数组
x, y, z := 1, 2, 3
arrPtr[0] = &x
arrPtr[1] = &y
arrPtr[2] = &z
```

## 控制结构

### 1. 条件语句

#### if 语句
```go
// 基本 if 语句
x := 10
if x > 5 {
    fmt.Println("x 大于 5")
}

// if-else 语句
if x > 10 {
    fmt.Println("x 大于 10")
} else {
    fmt.Println("x 不大于 10")
}

// if-else if-else 语句
if x > 15 {
    fmt.Println("x 大于 15")
} else if x > 10 {
    fmt.Println("x 大于 10 但不大于 15")
} else {
    fmt.Println("x 不大于 10")
}

// 带初始化语句的 if
if y := x * 2; y > 20 {
    fmt.Println("y 大于 20")
} // y 的作用域只在 if 块内
```

#### switch 语句
```go
// 基本 switch
day := "Monday"
switch day {
case "Monday":
    fmt.Println("星期一")
case "Tuesday":
    fmt.Println("星期二")
case "Wednesday", "Thursday", "Friday":
    fmt.Println("工作日")
default:
    fmt.Println("其他日期")
}

// 带表达式的 switch
score := 85
switch {
case score >= 90:
    fmt.Println("优秀")
case score >= 80:
    fmt.Println("良好")
case score >= 70:
    fmt.Println("中等")
default:
    fmt.Println("需要努力")
}

// 带初始化语句的 switch
switch x := 2; x {
case 1:
    fmt.Println("一")
case 2:
    fmt.Println("二")
    fallthrough  // 继续执行下一个 case
case 3:
    fmt.Println("三")
}

// 类型 switch
var i interface{} = "hello"
switch v := i.(type) {
case string:
    fmt.Printf("字符串: %s\n", v)
case int:
    fmt.Printf("整数: %d\n", v)
default:
    fmt.Printf("未知类型: %T\n", v)
}
```

### 2. 循环语句

#### for 循环
```go
// 基本 for 循环
for i := 0; i < 10; i++ {
    fmt.Println(i)
}

// 省略初始化语句
i := 0
for ; i < 10; i++ {
    fmt.Println(i)
}

// 省略后置语句
for i := 0; i < 10; {
    fmt.Println(i)
    i++
}

// 条件循环（类似 while）
i := 0
for i < 10 {
    fmt.Println(i)
    i++
}

// 无限循环
for {
    fmt.Println("无限循环")
    if someCondition {
        break
    }
}

// range 循环
// 数组/切片
slice := []int{1, 2, 3, 4, 5}
for index, value := range slice {
    fmt.Printf("索引: %d, 值: %d\n", index, value)
}

// 只要索引
for index := range slice {
    fmt.Printf("索引: %d\n", index)
}

// 只要值
for _, value := range slice {
    fmt.Printf("值: %d\n", value)
}

// 字符串
str := "Hello"
for index, char := range str {
    fmt.Printf("索引: %d, 字符: %c\n", index, char)
}

// 映射
m := map[string]int{"a": 1, "b": 2, "c": 3}
for key, value := range m {
    fmt.Printf("键: %s, 值: %d\n", key, value)
}

// 通道
ch := make(chan int, 3)
ch <- 1
ch <- 2
ch <- 3
close(ch)

for value := range ch {
    fmt.Printf("值: %d\n", value)
}
```

### 3. 跳转语句

#### break 和 continue
```go
// break 示例
for i := 0; i < 10; i++ {
    if i == 5 {
        break  // 跳出循环
    }
    fmt.Println(i)
}

// continue 示例
for i := 0; i < 10; i++ {
    if i%2 == 0 {
        continue  // 跳过当前迭代
    }
    fmt.Println(i)  // 只打印奇数
}

// 标签跳转
outer:
for i := 0; i < 3; i++ {
    for j := 0; j < 3; j++ {
        if i == 1 && j == 1 {
            break outer  // 跳出外层循环
        }
        fmt.Printf("i=%d, j=%d\n", i, j)
    }
}
```

#### goto 语句
```go
// goto 示例（谨慎使用）
func example() {
    i := 0
    
Loop:
    if i < 5 {
        fmt.Println(i)
        i++
        goto Loop
    }
    
    fmt.Println("结束")
}
```

## 函数

### 1. 函数定义和调用
```go
// 基本函数
func sayHello() {
    fmt.Println("Hello!")
}

// 带参数的函数
func greet(name string) {
    fmt.Println("Hello,", name)
}

// 带返回值的函数
func add(a, b int) int {
    return a + b
}

// 多个返回值
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("除数不能为零")
    }
    return a / b, nil
}

// 命名返回值
func rectangle(width, height float64) (area, perimeter float64) {
    area = width * height
    perimeter = 2 * (width + height)
    return  // 相当于 return area, perimeter
}

// 可变参数函数
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

// 调用示例
func main() {
    sayHello()
    greet("Alice")
    
    result := add(3, 5)
    fmt.Println(result)
    
    quotient, err := divide(10, 2)
    if err != nil {
        fmt.Println("错误:", err)
    } else {
        fmt.Println("商:", quotient)
    }
    
    area, perimeter := rectangle(5, 3)
    fmt.Printf("面积: %.2f, 周长: %.2f\n", area, perimeter)
    
    total := sum(1, 2, 3, 4, 5)
    fmt.Println("总和:", total)
    
    // 传递切片给可变参数函数
    numbers := []int{1, 2, 3, 4, 5}
    total = sum(numbers...)
    fmt.Println("总和:", total)
}
```

### 2. 函数类型和变量
```go
// 函数类型
type MathFunc func(int, int) int

// 函数变量
var operation MathFunc

func add(a, b int) int {
    return a + b
}

func multiply(a, b int) int {
    return a * b
}

func main() {
    operation = add
    result := operation(3, 4)  // 7
    
    operation = multiply
    result = operation(3, 4)   // 12
}
```

### 3. 匿名函数和闭包
```go
func main() {
    // 匿名函数
    func() {
        fmt.Println("这是一个匿名函数")
    }()
    
    // 匿名函数赋值给变量
    square := func(x int) int {
        return x * x
    }
    fmt.Println(square(5))  // 25
    
    // 闭包
    func adder() func(int) int {
        sum := 0
        return func(x int) int {
            sum += x
            return sum
        }
    }
    
    pos, neg := adder(), adder()
    fmt.Println(pos(1))   // 1
    fmt.Println(pos(2))   // 3
    fmt.Println(pos(3))   // 6
    fmt.Println(neg(-1))  // -1
    fmt.Println(neg(-2))  // -3
}
```

### 4. 递归函数
```go
// 阶乘
func factorial(n int) int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n-1)
}

// 斐波那契数列
func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

// 优化的斐波那契（使用记忆化）
func fibonacciMemo(n int, memo map[int]int) int {
    if n <= 1 {
        return n
    }
    
    if val, exists := memo[n]; exists {
        return val
    }
    
    memo[n] = fibonacciMemo(n-1, memo) + fibonacciMemo(n-2, memo)
    return memo[n]
}
```

### 5. defer 语句
```go
func main() {
    defer fmt.Println("1")  // 最后执行
    defer fmt.Println("2")  // 倒数第二执行
    defer fmt.Println("3")  // 倒数第三执行
    
    fmt.Println("正常执行")
    
    // 输出:
    // 正常执行
    // 3
    // 2
    // 1
}

// defer 的实际应用
func readFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()  // 确保文件被关闭
    
    // 读取文件内容
    data := make([]byte, 1024)
    _, err = file.Read(data)
    return err
}

// defer 与循环
func deferInLoop() {
    for i := 0; i < 5; i++ {
        defer fmt.Println(i)  // 注意：这里会打印 4,3,2,1,0
    }
}

// 正确的方式
func correctDeferInLoop() {
    for i := 0; i < 5; i++ {
        func(n int) {
            defer fmt.Println(n)
        }(i)
    }
}
```

### 6. panic 和 recover
```go
func main() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("捕获到 panic:", r)
        }
    }()
    
    fmt.Println("开始执行")
    causePanic()
    fmt.Println("这行不会执行")
}

func causePanic() {
    panic("发生了严重错误")
}

// 实际应用示例
func safeFunction() (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("函数执行失败: %v", r)
        }
    }()
    
    // 可能引发 panic 的代码
    riskyOperation()
    return nil
}

func riskyOperation() {
    // 模拟可能引发 panic 的操作
    slice := []int{1, 2, 3}
    _ = slice[10]  // 索引越界
}
```

## 结构体和方法

### 1. 结构体定义和使用
```go
// 基本结构体定义
type Person struct {
    Name string
    Age  int
    City string
}

// 结构体嵌套
type Address struct {
    Street   string
    City     string
    PostCode string
}

type Employee struct {
    Person           // 匿名嵌入
    Address          // 匿名嵌入
    ID       int
    Position string
    Salary   float64
}

// 带标签的结构体（用于JSON序列化等）
type User struct {
    ID       int    `json:"id" db:"user_id"`
    Name     string `json:"name" db:"user_name"`
    Email    string `json:"email" db:"email"`
    Password string `json:"-" db:"password"`  // JSON中忽略
}

func main() {
    // 结构体初始化
    // 方式1：按字段顺序
    p1 := Person{"Alice", 30, "New York"}
    
    // 方式2：指定字段名
    p2 := Person{
        Name: "Bob",
        Age:  25,
        City: "Los Angeles",
    }
    
    // 方式3：零值初始化
    var p3 Person
    p3.Name = "Charlie"
    p3.Age = 35
    
    // 方式4：使用 new
    p4 := new(Person)
    p4.Name = "David"
    
    // 方式5：返回指针
    p5 := &Person{
        Name: "Eve",
        Age:  28,
        City: "Chicago",
    }
    
    // 访问字段
    fmt.Println(p1.Name, p1.Age)
    fmt.Println(p5.Name, p5.Age)
    
    // 嵌套结构体
    emp := Employee{
        Person: Person{
            Name: "John",
            Age:  32,
            City: "Seattle",
        },
        Address: Address{
            Street:   "123 Main St",
            City:     "Seattle",
            PostCode: "98101",
        },
        ID:       1001,
        Position: "Software Engineer",
        Salary:   75000.0,
    }
    
    // 访问嵌套字段
    fmt.Println(emp.Name)          // 来自 Person
    fmt.Println(emp.Person.Name)   // 显式访问
    fmt.Println(emp.Address.City)
    fmt.Println(emp.Position)
}
```

### 2. 方法
```go
// 值接收者方法
func (p Person) GetInfo() string {
    return fmt.Sprintf("姓名: %s, 年龄: %d, 城市: %s", p.Name, p.Age, p.City)
}

// 值接收者方法（无法修改原始值）
func (p Person) SetAge(age int) {
    p.Age = age  // 这不会修改原始结构体
}

// 指针接收者方法（可以修改原始值）
func (p *Person) SetAgeCorrect(age int) {
    p.Age = age
}

// 指针接收者方法
func (p *Person) HaveBirthday() {
    p.Age++
}

// 更复杂的方法示例
type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

func (r Rectangle) String() string {
    return fmt.Sprintf("Rectangle(%.2f x %.2f)", r.Width, r.Height)
}

func main() {
    p := Person{Name: "Alice", Age: 30, City: "New York"}
    
    // 调用值接收者方法
    info := p.GetInfo()
    fmt.Println(info)
    
    // 调用指针接收者方法
    p.SetAgeCorrect(31)
    p.HaveBirthday()
    fmt.Println(p.Age)  // 32
    
    // 矩形示例
    rect := Rectangle{Width: 10, Height: 5}
    fmt.Println("面积:", rect.Area())
    fmt.Println("周长:", rect.Perimeter())
    fmt.Println(rect)  // 调用 String() 方法
    
    rect.Scale(2)
    fmt.Println("缩放后:", rect)
}
```

### 3. 构造函数
```go
// 构造函数模式
func NewPerson(name string, age int, city string) *Person {
    return &Person{
        Name: name,
        Age:  age,
        City: city,
    }
}

// 带验证的构造函数
func NewPersonWithValidation(name string, age int, city string) (*Person, error) {
    if name == "" {
        return nil, fmt.Errorf("姓名不能为空")
    }
    if age < 0 || age > 150 {
        return nil, fmt.Errorf("年龄必须在 0-150 之间")
    }
    
    return &Person{
        Name: name,
        Age:  age,
        City: city,
    }, nil
}

// 默认值构造函数
func NewPersonDefault() *Person {
    return &Person{
        Name: "Unknown",
        Age:  0,
        City: "Unknown",
    }
}

// 建造者模式
type PersonBuilder struct {
    person *Person
}

func NewPersonBuilder() *PersonBuilder {
    return &PersonBuilder{
        person: &Person{},
    }
}

func (pb *PersonBuilder) Name(name string) *PersonBuilder {
    pb.person.Name = name
    return pb
}

func (pb *PersonBuilder) Age(age int) *PersonBuilder {
    pb.person.Age = age
    return pb
}

func (pb *PersonBuilder) City(city string) *PersonBuilder {
    pb.person.City = city
    return pb
}

func (pb *PersonBuilder) Build() *Person {
    return pb.person
}

func main() {
    // 使用构造函数
    p1 := NewPerson("Alice", 30, "New York")
    
    p2, err := NewPersonWithValidation("Bob", 25, "Los Angeles")
    if err != nil {
        fmt.Println("错误:", err)
        return
    }
    
    // 使用建造者模式
    p3 := NewPersonBuilder().
        Name("Charlie").
        Age(35).
        City("Chicago").
        Build()
    
    fmt.Println(p1, p2, p3)
}
```

### 4. 组合和嵌入
```go
// 组合
type Engine struct {
    Power int
    Type  string
}

func (e Engine) Start() {
    fmt.Printf("%s 引擎启动，功率: %d HP\n", e.Type, e.Power)
}

type Car struct {
    Brand  string
    Model  string
    Engine Engine  // 组合
}

func (c Car) Start() {
    fmt.Printf("%s %s 正在启动...\n", c.Brand, c.Model)
    c.Engine.Start()
}

// 匿名嵌入（类似继承）
type Vehicle struct {
    Brand string
    Model string
    Year  int
}

func (v Vehicle) GetInfo() string {
    return fmt.Sprintf("%d %s %s", v.Year, v.Brand, v.Model)
}

type Car2 struct {
    Vehicle  // 匿名嵌入
    Doors   int
    FuelType string
}

func (c Car2) GetCarInfo() string {
    return fmt.Sprintf("%s, %d门, %s", c.GetInfo(), c.Doors, c.FuelType)
}

// 方法重写
func (c Car2) GetInfo() string {
    return fmt.Sprintf("汽车: %s", c.Vehicle.GetInfo())
}

func main() {
    // 组合示例
    car := Car{
        Brand: "Toyota",
        Model: "Camry",
        Engine: Engine{
            Power: 200,
            Type:  "汽油",
        },
    }
    car.Start()
    
    // 嵌入示例
    car2 := Car2{
        Vehicle: Vehicle{
            Brand: "Honda",
            Model: "Civic",
            Year:  2023,
        },
        Doors:    4,
        FuelType: "汽油",
    }
    
    fmt.Println(car2.GetCarInfo())
    fmt.Println(car2.Brand)  // 直接访问嵌入字段
}
```

## 接口

### 1. 接口定义和实现
```go
// 基本接口定义
type Writer interface {
    Write([]byte) (int, error)
}

type Reader interface {
    Read([]byte) (int, error)
}

// 接口组合
type ReadWriter interface {
    Reader
    Writer
}

// 实现接口
type File struct {
    name string
    data []byte
}

func (f *File) Write(data []byte) (int, error) {
    f.data = append(f.data, data...)
    return len(data), nil
}

func (f *File) Read(data []byte) (int, error) {
    if len(f.data) == 0 {
        return 0, fmt.Errorf("没有数据可读")
    }
    
    n := copy(data, f.data)
    f.data = f.data[n:]
    return n, nil
}

// 另一个实现
type Buffer struct {
    data []byte
}

func (b *Buffer) Write(data []byte) (int, error) {
    b.data = append(b.data, data...)
    return len(data), nil
}

func (b *Buffer) Read(data []byte) (int, error) {
    if len(b.data) == 0 {
        return 0, fmt.Errorf("缓冲区为空")
    }
    
    n := copy(data, b.data)
    b.data = b.data[n:]
    return n, nil
}

func main() {
    var w Writer
    var r Reader
    var rw ReadWriter
    
    file := &File{name: "test.txt"}
    buffer := &Buffer{}
    
    // 接口赋值
    w = file
    r = file
    rw = file
    
    w = buffer
    r = buffer
    rw = buffer
    
    // 使用接口
    writeData(w, []byte("Hello, World!"))
    
    data := make([]byte, 100)
    readData(r, data)
}

func writeData(w Writer, data []byte) {
    w.Write(data)
}

func readData(r Reader, data []byte) {
    r.Read(data)
}
```

### 2. 空接口
```go
// 空接口可以持有任何类型的值
func main() {
    var i interface{}
    
    i = 42
    fmt.Printf("值: %v, 类型: %T\n", i, i)
    
    i = "hello"
    fmt.Printf("值: %v, 类型: %T\n", i, i)
    
    i = []int{1, 2, 3}
    fmt.Printf("值: %v, 类型: %T\n", i, i)
    
    // 空接口切片
    slice := []interface{}{42, "hello", true, 3.14}
    for _, v := range slice {
        fmt.Printf("值: %v, 类型: %T\n", v, v)
    }
}

// 通用函数
func describe(i interface{}) {
    fmt.Printf("值: %v, 类型: %T\n", i, i)
}
```

### 3. 类型断言
```go
func main() {
    var i interface{} = "hello"
    
    // 类型断言
    s := i.(string)
    fmt.Println(s)
    
    // 安全的类型断言
    s, ok := i.(string)
    if ok {
        fmt.Println("字符串:", s)
    }
    
    // 断言失败示例
    n, ok := i.(int)
    if !ok {
        fmt.Println("不是整数")
    }
    
    // 类型开关
    checkType(42)
    checkType("hello")
    checkType(3.14)
    checkType([]int{1, 2, 3})
}

func checkType(i interface{}) {
    switch v := i.(type) {
    case int:
        fmt.Printf("整数: %d\n", v)
    case string:
        fmt.Printf("字符串: %s\n", v)
    case float64:
        fmt.Printf("浮点数: %.2f\n", v)
    case []int:
        fmt.Printf("整数切片: %v\n", v)
    default:
        fmt.Printf("未知类型: %T\n", v)
    }
}
```

### 4. 接口最佳实践
```go
// 小接口原则
type Stringer interface {
    String() string
}

type Error interface {
    Error() string
}

// 接受接口，返回结构体
func ProcessData(r Reader) *Result {
    // 处理逻辑
    return &Result{}
}

// 接口组合
type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}

type Closer interface {
    Close() error
}

// 接口适配器模式
type HandlerFunc func(string) string

func (f HandlerFunc) Handle(s string) string {
    return f(s)
}

type Handler interface {
    Handle(string) string
}

// 策略模式
type SortStrategy interface {
    Sort([]int) []int
}

type BubbleSort struct{}

func (bs BubbleSort) Sort(data []int) []int {
    // 冒泡排序实现
    return data
}

type QuickSort struct{}

func (qs QuickSort) Sort(data []int) []int {
    // 快速排序实现
    return data
}

type Sorter struct {
    strategy SortStrategy
}

func (s *Sorter) SetStrategy(strategy SortStrategy) {
    s.strategy = strategy
}

func (s *Sorter) Sort(data []int) []int {
    return s.strategy.Sort(data)
}
```

## 并发编程

### 1. Goroutines
```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 启动 goroutine
    go sayHello()
    go sayWorld()
    
    // 等待 goroutines 完成
    time.Sleep(2 * time.Second)
    
    // 匿名 goroutine
    go func() {
        fmt.Println("匿名 goroutine")
    }()
    
    // 带参数的 goroutine
    go func(name string) {
        fmt.Println("Hello,", name)
    }("Alice")
    
    time.Sleep(1 * time.Second)
}

func sayHello() {
    for i := 0; i < 5; i++ {
        fmt.Println("Hello")
        time.Sleep(100 * time.Millisecond)
    }
}

func sayWorld() {
    for i := 0; i < 5; i++ {
        fmt.Println("World")
        time.Sleep(100 * time.Millisecond)
    }
}
```

### 2. Channels（通道）
```go
// 基本通道操作
func main() {
    // 创建通道
    ch := make(chan int)
    
    // 启动 goroutine 发送数据
    go func() {
        ch <- 42  // 发送数据到通道
    }()
    
    // 接收数据
    value := <-ch
    fmt.Println("接收到:", value)
    
    // 带缓冲的通道
    bufferedCh := make(chan int, 3)
    bufferedCh <- 1
    bufferedCh <- 2
    bufferedCh <- 3
    
    fmt.Println(<-bufferedCh)  // 1
    fmt.Println(<-bufferedCh)  // 2
    fmt.Println(<-bufferedCh)  // 3
    
    // 关闭通道
    ch2 := make(chan int, 2)
    ch2 <- 1
    ch2 <- 2
    close(ch2)
    
    // 从关闭的通道读取
    for value := range ch2 {
        fmt.Println("从关闭的通道读取:", value)
    }
    
    // 检查通道是否关闭
    value, ok := <-ch2
    if !ok {
        fmt.Println("通道已关闭")
    }
}

// 生产者-消费者模式
func producer(ch chan<- int) {  // 只发送通道
    for i := 0; i < 10; i++ {
        ch <- i
        time.Sleep(100 * time.Millisecond)
    }
    close(ch)
}

func consumer(ch <-chan int) {  // 只接收通道
    for value := range ch {
        fmt.Println("消费:", value)
    }
}

func main() {
    ch := make(chan int, 5)
    
    go producer(ch)
    go consumer(ch)
    
    time.Sleep(2 * time.Second)
}
```

### 3. Select 语句
```go
func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)
    
    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "来自 ch1"
    }()
    
    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "来自 ch2"
    }()
    
    // select 语句
    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println("接收到", msg1)
        case msg2 := <-ch2:
            fmt.Println("接收到", msg2)
        case <-time.After(3 * time.Second):
            fmt.Println("超时")
            return
        }
    }
    
    // 非阻塞选择
    select {
    case <-ch1:
        fmt.Println("ch1 有数据")
    case <-ch2:
        fmt.Println("ch2 有数据")
    default:
        fmt.Println("没有数据可读")
    }
}

// 超时处理
func fetchData(timeout time.Duration) (string, error) {
    ch := make(chan string, 1)
    
    go func() {
        // 模拟耗时操作
        time.Sleep(2 * time.Second)
        ch <- "数据获取成功"
    }()
    
    select {
    case data := <-ch:
        return data, nil
    case <-time.After(timeout):
        return "", fmt.Errorf("获取数据超时")
    }
}
```

### 4. 同步原语

#### Mutex（互斥锁）
```go
import (
    "fmt"
    "sync"
    "time"
)

type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}

func main() {
    counter := &Counter{}
    
    // 启动多个 goroutines 同时递增
    for i := 0; i < 1000; i++ {
        go counter.Increment()
    }
    
    time.Sleep(1 * time.Second)
    fmt.Println("最终值:", counter.Value())
}
```

#### RWMutex（读写锁）
```go
type SafeMap struct {
    mu   sync.RWMutex
    data map[string]int
}

func NewSafeMap() *SafeMap {
    return &SafeMap{
        data: make(map[string]int),
    }
}

func (sm *SafeMap) Set(key string, value int) {
    sm.mu.Lock()
    defer sm.mu.Unlock()
    sm.data[key] = value
}

func (sm *SafeMap) Get(key string) (int, bool) {
    sm.mu.RLock()
    defer sm.mu.RUnlock()
    value, ok := sm.data[key]
    return value, ok
}

func (sm *SafeMap) Delete(key string) {
    sm.mu.Lock()
    defer sm.mu.Unlock()
    delete(sm.data, key)
}
```

#### WaitGroup
```go
func main() {
    var wg sync.WaitGroup
    
    // 启动多个 goroutines
    for i := 0; i < 5; i++ {
        wg.Add(1)  // 增加计数器
        go worker(i, &wg)
    }
    
    wg.Wait()  // 等待所有 goroutines 完成
    fmt.Println("所有工作完成")
}

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()  // 减少计数器
    
    fmt.Printf("工作者 %d 开始工作\n", id)
    time.Sleep(1 * time.Second)
    fmt.Printf("工作者 %d 完成工作\n", id)
}
```

#### Once
```go
import "sync"

var (
    instance *Singleton
    once     sync.Once
)

type Singleton struct {
    data string
}

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{data: "单例实例"}
    })
    return instance
}
```

### 5. 并发模式

#### 工作池模式
```go
func main() {
    const numWorkers = 3
    const numJobs = 10
    
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    
    // 启动工作者
    for i := 0; i < numWorkers; i++ {
        go worker(i, jobs, results)
    }
    
    // 发送任务
    for i := 0; i < numJobs; i++ {
        jobs <- i
    }
    close(jobs)
    
    // 收集结果
    for i := 0; i < numJobs; i++ {
        result := <-results
        fmt.Println("结果:", result)
    }
}

func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("工作者 %d 处理任务 %d\n", id, job)
        time.Sleep(500 * time.Millisecond)
        results <- job * 2
    }
}
```

#### 扇入扇出模式
```go
// 扇出：一个输入多个输出
func fanOut(input <-chan int, workers int) []<-chan int {
    outputs := make([]<-chan int, workers)
    
    for i := 0; i < workers; i++ {
        output := make(chan int)
        outputs[i] = output
        
        go func(out chan<- int) {
            defer close(out)
            for data := range input {
                out <- data * data  // 处理数据
            }
        }(output)
    }
    
    return outputs
}

// 扇入：多个输入一个输出
func fanIn(inputs ...<-chan int) <-chan int {
    output := make(chan int)
    var wg sync.WaitGroup
    
    for _, input := range inputs {
        wg.Add(1)
        go func(in <-chan int) {
            defer wg.Done()
            for data := range in {
                output <- data
            }
        }(input)
    }
    
    go func() {
        wg.Wait()
        close(output)
    }()
    
    return output
}
```

## 包和模块

### 1. 包的基本概念
```go
// 包声明
package mypackage

// 导出的标识符（首字母大写）
var PublicVar = "这是公共变量"
const PublicConst = 42

func PublicFunction() {
    fmt.Println("这是公共函数")
}

type PublicStruct struct {
    PublicField  string
    privateField string  // 私有字段
}

// 私有的标识符（首字母小写）
var privateVar = "这是私有变量"

func privateFunction() {
    fmt.Println("这是私有函数")
}
```

### 2. 包的初始化
```go
package main

import (
    "fmt"
    "math"
)

// 包级别变量
var packageVar = "包变量"

// init 函数（包初始化时自动调用）
func init() {
    fmt.Println("init 函数被调用")
    packageVar = "初始化后的包变量"
}

// 可以有多个 init 函数
func init() {
    fmt.Println("第二个 init 函数")
}

func main() {
    fmt.Println(packageVar)
    fmt.Println(math.Pi)
}
```

### 3. Go Modules
```bash
# 初始化模块
go mod init example.com/myproject

# 添加依赖
go get github.com/gorilla/mux
go get github.com/gorilla/mux@v1.8.0  # 指定版本

# 更新依赖
go get -u github.com/gorilla/mux

# 移除不需要的依赖
go mod tidy

# 下载依赖到本地缓存
go mod download

# 查看依赖
go list -m all

# 查看可用版本
go list -m -versions github.com/gorilla/mux
```

#### go.mod 文件示例
```go
module example.com/myproject

go 1.21

require (
    github.com/gorilla/mux v1.8.0
    github.com/go-sql-driver/mysql v1.7.0
)

require (
    github.com/gorilla/context v1.1.1 // indirect
)

replace example.com/oldpackage => example.com/newpackage v1.0.0
exclude example.com/badpackage v1.5.0
```

### 4. 创建自定义包
```go
// 文件: utils/string.go
package utils

import "strings"

// 字符串工具函数
func Capitalize(s string) string {
    if len(s) == 0 {
        return s
    }
    return strings.ToUpper(s[:1]) + strings.ToLower(s[1:])
}

func Reverse(s string) string {
    runes := []rune(s)
    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }
    return string(runes)
}

// 文件: utils/math.go
package utils

func Max(a, b int) int {
    if a > b {
        return a
    }
    return b
}

func Min(a, b int) int {
    if a < b {
        return a
    }
    return b
}

// 文件: main.go
package main

import (
    "fmt"
    "example.com/myproject/utils"
)

func main() {
    str := "hello world"
    fmt.Println(utils.Capitalize(str))
    fmt.Println(utils.Reverse(str))
    
    fmt.Println(utils.Max(10, 20))
    fmt.Println(utils.Min(10, 20))
}
```

## 错误处理

### 1. 基本错误处理
```go
import (
    "errors"
    "fmt"
)

// 函数返回错误
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("除数不能为零")
    }
    return a / b, nil
}

// 使用 fmt.Errorf 创建格式化错误
func validateAge(age int) error {
    if age < 0 {
        return fmt.Errorf("年龄不能为负数，得到: %d", age)
    }
    if age > 150 {
        return fmt.Errorf("年龄不能超过150，得到: %d", age)
    }
    return nil
}

func main() {
    // 处理错误
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("错误:", err)
        return
    }
    fmt.Println("结果:", result)
    
    // 检查具体错误
    if err := validateAge(-5); err != nil {
        fmt.Println("验证失败:", err)
    }
}
```

### 2. 自定义错误类型
```go
// 实现 error 接口
type ValidationError struct {
    Field   string
    Value   interface{}
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("验证错误 - 字段: %s, 值: %v, 消息: %s", 
        e.Field, e.Value, e.Message)
}

// 带错误代码的错误
type APIError struct {
    Code    int
    Message string
    Details map[string]interface{}
}

func (e APIError) Error() string {
    return fmt.Sprintf("API错误 [%d]: %s", e.Code, e.Message)
}

func (e APIError) StatusCode() int {
    return e.Code
}

// 使用自定义错误
func validateUser(name string, age int) error {
    if name == "" {
        return ValidationError{
            Field:   "name",
            Value:   name,
            Message: "姓名不能为空",
        }
    }
    
    if age < 0 {
        return ValidationError{
            Field:   "age",
            Value:   age,
            Message: "年龄不能为负数",
        }
    }
    
    return nil
}

func fetchUserData(userID int) (*User, error) {
    if userID <= 0 {
        return nil, APIError{
            Code:    400,
            Message: "无效的用户ID",
            Details: map[string]interface{}{
                "userID": userID,
                "min":    1,
            },
        }
    }
    
    // 模拟API调用失败
    return nil, APIError{
        Code:    404,
        Message: "用户不存在",
        Details: map[string]interface{}{
            "userID": userID,
        },
    }
}
```

### 3. 错误包装和解包
```go
import (
    "errors"
    "fmt"
)

// 错误包装
func processFile(filename string) error {
    err := readFile(filename)
    if err != nil {
        return fmt.Errorf("处理文件 %s 失败: %w", filename, err)
    }
    return nil
}

func readFile(filename string) error {
    // 模拟文件读取错误
    return errors.New("文件不存在")
}

func main() {
    err := processFile("test.txt")
    if err != nil {
        fmt.Println("错误:", err)
        
        // 错误解包
        var originalErr error
        if errors.As(err, &originalErr) {
            fmt.Println("原始错误:", originalErr)
        }
        
        // 检查是否包含特定错误
        if errors.Is(err, os.ErrNotExist) {
            fmt.Println("文件不存在")
        }
    }
}
```

### 4. 错误处理最佳实践
```go
// 错误处理函数
func handleError(err error, operation string) {
    if err == nil {
        return
    }
    
    log.Printf("操作 '%s' 失败: %v", operation, err)
    
    // 根据错误类型进行不同处理
    var apiErr APIError
    if errors.As(err, &apiErr) {
        // 处理API错误
        if apiErr.StatusCode() >= 500 {
            // 服务器错误，可能需要重试
            log.Printf("服务器错误，需要重试")
        }
    }
    
    var validationErr ValidationError
    if errors.As(err, &validationErr) {
        // 处理验证错误
        log.Printf("数据验证失败: %s", validationErr.Field)
    }
}

// 错误重试机制
func retryOperation(operation func() error, maxRetries int) error {
    var err error
    for i := 0; i < maxRetries; i++ {
        err = operation()
        if err == nil {
            return nil
        }
        
        // 指数退避
        time.Sleep(time.Duration(1<<i) * time.Second)
        log.Printf("重试 %d/%d: %v", i+1, maxRetries, err)
    }
    
    return fmt.Errorf("操作失败，已重试 %d 次: %w", maxRetries, err)
}

// 错误恢复
func safeOperation() (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("操作异常: %v", r)
        }
    }()
    
    // 可能引发 panic 的操作
    riskyOperation()
    return nil
}
```

## 文件操作

### 1. 基本文件操作
```go
import (
    "bufio"
    "fmt"
    "io"
    "os"
)

func main() {
    // 创建文件
    file, err := os.Create("test.txt")
    if err != nil {
        fmt.Println("创建文件失败:", err)
        return
    }
    defer file.Close()
    
    // 写入文件
    _, err = file.WriteString("Hello, World!\n")
    if err != nil {
        fmt.Println("写入文件失败:", err)
        return
    }
    
    // 读取文件
    content, err := os.ReadFile("test.txt")
    if err != nil {
        fmt.Println("读取文件失败:", err)
        return
    }
    fmt.Println("文件内容:", string(content))
    
    // 追加内容
    file, err = os.OpenFile("test.txt", os.O_APPEND|os.O_WRONLY, 0644)
    if err != nil {
        fmt.Println("打开文件失败:", err)
        return
    }
    defer file.Close()
    
    _, err = file.WriteString("追加的内容\n")
    if err != nil {
        fmt.Println("追加内容失败:", err)
        return
    }
}
```

### 2. 逐行读取文件
```go
func readFileLineByLine(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()
    
    scanner := bufio.NewScanner(file)
    lineNumber := 1
    
    for scanner.Scan() {
        line := scanner.Text()
        fmt.Printf("行 %d: %s\n", lineNumber, line)
        lineNumber++
    }
    
    return scanner.Err()
}

// 使用 bufio.Reader
func readWithBuffer(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()
    
    reader := bufio.NewReader(file)
    for {
        line, err := reader.ReadString('\n')
        if err != nil {
            if err == io.EOF {
                break
            }
            return err
        }
        fmt.Print(line)
    }
    
    return nil
}
```

### 3. 文件信息和目录操作
```go
import (
    "fmt"
    "os"
    "path/filepath"
    "time"
)

func fileOperations() {
    // 获取文件信息
    fileInfo, err := os.Stat("test.txt")
    if err != nil {
        fmt.Println("获取文件信息失败:", err)
        return
    }
    
    fmt.Println("文件名:", fileInfo.Name())
    fmt.Println("文件大小:", fileInfo.Size())
    fmt.Println("修改时间:", fileInfo.ModTime())
    fmt.Println("是否为目录:", fileInfo.IsDir())
    fmt.Println("文件权限:", fileInfo.Mode())
    
    // 检查文件是否存在
    if _, err := os.Stat("nonexistent.txt"); os.IsNotExist(err) {
        fmt.Println("文件不存在")
    }
    
    // 创建目录
    err = os.Mkdir("testdir", 0755)
    if err != nil {
        fmt.Println("创建目录失败:", err)
    }
    
    // 创建多级目录
    err = os.MkdirAll("path/to/deep/dir", 0755)
    if err != nil {
        fmt.Println("创建多级目录失败:", err)
    }
    
    // 删除文件
    err = os.Remove("test.txt")
    if err != nil {
        fmt.Println("删除文件失败:", err)
    }
    
    // 删除目录
    err = os.RemoveAll("path")
    if err != nil {
        fmt.Println("删除目录失败:", err)
    }
    
    // 重命名文件
    err = os.Rename("oldname.txt", "newname.txt")
    if err != nil {
        fmt.Println("重命名失败:", err)
    }
}

// 遍历目录
func walkDirectory(root string) {
    err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }
        
        if info.IsDir() {
            fmt.Printf("目录: %s\n", path)
        } else {
            fmt.Printf("文件: %s (大小: %d 字节)\n", path, info.Size())
        }
        
        return nil
    })
    
    if err != nil {
        fmt.Println("遍历目录失败:", err)
    }
}
```

### 4. JSON 和 CSV 处理
```go
import (
    "encoding/csv"
    "encoding/json"
    "fmt"
    "os"
)

type Person struct {
    Name  string `json:"name"`
    Age   int    `json:"age"`
    Email string `json:"email"`
}

// JSON 操作
func jsonOperations() {
    // 结构体转 JSON
    person := Person{
        Name:  "Alice",
        Age:   30,
        Email: "alice@example.com",
    }
    
    jsonData, err := json.MarshalIndent(person, "", "  ")
    if err != nil {
        fmt.Println("JSON 编码失败:", err)
        return
    }
    
    // 写入 JSON 文件
    err = os.WriteFile("person.json", jsonData, 0644)
    if err != nil {
        fmt.Println("写入 JSON 文件失败:", err)
        return
    }
    
    // 读取 JSON 文件
    data, err := os.ReadFile("person.json")
    if err != nil {
        fmt.Println("读取 JSON 文件失败:", err)
        return
    }
    
    // JSON 转结构体
    var loadedPerson Person
    err = json.Unmarshal(data, &loadedPerson)
    if err != nil {
        fmt.Println("JSON 解码失败:", err)
        return
    }
    
    fmt.Printf("加载的人员: %+v\n", loadedPerson)
}

// CSV 操作
func csvOperations() {
    // 写入 CSV
    file, err := os.Create("people.csv")
    if err != nil {
        fmt.Println("创建 CSV 文件失败:", err)
        return
    }
    defer file.Close()
    
    writer := csv.NewWriter(file)
    defer writer.Flush()
    
    // 写入标题行
    writer.Write([]string{"姓名", "年龄", "邮箱"})
    
    // 写入数据行
    people := []Person{
        {"Alice", 30, "alice@example.com"},
        {"Bob", 25, "bob@example.com"},
        {"Charlie", 35, "charlie@example.com"},
    }
    
    for _, person := range people {
        record := []string{
            person.Name,
            fmt.Sprintf("%d", person.Age),
            person.Email,
        }
        writer.Write(record)
    }
    
    // 读取 CSV
    file, err = os.Open("people.csv")
    if err != nil {
        fmt.Println("打开 CSV 文件失败:", err)
        return
    }
    defer file.Close()
    
    reader := csv.NewReader(file)
    records, err := reader.ReadAll()
    if err != nil {
        fmt.Println("读取 CSV 失败:", err)
        return
    }
    
    for i, record := range records {
        fmt.Printf("行 %d: %v\n", i+1, record)
    }
}
```

## 网络编程

### 1. HTTP 客户端
```go
import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

func httpClientExamples() {
    // GET 请求
    resp, err := http.Get("https://api.github.com/users/octocat")
    if err != nil {
        fmt.Println("GET 请求失败:", err)
        return
    }
    defer resp.Body.Close()
    
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("读取响应失败:", err)
        return
    }
    
    fmt.Println("响应状态:", resp.Status)
    fmt.Println("响应体:", string(body))
    
    // POST 请求
    postData := map[string]interface{}{
        "name":  "John Doe",
        "email": "john@example.com",
    }
    
    jsonData, _ := json.Marshal(postData)
    
    resp, err = http.Post(
        "https://httpbin.org/post",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        fmt.Println("POST 请求失败:", err)
        return
    }
    defer resp.Body.Close()
    
    // 自定义 HTTP 客户端
    client := &http.Client{
        Timeout: 10 * time.Second,
    }
    
    req, err := http.NewRequest("GET", "https://api.github.com/users/octocat", nil)
    if err != nil {
        fmt.Println("创建请求失败:", err)
        return
    }
    
    // 设置请求头
    req.Header.Set("User-Agent", "Go-HTTP-Client/1.0")
    req.Header.Set("Accept", "application/json")
    
    resp, err = client.Do(req)
    if err != nil {
        fmt.Println("发送请求失败:", err)
        return
    }
    defer resp.Body.Close()
}
```

### 2. HTTP 服务器
```go
import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strconv"
)

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    Email string `json:"email"`
}

var users = []User{
    {1, "Alice", "alice@example.com"},
    {2, "Bob", "bob@example.com"},
}

func main() {
    // 路由处理
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/users", usersHandler)
    http.HandleFunc("/users/", userHandler)
    
    // 静态文件服务
    http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))
    
    fmt.Println("服务器启动在 :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "欢迎来到我的 API!")
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case "GET":
        // 获取所有用户
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(users)
    
    case "POST":
        // 创建新用户
        var newUser User
        if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
            http.Error(w, "无效的 JSON", http.StatusBadRequest)
            return
        }
        
        newUser.ID = len(users) + 1
        users = append(users, newUser)
        
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(newUser)
    
    default:
        http.Error(w, "方法不被允许", http.StatusMethodNotAllowed)
    }
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    // 提取用户 ID
    idStr := r.URL.Path[len("/users/"):]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "无效的用户 ID", http.StatusBadRequest)
        return
    }
    
    // 查找用户
    for _, user := range users {
        if user.ID == id {
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(user)
            return
        }
    }
    
    http.Error(w, "用户不存在", http.StatusNotFound)
}
```

### 3. 中间件
```go
// 日志中间件
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        next.ServeHTTP(w, r)
        
        log.Printf(
            "%s %s %s %v",
            r.RemoteAddr,
            r.Method,
            r.URL.Path,
            time.Since(start),
        )
    })
}

// 认证中间件
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        if token == "" {
            http.Error(w, "缺少认证令牌", http.StatusUnauthorized)
            return
        }
        
        // 验证令牌逻辑
        if !isValidToken(token) {
            http.Error(w, "无效的令牌", http.StatusUnauthorized)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}

func isValidToken(token string) bool {
    // 简单的令牌验证逻辑
    return token == "Bearer valid-token"
}

// 使用中间件
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/", homeHandler)
    mux.HandleFunc("/protected", protectedHandler)
    
    // 应用中间件
    handler := loggingMiddleware(mux)
    
    // 对特定路径应用认证中间件
    protectedMux := http.NewServeMux()
    protectedMux.Handle("/protected", authMiddleware(http.HandlerFunc(protectedHandler)))
    protectedMux.Handle("/", handler)
    
    log.Fatal(http.ListenAndServe(":8080", protectedMux))
}

func protectedHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "这是受保护的资源")
}
```

## Web开发

### 1. 使用 Gin 框架
```go
// go get github.com/gin-gonic/gin

package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

func main() {
    r := gin.Default()
    
    // 路由组
    api := r.Group("/api/v1")
    {
        api.GET("/users", getUsers)
        api.POST("/users", createUser)
        api.GET("/users/:id", getUser)
    }
    
    r.Run(":8080")
}

func getUsers(c *gin.Context) {
    users := []User{{1, "Alice"}, {2, "Bob"}}
    c.JSON(http.StatusOK, users)
}

func createUser(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, user)
}
```

## 数据库操作

### 1. GORM ORM 框架
```go
// go get gorm.io/gorm
// go get gorm.io/driver/mysql

import (
    "gorm.io/gorm"
    "gorm.io/driver/mysql"
)

type User struct {
    ID    uint   `gorm:"primaryKey"`
    Name  string
    Email string `gorm:"uniqueIndex"`
}

func main() {
    dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    
    // 自动迁移
    db.AutoMigrate(&User{})
    
    // 创建
    user := User{Name: "Alice", Email: "alice@example.com"}
    db.Create(&user)
    
    // 查询
    var users []User
    db.Find(&users)
    
    // 更新
    db.Model(&user).Update("Name", "Alice Updated")
    
    // 删除
    db.Delete(&user)
}
```

### 2. 原生 SQL
```go
import (
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

func dbOperations() {
    db, err := sql.Open("mysql", "user:password@/dbname")
    if err != nil {
        panic(err)
    }
    defer db.Close()
    
    // 查询
    rows, err := db.Query("SELECT id, name FROM users")
    if err != nil {
        panic(err)
    }
    defer rows.Close()
    
    for rows.Next() {
        var id int
        var name string
        rows.Scan(&id, &name)
        fmt.Printf("ID: %d, Name: %s\n", id, name)
    }
    
    // 插入
    stmt, err := db.Prepare("INSERT INTO users(name, email) VALUES(?, ?)")
    if err != nil {
        panic(err)
    }
    defer stmt.Close()
    
    _, err = stmt.Exec("John", "john@example.com")
    if err != nil {
        panic(err)
    }
}
```

## 测试

### 1. 单元测试
```go
// main.go
func Add(a, b int) int {
    return a + b
}

func Divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// main_test.go
import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5
    if result != expected {
        t.Errorf("Add(2, 3) = %d; want %d", result, expected)
    }
}

func TestDivide(t *testing.T) {
    result, err := Divide(10, 2)
    if err != nil {
        t.Errorf("Divide(10, 2) returned error: %v", err)
    }
    if result != 5 {
        t.Errorf("Divide(10, 2) = %f; want %f", result, 5.0)
    }
    
    // 测试错误情况
    _, err = Divide(10, 0)
    if err == nil {
        t.Error("Divide(10, 0) should return error")
    }
}

// 表驱动测试
func TestAddTable(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -2, -3},
        {"zero", 0, 5, 5},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", 
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}
```

### 2. 基准测试
```go
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}

func BenchmarkStringConcat(b *testing.B) {
    for i := 0; i < b.N; i++ {
        _ = "hello" + "world"
    }
}

// 运行基准测试
// go test -bench=.
```

## 性能优化

### 1. 内存优化
```go
// 使用对象池减少 GC 压力
import "sync"

var bufferPool = sync.Pool{
    New: func() interface{} {
        return make([]byte, 1024)
    },
}

func processData(data []byte) {
    buf := bufferPool.Get().([]byte)
    defer bufferPool.Put(buf)
    
    // 使用 buf 处理数据
}

// 预分配切片容量
func optimizedSlice() {
    // 好的做法
    slice := make([]int, 0, 1000)  // 预分配容量
    
    // 避免
    var slice2 []int  // 会多次重新分配
}
```

### 2. 并发优化
```go
// 使用 worker pool 限制并发数
func workerPool(jobs <-chan int, results chan<- int, workers int) {
    var wg sync.WaitGroup
    
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- job * 2
            }
        }()
    }
    
    wg.Wait()
    close(results)
}
```

## 部署和运维

### 1. 构建和部署
```bash
# 编译
go build -o myapp main.go

# 交叉编译
GOOS=linux GOARCH=amd64 go build -o myapp-linux main.go

# 减小二进制文件大小
go build -ldflags "-s -w" -o myapp main.go

# Docker 部署
# Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]
```

### 2. 监控和日志
```go
import (
    "log/slog"
    "os"
)

func setupLogging() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    slog.SetDefault(logger)
    
    slog.Info("应用启动", "version", "1.0.0")
    slog.Error("错误信息", "error", "something went wrong")
}

// 健康检查端点
func healthCheck(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}
```

## 最佳实践

### 1. 代码组织
```
project/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handlers/
│   ├── models/
│   └── services/
├── pkg/
│   └── utils/
├── configs/
├── docs/
├── scripts/
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

### 2. 错误处理原则
```go
// 在函数边界处理错误
func processRequest() error {
    data, err := fetchData()
    if err != nil {
        return fmt.Errorf("获取数据失败: %w", err)
    }
    
    if err := validateData(data); err != nil {
        return fmt.Errorf("数据验证失败: %w", err)
    }
    
    return nil
}

// 使用哨兵错误
var (
    ErrNotFound = errors.New("not found")
    ErrInvalid  = errors.New("invalid input")
)
```

### 3. 接口设计
```go
// 小接口原则
type Validator interface {
    Validate() error
}

type Serializer interface {
    Serialize() ([]byte, error)
}

// 接受接口，返回结构体
func ProcessData(v Validator, s Serializer) (*Result, error) {
    if err := v.Validate(); err != nil {
        return nil, err
    }
    
    data, err := s.Serialize()
    if err != nil {
        return nil, err
    }
    
    return &Result{Data: data}, nil
}
```

## 高级主题

### 1. 反射
```go
import "reflect"

func analyzeStruct(obj interface{}) {
    v := reflect.ValueOf(obj)
    t := reflect.TypeOf(obj)
    
    for i := 0; i < v.NumField(); i++ {
        field := v.Field(i)
        fieldType := t.Field(i)
        
        fmt.Printf("字段: %s, 类型: %s, 值: %v\n", 
            fieldType.Name, field.Type(), field.Interface())
    }
}
```

### 2. 泛型（Go 1.18+）
```go
// 泛型函数
func Max[T comparable](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 泛型结构体
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    
    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item, true
}
```

### 3. 上下文（Context）
```go
import "context"

func longRunningTask(ctx context.Context) error {
    select {
    case <-time.After(5 * time.Second):
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()
    
    if err := longRunningTask(ctx); err != nil {
        fmt.Println("任务被取消:", err)
    }
}
```

## 学习路径建议

### 初学者 (1-2个月)
1. 安装 Go 环境
2. 学习基础语法和数据类型
3. 掌握控制结构和函数
4. 理解包的概念
5. 完成简单的命令行程序

### 进阶 (2-4个月)
1. 深入学习结构体和接口
2. 掌握错误处理模式
3. 学习并发编程（goroutines, channels）
4. 文件和网络操作
5. 编写单元测试

### 高级 (4-6个月)
1. Web 开发框架（Gin, Echo）
2. 数据库操作（GORM, 原生SQL）
3. 微服务架构
4. 性能优化和监控
5. 容器化部署

### 专家级 (6个月以上)
1. 源码阅读
2. 自定义中间件和框架
3. 分布式系统设计
4. 贡献开源项目
5. 技术分享和写作

## 推荐资源

### 官方资源
- [Go 官方网站](https://golang.org/)
- [Go 官方教程](https://tour.golang.org/)
- [Go 文档](https://pkg.go.dev/)

### 书籍推荐
- 《Go语言圣经》
- 《Go语言实战》
- 《Go语言学习笔记》

### 在线资源
- [Go by Example](https://gobyexample.com/)
- [Effective Go](https://golang.org/doc/effective_go.html)
- [Go 代码审查评论](https://github.com/golang/go/wiki/CodeReviewComments)

### 社区
- [Go 官方论坛](https://forum.golangbridge.org/)
- [Reddit Go 社区](https://www.reddit.com/r/golang/)
- [Stack Overflow Go 标签](https://stackoverflow.com/questions/tagged/go)

这个学习指南涵盖了 Go 语言从入门到精通的所有核心内容。建议按照学习路径循序渐进，多动手实践，多阅读优秀代码。Go 语言的设计哲学是简洁和高效，掌握这些知识点后，你就能够开发出高质量的 Go 应用程序了！
