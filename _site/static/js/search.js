function search() {
var data = [

{
"title" : "nginx自定义日志记录完整的请求",
"time" : "2018/01/25",
"categories":"Nginx",
"url" : "/posts/2018/01/25/nginx%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95%E5%AE%8C%E6%95%B4%E7%9A%84%E8%AF%B7%E6%B1%82.html"
}

,


{
"title" : "CentOS 7安装jekyll静态博客并通过git自动发布",
"time" : "2018/01/17",
"categories":"jekyll",
"url" : "/posts/2018/01/17/CentOS-7%E5%AE%89%E8%A3%85jekyll%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E5%B9%B6%E9%80%9A%E8%BF%87git%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%83.html"
}

,


{
"title" : "(爬虫学习)40行代码爬取猫眼电影TOP100",
"time" : "2018/01/12",
"categories":"Python爬虫",
"url" : "/posts/2018/01/12/(%E7%88%AC%E8%99%AB%E5%AD%A6%E4%B9%A0)40%E8%A1%8C%E4%BB%A3%E7%A0%81%E7%88%AC%E5%8F%96%E7%8C%AB%E7%9C%BC%E7%94%B5%E5%BD%B1Top100.html"
}


]
    var text_input = document.getElementById("text-input");
    var searchlist = document.getElementById("searchlist");
    var beforeinput = "";
    
    function addnode(json) {
        var li = document.createElement('li');
        var node = "<time>" + json.time + "&nbsp;</time>";
        node += "<a href='" + json.url + "'>" + json.title + "</a>";
        var arr = json.categories.split("@");
        for (var j = 0; j < arr.length; j++) {
            node += "<span>&nbsp;<a href='/pages/categories.html#" + arr[j] + "'>" + arr[j] + "</a></span>";
        }
        li.innerHTML = node;
        searchlist.appendChild(li);
    }

    function inputchange() {
        var currentinput = text_input.value;

        //输入有变化，重新检索
        if (beforeinput != currentinput.trim()) {
            beforeinput = currentinput.trim();
            if (beforeinput != "") {
                searchlist.innerHTML = "";
                var dataarray = data;
                for (i = 0; i < dataarray.length; i++) {
                    var keywords = beforeinput.split(" ");
                    for (var j = 0; j < keywords.length; j++) {
                        if (dataarray[i].time.match(keywords[j])) {
                            addnode(dataarray[i]);
                            break;
                        }
                        if (dataarray[i].title.toLocaleUpperCase().match(keywords[j].toLocaleUpperCase())) {
                            addnode(dataarray[i]);
                            break;
                        }
                        if (dataarray[i].categories.toLocaleUpperCase().match(keywords[j].toLocaleUpperCase())) {
                            addnode(dataarray[i]);
                            break;
                        }
                    }
                }
            } else {
                searchlist.innerHTML = "";
            }
        }
    }

    /*绑定事件*/
    if (window.attachEvent) {
        text_input.attachEvent("oninput", inputchange);
    } else if (window.addEventListener) {
        text_input.addEventListener("input", inputchange, false);
    }
}

/*绑定事件*/
if (window.attachEvent) {
    window.attachEvent("onload", search);
} else if (window.addEventListener) {
    window.addEventListener("load", search, false);
}