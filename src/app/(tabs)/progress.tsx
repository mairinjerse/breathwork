import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ScaleLine, Shift, SplitBar } from '../../components/charts';
import { Body, Button, Card, Display, Divider, Row, Screen } from '../../components/ui';
import { CHECK_IN_QUESTIONS } from '../../content/check-in';
import { getModule } from '../../content/curriculum';
import { nextCheckInDate, relianceByMonth, sessionShift, sortByDate } from '../../lib/progress';
import { formatDuration } from '../../lib/timeline';
import { useCurriculum } from '../../lib/use-curriculum';
import { useAppState } from '../../store/app-state';
import { space } from '../../theme/tokens';
import { useTheme } from '../../theme/use-theme';

/*
 * First pass at the progress / self-report screen. The brief flags this one
 * for a dedicated design pass; the rules it follows until then:
 *   - No streaks, no calendar grid, nothing that renders a missed day.
 *   - Check-ins are plotted by check-in, not by date.
 *   - Headline measure is change (before → after, first → latest), not volume.
 *   - "On your own" use is shown as a good thing, next to in-app sessions.
 */

const short = (iso: string) => new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' });

export default function Progress() {
  const { state, actions } = useAppState();
  const { c } = useTheme();
  const { completed, total } = useCurriculum();
  const [width, setWidth] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [now] = useState(() => Date.now());
  const chartW = Math.max(0, width - 2 * space[3] - 2);

  const shift = sessionShift(state.sessions);
  const checkIns = sortByDate(state.checkIns);
  const next = nextCheckInDate(state.checkIns, completed, total);
  const reliance = relianceByMonth(state.sessions, state.ownUses);
  const history = [...state.sessions].reverse();
  const rated = history.filter((s) => s.completed && s.before !== undefined && s.after !== undefined).slice(0, 6);

  return (
    <Screen>
      <View style={{ gap: space[1], paddingTop: space[1] }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <Display>Progress</Display>
        <Body muted>Whether this is working, in your own words. No streaks — gaps are fine.</Body>
      </View>

      {/* 1. Within a session */}
      <Card>
        <Body variant="eyebrow" muted>
          During a session
        </Body>
        {shift ? (
          <>
            <Row style={{ alignItems: 'baseline' }}>
              <Display>{shift.before.toFixed(1)}</Display>
              <Body muted>→</Body>
              <Display style={{ color: c.accent }}>{shift.after.toFixed(1)}</Display>
            </Row>
            <Body variant="bodySm" muted>
              Average activation before → after, across {shift.count} rated session{shift.count === 1 ? '' : 's'}. 1 is
              calm, 5 is very activated.
            </Body>
            {chartW > 0 ? (
              <View style={{ gap: space[1], marginTop: space[1] }}>
                {rated.map((s) => (
                  <View key={s.id} style={{ gap: 2 }}>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <Body variant="bodySm">{practiceName(s.moduleId)}</Body>
                      <Body variant="bodySm" muted>
                        {s.before} → {s.after}
                      </Body>
                    </Row>
                    <Shift before={s.before!} after={s.after!} width={chartW} />
                  </View>
                ))}
                <Row style={{ gap: space[2] }}>
                  <Legend color={c.inkMuted} hollow label="Before" />
                  <Legend color={c.accent} label="After" />
                </Row>
              </View>
            ) : null}
          </>
        ) : (
          <Body muted>
            Rate how activated you feel before and after a session, and the average shift shows up here.
          </Body>
        )}
      </Card>

      {/* 2. Over weeks */}
      <Card>
        <Body variant="eyebrow" muted>
          Over time
        </Body>
        {checkIns.length === 0 ? (
          <>
            <Body muted>A short check-in every so often shows whether things are changing outside of sessions.</Body>
            <Button label="Take a baseline" kind="secondary" onPress={() => router.push('/check-in')} />
          </>
        ) : (
          <>
            {CHECK_IN_QUESTIONS.map((q, qi) => {
              const values = checkIns.map((ci) => ci[q.key]);
              const first = values[0];
              const last = values[values.length - 1];
              const diff = last - first;
              const improved = q.better === 'up' ? diff > 0 : diff < 0;
              return (
                <View key={q.key} style={{ gap: 4 }}>
                  {qi > 0 ? <Divider /> : null}
                  <Row style={{ justifyContent: 'space-between', marginTop: qi > 0 ? space[1] : 0 }}>
                    <Body variant="strong">{q.title}</Body>
                    <Body variant="bodySm" muted>
                      {values.length > 1 ? `${first} → ${last}${improved ? ' · better' : ''}` : `${last} of 5`}
                    </Body>
                  </Row>
                  {chartW > 0 ? (
                    <ScaleLine
                      width={chartW}
                      values={values}
                      labels={checkIns.map((ci) => short(ci.at))}
                      accessibilityLabel={`${q.title}: ${values.join(', ')} across ${values.length} check-ins`}
                    />
                  ) : null}
                </View>
              );
            })}
            <Body variant="bodySm" muted>
              {next && next.getTime() > now
                ? `Next check-in around ${short(next.toISOString())}. They get less frequent as you go.`
                : 'A check-in is due.'}
            </Body>
            {next && next.getTime() <= now ? (
              <Button label="Check in" kind="secondary" onPress={() => router.push('/check-in')} />
            ) : null}
          </>
        )}
      </Card>

      {/* 3. Needing it less */}
      <Card>
        <Body variant="eyebrow" muted>
          Needing it less
        </Body>
        <Body variant="bodySm" muted>
          Sessions in the app, next to times you used a technique on your own. The second number growing is the goal.
        </Body>
        {chartW > 0
          ? reliance.map((w) => (
              <View key={w.label} style={{ gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Body variant="bodySm">{w.label}</Body>
                  <Body variant="bodySm" muted>
                    {w.inApp} in app · {w.onOwn} on your own
                  </Body>
                </Row>
                <SplitBar inApp={w.inApp} onOwn={w.onOwn} width={chartW} />
              </View>
            ))
          : null}
        <Row style={{ gap: space[2] }}>
          <Legend color={c.inkMuted} label="In the app" />
          <Legend color={c.accent} label="On your own" />
        </Row>
        <Button label="I used a technique on my own" kind="secondary" icon="plus" onPress={() => actions.addOwnUse()} />
      </Card>

      {/* 4. History */}
      <View style={{ gap: space[2] }}>
        <Body variant="eyebrow" muted>
          Session history
        </Body>
        {history.length === 0 ? (
          <Body muted>Nothing yet.</Body>
        ) : (
          (showAll ? history : history.slice(0, 8)).map((s) => (
            <View key={s.id} style={{ gap: space[1] }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Body variant="strong" style={{ fontSize: 14.5 }}>
                    {practiceName(s.moduleId)}
                  </Body>
                  <Body variant="bodySm" muted>
                    {short(s.startedAt)} · {formatDuration(s.seconds)} · {s.guidance === 'solo' ? 'on your own' : 'guided'}
                    {s.completed ? '' : ' · ended early'}
                  </Body>
                </View>
                {s.before !== undefined && s.after !== undefined ? (
                  <Body variant="bodySm" muted>
                    {s.before} → {s.after}
                  </Body>
                ) : null}
              </Row>
              <Divider />
            </View>
          ))
        )}
        {!showAll && history.length > 8 ? (
          <Button label={`Show all ${history.length}`} kind="quiet" onPress={() => setShowAll(true)} />
        ) : null}
      </View>
    </Screen>
  );
}

function practiceName(moduleId?: string): string {
  const m = moduleId ? getModule(moduleId) : undefined;
  return m ? m.practice.name : 'Practice';
}

function Legend({ color, label, hollow }: { color: string; label: string; hollow?: boolean }) {
  return (
    <Row style={{ gap: 6 }}>
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: hollow ? 'transparent' : color,
          borderWidth: 2,
          borderColor: color,
        }}
      />
      <Body variant="bodySm" muted>
        {label}
      </Body>
    </Row>
  );
}
