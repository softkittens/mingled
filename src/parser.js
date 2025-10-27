
export function parse(styles, ...values) {
  styles = styles.map((s, i) => `${s}${values[i] || ''}`).join('');

  const stylesArr = styles.trim().split(' ');
  let result = {};
  for (let s of stylesArr) {
    const [rest, mediaQ] = s.split('@');
    const [attribute, valuesStr] = rest.split(':');

    // if (!isRightMedia(mediaQ)) continue;

    const values = valuesStr
      ? valuesStr.split('|').map((v) => (!isNaN(v) ? parseInt(v) : v))
      : [];
    result = { ...result, ...shortMethods[attribute](...values) };
  }
  return result;
}

export const colors = {
  primary: '#405de6',
  black: '#0F0F0F',
  red: '#DD5D49',
  blue: '#1289F8',
  'indigo-5': '#F9FAFC',
  'indigo-50': '#8D9EB3',
  'indigo-60': '#63728B',
  'gray-5': '#FAFAFA',
  'gray-7': '#F7F7F7',
  'gray-10': '#F5F5F5',
  'gray-15': '#efeff0',
  'gray-20': '#E3E5E5',
  'gray-30': '#D8D8D8',
  'gray-40': '#B0B0B0',
  'gray-50': '#999999',
  'gray-60': '#666666',
  'gray-90': '#323232',
};

export function setColors(palette, { replace = false } = {}) {
  if (!palette || typeof palette !== 'object') return;
  if (replace) {
    for (const key of Object.keys(colors)) delete colors[key];
  }
  for (const [key, value] of Object.entries(palette)) {
    colors[key] = value;
  }
}

const shortMethods = {
  p: (val, ...values) => {
    if (!values.length) return { padding: val };
    if (values.length === 1) {
      return {
        paddingVertical: val || 0,
        paddingHorizontal: values[0],
      };
    }
    if (values.length === 2) {
      return {
        paddingTop: val,
        paddingRight: values[0],
        paddingBottom: values[1],
        paddingLeft: values[0],
      };
    }
    if (values.length === 3) {
      return {
        paddingTop: val,
        paddingRight: values[0],
        paddingBottom: values[1],
        paddingLeft: values[2],
      };
    }
  },
  pt: (val) => ({ paddingTop: val }),
  pr: (val) => ({ paddingRight: val }),
  pb: (val) => ({ paddingBottom: val }),
  pl: (val) => ({ paddingLeft: val }),
  px: (val) => ({ paddingHorizontal: val }),
  py: (val) => ({ paddingVertical: val }),
  m: (val, ...values) => {
    if (!values.length) return { margin: val };
    if (values.length === 1) {
      return {
        marginVertical: val || 0,
        marginHorizontal: values[0],
      };
    }
    if (values.length === 2) {
      return {
        marginTop: val,
        marginRight: values[0],
        marginBottom: values[1],
        marginLeft: values[0],
      };
    }
    if (values.length === 3) {
      return {
        marginTop: val,
        marginRight: values[0],
        marginBottom: values[1],
        marginLeft: values[2],
      };
    }
  },
  mt: (val) => ({ marginTop: val }),
  ml: (val) => ({ marginLeft: val }),
  mb: (val) => ({ marginBottom: val }),
  mr: (val) => ({ marginRight: val }),
  mx: (val) => ({ marginHorizontal: val }),
  my: (val) => ({ marginVertical: val }),
  flex: (val) => ({ flex: val }),
  row: (...values) => {
    if (!values.length) return { flexDirection: 'row' };
    if (values.length === 1) {
      return { flexDirection: 'row', alignItems: values[0] };
    }
    if (values.length === 2) {
      return {
        flexDirection: 'row',
        alignItems: values[0] || 'stretch',
        justifyContent: shortenJustify(values[1]),
      };
    }
  },
  gap: (val) => ({ gap: val }),
  ar: (val) => ({ aspectRatio: val }),
  jc: (val) => ({ justifyContent: shortenJustify(val) }),
  ai: (val) => ({ alignItems: val }),
  self: (val) => ({ alignSelf: val }),
  center: () => ({ alignItems: 'center', justifyContent: 'center' }),
  wrap: () => ({ flexWrap: 'wrap' }),
  w: (val) => ({ width: val }),
  'max-w': (val) => ({ maxWidth: val }),
  'min-w': (val) => ({ minWidth: val }),
  'max-h': (val) => ({ maxHeight: val }),
  'min-h': (val) => ({ minHeight: val }),
  h: (val) => ({ height: val }),
  b: (color, size = 1, style = 'solid') => ({
    borderWidth: size,
    borderColor: colors[color] || color,
    borderStyle: style,
  }),
  bb: (color, size = 1, style = 'solid') => ({
    borderBottomWidth: size,
    borderBottomColor: colors[color] || color,
    borderStyle: style,
  }),
  bt: (color, size = 1, style = 'solid') => ({
    borderTopWidth: size,
    borderTopColor: colors[color] || color,
    borderStyle: style,
  }),
  bl: (color, size = 1, style = 'solid') => ({
    borderLeftWidth: size,
    borderLeftColor: colors[color] || color,
    borderStyle: style,
  }),
  br: (color, size = 1, style = 'solid') => ({
    borderRightWidth: size,
    borderRightColor: colors[color] || color,
    borderStyle: style,
  }),
  r: (val) => ({ borderRadius: val }),
  tr: (val) => ({ borderTopRightRadius: val, borderTopLeftRadius: val }),
  c: (val) => ({ color: colors[val] || val }),
  f: (val, ...values) => {
    if (!values.length) return { fontSize: val };
    if (values.length === 1) {
      return {
        fontSize: val,
        color: colors[values[0]] || values[0],
      };
    }
  },
  t: (val) => ({ textAlign: val }),
  ls: (val) => ({ letterSpacing: val }),
  uc: () => ({ textTransform: 'uppercase' }),
  u: () => ({ textDecorationLine: 'underline' }),
  underline: () => ({ textDecorationLine: 'underline' }),
  lh: (val) => ({ lineHeight: val }),
  semi: () => ({ fontWeight: '600' }),
  bold: () => ({ fontWeight: 'bold' }),
  fw: (val) => ({ fontWeight: val }),
  bg: (val) => ({ backgroundColor: colors[val] || val }),
  clear: () => ({ backgroundColor: 'transparent' }),
  of: (val) => ({ overflow: val }),
  ofh: () => ({ overflow: 'hidden' }),
  o: (val) => ({ opacity: val / 100 }),
  opacity: (val) => ({ opacity: val / 100 }),
  abs: (...values) => {
    if (!values.length) return { position: 'absolute' };
    if (values.length === 1) return { position: 'absolute', top: values[0] || 'auto' };
    if (values.length === 2)
      return { position: 'absolute', top: values[0] || 'auto', right: values[1] };
    if (values.length === 3)
      return {
        position: 'absolute',
        top: values[0] || 'auto',
        right: values[1],
        bottom: values[2],
      };
    if (values.length === 4)
      return {
        position: 'absolute',
        top: values[0],
        right: values[1],
        bottom: values[2],
        left: values[3],
      };
  },
  bottom: (val) => ({ bottom: val }),
  top: (val) => ({ top: val }),
  left: (val) => ({ left: val }),
  right: (val) => ({ right: val }),
};

function shortenJustify(val) {
  if (val === 'between') return 'space-between';
  if (val === 'around') return 'space-around';
  return val;
}

// function isRightMedia(val) {
//   if (!val) return true;
//   if (val === 'ios' && Platform.OS === 'ios') return true;
//   if (val === 'android' && Platform.OS === 'android') return true;
//   if (val === 'droid' && Platform.OS === 'android') return true;
// }
//todo: shadows
//merge styles
//conditional styles
//colors/variables
