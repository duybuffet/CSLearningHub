# Content review — security-web (phase16 + phase17)

Validation: `node scripts/validate-content.mjs phase16/ phase17/` → 12 topics, 0 errors, 0 warnings.
All JS examples that can run in Node were run (Node 23; bcrypt / jsonwebtoken / zod 4 / express 5 installed in a scratch dir). Browser-only snippets were syntax-checked.
Quiz answers in every topic were re-spread; no explanation refers to an option by letter.

## phase16

### cryptography-fundamentals
- Code bug: comment said "MODP group 14" but the code called `createDiffieHellman(2048)`, which generates a new prime and takes seconds → replaced with X25519 + `diffieHellman()` + HKDF. RSA signing used the default PKCS#1 v1.5 → replaced with Ed25519 plus RSA-PSS (3072-bit). Added a tamper demo (flip one ciphertext bit, `final()` throws). All run.
- Password example only had the WRONG case (bcrypt commented out) → added runnable salted scrypt with a `timingSafeEqual` verify. `safeCompare` now hashes both sides, so lengths never leak.
- Security table listed made-up "AES-80/AES-112" and "P-160" → now NIST SP 800-57 equivalents (3DES, 160-bit ECC). Fixed "RSA-PSS (legacy TLS)" (it's the TLS 1.3 RSA scheme). Fixed "Ed25519 in TLS certificates" (the Web PKI doesn't support it).
- Facts fixed: RSA works by Euler's theorem (not Fermat). Curve25519 parameters are "rigid"/deterministic, not "verifiably random". POODLE/BEAST/CRIME were mis-attributed (CRIME = compression; BEAST is not a padding oracle). RSA blinding described correctly. Removed the unverifiable "Project Zero VPN nonce reuse" claim and cited the 2016 "Nonce-Disrespecting Adversaries" scan instead. TLS 1.3 handshake bullets corrected (key_share in ClientHello, encrypted cert, CertificateVerify, AEAD with no separate MAC keys).
- Added: GCM nonce limit (~2³² random nonces per key), AES-GCM-SIV/XChaCha20. MD5/SHA-1 broken (SHAttered). ECDSA nonce reuse (PS3). RSA vs ECDSA vs Ed25519 in 2026. Rewrote the post-quantum callout: FIPS 203/204/205, FN-DSA pending, X25519MLKEM768 on by default in browsers, OpenSSL 3.5 and Cloudflare. Two new takeaways.

### hashing-and-digital-signatures
- Code bug: the Ed25519 example used `createSign('SHA512')`, which **throws** for Ed25519 keys → rewritten with `crypto.sign(null, …)`. The JWT demo used `exp` in ms → now seconds, and it pins `alg` and checks `exp`. The `SHA-256('Hello')` digest in a comment was wrong → corrected.
- OWASP Argon2id numbers were wrong ("64 MiB, t=3, p=4" is the RFC 9106 option). OWASP's minimum is 19 MiB, t=2, p=1 → now both are given correctly. bcrypt minimum cost is 10.
- 94⁸ was called "6 trillion … under 10 minutes" → it is 6.1×10¹⁵: about 3 days on one GPU, or minutes on hundreds of GPUs.
- Argon2id hybrid described wrongly in both the text and the q9 option → it's the first half of the first pass.
- Bleichenbacher 1998 targets PKCS#1 v1.5 *encryption*, not signatures; RS256 is still fine.
- The "sign = encrypt hash with private key" framing was corrected and explained.
- Other fixes: "Stripe, Stripe" typo (now GitHub, Stripe, Shopify); a bare hash only proves integrity if the digest comes from a trusted channel; timing-attack numbers made realistic.
- Cert chain: added CT/SCTs. Revocation updated for 2026: Let's Encrypt ended OCSP in 2025; CRLSets/CRLite. CA/B Forum lifetimes are now 200 days (Mar 2026) → 47 days (2029). The diagram said "30–90 day validity" → updated.
- Added: blind-index HMAC for lookup fields, length-extension scope, webhook timestamp/replay.

### tls-and-https-internals
- Added: hybrid PQ key exchange (X25519MLKEM768), HelloRetryRequest, EncryptedExtensions in the diagram, ALPN/SNI in ClientHello, QUIC = 1-RTT total, 0-RTT anti-replay plus `425 Too Early`, PSK+ECDHE resumption keeps forward secrecy.
- Code bug: listing TLS 1.3 suites in Node's `ciphers` *replaces* the TLS 1.3 defaults. The old list silently dropped the mandatory `TLS_AES_128_GCM_SHA256` (verified with a local TLS server). Fixed the list and comment. `getCipher().bits` doesn't exist → replaced with `getEphemeralKeyInfo()`. Example now actually runs against example.com. X-Frame-Options → CSP `frame-ancestors`.
- Fixes: mTLS `CertificateRequest` ordering was wrong. HKDF/randoms description corrected. "CERTIFICATE_VERIFY_FAILED" is Python's chain-verification error, not a CertificateVerify failure. HPKP removal dates. ECH is no longer "still being standardised" (enabled in Chrome/Firefox). The NSA story was wrong (it was enterprises/banks; ETSI "Enterprise TLS"). HSTS sentence contradicted itself. "Max 1 year / 90 days" lifetimes → 200-day cap.
- OCSP section updated (OCSP optional since 2023, LE shutdown, Must-Staple fading). Fixed a Mermaid single-line note containing `\n`.
- Quiz: replaced q4 (it duplicated q2 on forward secrecy) with a PQ-hybrid question.

### authentication-and-authorization
- Code bug (security): `verifyApiKey` bcrypt-hashed the submitted key with a *new random salt* and compared → it can never match. Rewrote it with SHA-256 for high-entropy keys plus `timingSafeEqual`. Login dummy-compare now uses a real precomputed hash (a malformed hash may short-circuit in other bcrypt libs). Added the bcrypt 72-byte guard. All run with real bcrypt.
- SameSite: "Lax is the browser default" → only Chromium. Lax blocks cross-site POST (not "forms" generally). Added same-site-subdomain and state-changing-GET caveats, CSRF tokens, Origin/`Sec-Fetch-Site`. "SameSite=None required for OAuth" corrected. Lax recommended as the pragmatic default.
- OAuth: PKCE S256 per RFC 9700 (Jan 2025) / OAuth 2.1 draft (still a draft in 2026). Exact redirect-URI matching, refresh-token rotation/sender-constraining, BFF for SPAs. OIDC `nonce`; ID token vs access token roles. The code exchange isn't always server-to-server.
- Added: `kid`/`jku` header attacks, weak HS256 secrets, DPoP (RFC 9449) / mTLS-bound tokens. Passkeys: synced vs device-bound; TOTP/push are phishable (AitM, MFA fatigue). NIST SP 800-63B-4 password rules. `__Host-` prefix.

### owasp-top-ten
- **Edition**: content presented the 2021 list as "current". Now leads with the **OWASP Top 10:2025** table (verified against top10.owasp.org):
  - A01 Broken Access Control (SSRF merged in)
  - A02 Security Misconfiguration
  - A03 Software Supply Chain Failures (new)
  - A04 Cryptographic Failures
  - A05 Injection
  - A06 Insecure Design
  - A07 Authentication Failures
  - A08 Software or Data Integrity Failures
  - A09 Security Logging and Alerting Failures
  - A10 Mishandling of Exceptional Conditions (new)

  The table includes a 2021 mapping column. Every section title, diagram label, takeaway, the reference table code, and quiz q6 are now labeled with the edition year. The q8 Log4Shell question was reworked to A03:2025.
- Code bug (security): the SSRF guard validated DNS and then called `fetch(url)`, which **re-resolves DNS**. That is exactly the rebinding gap the text warns about. It also missed AAAA/IPv6, `localhost`, mapped addresses, and redirects. Rewrote it with `net.BlockList` and a custom socket `lookup`, so the IP that gets checked is the IP that gets connected to. IP literals are checked too, and redirects are not followed. Tested: IMDS, decimal IP, `[::ffff:127.0.0.1]`, `localhost`, and `file:` are blocked; a public host is allowed. Note for the next editor: a `::ffff:0:0/96` rule in `BlockList` blocks *all* IPv4, so it was deliberately left out.
- htmlEncode output comment was wrong (`"` becomes `&quot;`). Added context-specific encoding, `javascript:` URLs (React only warns), DOMPurify, strict nonce CSP + `strict-dynamic`, Trusted Types. Added SQL identifier allowlists and NoSQL/OS-command injection. IMDSv2 hop limit. Capital One figures corrected.

### secure-coding-practices
- Code bug: the Zod schema validated `.email()` *before* `.trim().toLowerCase()`, so the claimed output was false: the example input was rejected. Reordered with `.pipe(z.email())` for Zod 4. The name regex now accepts non-ASCII letters. Flagged that a `role` field on a public signup schema is mass assignment. Verified with zod 4.6.
- event-stream story fixed: `^` ranges live in package.json, and the payload was `flatmap-stream`. `crossenv` is the real typosquat. Added xz-utils (2024), the 2025 npm maintainer phishing (chalk/debug) and Shai-Hulud, `--ignore-scripts`, pnpm 10 script blocking, `minimumReleaseAge`, trusted publishing/provenance, SBOM. Dependency confusion fix (scopes).
- Postgres grant comments fixed: DROP/ALTER aren't grantable, owners can always drop; added default privileges and the PG15 note. `trufflehog` command fixed (old flags limited the scan to 100 commits). `pg_exec` → `COPY … TO PROGRAM`. Added OIDC workload federation and push protection. OWASP callout updated to the 2025 mapping (including A10 fail-open).

## phase17

### how-browsers-work
- 0-RTT does not send data "in the first packet of the TCP handshake" → it goes with the ClientHello after TCP, and has a replay caveat. "TLS 1.3 mandatory" → default. RTT figures fixed (a LAN isn't 20ms).
- TTFB: two definitions given; it is not a Core Web Vital. Added 103 Early Hints (Server Push removed from Chrome in 2022), HTTPS/SVCB DNS records, Alt-Svc / HTTP/3 discovery, and "CSS blocks later sync scripts".
- Code: CWV observers used `entryTypes` (can't buffer, so early LCP is missed) → `type` + `buffered`. The "INP" snippet actually measured FID-style input delay with a 100ms target, and `durationThreshold` is ignored with `entryTypes` → rewritten to use `duration` with a 200ms target.
- Pipeline: added the Style step. Paint vs raster split. "Compositing layers = stacking contexts" corrected. Firefox uses WebRender, not Moz2D. Engine history fixed (Netscape 4 didn't use Gecko; iOS/DMA). `document.write` "full re-parse" fixed. Added fetchpriority/Speculation Rules. Layout direction described correctly.

### dom-and-rendering-pipeline
- CSSOM was described as "a tree mirroring the DOM" → corrected (stylesheet object model; per-element results come from style calculation).
- "FCP is a Core Web Vital" → wrong; only LCP/INP/CLS.
- Code bug: will-change cleanup waited for `transitionend`, which never fires for a rAF animation → `animateBox` now returns a Promise. Also clamped negative progress and handled NodeLists. ResizeObserver comment was wrong (writes re-run layout in the same frame). `border-style` is not paint-only.
- Fixed: layer-explosion explanation, "algorithmic layout thrashing" wording, DevTools colours, `content-visibility` needs `contain-intrinsic-size`, selector-matching description.
- Added: INP link, `scheduler.yield()`, Long Animation Frames.

### javascript-event-loop
- Verified all ordering outputs with Node (each snippet in isolation; added a note that they interleave if pasted together).
- Fixes: setImmediate "runs before I/O" → wrong (check phase follows poll). 4ms clamp applies at nesting depth > 5. Multiple task sources/prioritisation. Background throttling. Since Node 11, microtasks drain after each callback. **ESM caveat** (verified: Promise.then runs before nextTick in an ES module).
- Fixes: rAF "reads avoid forced layout because layout already ran" → rAF runs *before* layout. `scheduler.yield` version (Chromium 129, not 115). unhandledrejection timing, plus Node 15+ crash default. "V8's event loop" → libuv. HostEnqueuePromiseJob vs the HTML checkpoint. DevTools colours.
- Added transferables. Fixed a wrong animation comment.

### http-caching-cookies-cors
- `Access-Control-Allow-Credentials` missing does **not** strip cookies; it hides the response from JS → corrected. fetch default is `credentials: 'same-origin'`, not `omit` for cross-origin.
- Preflight cache: Chromium caps it at 7200s (5s default), so the "86400 = once a day" claim was wrong.
- SameSite Lax-by-default is Chromium only. **Added "same-site ≠ same-origin"**: `app.example.com` → `api.example.com` is same-site, so the sample's `SameSite=None` was unnecessary (comment fixed). Added `__Host-`/`__Secure-`/`Partitioned`.
- Third-party cookies: Chrome reversed its deprecation plan; Safari and Firefox block or partition → updated.
- Code: `only-if-cached` needs `mode:'same-origin'`; `Vary: Origin` is now set on every response. Added the 2xx-preflight rule, the wildcard-literal rule with credentials, the "don't reflect any Origin" warning, and the Chrome `immutable` note. Fixed "~2ms" revalidation and the `localhost` Secure-cookie claim.

### websockets-and-sse
- Sample `Sec-WebSocket-Key` was 10 bytes (invalid) → the RFC 6455 key. **Added a runnable example** computing `Sec-WebSocket-Accept` (it reproduces the RFC value) plus Origin validation.
- `send()` in CLOSING/CLOSED does **not** throw (it silently discards) → fixed in the text and q8. Browsers auto-pong, and JS can't ping.
- EventSource can't set headers and is text-only → added fetch-stream alternative. The HTTP/1.1 6-connection limit is shared across tabs. SSE wire-format block and diagram fixed (literal `\n`).
- Auth: single-use tickets instead of tokens in URLs; the API can't set Authorization; token expiry on long connections. SameSite helps against CSWSH. RFC 8441/9220 and WebTransport added. `parseInt` validation, `retry:` example, Connection header is HTTP/1.1-only. 4002/4008 inconsistency and SSE history fixed.

### web-performance-optimization
- CWV details added: evaluated at p75. CLS = worst session window (not a lifetime sum). INP ≈ p98, not strictly the worst. Lighthouse can't measure INP (uses TBT) and isn't deterministic. TTI removed from the diagram (deprecated).
- `immutable` doesn't survive a hard refresh. Tokyo–NY real RTT is about 150–180ms. Anycast. Vercel "Edge Functions" naming → Routing Middleware. Ranking-penalty claim toned down; the Amazon stat dated. Added zstd.
- Code bug: `app.get('*.html')` is invalid in Express 5 and ran after static anyway. A naive hash regex would mark `my-component.js` immutable → rewritten as directory-based (`/assets` immutable via express.static options; HTML no-cache). Verified with Express 5.3. Yield uses `scheduler.yield()` with a fallback.
- Added INP's three phases, LoAF, `postTask` priorities.

## Unsure / worth a second look
- OWASP 2025: the site does not state "final vs RC" or a date. I treated it as the current edition, per the brief.
- Vendor rollout claims as of Oct 2026: Safari's X25519MLKEM768 default, ECH status, `scheduler.yield` outside Chromium, browser share percentages (given as approximate).
- NIST SP 800-63B-4 specifics (15-char single-factor minimum; phishing-resistant option required at AAL2): stated from memory.
- 2025 npm incidents (chalk/debug phishing, Shai-Hulud) and pnpm `minimumReleaseAge`: stated from memory.
