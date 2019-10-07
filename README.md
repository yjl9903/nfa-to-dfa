# NFA to DFA

非确定性有限状态自动机转化为确定性有限状态自动机。

## 安装

请确保您的电脑上配置有 Node 环境。

全局安装 TypeScript。

```bash
yarn global add typescript
```

安装依赖。

```bash
yarn
```

TypeScript 编译。

```bash
tsc
```

## 使用

读取 `testdata/in.txt`，并输出转化的 DFA。

```bash
yarn run start
```

### 输入格式说明

第一行一个字符串，表示 NFA 的根节点。

第二行有任意个字符串（用空格分割），表示 NFA 的终止结点。

剩下的，每行有 3 个字符串 u v w（用空格分割），表示结点 u 连接一条字符为 w 的边向结点 v。

输入文件忽略空行和 `//` 开头的行。
