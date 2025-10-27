import { Platform, StyleSheet } from 'react-native';
import  { parse } from './src/parser';

export function $(styles, ...values) {
  return StyleSheet.create(parse(styles, ...values));
}

export { setColors, colors } from './src/parser';
