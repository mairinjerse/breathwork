import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { PARTS } from '../content/curriculum';
import type { Module } from '../content/types';
import { stepsDone, type ModuleProgress, type ModuleStatus } from '../lib/progress';
import { radius, space } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';
import { BlobDot, type BlobVariant } from './blob';
import { Body, Icon } from './ui';

const DOTS: BlobVariant[] = ['cool', 'warm', 'dusk', 'accent'];

export function statusLine(status: ModuleStatus, progress: ModuleProgress | undefined): string {
  switch (status) {
    case 'complete':
      return 'Completed';
    case 'in-progress':
      return `In progress · ${stepsDone(progress)} of 3`;
    case 'up-next':
      return 'Up next';
  }
}

export function ModuleRow({
  module,
  index,
  status,
  progress,
}: {
  module: Module;
  index: number;
  status: ModuleStatus;
  progress?: ModuleProgress;
}) {
  const { c } = useTheme();
  const active = status === 'in-progress' || status === 'up-next';

  const marker =
    status === 'complete' || status === 'in-progress' ? (
      <BlobDot size={32} variant={DOTS[index % DOTS.length]} />
    ) : (
      <View style={[styles.marker, { backgroundColor: c.line }]}>
        <Body variant="label" muted>
          {index + 1}
        </Body>
      </View>
    );

  const content = (
    <View
      style={[styles.row, { backgroundColor: c.surface200, borderColor: active ? c.accent + '4d' : 'transparent' }]}>
      {marker}
      <View style={{ flex: 1, gap: 2 }}>
        <Body variant="strong" style={{ fontSize: 14.5 }}>
          {module.title}
        </Body>
        <Body variant="bodySm" muted style={{ fontSize: 12, lineHeight: 16 }}>
          {statusLine(status, progress)} · {PARTS[module.part].title.toLowerCase()}
        </Body>
      </View>
      {status === 'complete' ? (
        <Icon name="check" size={16} color={c.inkMuted} />
      ) : (
        <Icon name="chevron-right" size={16} color={c.inkMuted} />
      )}
    </View>
  );

  return (
    <Link href={{ pathname: '/module/[id]', params: { id: module.id } }} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={`${module.title}, ${statusLine(status, progress)}`}>
        {content}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const listGap = space[2] - 2;
