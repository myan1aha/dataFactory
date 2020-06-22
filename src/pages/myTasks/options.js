const options = [
  { name: 'id', label: '任务id', type0: 'text', type: 'input', isEdit: false },
  { name: 'projectName', label: '项目名称', type0: 'select', type: 'input', isEdit: false },
  { name: 'taskName', label: '任务名称', type0: 'text', type: 'input', isEdit: false },
  { name: 'dataInputs', label: '来源表', type0: 'insertForm', type: 'select', noRequired: true },
  { name: 'dataOutputs', label: '目标表', type0: 'insertForm', type: 'select', noRequired: true },
  {
    name: 'taskDependencies',
    label: '解析任务依赖',
    type0: 'taskDependency',
    type: 'input',
    noRequired: true,
  },
  { name: 'parNode', label: '上游节点', type0: 'text', noRequired: true, type: 'input', isEdit: true },
  { name: 'command', label: '命令', type0: 'insertForm', type: 'input' },
  { name: 'numRetry', label: '失败重启次数', type0: 'text', type: 'input', isEdit: true },
  { name: 'retryInterval', label: '失败重启间隔', type0: 'text', type: 'input', isEdit: true },
  { name: 'description', label: '基本描述', type0: 'text', type: 'textarea', isEdit: true },
  { name: 'owner', label: '负责人', type0: 'text', type: 'input', isEdit: true },
];
export default options;
