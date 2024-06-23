import { Platform, StyleSheet } from 'react-native';
import  { parse } from './parser';

export function $(styles, ...values) {
  return StyleSheet.create(parse(styles, ...values));
}
