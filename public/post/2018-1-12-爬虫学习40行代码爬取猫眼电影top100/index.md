# (爬虫学习)40行代码爬取猫眼电影TOP100


最近一直在学习爬虫方面的知识，在网上也找了很多书和视频来看，原来Web比爬虫简单多了，建议大家如果想快速上手Python的话先从Web方面入手应该会比较快。

废话不多说，这篇文章是我学爬虫来踩的第一个坑，但绝不是最后一个,俗话说在失败中学习进步。从第一个错误到成功运行也是下了蛮大的功夫。

<!--more-->

运行成功的图

![](http://otsqi967f.bkt.clouddn.com/QQ%E6%88%AA%E5%9B%BE20180112151439.png)

上面图片拿到排行榜前20的电影名、封面图、播放地址、主演等等
### 正文来了
要抓取的地址
`http://maoyan.com/board/4`
网上有好多库和模块大家都可以利用，本小白用的是`requests`这个模块,用`get`方法获取一个地址,它返回的是一个`Response`对象,我们可以利用
`Response.status_code`来查看状态码确定网站是否访问成功

```python
try:
  response=requests.get(url)
  if response.status_code==200:
    return response.text
    return None
except RequestException:
  return None
```
个人觉得，爬虫最主要的就是对页面的分析，你要清楚你需要的是什么数据，你需要的数据是在HTML里还是JSON里或是其他地方，
在这里不得不介绍我最喜欢的chrome开发者工具，当然也有其他的，不过用惯了chrome，拿到页面按F12,打开控制台。
![](http://otsqi967f.bkt.clouddn.com/timg.jpg)
这个主要介绍 Network 这个功能，是我们学习爬虫要经常用的。

![](http://otsqi967f.bkt.clouddn.com/QQ%E6%88%AA%E5%9B%BE20180112153610.png)

在《霸王别姬》这部电影按鼠标右键然后**审查元素或者检查(chrome是检查)**通过对页面的分析我们可以得知每部电影都在一个`<dd>`标签中包裹
它们的排名、图片、地址、演员、评分又分别在不同的标签里面,标签我们可以用`beautifulsoup`、`xpath`等`Python`上面的解析库和第三方库来选取
这样是最简单的，不过我这里用的是**正则**来匹配。可能是没被正则虐够吧,顺带给大家推荐个正则在线测试的地址[正则在线测试](http://tool.oschina.net/regex/)
我们要拿到的就是图上红框里面的几个内容。
正则表达式如下:
```python
patten=re.compile('<dd>.*?board-index.*?>(\d+)</i>.*?data-src="(.*?)".*?name">'\
                  '<a.*?>(.*?)</a>.*?star">(.*?)</p>.*?releasetime">(.*?)</p>'\
                  '.*?integer">(.*?)</i>.*?fraction">(.*?)</i>.*?',re.S)
```
`.*?`表示非贪婪匹配意思就是往最少的匹配，只要刚好到临界点就立马停止匹配
`re.S`表示`.`可以匹配换行符
拿到数据之后就是保存的问题，保存的时候一定要注意编码，不然拿到的数据一定会乱码
代码如下:
```python
def save_content(content):
  with open('movie.txt','a',encoding='utf-8') as f:
    f.write(json.dumps(content,ensure_ascii=False)+'\n')
    f.close()
```

[完整代码](https://github.com/ma1ive/scrapy/blob/master/MovieTop100.py)
保存完之后就大功告成了，代码中我们可以多做优化，肯定是不会超过40行的，我们还可以添加其他功能。
在这里主要想告诉大家的是爬取一个页面的时候一定要对需要爬取的数据和页面内容好好分析，这样在编码过程中不至于一卡一顿的。

