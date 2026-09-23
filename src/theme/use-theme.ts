import { useAppState } from '../store/app-state';
import { colors, type ColorTokens, type ThemeName } from './tokens';

export function useTheme(): { name: ThemeName; c: ColorTokens } {
  const { state } = useAppState();
  const name = state.settings.theme;
  return { name, c: colors[name] };
}
