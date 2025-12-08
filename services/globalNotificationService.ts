// services/globalNotificationService.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ============ CONFIG ============

// Daily notification time (local device time)
const DAILY_HOUR = 9;   // 9 AM
const DAILY_MINUTE = 0; // 09:00

// Android notification channel id
const CHANNEL_ID = 'global-intel';

// Rotating, Zomato‑style messages
const GREETING_MESSAGES: { title: string; body: string }[] = [
  {
    title: '🌅 Good morning, market mover!',
    body: 'One tap to see today\'s global AI Intel.',
  },
  {
    title: '📈 Nifty & Nasdaq are waking up',
    body: 'Check your daily AI market snapshot before the crowd.',
  },
  {
    title: '⚡ Trade with context, not vibes',
    body: 'Tap to generate fresh global intel in seconds.',
  },
  {
    title: '🎯 Sharpen your edge today',
    body: 'Your AI-powered market brief is one tap away.',
  },
  {
    title: '💡 Smart money checks the data first',
    body: 'Open ChatMaster and let AI scan the markets for you.',
  },
  {
    title: '🌍 Markets never sleep, but you did great',
    body: 'Start your day with a quick global market Intel run.',
  },
];

// ============ HELPERS ============

// Pick a random message each day
function getRandomMessage() {
  const idx = Math.floor(Math.random() * GREETING_MESSAGES.length);
  return GREETING_MESSAGES[idx];
}

// Configure how notifications behave in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permissions (idempotent)
export async function requestGlobalNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Global notifications permission denied');
      return false;
    }

    console.log('✅ Global notifications permission granted');

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Global Market Intel',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
        enableLights: true,
        lightColor: '#FFB74D',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        description: 'Daily AI global market intelligence reminders',
      });
      console.log('✅ Android channel configured for global intel');
    }

    return true;
  } catch (error) {
    console.error('❌ Error requesting global notification permissions:', error);
    return false;
  }
}

// Cancel any existing scheduled daily notifications for this feature
export async function cancelGlobalIntelNotifications() {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter((n: Notifications.NotificationRequest) => {
      const data = (n.content.data || {}) as Record<string, any>;
      return data?.feature === 'global-intel';
    });

    for (const n of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }

    if (toCancel.length > 0) {
      console.log(`🧹 Cancelled ${toCancel.length} existing global-intel notifications`);
    }
  } catch (error) {
    console.error('❌ Error cancelling global-intel notifications:', error);
  }
}

// Schedule the daily notification at 9:00 with rotating copy
export async function scheduleDailyGlobalIntelNotification() {
  try {
    await cancelGlobalIntelNotifications();

    const { title, body } = getRandomMessage();

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          feature: 'global-intel',
          type: 'global-intel',
          autoGenerate: true, // ← Global screen will auto-run Generate Intel
        },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: DAILY_HOUR,
        minute: DAILY_MINUTE,
        repeats: true,
      },
    });

    console.log(
      `✅ Scheduled daily global-intel notification at ${DAILY_HOUR}:${DAILY_MINUTE
        .toString()
        .padStart(2, '0')} with id: ${identifier}`,
    );
  } catch (error) {
    console.error('❌ Error scheduling daily global-intel notification:', error);
  }
}

// Public initializer to be called once from app root (e.g., app/_layout.tsx)
export async function initializeGlobalNotifications() {
  console.log('🚀 Initializing Global Market notifications...');
  const granted = await requestGlobalNotificationPermissions();
  if (!granted) {
    console.log('⚠️ Global notifications not enabled by user');
    return;
  }

  await scheduleDailyGlobalIntelNotification();
  console.log('✅ Global Market notifications initialized');
}

// Optional: helper to fire a test notification in a few seconds
export async function sendTestGlobalNotification() {
  try {
    const { title, body } = getRandomMessage();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${title} (TEST)`,
        body,
        data: {
          feature: 'global-intel',
          type: 'global-intel',
          autoGenerate: true,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });

    console.log('🧪 Test global-intel notification scheduled for 3 seconds from now');
  } catch (error) {
    console.error('❌ Error sending test global notification:', error);
  }
}