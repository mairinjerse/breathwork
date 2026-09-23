import Tabs from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '../../components/ui';
import { fonts } from '../../theme/tokens';
import { useTheme } from '../../theme/use-theme';

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'curriculum', title: 'Curriculum', icon: 'book-open' },
  { name: 'progress', title: 'Progress', icon: 'activity' },
  { name: 'profile', title: 'Profile', icon: 'user' },
];

export default function TabLayout() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.surface100 } }}
      tabBar={({ state, navigation }) => (
        <View
          style={[
            styles.bar,
            { borderTopColor: c.line, backgroundColor: c.surface100, paddingBottom: Math.max(insets.bottom, 14) },
          ]}>
          {state.routes.map((route, i) => {
            const tab = TABS.find((t) => t.name === route.name);
            if (!tab) return null;
            const focused = state.index === i;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={tab.title}
                onPress={() => {
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
                }}
                style={styles.item}>
                <Icon name={tab.icon} size={21} color={focused ? c.ink : c.inkMuted} />
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: focused ? fonts.bodySemi : fonts.body,
                    color: focused ? c.ink : c.inkMuted,
                  }}>
                  {tab.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}>
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  item: { alignItems: 'center', gap: 4, minWidth: 64 },
});
