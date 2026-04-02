module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新功能 (feature)' },
    { value: 'fix', name: 'fix:      修复 (bug)' },
    { value: 'docs', name: 'docs:     文档变更 (documentation)' },
    { value: 'style', name: 'style:    代码格式 (不影响代码运行的变动)' },
    { value: 'refactor', name: 'refactor: 重构 (不是新增功能，也不是修改bug的代码变动)' },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     测试 (testing)' },
    { value: 'chore', name: 'chore:    构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert:   回退 (revert)' },
    { value: 'build', name: 'build:    构建系统或外部依赖的变动' },
    { value: 'ci', name: 'ci:       CI配置文件和脚本的变动' }
  ],

  scopes: [],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  scopeOverrides: {
    fix: [{ name: 'merge', value: 'merge' }]
  },

  // override the messages, defaults are as follows
  messages: {
    type: "选择你要提交的类型 :",
    scope: '\n选择一个 scope (可选):',
    customScope: '请输入自定义的 scope:',
    subject: '\n写一个简短的描述 (必填):\n',
    body: '写一个更详细的描述 (可选):\n',
    breaking: '列出任何 BREAKING CHANGES (可选):\n',
    footer: '列出关闭的 issue (例如. fix #123, fix #234) (可选):\n',
    confirmCommit: '确认提交?'
  },

  allowBreakingChanges: ['feat', 'fix'],

  skipQuestions: [],

  subjectLimit: 100
}
