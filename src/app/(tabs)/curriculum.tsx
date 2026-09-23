import { View } from 'react-native';

import { ModuleRow, listGap } from '../../components/module-row';
import { Body, Card, Display, Screen } from '../../components/ui';
import { PARTS } from '../../content/curriculum';
import type { Part } from '../../content/types';
import { useCurriculum } from '../../lib/use-curriculum';
import { useAppState } from '../../store/app-state';
import { space } from '../../theme/tokens';

const ORDER: Part[] = ['breath', 'body', 'own'];

export default function Curriculum() {
  const { state } = useAppState();
  const { modules, statuses, completed, total } = useCurriculum();

  return (
    <Screen>
      <View style={{ gap: space[1], paddingTop: space[1] }}>
        <Display>Curriculum</Display>
        <Body muted>
          {total} modules, in order, with a real end. Each one explains the mechanism, guides you through the practice,
          then asks you to do it without guidance. {completed > 0 ? `${completed} of ${total} done.` : ''}
        </Body>
      </View>

      {ORDER.map((part) => (
        <View key={part} style={{ gap: listGap }}>
          <View style={{ gap: 2, marginTop: space[1] }}>
            <Body variant="eyebrow" muted>
              {PARTS[part].title}
            </Body>
            <Body variant="bodySm" muted>
              {PARTS[part].blurb}
            </Body>
          </View>
          {modules.map((m, i) =>
            m.part === part ? (
              <ModuleRow key={m.id} module={m} index={i} status={statuses[i]} progress={state.progress[m.id]} />
            ) : null,
          )}
        </View>
      ))}

      <Card>
        <Body variant="strong">Where this ends</Body>
        <Body muted>
          When you finish, you’ll have practised every technique both with the app and without it, and you’ll know which
          one to reach for in a given moment. That’s the point: needing this less.
        </Body>
      </Card>
    </Screen>
  );
}
