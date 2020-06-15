const options = [
    { key: 1, name: 'proName', label: '项目名称', type0: 'text', type: 'input' },
    { key: 2, name: 'taskName', label: '任务名称', type0: 'text', type: 'input' },
    { key: 3, name: 'originForm', label: '来源表', type0: 'text', type: 'input' },
    { key: 4, name: 'targetForm', label: '目标表', type0: 'text', type: 'input' },
    { key: 5, name: 'taskDependency', label: '解析任务依赖', type0: 'text', type: 'input' },
    { key: 6, name: 'upNode', label: '上游节点', type0: 'text', type: 'input' },
    { key: 7, name: 'order', label: '命令', type0: 'text', type: 'input' },
    { key: 8, name: 'reTimes', label: '失败重启次数', type0: 'text', type: 'input' },
    { key: 9, name: 'reInterval', label: '失败重启间隔', type0: 'text', type: 'input' },
    { key: 10, name: 'description', label: '基本描述', type0: 'text', type: 'textarea' },
]
export default options;
