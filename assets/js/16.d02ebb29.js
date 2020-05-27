(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{338:function(e,t,a){"use strict";a.r(t);var n=a(33),r=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("p",[e._v("collectionHandlers 主要是对 set、map、weakSet、weakMap 四种类型的对象进行劫持。\n主要有下面三种类型的 handler，当然照旧，我们拿其中的 mutableCollectionHandlers 进行讲解。剩余两种结合理解。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {\n  get: createInstrumentationGetter(false, false)\n}\n\nexport const shallowCollectionHandlers: ProxyHandler<CollectionTypes> = {\n  get: createInstrumentationGetter(false, false)(false, true)\n}\n\nexport const readonlyCollectionHandlers: ProxyHandler<CollectionTypes> = {\n  get: createInstrumentationGetter(true, false)\n}\n")])])]),a("p",[e._v("mutableCollectionHandlers 主要是对 collection 的方法进行劫持，所以主要是对 get 方法进行代理，接下来对 createInstrumentationGetter(false, false) 进行研究。")]),e._v(" "),a("p",[e._v("instrumentations 是代理 get 访问的 handler，当然如果我们访问的 key 是 ReactiveFlags，直接返回存储的值，否则如果访问的 key 在 instrumentations 上，在由 instrumentations 进行处理。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function createInstrumentationGetter(isReadonly: boolean, shallow: boolean) {\n  const instrumentations = shallow\n    ? shallowInstrumentations\n    : isReadonly\n      ? readonlyInstrumentations\n      : mutableInstrumentations\n\n  return (\n    target: CollectionTypes,\n    key: string | symbol,\n    receiver: CollectionTypes\n  ) => {\n    if (key === ReactiveFlags.isReactive) {\n      return !isReadonly\n    } else if (key === ReactiveFlags.isReadonly) {\n      return isReadonly\n    } else if (key === ReactiveFlags.raw) {\n      return target\n    }\n\n    return Reflect.get(\n      hasOwn(instrumentations, key) && key in target\n        ? instrumentations\n        : target,\n      key,\n      receiver\n    )\n  }\n}\n\n")])])]),a("p",[e._v("接下来看看 mutableInstrumentations ，可以看到 mutableInstrumentations 对常见集合的增删改查以及 迭代方法进行了代理，我们就顺着上面的 key 怎么进行拦截的。注意 this: MapTypes 是 ts 上对 this 类型进行标注")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const mutableInstrumentations: Record<string, Function> = {\n  get(this: MapTypes, key: unknown) {\n    return get(this, key, toReactive)\n  },\n  get size() {\n    return size((this as unknown) as IterableCollections)\n  },\n  has,\n  add,\n  set,\n  delete: deleteEntry,\n  clear,\n  forEach: createForEach(false, false)\n}\nconst iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator]\niteratorMethods.forEach(method => {\n  mutableInstrumentations[method as string] = createIterableMethod(\n    method,\n    false,\n    false\n  )\n  readonlyInstrumentations[method as string] = createIterableMethod(\n    method,\n    true,\n    false\n  )\n  shallowInstrumentations[method as string] = createIterableMethod(\n    method,\n    true,\n    true\n  )\n})\n\n")])])]),a("h3",{attrs:{id:"get-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#get-方法"}},[e._v("#")]),e._v(" get 方法")]),e._v(" "),a("p",[e._v("首先获取 target ，对 target 进行 toRaw， 这个会被 createInstrumentationGetter 中的 proxy 拦截返回原始的 target，然后对 key 也进行一次 toRaw, 如果两者不一样，说明 key 也是 reative 的， 对 key  和 rawkey 都进行 track ，然后调用 target 原型上面的 has 方法，如果 key 为 true ，调用 get 获取值，同时对值进行 wrap ，对于 mutableInstrumentations 而言，就是 toReactive。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function get(\n  target: MapTypes,\n  key: unknown,\n  wrap: typeof toReactive | typeof toReadonly | typeof toShallow\n) {\n  target = toRaw(target)\n  const rawKey = toRaw(key)\n  if (key !== rawKey) {\n    track(target, TrackOpTypes.GET, key)\n  }\n  track(target, TrackOpTypes.GET, rawKey)\n  const { has, get } = getProto(target)\n  if (has.call(target, key)) {\n    return wrap(get.call(target, key))\n  } else if (has.call(target, rawKey)) {\n    return wrap(get.call(target, rawKey))\n  }\n}\n")])])]),a("h3",{attrs:{id:"has-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#has-方法"}},[e._v("#")]),e._v(" has 方法")]),e._v(" "),a("p",[e._v("跟 get 方法差不多，也是对 key 和 rawkey 进行 track。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function has(this: CollectionTypes, key: unknown): boolean {\n  const target = toRaw(this)\n  const rawKey = toRaw(key)\n  if (key !== rawKey) {\n    track(target, TrackOpTypes.HAS, key)\n  }\n  track(target, TrackOpTypes.HAS, rawKey)\n  const has = getProto(target).has\n  return has.call(target, key) || has.call(target, rawKey)\n}\n")])])]),a("h3",{attrs:{id:"size-和-add-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#size-和-add-方法"}},[e._v("#")]),e._v(" size 和 add 方法")]),e._v(" "),a("p",[e._v("size 最要是返回集合的大小，调用原型上的 size 方法，同时触发 ITERATE 类型的 track，而 add 方法添加进去之前要判断原本是否已经存在了，如果存在，则不会触发 ADD 类型的 trigger。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function size(target: IterableCollections) {\n  target = toRaw(target)\n  track(target, TrackOpTypes.ITERATE, ITERATE_KEY)\n  return Reflect.get(getProto(target), 'size', target)\n}\n\nfunction add(this: SetTypes, value: unknown) {\n  value = toRaw(value)\n  const target = toRaw(this)\n  const proto = getProto(target)\n  const hadKey = proto.has.call(target, value)\n  const result = proto.add.call(target, value)\n  if (!hadKey) {\n    trigger(target, TriggerOpTypes.ADD, value, value)\n  }\n  return result\n}\n")])])]),a("h3",{attrs:{id:"set-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#set-方法"}},[e._v("#")]),e._v(" set 方法")]),e._v(" "),a("p",[e._v("set 方法是针对 map 类型的，从 this 的类型我们就可以看出来了， 同样这里我们也会对 key 做两个校验，第一，是看看现在 map 上面有没有存在同名的 key，来决定是触发 SET 还是 ADD 的 trigger， 第二，对于开发环境，会进行 checkIdentityKeys 检查")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function set(this: MapTypes, key: unknown, value: unknown) {\n  value = toRaw(value)\n  const target = toRaw(this)\n  const { has, get, set } = getProto(target)\n\n  let hadKey = has.call(target, key)\n  if (!hadKey) {\n    key = toRaw(key)\n    hadKey = has.call(target, key)\n  } else if (__DEV__) {\n    checkIdentityKeys(target, has, key)\n  }\n\n  const oldValue = get.call(target, key)\n  const result = set.call(target, key, value)\n  if (!hadKey) {\n    trigger(target, TriggerOpTypes.ADD, key, value)\n  } else if (hasChanged(value, oldValue)) {\n    trigger(target, TriggerOpTypes.SET, key, value, oldValue)\n  }\n  return result\n}\n")])])]),a("p",[e._v("checkIdentityKeys 就是为了检查目标对象上面，是不是同时存在 rawkey 和 key，因为这样可能会数据不一致。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function checkIdentityKeys(\n  target: CollectionTypes,\n  has: (key: unknown) => boolean,\n  key: unknown\n) {\n  const rawKey = toRaw(key)\n  if (rawKey !== key && has.call(target, rawKey)) {\n    const type = toRawType(target)\n    console.warn(\n      `Reactive ${type} contains both the raw and reactive ` +\n        `versions of the same object${type === `Map` ? `as keys` : ``}, ` +\n        `which can lead to inconsistencies. ` +\n        `Avoid differentiating between the raw and reactive versions ` +\n        `of an object and only use the reactive version if possible.`\n    )\n  }\n}\n")])])]),a("h3",{attrs:{id:"deleteentry-和-clear-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#deleteentry-和-clear-方法"}},[e._v("#")]),e._v(" deleteEntry 和 clear 方法")]),e._v(" "),a("p",[e._v("deleteEntry 主要是为了触发 DELETE trigger ，流程跟上面 set 方法差不多，而 clear  方法主要是触发 CLEAR track，但是里面做了一个防御性的操作，就是如果集合的长度已经为0，则调用 clear 方法不会触发 trigger。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function deleteEntry(this: CollectionTypes, key: unknown) {\n  const target = toRaw(this)\n  const { has, get, delete: del } = getProto(target)\n  let hadKey = has.call(target, key)\n  if (!hadKey) {\n    key = toRaw(key)\n    hadKey = has.call(target, key)\n  } else if (__DEV__) {\n    checkIdentityKeys(target, has, key)\n  }\n\n  const oldValue = get ? get.call(target, key) : undefined\n  // forward the operation before queueing reactions\n  const result = del.call(target, key)\n  if (hadKey) {\n    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)\n  }\n  return result\n}\n\nfunction clear(this: IterableCollections) {\n  const target = toRaw(this)\n  const hadItems = target.size !== 0\n  const oldTarget = __DEV__\n    ? target instanceof Map\n      ? new Map(target)\n      : new Set(target)\n    : undefined\n  // forward the operation before queueing reactions\n  const result = getProto(target).clear.call(target)\n  if (hadItems) {\n    trigger(target, TriggerOpTypes.CLEAR, undefined, undefined, oldTarget)\n  }\n  return result\n}\n")])])]),a("h3",{attrs:{id:"foreach-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#foreach-方法"}},[e._v("#")]),e._v(" forEach 方法")]),e._v(" "),a("p",[e._v("在调用 froEach 方法的时候会触发 ITERATE 类型的 track，需要注意 Size 方法也会同样类型的 track，毕竟集合整体的变化会导致整个两个方法的输出不一样。顺带提一句，还记得我们的 effect 时候的 trigger 吗，对于 SET | ADD | DELETE 等类似的操作，因为会导致集合值得变化，所以也会触发 ITERATE_KEY 或则 MAP_KEY_ITERATE_KEY 的 effect 重新收集依赖。")]),e._v(" "),a("p",[e._v("在调用原型上的 forEach 进行循环的时候，会对 key 和 value 都进行一层 wrap，对于我们来说，就是 reactive。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function createForEach(isReadonly: boolean, shallow: boolean) {\n  return function forEach(\n    this: IterableCollections,\n    callback: Function,\n    thisArg?: unknown\n  ) {\n    const observed = this\n    const target = toRaw(observed)\n    const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive\n    !isReadonly && track(target, TrackOpTypes.ITERATE, ITERATE_KEY)\n    // important: create sure the callback is\n    // 1. invoked with the reactive map as `this` and 3rd arg\n    // 2. the value received should be a corresponding reactive/readonly.\n    function wrappedCallback(value: unknown, key: unknown) {\n      return callback.call(thisArg, wrap(value), wrap(key), observed)\n    }\n    return getProto(target).forEach.call(target, wrappedCallback)\n  }\n}\n\n")])])]),a("h3",{attrs:{id:"createiterablemethod-方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#createiterablemethod-方法"}},[e._v("#")]),e._v(" createIterableMethod 方法")]),e._v(" "),a("p",[e._v("主要是对集合中的迭代进行代理，"),a("code",[e._v("['keys', 'values', 'entries', Symbol.iterator]")]),e._v(" 主要是这四个方法。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator]\niteratorMethods.forEach(method => {\n  mutableInstrumentations[method as string] = createIterableMethod(\n    method,\n    false,\n    false\n  )\n  readonlyInstrumentations[method as string] = createIterableMethod(\n    method,\n    true,\n    false\n  )\n  shallowInstrumentations[method as string] = createIterableMethod(\n    method,\n    true,\n    true\n  )\n})\n")])])]),a("p",[e._v("可以看到，这个方法也会触发 TrackOpTypes.ITERATE 类型的 track，同样也会在遍历的时候对值进行 wrap，需要主要的是，这个方法主要是 iterator protocol 进行一个 polyfill， 所以需要实现同样的接口方便外部进行迭代。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function createIterableMethod(\n  method: string | symbol,\n  isReadonly: boolean,\n  shallow: boolean\n) {\n  return function(this: IterableCollections, ...args: unknown[]) {\n    const target = toRaw(this)\n    const isMap = target instanceof Map\n    const isPair = method === 'entries' || (method === Symbol.iterator && isMap)\n    const isKeyOnly = method === 'keys' && isMap\n    const innerIterator = getProto(target)[method].apply(target, args)\n    const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive\n    !isReadonly &&\n      track(\n        target,\n        TrackOpTypes.ITERATE,\n        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY\n      )\n    // return a wrapped iterator which returns observed versions of the\n    // values emitted from the real iterator\n    return {\n      // iterator protocol\n      next() {\n        const { value, done } = innerIterator.next()\n        return done\n          ? { value, done }\n          : {\n              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),\n              done\n            }\n      },\n      // iterable protocol\n      [Symbol.iterator]() {\n        return this\n      }\n    }\n  }\n}\n")])])]),a("p",[e._v("总的来说对集合的代理，就是对集合方法的代理，在集合方法的执行的时候，进行不同类型的 key 的 track 或者 trigger。")])])}),[],!1,null,null,null);t.default=r.exports}}]);