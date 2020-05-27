(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{336:function(e,n,t){"use strict";t.r(n);var s=t(33),o=Object(s.a)({},(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("p",[e._v("这里主要讲讲 parse ，看看 Vue 怎么对模板进行初步的解析。 在 compile 中调用 baseParse 进行 parse，所以这里先看看 baseParse 。")]),e._v(" "),t("p",[e._v("在解析之前，会创建一个上下文，用于保存当前解析进度和一些配置项。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export function baseParse(\n  content: string,\n  options: ParserOptions = {}\n): RootNode {\n  const context = createParserContext(content, options)\n  const start = getCursor(context)\n  return createRoot(\n    parseChildren(context, TextModes.DATA, []),\n    getSelection(context, start)\n  )\n}\n")])])]),t("p",[e._v("options 中基本是用 parseOptions 传下来的 options 进行覆盖， column 表示第几行， line 表示第几列， offset 表示传入 content 的偏差，originalSource 表示原始字符串，在 parse 不会被修改，source 一开始代表原始字符串，在 parse 过程会被裁剪， inPre 表示是否在 pre 标签里面，inVPre 表示是否在 VPre 标签里面。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("function createParserContext(\n  content: string,\n  options: ParserOptions\n): ParserContext {\n  return {\n    options: {\n      ...defaultParserOptions,\n      ...options\n    },\n    column: 1,\n    line: 1,\n    offset: 0,\n    originalSource: content,\n    source: content,\n    inPre: false,\n    inVPre: false\n  }\n}\n")])])]),t("p",[e._v("回到 baseParse，创建完 context 之后，我们首先获取一开始的字符串的坐标。 getCursor 返回当前的 行、列、偏差。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("function getCursor(context: ParserContext): Position {\n  const { column, line, offset } = context\n  return { column, line, offset }\n}\n")])])]),t("p",[e._v("然后在调用 createRoot 返回根节点的 ast 之前，使用 parseChildren 对模板进行解析。一开始的 TextModes 为DATA，正如我们在 compiler 里面曾经说过，不同的 TextModes 会影响解析。 从下面可以看出，DATA 可以包含 Elements、 Entities ，结束的标志是在 tags 栈中找到 关闭 tag，而对于 RCDATA，不包含  Elements，包含Entities， 结束的标志是 tags 栈上一级有关闭 tag， 一般处于 textarea，RAWTEXT 不包含  Elements 和Entities，结束的标志页数是 tags 栈上一级有关闭 tag，一般位于 style 和 script 内。可能在这里单独讲概念有点懵，后面结合解析过程来会加深理解。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export const enum TextModes {\n  //          | Elements | Entities | End sign              | Inside of\n  DATA, //    | ✔        | ✔        | End tags of ancestors |\n  RCDATA, //  | ✘        | ✔        | End tag of the parent | <textarea>\n  RAWTEXT, // | ✘        | ✘        | End tag of the parent | <style>,<script>\n  CDATA,\n  ATTRIBUTE_VALUE\n}\nparseChildren(context, TextModes.DATA, [])\n")])])]),t("p",[e._v("需要注意的是，对于 Dom 平台来说，对于 DOMNamespaces.HTML,包括在 iframe 和 noscript 标签里面，RCDATA 还包括 title。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("const isRawTextContainer = /*#__PURE__*/ makeMap(\n  'style,iframe,script,noscript',\n  true\n)\ngetTextMode({ tag, ns }: ElementNode): TextModes {\n    if (ns === DOMNamespaces.HTML) {\n      if (tag === 'textarea' || tag === 'title') {\n        return TextModes.RCDATA\n      }\n      if (isRawTextContainer(tag)) {\n        return TextModes.RAWTEXT\n      }\n    }\n    return TextModes.DATA\n}\n")])])]),t("p",[e._v("现在进行 parseChildren 的分析。首先获取父级 以及 父级的Namespaces，nodes 是解析后的 AST 节点。可以看到，一个 while 循环判断是否解析结束了，同时会 传入去 mode、ancestors，对于根节点来说，ancestors 一开始为空数组。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("function parseChildren(\n  context: ParserContext,\n  mode: TextModes,\n  ancestors: ElementNode[]\n): TemplateChildNode[] {\n  const parent = last(ancestors)\n  const ns = parent ? parent.ns : Namespaces.HTML\n  const nodes: TemplateChildNode[] = []\n\n  while (!isEnd(context, mode, ancestors)) {\n    ...\n  }\n\n  // Whitespace management for more efficient output\n  // (same as v2 whitespace: 'condense')\n  let removedWhitespace = false\n  if (mode !== TextModes.RAWTEXT) {\n    ...\n  }\n\n  return removedWhitespace ? nodes.filter(Boolean) : nodes\n}\n")])])]),t("p",[e._v("isEnd 用于判断是否应该要结束解析，但是不同 TextMode 下，对 end 的判断是不同的，其实这点在上面讲 TextModes 的时候已经讲了，TextModes.DATA 允许有标签没闭合，所以只要祖先有相同的标签就可以了，而 RCDATA、RAWTEXT 要求父级标签跟闭合标签一样才算结束，而对于 TextModes.CDATA ，则要求 "),t("code",[e._v("]]>")]),e._v(" 结尾，如果都不符合这些条件，则看看 s 是否为空来决定是否到尽头了。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("function isEnd(\n  context: ParserContext,\n  mode: TextModes,\n  ancestors: ElementNode[]\n): boolean {\n  const s = context.source\n\n  switch (mode) {\n    case TextModes.DATA:\n      if (startsWith(s, '</')) {\n        //TODO: probably bad performance\n        for (let i = ancestors.length - 1; i >= 0; --i) {\n          if (startsWithEndTagOpen(s, ancestors[i].tag)) {\n            return true\n          }\n        }\n      }\n      break\n\n    case TextModes.RCDATA:\n    case TextModes.RAWTEXT: {\n      const parent = last(ancestors)\n      if (parent && startsWithEndTagOpen(s, parent.tag)) {\n        return true\n      }\n      break\n    }\n\n    case TextModes.CDATA:\n      if (startsWith(s, ']]>')) {\n        return true\n      }\n      break\n  }\n\n  return !s\n}\n")])])]),t("p",[e._v("回到 while 循环，如果 isEnd 为 false， 进入循环，如果 mode 为 "),t("code",[e._v("mode === TextModes.DATA || mode === TextModes.RCDATA")]),e._v(" 则进入 if 里面，否者往下走，如果这时 node 还为空，则直接进行 parseText 操作。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("__TEST__ && assert(context.source.length > 0)\nconst s = context.source\nlet node: TemplateChildNode | TemplateChildNode[] | undefined = undefined\nif (mode === TextModes.DATA || mode === TextModes.RCDATA) {\n    ...\n}\nif (!node) {\n  node = parseText(context, mode)\n}\n")])])]),t("p",[e._v("parseText, 看名字就知道用来干嘛的，首先利用 endTokens 去判断结尾，分别是标签的开头、左delimiters， 如果是 TextModes.CDATA 模式下，还包括 "),t("code",[e._v("]]>")]),e._v("， 我们需要最小的 endIndex，即尽可能短的 Text，接着使用 parseTextData 对内容解析。")]),e._v(" "),t("p",[e._v("parseTextData 首先 slice source 得到 rawtext，然后 advanceBy 让 context 中 columin、 line 往前进同时对 context.source 进行切割。接下来的判断，就是决定要不要对 Entities 进行解码，对于 "),t("code",[e._v("mode === TextModes.RAWTEXT || mode === TextModes.CDATA")]),e._v(" 这两种不需要解码，而如果是其他模式，但是里面没有 "),t("code",[e._v("&")]),e._v("， 也不需要解码，否则调用传进来的解码函数进行解码。")]),e._v(" "),t("p",[e._v("parseTextData 结束后，返回 AST 节点，其中类型为 NodeTypes.TEXT， 内容为 parseTextData 返回的内容，loc 代表这个节点开始位置、结束位置以及原始内容，其中位置用三个维度去表示 行、列、偏移，需要记住的是，结束位置是开区间。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("function parseText(context: ParserContext, mode: TextModes): TextNode {\n  __TEST__ && assert(context.source.length > 0)\n\n  const endTokens = ['<', context.options.delimiters[0]]\n  if (mode === TextModes.CDATA) {\n    endTokens.push(']]>')\n  }\n\n  let endIndex = context.source.length\n  for (let i = 0; i < endTokens.length; i++) {\n    const index = context.source.indexOf(endTokens[i], 1)\n    if (index !== -1 && endIndex > index) {\n      endIndex = index\n    }\n  }\n\n  __TEST__ && assert(endIndex > 0)\n\n  const start = getCursor(context)\n  const content = parseTextData(context, endIndex, mode)\n\n  return {\n    type: NodeTypes.TEXT,\n    content,\n    loc: getSelection(context, start)\n  }\n}\nfunction parseTextData(\n  context: ParserContext,\n  length: number,\n  mode: TextModes\n): string {\n  const rawText = context.source.slice(0, length)\n  advanceBy(context, length)\n  if (\n    mode === TextModes.RAWTEXT ||\n    mode === TextModes.CDATA ||\n    rawText.indexOf('&') === -1\n  ) {\n    return rawText\n  } else {\n    // DATA or RCDATA containing \"&\"\". Entity decoding required.\n    return context.options.decodeEntities(\n      rawText,\n      mode === TextModes.ATTRIBUTE_VALUE\n    )\n  }\n}\n")])])]),t("p",[e._v("回到上面的判断，对于 "),t("code",[e._v("mode === TextModes.DATA || mode === TextModes.RCDATA")]),e._v(" 模式下，记住根节点是 TextModes.DATA 模式，继续判断，如果不在 inVPre 下面，又是左 delimiters 开头的，对于默认 delimiters 对是 "),t("code",[e._v("{{")]),e._v(" 和 "),t("code",[e._v("}}")]),e._v("，这些都满足，则进行插值 parseInterpolation 的解析。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("if (mode === TextModes.DATA || mode === TextModes.RCDATA) {\n    if (!context.inVPre && startsWith(s, context.options.delimiters[0])) {\n        // '{{'\n        node = parseInterpolation(context, mode)\n      } else if (mode === TextModes.DATA && s[0] === '<') {\n       \n    }\n}\n")])])]),t("p",[e._v("parseInterpolation 插值函数如下，")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("function parseInterpolation(\n  context: ParserContext,\n  mode: TextModes\n): InterpolationNode | undefined {\n  const [open, close] = context.options.delimiters\n  __TEST__ && assert(startsWith(context.source, open))\n\n  const closeIndex = context.source.indexOf(close, open.length)\n  if (closeIndex === -1) {\n    emitError(context, ErrorCodes.X_MISSING_INTERPOLATION_END)\n    return undefined\n  }\n\n  const start = getCursor(context)\n  advanceBy(context, open.length)\n  const innerStart = getCursor(context)\n  const innerEnd = getCursor(context)\n  const rawContentLength = closeIndex - open.length\n  const rawContent = context.source.slice(0, rawContentLength)\n  const preTrimContent = parseTextData(context, rawContentLength, mode)\n  const content = preTrimContent.trim()\n  const startOffset = preTrimContent.indexOf(content)\n  if (startOffset > 0) {\n    advancePositionWithMutation(innerStart, rawContent, startOffset)\n  }\n  const endOffset =\n    rawContentLength - (preTrimContent.length - content.length - startOffset)\n  advancePositionWithMutation(innerEnd, rawContent, endOffset)\n  advanceBy(context, close.length)\n\n  return {\n    type: NodeTypes.INTERPOLATION,\n    content: {\n      type: NodeTypes.SIMPLE_EXPRESSION,\n      isStatic: false,\n      // Set `isConstant` to false by default and will decide in transformExpression\n      isConstant: false,\n      content,\n      loc: getSelection(context, innerStart, innerEnd)\n    },\n    loc: getSelection(context, start)\n  }\n}\n")])])])])}),[],!1,null,null,null);n.default=o.exports}}]);