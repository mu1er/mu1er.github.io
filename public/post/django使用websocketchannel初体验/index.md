# Django使用Websocket,Channel初体验




很久都没更新文章了，最近恰好在做了一个服务端主动推送消息给客户端的需求，因为是第一次使用Channels模块，踩了不少坑，在这里记录一下。

<!--more-->

### 什么是Websocket
[websocket的介绍](https://baike.baidu.com/item/WebSocket/1953845?fr=aladdin)
[WebSocket-阮一峰老师](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
通俗的来说Websocket就是一个双向通道，客户端可以主动给服务端发消息，服务端也可以主动给客户端发送消息。

[Channels](https://channels.readthedocs.io/en/latest/index.html)是Django里面可以构建websocket的模块，官方文档里说了很清晰了，就是一个以处理WebSocket，聊天协议，IoT协议的模块，基于称为ASGI的Python规范构建。它可以以异步的方式进行。

### 安装配置

```
python2: pip install -U channels
python3: pip3 install -U channels

# 添加到yourproject.settings
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    ...
    'channels',
)

# yourproject/routing.py
from channels.routing import ProtocolTypeRouter

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
})

# 修改settings文件，yourproject/settings,添加下面一行内容

ASGI_APPLICATION = "yourproject.routing.application"

```

启用之后，通道就会将自己集成到Django中，并控制runserver命令
```
# 启动之后命令行变成 ASGI/channels
Starting ASGI/Channels version 2.4.0 development server at https://127.0.0.1:8000/
```

下面是在实际中编写的一个模块，主要用websocket连接通道，然后服务端主动推送消息.聊天室的例子大家可以在网上搜一下有很多，我在这里就不多做描写了。
```
# 目录结构
yourproject/
 - yourproject/
    - asgi.py
    - routing.py
    - wsgi.py
    - settings.py
    - urls.py
 - chat/
    - routing.py
    - consumers.py
    - controller.py
 - manage.py

# youproject/routing.py
from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from chat import routing
application = ProtocolTypeRouter({
    # 没有做权限校验
    "websocket": URLRouter(
      chat.routing.websocket_urlpatterns
    )
})

# chat/routing.py
from django.conf.urls import re_path
from monitor.consumers import AsyncConsumer

websocket_urlpatterns = [
    # api router setting
    re_path(r'ws/chat/', AsyncConsumer)
]

# 官方文档一般建议使用AsyncWebsocketConsumer
# 原文默认情况下编写SyncConsumers，并且仅在以下情况下使用AsyncConsumers：通过异步处理来改善的事情
# 如果想要在其他模块主动推送消息给客户端，必须使用通道，通道分为Redis和内存通道（生产中不建议使用）
# 配置通道层
# yourproject/settings.py
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
# chat/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from monitor import CHANNEL_NAME
from redis_cache import REDIS_CONN
import json

class AsyncConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        连接时触发 并且分配一个self.channel_name名称可以存数据库
        这里我存入redis 主要方便
        """
        REDIS_CONN.lpush(CHANNEL_NAME, self.channel_name)
        await self.accept()

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):

        # text_data_json = json.loads(text_data)
        # message = text_data_json['message']
        # 接受信息并回复
        await self.send(text_data = json.dumps(text_data))

    async def disconnect(self, close_code):
        # 将关闭的连接从群组中移除
        results = REDIS_CONN.lrange(CHANNEL_NAME, 0, REDIS_CONN.llen(CHANNEL_NAME))
        for index, item in enumerate(results):
            if self.channel_name == item:
                REDIS_CONN.lrem(CHANNEL_NAME, index, item)
        await self.close()

    # 主动推送的事件处理方法
    async def push_message(self, event):
        data = json.dumps(event["text"])
        await self.send(text_data = data)

# chat/controller.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from monitor import CHANNEL_NAME
from redis_cache import REDIS_CONN
# 官方例子，异步推送消息
channel_layer = get_channel_layer()
await channel_layer.send("channel_name", {
    "type": "chat.message",
    "text": "Hello there!",
})
# 同步推送消息，调用函数即可推送
def push_chat_message(data):
    """
    从redis拿到已经连接的通道名称
    """
    channel_layer = get_channel_layer()
    # 循环redis中的channel_name，并且推送消息
    results = REDIS_CONN.lrange(CHANNEL_NAME, 0, REDIS_CONN.llen(CHANNEL_NAME))
    for channel in results:
        async_to_sync(channel_layer.send)(channel,
            {
                # consumer中的事件处理方法,建议为事件类型加上前缀如`push.`避免冲突.
                "type": "push.message",
                "text": data,
            }
        )
```

以上就是单通道推送消息的例子，第一次使用也有很多地方不清楚，这块只是做个记录，根据网上看到的一些资料，再总结一下。如果想要了解聊天室的例子，大家可以去网上搜一下，有很多，官方文档也有[chan_examplte](https://channels.readthedocs.io/en/latest/tutorial/index.html).还望大佬们轻拍.



