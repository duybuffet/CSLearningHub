# Phase 9 — Design Patterns: content review

Scope: all 17 files in `src/content/phase9/`. Every JS/TS `code` section was run with Node 23 (`--experimental-transform-types`); TS-only snippets (TC39 decorators, typed emitter) were compiled with `tsc --strict`. Snippets that depend on an earlier section (Command macro, Facade tests) were run concatenated with their dependencies. Final: `node scripts/validate-content.mjs phase9/` → 17 topics, 0 errors, 0 warnings.

**Cross-cutting:** quiz answers were almost all at index 1 or 2 in every file (index 0/3 were almost never correct). Options were swapped so every file now spreads answers across 0–3. Only the order changed; no explanation refers to a position.

## singleton
- Prisma hot-reload code was wrong: it ran `new PrismaClient()` *before* checking `globalThis`, so each reload still built a new client. Rewrote it to the official `globalThis.__prisma ?? new PrismaClient()` pattern.
- GoF callout said the GoF book proposed double-checked locking. It did not (DCL is Schmidt & Harrison, 1996, broken before Java 5 unless the field is `volatile`). Rewrote the callout and the lazy-init paragraph.
- "WeakRef as an older pattern" → the `_instance` convention. Added that JS has no private constructors (TS `private constructor` is compile-time only).
- Angular "request-scoped providers" do not exist → NestJS `Scope.REQUEST` / Angular hierarchical injectors. Fixed the cold-start wording. `Object.freeze` is shallow.
- classDiagram: `instance` and `getInstance` are now marked static (`$`).
- **Added:** a callout on module singletons being per *resolved path* (duplicate `node_modules` copies, the CJS/ESM dual-package hazard, symlinks), plus a matching takeaway.

## factory-method
- The text says Factory Method needs a subclass override, then called `React.createElement` and `http.createServer` Factory Methods. Rewrote the frameworks section to split true Factory Method hooks (React class `render()`, Spring `createBean()`) from factory functions (createElement/`jsx()`, createServer, NestJS `useFactory`, `Router()`, `jest.fn()`, `mongoose.model()`).
- Removed the false claim that Fiber changed the element format. Used React 19's element changes instead. `http.createServer` has no TLS (that is `https`).
- Angular `ComponentFactoryResolver` has been deprecated since v13 → `createComponent`.
- q8 was rewritten (createElement is a factory function, not a GoF Factory Method).
- Renamed `Document` → `SourceDoc` in the TS snippet (it clashed with the DOM type).
- **Added:** GoF intent quote, Bloch's static factory method as a separate idea, and a "three different factories" takeaway.

## abstract-factory
- **Bug:** the Postgres builder emitted `$alice@x…` (it interpolated values as `$${v}`), and the SQLite builder spliced quoted values straight into SQL. Both now use proper placeholders (`$1,$2` vs `?`), and the output is printed and verified.
- React renderers: replaced the inaccurate "react-test-renderer/createElement is the factory" with the real Abstract Factory, the `react-reconciler` host config (`createInstance`…).
- MUI `createTheme` is now presented as a counter-example (a config object, not a factory). TestBed now uses `provideHttpClientTesting` (`HttpClientTestingModule` is deprecated). JDBC: `Connection` is the abstract factory.
- The "type system encodes the constraint" claim was softened (nothing stops `new DarkButton()`). Removed the "red lines" caption error. Added `<<interface>>`.
- **Added:** an idiomatic JS object-of-functions factory with `satisfies` (code_concept).

## builder
- **Bug:** the Director reused one QueryBuilder, so `paginatedSearch` really output stale `status='active'` and `ORDER BY created_at` clauses, unlike its comment. It also had SQL injection via `ILIKE '%${term}%'`. Rewrote it: the Director takes a builder factory, values are bound parameters (`{sql, params}`), and there is a real cross-field rule. Output verified.
- The HTTP Director example now carries a single-use warning.
- GoF history was wrong: Builder is not "one of three creational patterns", and the example was an RTF reader with ASCII/TeX/TextWidget converters. Fixed it, with the GoF intent.
- supertest `.expect()` is not terminal. Removed the axios "Director" and the Apollo cache claims. Thread-safety text corrected for JS workers (postMessage clones).
- Options-object vs Builder thresholds contradicted each other (4–8 / 6+ / 7+). Reframed: in JS, named options already fix telescoping, so choose Builder for step-wise assembly, validation, presets or multiple representations. Updated the KT and q8.
- **Added:** a "reusing a builder leaks state" takeaway.

## adapter
- Stripe example passed `49.99` dollars. It now converts to integer cents and a lowercase currency. The idempotency key was `Date.now()` (not idempotent) and is now flagged.
- Class adapter "impossible in TS" is false: `extends Adaptee implements Target` works when Target is an interface. Fixed the text, KT and q3.
- `InMemoryLogger`/Fake processors were called adapters. They are test doubles, and the text is corrected. Renamed the fictional "Winston" SDK (the real Winston API differs) to `LegacyLogSDK`.
- Real-world list: removed the `useRef`, user-event and Jest-mock-as-adapter claims. Added `util.promisify`, `Readable.toWeb/fromWeb`, and Prisma driver adapters.
- **Added:** a Ports & Adapters (Hexagonal) section plus a takeaway.

## decorator
- **Bug:** the DataSource demo printed `[object Object]` (it encrypted `String(obj)`), and the stack did encrypt-then-compress (the wrong order). It is now compress → encrypt, recovers the object, and has the CRIME/BREACH note.
- **Quiz q5 was marked wrong:** swapping to Log-outer means cache *hits* get logged too. Fixed the answer and explanation, plus the matching sentence and the wrong log-order comments in the service example.
- Java I/O: `InputStreamReader` is an **Adapter**, not a decorator. Fixed the text and rewrote q10. The GoF example was TextView/ScrollDecorator.
- The TS decorators callout was wrong ("ES2022 proposal", TypeORM `@Transactional`). It now says TC39 Stage 3, on by default in TS 5, with legacy `experimentalDecorators` still used by Angular/Nest/TypeORM.
- Express middleware → Chain of Responsibility; Koa onion = decorator (diagram redrawn). NestJS guards/pipes ≠ around-wrappers.
- **Added:** a code_concept with a higher-order `withRetry` and a TC39 `@logged` method decorator (compiled and run).

## facade
- The single-file module-facade example failed to run (duplicate `login` import). The caller import is now a comment.
- "Humble Object" was misapplied, and the text now explains the real meaning.
- AWS `S3.upload()` (v2, end-of-support) → v3 `Upload` from `@aws-sdk/lib-storage`. React Query v5 `useQuery({queryKey, queryFn})`.
- Sharpened the Mediator test. Stripe "tested against the real API" → test mode.
- **Added:** `package.json` `exports` enforcement, and the barrel-file caveat (test/dev perf, circular imports).

## proxy
- Removed "double-checked locking" again. Added the real JS issue: async lazy init must cache the promise.
- Service workers are caching/network proxies, not remote proxies (text, diagram, KT).
- Vue `ref()` is a getter/setter object, not a Proxy. Reactivity Transform was dropped in 3.4. SQLAlchemy uses descriptors, not `__getattr__`. dataclasses/attrs claims removed.
- History: AngularJS/Backbone/Knockout did not use `defineProperty` (dirty checking, explicit get/set). RPC stubs date from the 1980s.
- Frozen-object gotcha was wrong (proxying is allowed, but trap invariants apply).
- **Added:** a code_concept on ES Proxy pitfalls (Map/#private internal slots, identity, `Reflect` + receiver, verified), plus "language Proxy ≠ Proxy pattern" and a takeaway.

## composite
- Comment math error (`178 + 501 = 679` → `177 + 501 = 678`). The sequence diagram had the wrong tree (Submit under sidebar) and was redrawn.
- "TS flags leaf.add()" in the transparent variant is false. `getBoundingClientRect` does not aggregate children. Apache POI is not Composite (moved to a counter-example). Three.js: any `Object3D` has children, via `updateMatrixWorld`/`traverse`.
- Stack depth concerns tree depth, not node count. The caching note was not Flyweight. `getDepth` needed `Math.max(0, …)`.
- **Added:** the DOM as the transparent variant (`appendChild` on Text throws `HierarchyRequestError`).

## observer
- The async "batching" snippet did not batch, and now uses a scheduled flag (verified: 3 sets → 1 update).
- Redux "throws if an observer dispatches" was wrong (reducers may not dispatch, subscribers may). Fixed the text and q7.
- The snapshot diagram contradicted snapshot semantics. Redrew it and noted the Node vs DOM difference.
- RxJS `pluck` is deprecated and `select` is NgRx. Removed "canonical OCP example from the GoF book". MobX reactions run at action end (not a microtask). React 18 removed the unmounted-setState warning. Angular `takeUntilDestroyed`.
- The TS emitter section was labelled `javascript` and is now `typescript` (it compiles).
- **Added:** `AbortController` listener teardown, `useSyncExternalStore`, and a batching takeaway.

## strategy
- Rewrote the Stripe strategy test: the old one used `new` on a plain object, with an async SDK under sync assertions. The new one is an injected SDK, integer cents, and is verified. Cents fix in the closure example too.
- Removed axios interceptors and webpack plugins as Strategy (plugins are hooks/Observer). Fixed the `Intl.Collator` usage and the Zod API. Passport `compareSync` → `await bcrypt.compare`.
- Decision diagram rewritten (it wrongly sent "no runtime swap" to Template Method). Added the State nuance: either the context or the states own transitions, and states know their siblings.
- Fixed the self-contradictory misconception title.

## command
- Comment/output mismatch (`" JS World"`): the delete length is now fixed.
- **Event sourcing stored "commands"** (it stores events). Fixed in the text and callout, and added commands-vs-events as a takeaway. Outbox claimed exactly-once (it is at-least-once, so consumers must be idempotent).
- Flyway undo is a paid feature, and many teams run forward-only migrations. Redux style guide: actions as events. VS Code command ids corrected. Diagram: `<<interface>>` and aggregation.

## state
- KT/text claimed adding a state needs no edits. In fact incoming states change, and new *events* touch every state. Fixed the TS "OCP" paragraph the same way.
- The "string-literal union" was called a discriminated union. Added a real discriminated-union example. Removed "Mealy diagram".
- Callout: TCP path completed, plus RFC 9293 and the Linux `sk_state` note. Removed the unverifiable "Microsoft Office uses XState" claim. Fixed the commercetools API, the Unity Animator wording and the RTK status names. GoF's TCPConnection origin was added to the intro.
- The JS "must implement every method" claim was nuanced (base class with throwing defaults). Softened the singleton-states perf claim. q6 distractor fixed (it was actually a true benefit).

## iterator
- **Bug:** the pipeline demo printed `[0,1,1,144, 1.7e27]`. Only 0, 1, 144 are square Fibonacci numbers, so it ran past 2^53 into a float false positive. Rewrote it to match the diagram (`[0,1,1,4,9]`, the diagram had said `[…,25]`). Added the native Iterator Helpers version and an infinite-filter caveat.
- Iterator Helpers are shipped ES2025 (Node 22+), no longer "coming". Object destructuring does not use iterators. GoF iterator API names fixed. Python *raises* StopIteration (the invented performance rationale was removed). Removed the React/useReducer filler.
- **Added:** generator lifecycle edges, `pipeline()` with async generators, and an Iterator Helpers takeaway.

## template-method
- Express error middleware as Template Method is weak and was replaced with Node streams `_read/_write/_transform` (genuine). Added the Spring `JdbcTemplate` callback flavour.
- "Fiber reconciler is the AbstractClass" → `React.Component`. No `final` in JS/TS. Fixed the Hollywood-principle attribution and section title.
- **q10 was ambiguous:** two options both described "one generation of subclasses". Replaced it with a JdbcTemplate callback-template question.

## design-patterns-in-the-wild
- `crypto.createCipher()` (removed in Node 22) → `createCipheriv`. Added `stream.pipeline()` over `.pipe()` (error propagation).
- Redux: the reducer was called the GoF *invoker* (the store's dispatch is the Invoker, the reducer the Receiver). "Replayed in any order" → original order. The mutation explanation was wrong (listeners still fire; selectors miss reference changes). Fixed the unsubscribe `indexOf -1` bug. Noted that `createStore` is deprecated and SSR needs a store per request.
- `getMany()`/`execute()` called "Director". The Builder demo used undefined `minOrders` and claimed `$2: 0`. Both are fixed and the output verified.
- The GoF book used C++/Smalltalk, not Java. `pipe()` ≠ CoR. Closure ≠ Singleton. Active Record is not "Domain Object + Data Mapper". Prisma `$use` deprecated → `$extends`. Context/provide-inject is DI, not Mediator. Nest DI is an IoC container, not a Service Locator. Fastify uses hooks/decorate. Removed the made-up "70%" statistic.
- Added promise *resolved ≠ fulfilled*, and real cancellation via AbortController (the old "no backward edges" explanation was nonsense). Streams are described as Pipes-and-Filters with Decorator intuition (q4 reworded).

## anti-patterns-and-tradeoffs
- The `_AppState__instance` reset hack is Python name-mangling and does not exist in JS. Fixed the code comment and text.
- Express "middlewares are EventEmitter subscribers" and Redux "reducers are subscribers" were wrong. Rewrote both examples.
- The Rule of Three wording was inconsistent ("two use cases" vs "extract on third"), and the Strategy threshold of 3+ contradicted the strategy topic. Reconciled them (consider at two, extract at three unless the axis is certain), and updated the KT and q6.
- Throwing listeners are not "silent". TS interfaces have zero runtime cost, and structural typing means fakes need no interface. Fixed the AbstractSingletonProxyFactoryBean history. Replaced the dubious "Backbone God Collection" example.

## Unsure / flag for lead
- Prisma `$use` middleware: I said "deprecated in favour of Client extensions". I believe it was later removed in Prisma 6.x, but I did not state a removal version.
- TC39 decorators: I wrote "native engine support has lagged the spec; in practice compiled by TS/Babel". I could not verify the 2026 engine-shipping status.
- Mermaid labels throughout use `\n` inside quoted labels (pre-existing convention across the app). I left this unchanged.
