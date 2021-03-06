# nginx自定义日志记录完整的请求

### 配置文件/etc/nginx/nginx.conf

<!--more-->

```bash
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr [$time_local] '
                      '"$request_method $scheme://$host$request_uri $server_protocol" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}

```

### 容器处理
```bash
docker cp nginx:/etc/nginx/nginx.conf .
docker cp nginx.conf nginx:/etc/nginx/nginx.conf
```

