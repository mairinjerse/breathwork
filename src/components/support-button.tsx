import { router, useSegments } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from './ui';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';

/** Route segments the floating support entry point should appear on. */
const VISIBLE_SEGMENTS = new Set(['(tabs)', 'module']);

export function SupportButton() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  if (!VISIBLE_SEGMENTS.has(segments[0] ?? '')) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="In-the-moment support"
      hitSlop={8}
      onPress={() => router.push('/support')}
      style={({ pressed }) => [
        styles.button,
        { bottom: insets.bottom + 76, backgroundColor: c.surface100, borderColor: c.line },
        pressed && { opacity: 0.8 },
      ]}>
      <Icon name="life-buoy" size={20} color={c.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
