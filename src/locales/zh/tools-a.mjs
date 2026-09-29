export const ui = Object.fromEntries([
  ['Text to count','要统计的文本'],['Start typing or paste your text here...','在此输入或粘贴文本…'],['Words','词数'],['Characters','字符数'],['Without spaces','不含空格'],['Lines','行数'],['0 min','0分钟'],['Reading time','阅读时间'],['Copy summary','复制摘要'],['Your counts update as you type.','输入时自动更新统计结果。'],
  ['Text to convert','要转换的文本'],['Paste text here...','在此粘贴文本…'],['Text case options','字母大小写格式'],['UPPERCASE','大写'],['lowercase','小写'],['Sentence case','句首大写'],['Title Case','标题格式'],['Your converted text will appear here...','转换后的文本将显示在这里…'],['Choose a format to create your result.','选择格式以生成结果。'],
  ['List to clean','要清理的列表'],['Paste one item per line...','每行粘贴一项…'],['Trim spaces','删除首尾空格'],['Ignore case','忽略大小写'],['Remove empty lines','删除空行'],['Remove duplicates','删除重复项'],['Your cleaned list will appear here.','清理后的列表将显示在这里。'],['Clean list','清理列表'],['Cleaned lines...','清理后的内容…'],
  ['JSON to format','要格式化的 JSON'],['Format JSON','格式化 JSON'],['Minify','压缩'],['Paste JSON to validate it.','粘贴 JSON 以检查格式。'],['Formatted JSON...','格式化后的 JSON…'],['Base64 direction','Base64 转换方向'],['Encode to Base64','编码为 Base64'],['Decode Base64','解码 Base64'],['Value to convert','要转换的内容'],['Text to encode...','要编码的文本…'],['Convert','转换'],['Runs only in your browser.','仅在浏览器中处理。'],['Result...','结果…'],
  ['URL direction','URL 转换方向'],['Encode URL text','编码 URL 文本'],['Decode URL text','解码 URL 文本'],['URL text to convert','要转换的 URL 文本'],['https://example.com/search?q=hello world','https://example.com/search?q=中文工具'],['Use encode for text that must travel safely inside a URL.','将文本安全地放入 URL 时，请使用编码。'],['Title or phrase','标题或短语'],['How to write a great blog post','如何写好一篇博客'],['Keep numbers','保留数字'],['Keep non-Latin letters','保留非拉丁字母'],['URL slug','URL 短链接'],['your-clean-url-slug','清晰的-url-短链接'],['Create slug','生成短链接'],['Copy slug','复制短链接'],['A good slug is short, clear and easy to read.','好的 URL 短链接应简短、清晰、易读。'],
  ['What is a percentage of a number?','一个数的百分比是多少？'],['Percent','百分之'],['% of','×'],['Base number','基数'],['What percent is one number of another?','一个数占另一个数的百分之几？'],['Part','部分'],['of','占'],['What is the percentage change?','百分比变化是多少？'],['to','至'],['New number','新数值'],['Calculate','计算'],['Copy answers','复制结果'],['Fill in any calculation you need.','填写你需要计算的数据。'],
  ['Your password','你的密码'],['Click Generate password','点击“生成密码”'],['Length:','长度：'],['Uppercase','大写字母'],['Lowercase','小写字母'],['Numbers','数字'],['Symbols','符号'],['Exclude similar characters','排除易混淆字符'],['Generate password','生成密码'],['Copy password','复制密码'],["Generated locally with your browser's secure random generator.",'使用浏览器的安全随机数生成器在本地创建。'],
  ['Unix timestamp to date','Unix 时间戳转日期'],['Timestamp in seconds or milliseconds','以秒或毫秒表示的时间戳'],['Convert to date','转换为日期'],['Your local time','本地时间'],['Date to Unix timestamp','日期转 Unix 时间戳'],['Date and time in your time zone','你所在时区的日期和时间'],['Convert to timestamp','转换为时间戳'],['Seconds','秒'],['Milliseconds','毫秒'],['Your dates stay in this browser.','日期数据仅保留在此浏览器中。'],
  ['HTML entity direction','HTML 实体转换方向'],['Encode HTML','编码 HTML'],['Decode HTML','解码 HTML'],['Use & symbols safely','安全使用 & 等符号'],
]);

export const runtimeMessages = {
  'Valid JSON. Your result is ready.':'JSON 格式正确，结果已就绪。','Conversion complete.':'转换完成。','That does not look like valid Base64 text.':'这段内容似乎不是有效的 Base64 文本。','This text has an invalid URL escape sequence.':'文本中包含无效的 URL 转义序列。','Slug created.':'短链接已生成。','Type a title first.':'请先输入标题。','Calculation complete.':'计算完成。','Enter valid numbers to calculate.':'请输入有效数字进行计算。','Choose at least one character type.':'请至少选择一种字符类型。','Password created locally. Store it in a password manager.':'密码已在本地生成，请将其保存到密码管理器中。','Enter a valid Unix timestamp.':'请输入有效的 Unix 时间戳。','That timestamp is outside the supported date range.':'该时间戳超出支持的日期范围。','Date converted.':'日期转换完成。','Timestamp converted.':'时间戳转换完成。',Strong:'强',Good:'良好','Invalid JSON. Check the quotes, commas and brackets.':'JSON 格式无效，请检查引号、逗号和括号。','Base64 to decode...':'要解码的 Base64…',
};

export const copy = {
  'word-counter':['在线字数统计器','统计词数、字符数和阅读时间','在一个清晰的页面中快速统计词数、字符数、行数和阅读时间。','字数统计，在线字数计数，字符数统计，行数统计，阅读时间，word counter Chinese','输入或粘贴文本，即可查看词数、字符数和行数。','适合检查文章、作业、邮件和社交媒体文案的长度。文本仅在浏览器中处理，阅读时间也会即时估算。'],
  'text-case-converter':['英文大小写转换器','转换大写、小写和标题格式','将英文文本转换为大写、小写、句首大写或标题格式。中文字符没有大小写之分。','英文大小写转换，文本转大写，文本转小写，英文标题格式，text case converter Chinese','粘贴文本并选择所需格式，即可预览转换结果。','此工具用于转换拉丁字母的大小写格式。中文字符没有大小写之分，因此会保持不变。'],
  'remove-duplicate-lines':['删除重复行工具','清理列表并去除重复项','按原有顺序清理列表并删除重复行，过程在浏览器本地完成。','删除重复行，列表去重，文本去重，清理重复项目，remove duplicate lines Chinese','每行粘贴一项，选择空行和大小写选项，然后生成清理后的列表。','适合快速整理名单或文本列表。可以忽略大小写、去除空行并清除首尾空格。'],
  'json-formatter':['JSON 格式化与校验工具','格式化、压缩和检查 JSON','在浏览器中格式化、压缩并校验 JSON，无需上传数据。','JSON 格式化，JSON 校验，JSON 压缩，在线 JSON 工具，json formatter Chinese','粘贴 JSON 并点击“格式化 JSON”，即可查看整齐结果或定位语法错误。','可将 JSON 整理为易读格式，也可压缩有效数据。所有处理均在本地设备上进行。'],
  'base64-encoder-decoder':['Base64 编码与解码工具','文本和 Base64 相互转换','在浏览器中将文本编码为 Base64，或将 Base64 解码为可读文本。','Base64 编码，Base64 解码，在线 Base64 转换器，base64 encoder decoder Chinese','选择编码或解码，输入文本或 Base64 内容即可获得结果。','转换过程在本地完成。Base64 是编码格式，不是加密方式，不能用于保护机密信息。'],
  'url-encoder-decoder':['URL 编码与解码工具','编码 URL 文本或还原内容','为 URL 安全编码文本，或解码 URL 编码后的内容。','URL 编码，URL 解码，百分号编码，在线 URL 转换，url encoder decoder Chinese','输入链接或文本，然后选择编码或解码，即可立即查看结果。','此工具可处理 URL 中的空格和特殊字符。转换在浏览器内完成，不会改变文本原意。'],
  'text-to-slug':['文本转 URL 短链接工具','生成简洁清晰的 URL 短链接','将标题或短语转换为简洁、易读、适用于网页的 URL 短链接。','文本转 slug，生成 URL 短链接，SEO 链接，中文 slug，text to slug Chinese','输入标题，选择是否保留数字和非拉丁字符，然后生成短链接。','简洁的 URL 更易阅读和分享。可根据需要保留中文字符，也可以生成拉丁字母格式。'],
  'percentage-calculator':['百分比计算器','计算百分比和百分比变化','快速计算一个数的百分比、部分数占比以及两个数值之间的百分比变化。','百分比计算器，计算百分比，百分比变化，求一个数占另一个数的百分比，percentage calculator Chinese','在对应计算区域输入数值，即可立即查看答案。','工具提供三种常见百分比计算：求某数的百分比、计算部分占比，以及比较两个数值的变化。'],
  'password-generator':['安全随机密码生成器','按需生成随机密码','在浏览器本地生成随机密码，可自定义密码长度与字符类型。','随机密码生成器，生成强密码，安全密码，在线密码生成，password generator Chinese','选择密码长度和字符类型，然后点击“生成密码”。','密码使用浏览器的安全随机数功能生成，不会发送到服务器。请使用密码管理器保存。'],
  'timestamp-converter':['Unix 时间戳转换器','Unix 时间戳与日期互转','将 Unix 时间戳转换为日期，或将日期转换为秒和毫秒。','Unix 时间戳转日期，日期转时间戳，秒毫秒转换，timestamp converter Chinese','输入以秒或毫秒表示的时间戳，或选择日期和时间进行转换。','可查看 UTC 时间和本地时间，也可从日期取得时间戳。输入数据保留在浏览器中。'],
  'html-entity-encoder-decoder':['HTML 实体编码与解码工具','转换 HTML 特殊字符和实体','将特殊字符转换为 HTML 实体，或将 HTML 实体还原为可读文本。','HTML 实体编码，HTML 实体解码，特殊字符转义，html entity encoder decoder Chinese','输入文本并选择编码或解码，即可安全转换特殊字符。','可转换 & 和 < 等 HTML 特殊字符。处理直接在浏览器中进行，不会上传文本。'],
};
export const seo = Object.fromEntries(Object.entries(copy).map(([id, values]) => [id, { title: values[1], description: values[2] }]));
export const faq = {
  'word-counter':[{question:'如何统计中文文章的字数？',answer:'将文章粘贴到输入框，即可查看词数、字符数和行数。统计过程在浏览器中完成。'},{question:'输入的文本会上传到服务器吗？',answer:'不会，文本只在浏览器本地处理，不会上传。'}],
  'text-case-converter':[{question:'如何将文本转换为大写或小写？',answer:'粘贴文本，然后选择大写、小写、句首大写或标题格式。转换适用于拉丁字母。'},{question:'中文字符会发生变化吗？',answer:'中文字符没有大小写，因此会保持原样。'}],
  'remove-duplicate-lines':[{question:'如何删除列表中的重复行？',answer:'每行粘贴一项，设置空格和大小写选项，然后生成清理后的列表。'},{question:'去重后会保留原有顺序吗？',answer:'会。工具删除重复项，同时保留每项首次出现的位置。'}],
  'json-formatter':[{question:'如何格式化 JSON？',answer:'将 JSON 粘贴到输入框并点击“格式化 JSON”，即可查看易读格式并校验语法。'},{question:'可以压缩 JSON 吗？',answer:'可以。选择“压缩”即可删除有效 JSON 中的空白和格式字符。'}],
  'base64-encoder-decoder':[{question:'如何将文本转换为 Base64？',answer:'选择“编码为 Base64”，输入文本并点击“转换”，结果会在浏览器中显示。'},{question:'Base64 是加密方式吗？',answer:'不是。Base64 可以还原，不应用于保护密码或机密数据。'}],
  'url-encoder-decoder':[{question:'什么时候需要进行 URL 编码？',answer:'当文本含有空格或特殊字符并要放入 URL 时，可以使用 URL 编码。'},{question:'可以解码 URL 内容吗？',answer:'可以，选择解码并粘贴已编码文本，即可查看原始内容。'}],
  'text-to-slug':[{question:'如何从网页标题生成 URL 短链接？',answer:'输入标题，选择是否保留数字或中文字符，然后生成简洁易读的短链接。'},{question:'生成的短链接支持中文吗？',answer:'支持。启用保留非拉丁字符选项即可在 URL 短链接中保留中文。'}],
  'percentage-calculator':[{question:'如何计算一个数的百分比？',answer:'在第一个区域输入百分比和基数，计算器会立即显示结果。'},{question:'如何计算两个数之间的百分比变化？',answer:'在百分比变化区域输入原值和新值，即可查看增幅或降幅。'}],
  'password-generator':[{question:'如何生成随机密码？',answer:'选择密码长度和需要的字符类型，然后点击“生成密码”。'},{question:'密码会发送到网络上吗？',answer:'不会。密码由浏览器本地安全生成，不会离开你的设备。'}],
  'timestamp-converter':[{question:'如何将 Unix 时间戳转换为日期？',answer:'输入以秒或毫秒表示的时间戳，然后点击“转换为日期”。'},{question:'支持秒和毫秒两种时间戳吗？',answer:'支持。工具可以显示秒与毫秒，也能将日期和时间转换为这两种格式。'}],
  'html-entity-encoder-decoder':[{question:'如何对 HTML 特殊字符进行编码？',answer:'粘贴文本并选择“编码 HTML”，即可将特殊字符转换为 HTML 实体。'},{question:'如何解码 HTML 实体？',answer:'选择“解码 HTML”并粘贴实体，即可还原为可读文本。'}],
};
