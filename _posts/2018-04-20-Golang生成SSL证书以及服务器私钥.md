---
layout: post
title: Golang生成SSL证书以及服务器私钥
tags: [golang]
---

> SSL 证书X.509 是国际电信联盟电信标准化部门（ ITU-T ）为公钥基础设施制定的一个标准，这个标准包含了公钥证书的标准格式。
一个 X.509 证书（简称 SSL 证书）实际上就是一个经过编码的 ASN.1( Abstract Syntax Notation One,抽象语法表示法／1 ）格式的电子文档。 ASN.1 既是一个标准，也是一种表示法，它描述了表示电信以及
计算机网络数据的规则和结构。
X.509 证书可以使用多种格式编码，其中一种编码格式是 BER ( Basic Encoding Rules ，基本编码规
则）。 BER 格式指定了一种自解释并且自定义的格式用于对 ASN.1 数据结构进行编码，而 DER 格式则是
BER 的一个子集。 DER 只提供了一种编码 ASN.1 值的方法，这种方法被广泛地应用于密码学当中，尤其是对 X.509 证书进行加密。56 第 3 章接收请求SSL 证书可以以多种不同的格式保存，其中一种是 PEM (Privacy Enhanced Email ，隐私增强邮件 ）格式，这种格式会对 DER 格式的 X.509 证书实施Base64 编码，并且这种格式的文件都以一一BEGINCERTIFICATE一开头，以一一END CERTIF工CATE一结尾｛除了用作文件格式之外 ， PEM和此处讨论的 SSL 证书关系并不大）。

----


生成证书的方法并不复杂,因为 SSL 证书实际上就是一个将扩展密钥用
法（extended key usage）设置成了服务器身份验证操作的`X.509`证书
### 配置证书信息
```
//生成一个比较长的随机整数来做序列号
max := new(big.Int).Lsh(big.NewInt(1), 128)
seriaNumber := rand.Int(rand.Reader, max)
//生成证书标题
subject := pkix.Name{
		Organization:       []string{"Mu1er.cn"},
		OrganizationalUnit: []string{"mu1er"},
		CommonName:         "mu1er.cn",
	}
template := x509.Certificate{
		SerialNumber: seriaNumber,
		Subject:      subject,
		NotBefore:    time.Now(),
        //有效期
		NotAfter:     time.Now().Add(365 * 24 * time.Hour),
        //用x509证书来验证
		KeyUsage:     x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage:  []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
        //运行地址
		IPAddresses:  []net.IP{net.ParseIP("127.0.0.1")},
	}
```
### 生成 RSA 私钥
```
pk, _ := rsa.GenerateKey(rand.Reader, 2048)
```
私钥结构里面包含了一个能够公开访问的公钥，随后创建SSL证书的时候会用到
```
derBytes, _ := x509.CreateCertificate(rand.Reader, &template, &template,&pk.PublicKey, pk)
```
`CreateCertificate`函数接受`Certificate`结构、公钥和私钥等多个参数，创建出一个经过 DER 编码格式化的字节切片 。后续代码的意图也非常简单明了，它们首先使用`encoding/pem`标准库将证书编码到`cert.pem`文件里面
```
certOut, _ := os.Create("cert.pem")
pem.Encode(certOut, &pem.Block{Type: "CERTIFICATE", Bytes: derBytes})
certOut.Close()
```

然后继续以 PEM 编码的方式把之前生成的密钥编码并保存到`key.pem`文件里面：
```
keyOut, _ := os.Create("key.pem")
pem.Encode(keyOut, &pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(pk)})
keyOut.Close()
```
最后需要提醒的是，如果证书是由`CA`签发的，那么证书文件中将同时包含服务器签名以及`CA`签名，其中服务器签名在前,`CA`签名在后.




