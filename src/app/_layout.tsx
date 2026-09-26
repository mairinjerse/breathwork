import { IBMPlexSans_400Regular } from '@expo-google-fonts/ibm-plex-sans/400Regular';
import { IBMPlexSans_500Medium } from '@expo-google-fonts/ibm-plex-sans/500Medium';
import { IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans/600SemiBold';
import { STIXTwoText_500Medium } from '@expo-google-fonts/stix-two-text/500Medium';
import { STIXTwoText_600SemiBold } from '@expo-google-fonts/stix-two-text/600SemiBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SupportButton } from '../components/support-button';
import { AppStateProvider, useAppState } from '../store/app-state';
import { useTheme } from '../theme/use-theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <Root />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const { ready } = useAppState();
  const { name, c } = useTheme();
  const [fontsLoaded] = useFonts({
    STIXTwoText_500Medium,
    STIXTwoText_600SemiBold,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
  });
  const loaded = ready && fontsLoaded;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={name === 'night' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.surface100 } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="module/[id]" />
        <Stack.Screen name="breathe" />
        <Stack.Screen name="check-in" options={{ presentation: 'modal' }} />
        <Stack.Screen name="support" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="session/[id]"
          options={{ presentation: 'fullScreenModal', animation: 'fade', gestureEnabled: false }}
        />
      </Stack>
      <SupportButton />
    </View>
  );
}
