---
title: Ribbon
date: 2026-03-29
slug: Ribbon.md
category: client/public/posts/教程
tags: []
---
### 一、Ribbon 是什么
Ribbon 是 Netflix 开源的**客户端负载均衡器**，在 Spring Cloud 中被广泛使用。它运行在**服务消费者端**，负责从服务注册中心获取服务实例列表，并通过负载均衡策略选择一个实例进行调用。

---

### 二、核心使用方式
#### 1. 引入依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>

```

> 注：引入 `eureka-client` 或 `spring-cloud-starter-netflix-eureka-client` 时会自动引入 Ribbon
>

#### 2. 启用负载均衡
```java
@Configuration
public class AppConfig {
    
    @Bean
    @LoadBalanced  // 关键注解：为 RestTemplate 启用 Ribbon 负载均衡
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

#### 3. 服务调用
```java
@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUserById(Long id) {
        // 使用服务名称代替 IP+端口
        String url = "http://user-service/user/" + id;
        return restTemplate.getForObject(url, User.class);
    }
}
```

---

### 三、负载均衡策略
Ribbon 提供了多种负载均衡策略，通过 `IRule` 接口实现：

| 策略类 | 策略名称 | 说明 |
| --- | --- | --- |
| `RoundRobinRule` | 轮询 | 默认策略，依次轮询每个服务实例 |
| `RandomRule` | 随机 | 随机选择一个服务实例 |
| `WeightedResponseTimeRule` | 响应时间权重 | 根据响应时间分配权重，响应越快被选中的概率越高 |
| `BestAvailableRule` | 最小并发 | 选择并发请求数最小的实例 |
| `RetryRule` | 重试 | 先轮询，失败后重试其他实例 |
| `AvailabilityFilteringRule` | 可用性过滤 | 过滤掉故障或高并发的实例后再轮询 |
| `ZoneAvoidanceRule` | 区域优先 | 优先选择同一 Zone 的实例，提高性能 |


#### 配置负载均衡策略
```yaml
# 方式一：全局配置
ribbon:
  NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule

# 方式二：指定服务配置
user-service:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
# 方式三：注入IRule 的实现类 RandomRule
@Bean
public IRule randomRule{
        return new RandomRule();
}

```

---

### 四、核心组件架构
<img src="https://cdn.nlark.com/yuque/0/2026/png/35477077/1774601332601-d340ee3d-4a0f-42e4-9c08-6b04fb635fd1.png?x-oss-process=image%2Fcrop%2Cx_0%2Cy_70%2Cw_1642%2Ch_738" width="821" title="" crop="0,0.0866,0.9915,1" id="ud3cc2d33" class="ne-image">

```plain
┌─────────────────────────────────────────┐
│         LoadBalancerClient              │
│         (负载均衡客户端)                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│            ILoadBalancer                │
│         (负载均衡器核心接口)              │
├─────────────────────────────────────────┤
│  - IPing        ：服务存活检测            │
│  - IRule        ：负载均衡策略            │
│  - ServerList   ：服务实例列表获取        │
│  - ServerListUpdater：列表动态更新        │
└─────────────────────────────────────────┘
```

| 组件 | 职责 | 默认实现 |
| --- | --- | --- |
| `ILoadBalancer` | 负载均衡器主入口 | `ZoneAwareLoadBalancer` |
| `IRule` | 选择实例的策略 | `RoundRobinRule` |
| `IPing` | 检测服务是否存活 | `DummyPing`（始终返回 true，依赖 Eureka 心跳） |
| `ServerList` | 获取服务实例列表 | `DiscoveryEnabledNIWSServerList`（从 Eureka 获取） |
| `ServerListUpdater` | 动态更新服务列表 | `PollingServerListUpdater`（默认30秒更新一次） |


---

### 五、常用配置项
```yaml
# 全局 Ribbon 配置
ribbon:
  # 连接超时时间（毫秒）
  ConnectTimeout: 2000
  # 读取数据超时时间（毫秒）
  ReadTimeout: 5000
  # 是否对所有操作进行重试
  OkToRetryOnAllOperations: false
  # 同一实例的重试次数（不包括首次）
  MaxAutoRetries: 1
  # 重试其他实例的次数
  MaxAutoRetriesNextServer: 2
  # 是否启用重试机制
  ribbonOkToRetryOnAllOperations: true
  
  # Eureka 相关
  eureka:
    enabled: true  # 是否从 Eureka 获取服务列表
  
  # 服务列表刷新间隔（毫秒）
  ServerListRefreshInterval: 30000

# 针对具体服务的配置
user-service:
  ribbon:
    ConnectTimeout: 3000
    ReadTimeout: 6000
    MaxAutoRetries: 2
```

---

### 六、进阶知识点
#### 1. 饥饿加载（Eager Loading）
默认情况下，Ribbon 在第一次请求时才初始化，可能导致首次请求超时。可通过配置开启饥饿加载：

```yaml
ribbon:
  eager-load:
    enabled: true
    clients: user-service, order-service  # 需要饥饿加载的服务列表
```

#### 2. 自定义负载均衡策略
```java
@Configuration
public class MyRibbonConfig {
    
    @Bean
    public IRule myRule() {
        // 自定义策略：始终选择第一个可用实例
        return new AbstractLoadBalancerRule() {
            @Override
            public Server choose(Object key) {
                ILoadBalancer lb = getLoadBalancer();
                List<Server> servers = lb.getAllServers();
                return servers.isEmpty() ? null : servers.get(0);
            }
            
            @Override
            public void initWithNiwsConfig(IClientConfig clientConfig) {}
        };
    }
}
```

#### 3. 与 Feign 的关系
+ Feign 内部集成了 Ribbon，声明式 HTTP 客户端自动具备负载均衡能力
+ 使用 `@FeignClient` 时，无需手动配置 RestTemplate

---

### 七、常见问题
| 问题 | 解决方案 |
| --- | --- |
| 首次调用超时 | 开启饥饿加载：`ribbon.eager-load.enabled=true` |
| 服务实例下线后仍被调用 | 检查 `ServerListRefreshInterval` 是否过长，或 Eureka 自我保护机制 |
| 重试导致请求重复 | 合理设置 `MaxAutoRetries` 和 `MaxAutoRetriesNextServer`，幂等性设计 |
| 自定义策略不生效 | 检查 `@RibbonClient` 或 `@RibbonClients` 配置是否正确 |


---

### 八、Ribbon 与 Spring Cloud LoadBalancer 对比
| 特性 | Ribbon | Spring Cloud LoadBalancer |
| --- | --- | --- |
| 维护状态 | **进入维护模式**，不再迭代 | Spring Cloud 官方推荐替代品 |
| 依赖 | Netflix 组件，需要额外引入 | Spring Cloud 内置 |
| 性能 | 较重，依赖 Eureka | 轻量级，支持响应式编程 |
| 策略扩展 | 策略丰富，扩展灵活 | 策略相对较少，但够用 |
| 未来趋势 | 逐步被替代 | 主流方向 |


> 💡 **建议**：新项目推荐使用 **Spring Cloud LoadBalancer**；旧项目可继续使用 Ribbon，关注后续迁移。
>

---
