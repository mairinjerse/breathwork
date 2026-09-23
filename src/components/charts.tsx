import { View } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import { fonts } from '../theme/tokens';
import { useTheme } from '../theme/use-theme';

/**
 * Small, quiet charts for the Progress screen. Every chart here plots
 * self-reports on a fixed 1–5 scale, one series per chart (small multiples,
 * never dual axes). Points are indexed by check-in, not by calendar day, so a
 * gap between check-ins never shows up as a "missed" day.
 */

const H = 96;
const PAD = { top: 10, bottom: 20, left: 18, right: 10 };

export function ScaleLine({
  values,
  labels,
  width,
  accessibilityLabel,
}: {
  values: number[];
  labels: string[];
  width: number;
  accessibilityLabel: string;
}) {
  const { c } = useTheme();
  const innerW = width - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (values.length === 1 ? innerW / 2 : (i / (values.length - 1)) * innerW);
  const y = (v: number) => PAD.top + ((5 - v) / 4) * innerH;
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const showLabel = (i: number) => i === 0 || i === values.length - 1;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Svg width={width} height={H}>
        {[1, 3, 5].map((g) => (
          <Line key={g} x1={PAD.left} x2={width - PAD.right} y1={y(g)} y2={y(g)} stroke={c.line} strokeWidth={1} />
        ))}
        {[1, 3, 5].map((g) => (
          <SvgText key={`t${g}`} x={0} y={y(g) + 4} fontSize={10} fill={c.inkMuted} fontFamily={fonts.body}>
            {g}
          </SvgText>
        ))}
        {values.length > 1 ? (
          <Polyline points={points} fill="none" stroke={c.accent} strokeWidth={2} strokeLinejoin="round" />
        ) : null}
        {values.map((v, i) => (
          <Circle key={i} cx={x(i)} cy={y(v)} r={4} fill={c.accent} stroke={c.surface200} strokeWidth={2} />
        ))}
        {labels.map((l, i) =>
          showLabel(i) ? (
            <SvgText
              key={`l${i}`}
              x={x(i)}
              y={H - 4}
              fontSize={10}
              fill={c.inkMuted}
              fontFamily={fonts.body}
              textAnchor={values.length === 1 ? 'middle' : i === 0 ? 'start' : 'end'}>
              {l}
            </SvgText>
          ) : null,
        )}
      </Svg>
    </View>
  );
}

/** Before → after on a 1–5 track. */
export function Shift({ before, after, width }: { before: number; after: number; width: number }) {
  const { c } = useTheme();
  const h = 22;
  const x = (v: number) => 8 + ((v - 1) / 4) * (width - 16);
  return (
    <Svg width={width} height={h}>
      <Rect x={8} y={h / 2 - 1} width={width - 16} height={2} rx={1} fill={c.line} />
      <Line x1={x(before)} x2={x(after)} y1={h / 2} y2={h / 2} stroke={c.inkMuted} strokeWidth={2} />
      <Circle cx={x(before)} cy={h / 2} r={5} fill={c.surface200} stroke={c.inkMuted} strokeWidth={2} />
      <Circle cx={x(after)} cy={h / 2} r={5} fill={c.accent} stroke={c.surface200} strokeWidth={2} />
    </Svg>
  );
}

/** Two counts as one split bar: in the app vs. on your own. */
export function SplitBar({ inApp, onOwn, width }: { inApp: number; onOwn: number; width: number }) {
  const { c } = useTheme();
  const total = inApp + onOwn;
  const h = 10;
  if (total === 0) {
    return (
      <Svg width={width} height={h}>
        <Rect x={0} y={0} width={width} height={h} rx={4} fill={c.line} />
      </Svg>
    );
  }
  const gap = inApp && onOwn ? 2 : 0;
  const a = ((width - gap) * inApp) / total;
  return (
    <Svg width={width} height={h}>
      {inApp ? <Rect x={0} y={0} width={a} height={h} rx={4} fill={c.inkMuted} /> : null}
      {onOwn ? <Rect x={a + gap} y={0} width={width - a - gap} height={h} rx={4} fill={c.accent} /> : null}
    </Svg>
  );
}
