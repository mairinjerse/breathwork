import { Alert, Platform, Pressable, Share, Switch, TextInput, View } from 'react-native';

import { Body, Button, Card, Display, Divider, Row, Screen } from '../../components/ui';
import { useAppState } from '../../store/app-state';
import { fonts, radius, space, type ThemeName } from '../../theme/tokens';
import { useTheme } from '../../theme/use-theme';

export default function Profile() {
  const { state, actions } = useAppState();
  const { c } = useTheme();
  const s = state.settings;

  const confirmReset = () => {
    const msg = 'This deletes your progress, sessions and check-ins from this device. It can’t be undone.';
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(msg)) actions.reset();
      return;
    }
    Alert.alert('Reset everything?', msg, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: actions.reset },
    ]);
  };

  const exportData = () => {
    const { sessions, checkIns, ownUses, progress } = state;
    const json = JSON.stringify({ progress, sessions, checkIns, ownUses }, null, 2);
    if (Platform.OS === 'web' && !globalThis.navigator?.share) {
      // Most desktop browsers have no share sheet: download a file instead.
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `exhale-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    Share.share({ message: json }).catch(() => {});
  };

  return (
    <Screen>
      <View style={{ paddingTop: space[1] }}>
        <Display>Profile</Display>
      </View>

      <Card>
        <Body variant="eyebrow" muted>
          Name
        </Body>
        <TextInput
          value={s.name}
          onChangeText={(name) => actions.updateSettings({ name })}
          placeholder="Optional"
          placeholderTextColor={c.inkMuted}
          accessibilityLabel="Name"
          style={{
            fontFamily: fonts.body,
            fontSize: 15,
            color: c.ink,
            borderWidth: 1,
            borderColor: c.line,
            borderRadius: radius.sm,
            paddingHorizontal: space[2],
            paddingVertical: 10,
            backgroundColor: c.surface100,
          }}
        />
      </Card>

      <Card>
        <Body variant="eyebrow" muted>
          Appearance
        </Body>
        <Row style={{ gap: 8 }}>
          {(['day', 'night'] as ThemeName[]).map((t) => {
            const selected = s.theme === t;
            return (
              <Pressable
                key={t}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => actions.updateSettings({ theme: t })}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderRadius: radius.sm,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? c.accent : c.line,
                  backgroundColor: c.surface100,
                }}>
                <Body variant="strong">{t === 'day' ? 'Day' : 'Night'}</Body>
              </Pressable>
            );
          })}
        </Row>
      </Card>

      <Card>
        <Toggle
          label="Haptic cues"
          hint="A light tap at each phase change, so you can practise with your eyes closed."
          value={s.haptics}
          onChange={(haptics) => actions.updateSettings({ haptics })}
        />
        <Divider />
        <Toggle
          label="Before & after ratings"
          hint="Ask how activated you feel around each session. This powers the Progress screen."
          value={s.sessionRatings}
          onChange={(sessionRatings) => actions.updateSettings({ sessionRatings })}
        />
      </Card>

      <Card>
        <Body variant="eyebrow" muted>
          About
        </Body>
        <Body muted>
          Exhale doesn’t send reminders or count streaks. The curriculum has an end, and the aim is for you to need it
          less. Your data stays on this device.
        </Body>
        <Button label="Export my data" kind="secondary" icon="share" onPress={exportData} />
        <Button label="Reset everything" kind="quiet" onPress={confirmReset} />
      </Card>
    </Screen>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { c } = useTheme();
  return (
    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Body variant="strong">{label}</Body>
        <Body variant="bodySm" muted>
          {hint}
        </Body>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: c.accent, false: c.line }}
        thumbColor="#ffffff"
        {...(Platform.OS === 'web' ? { activeThumbColor: '#ffffff' } : null)}
      />
    </Row>
  );
}
