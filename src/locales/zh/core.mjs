// 简体中文（中国大陆）。Keys remain the English source strings; values are localized.
export const meta = {
  code: 'zh-CN', name: '简体中文', prefix: '/zh-cn', tag: 'zh-CN', direction: 'ltr',
  homeTitle: '免费在线工具：文本、数据与日常计算 | UsefulVerse',
  homeDescription: '免费使用文本、数据和日常计算工具。无需注册或上传文件，处理过程直接在浏览器中完成。',
  homeLabel: '首页', homeMarker: '工具', keepEnglish: ['JSON Web Token', 'UTC', 'UUID', 'SHA-256', 'Base64', 'HEX', 'RGB', 'HSL', 'HTML', 'CSV', 'SEO', 'name,age\nAda,36\nLinus,55', '\\bUseful\\w*\\b', 'https://example.com/search?q=useful&lang=en'],
  runtime: { textNumberInputs: true, wordSegmentation: true, readingRate: 400, longDates: true, timeZones: { from: 'Asia/Shanghai', to: 'America/New_York' } },
};

export const page = {
  faqHow: '如何使用{name}？', privacyQuestion: '我的数据会发送到服务器吗？',
  privacyAnswer: '不会。所有处理都在浏览器中完成，数据不会上传。', about: '关于{title}',
  madeSimple: '轻松使用{title}', categoryTool: '{category}工具', workspace: '{title}工作区',
};

export const templates = {
  'reading.minutes': '{count}分钟',
  summary: '字数：{words}\n字符数：{characters}\n不含空格的字符数：{noSpaces}\n行数：{lines}\n阅读时间：{reading}分钟',
  'dedupe.kept': { other: '已保留{count}行不重复内容。' }, 'percent.of': '{base}的{percent}% = {result}',
  'percent.share': '{part}占{whole}的{result}%', 'percent.change': '从{from}到{to}的变化 = {change}%',
  'rows.converted': { other: '已转换{count}行。' }, 'uuid.generated': { other: '已在本地生成{count}个UUID。' },
  'regex.matches': { other: '找到{count}处匹配。' }, 'duration.exact': '{days}天 {hours}小时 {minutes}分钟 {seconds}秒',
  'diff.found': { other: '发现{count}行不同。' }, 'diff.line': '第{line}行：', 'diff.empty': '（空）',
  'date.days': { other: '{count}天' }, 'url.none': '（无）', 'timestamp.local': '本地时间：{value}',
  'timestamp.seconds': '秒：{value}', 'timestamp.milliseconds': '毫秒：{value}',
};

export const ui = Object.fromEntries([
  ['UsefulVerse home','UsefulVerse 首页'],['Main navigation','主导航'],['Tools','工具'],['How it works','使用方法'],['Find a tool','查找工具'],['Language','语言'],
  ['A useful place on the internet','实用的在线工具箱'],['Do the small things','轻松完成'],['faster.','日常小任务。'],
  ['Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.','适用于文本、数据和日常工作的简洁浏览器工具。无需注册或上传文件，打开工具即可完成任务。'],
  ['Explore tools','浏览工具'],['UsefulVerse principles','UsefulVerse 的理念'],['Fast by default','快速易用'],['Private by design','注重隐私'],['Free to use','免费使用'],
  ['The toolbox','工具箱'],['Find the right tool.','找到合适的工具。'],['Search tools','搜索工具'],['Tool categories','工具分类'],['All','全部'],
  ['Writing','写作'],['Text','文本'],['Developer','开发者'],['SEO','搜索优化'],['Everyday','日常'],['Privacy','隐私'],['Data','数据'],['Design','设计'],
  ['Open tool','打开工具'],['No tools match that search yet. Try another word.','没有找到匹配的工具，请尝试其他关键词。'],['Why UsefulVerse','为什么选择 UsefulVerse'],
  ['Small tools.','小工具，'],['Clear answers.','解决大问题。'],['Open a tool','打开工具'],['Each tool has one clear job. You can start in seconds.','每个工具只专注做好一件事，几秒钟即可开始。'],
  ['Work privately','安心处理'],['Your text stays in your browser for browser-first tools.','对于本地运行的工具，你的文本始终留在浏览器中。'],['Take the result','获取结果'],['Copy it or use it where you need it next.','复制结果，或继续用于其他地方。'],
  ['Simple tools that respect your time and your files.','简洁实用，尊重你的时间与文件。'],['All tools','全部工具'],['Privacy first','隐私优先'],['Breadcrumb','面包屑导航'],['Runs in your browser. No upload.','在浏览器中运行，无需上传。'],
  ['Clear','清除'],['About this tool','关于此工具'],['Common questions','常见问题'],['Keep going','继续探索'],['More useful tools','更多实用工具'],['Browse all tools','查看全部工具'],
  ['Result','结果'],['Copy result','复制结果'],['Whole number','整数'],['From','从'],['Minimum','最小值'],['Maximum','最大值'],
]);

export const runtimeMessages = {
  'There is nothing to copy yet.':'还没有可复制的内容。','Copied to your clipboard.':'已复制到剪贴板。','Copy was blocked. Select the result and copy it manually.':'复制失败，请选中结果并手动复制。',
  'Choose a valid date and time.':'请选择有效的日期和时间。','Number converted locally.':'已在浏览器中完成数字转换。',
};
export const toolUi = { 'percentage-calculator': { 'Whole number':'总数' } };
