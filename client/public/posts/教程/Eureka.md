---
title: Eureka
date: 2026-03-29
slug: Eureka.md
category: client/public/posts/教程
tags: []
---
### 一、Eureka 使用总结
#### 1. 搭建 Eureka Server（服务注册中心）
+ **依赖**：引入 `spring-cloud-starter-netflix-eureka-server`

```java
<!--eureka服务端-->
<dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

+ **注解**：在主启动类上添加 `@EnableEurekaServer`，声明该服务为注册中心
+ **配置**（`application.yml`）：

```yaml
server:
# 端口可以随意制定
  port: 8761
eureka:
  client:
    register-with-eureka: false   # 不向自己注册
    fetch-registry: false         # 不检索服务
     # 注册中心地址
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

#### 2. 服务提供者（服务注册）
+ **依赖**：引入 `spring-cloud-starter-netflix-eureka-client`

```java
<!--eureka客户端依赖-->
<dependency>
<groupId>org.springframework.cloud</groupId>
<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

+ **配置**：

```yaml
spring:
  application:
    name: orderservice
```

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    instance-id: ${spring.application.name}:${server.port}  # 自定义实例ID
    prefer-ip-address: true                                 # 使用IP注册
```

+ **服务注册多次（保证端口不同）**

<img src="https://cdn.nlark.com/yuque/0/2026/png/35477077/1774600312587-50adaa87-bd12-454f-8b5b-5d5f18f1f252.png?x-oss-process=image%2Fcrop%2Cx_0%2Cy_131%2Cw_2190%2Ch_783" width="1095" title="" crop="0,0.1431,1,1" id="u987b3ae6" class="ne-image">

#### 3. 服务消费者（服务发现）
+ **依赖**：同样引入 `eureka-client`

```java
<!--eureka客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

+ **RestTemplate 增强**：在配置类中为 `RestTemplate` 添加 `@LoadBalanced` 注解，启用 Ribbon 负载均衡

```java
@Bean
@LoadBalanced//负载均衡
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

+ **远程调用**：使用**服务名称**（即 `spring.application.name`）替代 IP + 端口

```java
String url = "http://user-service/user/" + id;
User user = restTemplate.getForObject(url, User.class);
```

---

### 二、核心知识点补充
| 概念 | 说明 |
| --- | --- |
| **服务注册** | 服务启动时向 Eureka Server 发送自己的元数据（IP、端口、健康状态等） |
| **服务续约** | 服务通过心跳（默认30秒）向 Server 证明自己“活着”，若90秒未续约则被剔除 |
| **服务发现** | 消费者从 Eureka Server 获取服务实例列表，实现软负载 |
| **自我保护机制** | 当短时间内大量实例续约失败时，Eureka 会进入保护模式，**不剔除任何实例**，防止网络波动导致误删 |
| **分区与高可用** | 可搭建多个 Eureka Server 相互注册，形成集群，实现高可用 |
| **CAP 理论** | Eureka 优先保证 **AP（可用性 + 分区容错性）**，牺牲强一致性，更适合分布式场景 |


---

### 三、常见问题与建议
1. **服务启动后无法注册**
    - 检查 Eureka Server 地址是否正确
    - 确认 `spring.application.name` 是否配置
    - 查看日志是否有网络或权限问题
2. **服务调用时出现 **`java.net.UnknownHostException`
    - 确认 `RestTemplate` 是否添加了 `@LoadBalanced`
    - 确认调用时使用的是服务名称，而非 IP
3. **自我保护机制的影响**
    - 开发调试时若频繁重启服务，可能看到旧实例仍存在（未被剔除），属于正常现象
    - 可通过 `eureka.server.enable-self-preservation=false` 关闭（仅建议本地测试）


