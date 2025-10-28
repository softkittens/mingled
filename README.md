# mingled

**Style fast. Read faster.**

Inline utility styling for React Native with clear `property:value` tokens—meant to be mingled right into your JSX.

Mingled compiles short, space-delimited tokens (e.g. `p:16 bg:gray-10 row:center|between`) into React Native style objects via a tiny tagged-template function.

## ✨ Features

- **Inline by design**. Write styles where you need them, as tagged templates.
- **Memorable syntax**. Readable `property:value` tokens instead of cryptic class names.
- **Tiny surface area**. A focused set of utilities that map directly to RN styles.
- **Zero config**. Drop in and start styling. No build step required.
- **Theme-friendly**. Use built-in color tokens or pass raw hex.

## At a glance

- **Exports**: `$`, `setColors`, `colors`, `configure`, `clearCache`
- **Inline usage**: `<View style={$`p:16 bg:gray-10 r:8`} />`
- **Customize colors**: `setColors({ primary: '#6C47FF' })`
- **Performance knobs**: `configure({ maxCacheEntries, maxTokenCacheEntries })`

## Installation

Install with your preferred package manager.

```bash
npm i mingled
```

## Quick start

Use the tagged template to generate styles from utility tokens—inline, like Tailwind.

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { $ } from 'mingled';

export function Card() {
  return (
    <View style={$`p:12|16 bg:gray-10 r:8`}>
      <Text style={$`f:16|gray-60 semi`}>Hello</Text>
    </View>
  );
}
```

Notes:

- `$` is a tagged template function that composes the style object from tokens.
- Tokens are separated by spaces. Values inside a token are separated by `|`.

## Usage tips

- **Compose conditionally**

  ```tsx
  <View style={[
    $`p:16 r:8 bg:indigo-5`,
    isActive && $`b:blue|2`,
  ]} />
  ```

- **Mix with regular RN styles**

  ```tsx
  <Text style={[{ fontFamily: 'Inter' }, $`f:18 semi c:gray-90`]}>
    Title
  </Text>
  ```

- **Reuse fragments**

  ```tsx
  const pill = $`px:12 py:6 r:16 bg:gray-10`;
  const pillText = $`f:12|gray-60`;
  <View style={pill}><Text style={pillText}>New</Text></View>
  ```



## Customize colors

Override or extend the palette at runtime.

```ts
import { setColors } from 'mingled';

// Merge: extend/override specific tokens
setColors({
  primary: '#6C47FF',
  brand: '#FF5A5F',
  'gray-10': '#F4F4F5',
});

// Replace: wipe built-ins and set a new palette
setColors(
  {
    text: '#222',
    bg: '#fff',
    accent: '#0EA5E9',
  },
  { replace: true },
);
```

Tips:

- **When to call**: initialize once at app startup (e.g., in your root component) or when switching themes.
- **Usage**: tokens are resolved by name in `c:token`, `bg:token`, and border utilities like `b:token|size|style`.

## Examples

- **Centered row with spacing**

```tsx
<View style={$`row:center|between gap:8 px:12 py:8`} />
// RN equivalent:
// <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 12, paddingVertical: 8 }} />
```

- **Text**

```tsx
<Text style={$`f:18|gray-90 semi ls:1`}>Title</Text>
// RN equivalent:
// <Text style={{ fontSize: 18, color: '#323232', fontWeight: '600', letterSpacing: 1 }}>Title</Text>
```

- **Borders and radius**

```tsx
<View style={$`b:gray-20|1|solid r:12 bg:indigo-5 p:16`} />
// RN equivalent:
// <View style={{ borderWidth: 1, borderColor: '#E3E5E5', borderStyle: 'solid', borderRadius: 12, backgroundColor: '#F9FAFC', padding: 16 }} />
```

- **Absolute fill**

```tsx
<View style={$`abs:0|0|0|0 ofh`} />
// RN equivalent:
// <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }} />
```

- **Button**

```tsx
<Button style={$`bg:blue p:10|16 r:8`}>
  <Text style={$`c:white semi`}>Tap me</Text>
</Button>
// RN equivalent:
// <Button style={{ backgroundColor: '#1289F8', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 }}>
//   <Text style={{ color: 'white', fontWeight: '600' }}>Tap me</Text>
// </Button>
```

- **Avatar**

```tsx
<Image style={$`w:48 h:48 r:9999 b:white|2`} source={{ uri }} />
// RN equivalent:
// <Image style={{ width: 48, height: 48, borderRadius: 9999, borderColor: 'white', borderWidth: 2 }} source={{ uri }} />
```

- **Grid wrap**

```tsx
<View style={$`row wrap gap:8`}>
  {items.map(i => (
    <View key={i.id} style={$`w:100 h:80 bg:gray-7 r:8`} />
  ))}
</View>
// RN equivalent:
// <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
//   {items.map(i => (
//     <View key={i.id} style={{ width: 100, height: 80, backgroundColor: '#F7F7F7', borderRadius: 8 }} />
//   ))}
// </View>
```

- **Overlay**

```tsx
<View style={$`abs:0|0|0|0 bg:black o:60`} />
// RN equivalent:
// <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#0F0F0F', opacity: 0.6 }} />
```

- **Chip / pill**

```tsx
<View style={$`px:12 py:6 r:16 bg:gray-10`}>
  <Text style={$`f:12|gray-60 uc`}>beta</Text>
</View>
// RN equivalent:
// <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F5F5F5' }}>
//   <Text style={{ fontSize: 12, color: '#666666', textTransform: 'uppercase' }}>beta</Text>
// </View>
```

- **Padding and margin combos**

```tsx
<View style={$`p:12|16 m:8|12|16|12`} />
// RN equivalent:
// <View style={{ paddingVertical: 12, paddingHorizontal: 16, marginTop: 8, marginRight: 12, marginBottom: 16, marginLeft: 12 }} />

<View style={$`px:16 py:8 mx:12 my:4`} />
// RN equivalent:
// <View style={{ paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 12, marginVertical: 4 }} />
```

- **Alignment helpers**

```tsx
<View style={$`row ai:center jc:around`} />
// RN equivalent:
// <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }} />
<View style={$`row`}>
  <View style={$`self:flex-end`} />
</View>
// RN equivalent:
// <View style={{ flexDirection: 'row' }}>
//   <View style={{ alignSelf: 'flex-end' }} />
// </View>
```

- **Sizing and aspect ratio**

```tsx
<View style={$`w:120 h:80`} />
// RN equivalent:
// <View style={{ width: 120, height: 80 }} />

<View style={$`w:200 ar:1.777 bg:gray-7`} />
// RN equivalent:
// <View style={{ width: 200, aspectRatio: 1.777, backgroundColor: '#F7F7F7' }} />

<View style={$`min-w:80 max-h:120 bg:indigo-5`} />
// RN equivalent:
// <View style={{ minWidth: 80, maxHeight: 120, backgroundColor: '#F9FAFC' }} />
```

- **Colors and clear**

```tsx
<View style={$`bg:gray-10`} />
// RN equivalent:
// <View style={{ backgroundColor: '#F5F5F5' }} />

<Text style={$`c:#1289F8`}>Link</Text>
// RN equivalent:
// <Text style={{ color: '#1289F8' }}>Link</Text>

<View style={$`clear`} />
// RN equivalent:
// <View style={{ backgroundColor: 'transparent' }} />
```

- **Typography variants**

```tsx
<Text style={$`f:18|gray-60 semi`} />
// RN equivalent:
// <Text style={{ fontSize: 18, color: '#666666', fontWeight: '600' }} />

<Text style={$`f:14 lh:20 ls:0.5`} />
// RN equivalent:
// <Text style={{ fontSize: 14, lineHeight: 20, letterSpacing: 0.5 }} />

<Text style={$`fw:700 u`}>Underlined bold</Text>
// RN equivalent:
// <Text style={{ fontWeight: 700, textDecorationLine: 'underline' }}>Underlined bold</Text>
```

- **Overflow and opacity**

```tsx
<View style={$`of:auto`} />
// RN equivalent:
// <View style={{ overflow: 'auto' }} />

<View style={$`ofh o:60`} />
// RN equivalent:
// <View style={{ overflow: 'hidden', opacity: 0.6 }} />
```

- **Positioning variants**

```tsx
<View style={$`abs`} />
// RN equivalent:
// <View style={{ position: 'absolute' }} />

<View style={$`abs:10`} />
// RN equivalent:
// <View style={{ position: 'absolute', top: 10 }} />

<View style={$`abs:10|20`} />
// RN equivalent:
// <View style={{ position: 'absolute', top: 10, right: 20 }} />

<View style={$`abs:10|20|30`} />
// RN equivalent:
// <View style={{ position: 'absolute', top: 10, right: 20, bottom: 30 }} />

<View style={$`abs:1|2|3|4`} />
// RN equivalent:
// <View style={{ position: 'absolute', top: 1, right: 2, bottom: 3, left: 4 }} />

<View style={$`top:8 right:12`} />
// RN equivalent:
// <View style={{ top: 8, right: 12 }} />
```

## 💡 Why Mingled?

Mingled embraces styling where it’s used: in your JSX. Instead of memorizing class systems, you write concise `property:value` tokens that map cleanly to React Native styles. It’s familiar like Tailwind, but more literal and compact.


## Testing & development

This repo uses Bun for tests.

```bash
bun install
bun test
```

## Related

- UnoCSS preset: CSS version of this language — https://github.com/softkittens/unocss-preset-mingled

## Roadmap and limitations

- Platform tokens via `@ios` / `@android` are scaffolded in the parser but currently disabled.
- Shorthand coverage will be expanded (e.g. shadows).
- The API surface is small by design; please open issues for gaps you hit.

## License

MIT
