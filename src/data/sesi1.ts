import type { Sesi } from './types';

export const sesi1: Sesi = {
  id: 'sesi-1',
  nomor: 'SESI 1',
  judul: 'Fondasi UI + Auth Lokal',
  deskripsi:
    'Setup proyek, tema, router sementara, shell + tab, widget bersama, dan layar Welcome/Login/Register yang sudah bisa dipakai. Di akhir sesi: register → login → 5 tab placeholder.',
  steps: [
    {
      id: 'setup',
      judul: 'Siapkan alat + proyek + pubspec',
      tujuan:
        'Install Flutter SDK, buat proyek dengan flutter create, lalu ganti bagian dependencies dan assets di pubspec.yaml. Jalankan flutter pub get sekali.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'terminal',
          lang: 'powershell',
          code: 'flutter doctor\nflutter create fitpedia_flutter\ncd fitpedia_flutter\nflutter pub get',
        },
        {
          file: 'pubspec.yaml (bagian dependencies + flutter)',
          lang: 'yaml',
          code: `dependencies:
  flutter:
    sdk: flutter

  flutter_riverpod: ^3.4.3
  go_router: ^18.0.2
  dio: ^5.11.1
  geolocator: ^14.1.1
  permission_handler: 12.0.1
  image_picker: ^1.2.3
  google_generative_ai: ^0.4.7
  cached_network_image: ^4.0.4
  shared_preferences: ^2.5.5
  google_fonts: ^9.0.0
  webview_flutter: ^4.14.1
  intl: ^0.20.3
  flutter_svg: ^2.3.0
  flutter_map: ^8.3.2
  latlong2: ^0.10.1
  crypto: ^3.0.7
  url_launcher: ^6.3.2
  sqflite: ^2.4.4
  sqflite_common_ffi: ^2.4.3
  path: ^1.9.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^6.0.0
flutter:
  uses-material-design: true

  assets:
    - assets/brand/
    - assets/backgrounds/
    - assets/badges/
    - assets/trainer/
    - assets/articles/
    - assets/placeholders/
    - assets/muscles/`,
        },
      ],
      checkpoint: ['flutter pub get tanpa error'],
    },
    {
      id: 'assets',
      judul: 'Copy gambar (hanya .png/.jpg, tanpa .xml)',
      tujuan:
        'Salin bitmap dari folder Fitpedia/assets/ ke folder assets/ proyek sesuai tabel. File .xml JANGAN dicopy — diganti Icons dan BoxDecoration di langkah tema.',
      pngHasil: [],
      asetDipakai: [
        'img/logo_gg.png',
        'img/ic_gmail.png',
        'img/ic_facebook.png',
        'img/ic_apple.png',
        'img/welcome_background.png',
      ],
      kode: [
        {
          file: 'struktur folder assets/ (acuan saja, tidak perlu disalin)',
          lang: 'text',
          noCopy: true,
          code: `assets/
├── brand/
│   ├── logo_gg.png
│   ├── logo_gg_icon_white.png
│   ├── ic_gmail.png
│   ├── ic_facebook.png
│   └── ic_apple.png
├── backgrounds/
│   ├── home_background.png
│   ├── welcome_background.png
│   └── robot_fitness.jpg
├── badges/                  (7 file badge_bronze … badge_amethyst.png)
├── trainer/
│   ├── consult_trainer.png
│   ├── scan_equip.png
│   ├── scan_meal.png
│   ├── nearby_location.png
│   ├── trainer_node1.png
│   ├── trainer_node2.png
│   ├── trainer_node3.png
│   ├── user_node.png
│   └── sample_trainer*.png
├── articles/
│   ├── article_category.png
│   ├── article_time.png
│   ├── article_views.png
│   ├── window_icons.png
│   ├── window_like.png
│   └── line.png
├── placeholders/
│   ├── sample_*.png dan sample_*.jpg
│   ├── reference_*.png
│   ├── classify_equip_reference.png
│   └── scan_activity_reference.png
└── muscles/                 (dibuat di Sesi 2 dari muscle_front*.xml)`,
        },
      ],
    },
    {
      id: 'env',
      judul: 'Kunci rahasia (.env.json)',
      tujuan:
        'Kunci API tidak boleh masuk git. Buat contohnya (.env.json.example, dicommit) dan salinannya (.env.json, gitignored) yang diisi kunci asli.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: '.env.json.example',
          lang: 'json',
          code: `{
  // Copy to .env.json and add your keys (gitignored).
  // Run with: flutter run --dart-define-from-file=.env.json
  "GEMINI_API_KEY": ""
}`,
        },
        {
          file: '.env.json',
          lang: 'json',
          code: `{
  "GEMINI_API_KEY": "ISI_KUNCI_GEMINI_KAMU"
}`,
        },
        {
          file: '.gitignore (tambahkan di bawah)',
          lang: 'text',
          code: '.env.json',
        },
      ],
      checkpoint: ['Jalankan app dengan: flutter run --dart-define-from-file=.env.json'],
    },
    {
      id: 'main',
      judul: 'lib/main.dart — pintu masuk',
      tujuan:
        'Inisialisasi database + sesi login, bungkus app dengan Riverpod, pakai tema gelap + router.',
      pngHasil: [],
      asetDipakai: [],
      kerangka: 'main() > ProviderScope > FitpediaApp > MaterialApp.router',
      kode: [
        {
          file: 'lib/main.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite/sqflite.dart';

import 'core/constants/app_strings.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'data/datasources/local_auth_ds.dart';

/// Local-first entry: SQLite (FFI on desktop) + SharedPreferences session
/// restore, Riverpod scope, dark theme, router. No Firebase, no server.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final Database db = await AppDatabase.instance();
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final repository = LocalAuthRepository(db, prefs);
  authSession.set(await repository.restoreSession());
  runApp(
    ProviderScope(
      overrides: [
        databaseProvider.overrideWithValue(db),
        sharedPrefsProvider.overrideWithValue(prefs),
      ],
      child: const FitpediaApp(),
    ),
  );
}

class FitpediaApp extends StatelessWidget {
  const FitpediaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: AppStrings.appName,
      theme: AppTheme.dark,
      routerConfig: AppRouter.router,
      debugShowCheckedModeBanner: false,
    );
  }
}`,
        },
      ],
    },
    {
      id: 'colors',
      judul: 'lib/core/theme/app_colors.dart — semua warna',
      tujuan:
        'Disalin 1:1 dari colors.xml Android. Jangan tulis kode hex di file lain — selalu pakai AppColors.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/core/theme/app_colors.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';

/// Design tokens mapped 1:1 from
/// \`GymGuide-MD-master/app/src/main/res/values/colors.xml\`.
/// Never hardcode hex outside this file (see \`docs/02-DESIGN_SYSTEM.md\`).
abstract final class AppColors {
  static const Color black = Color(0xFF0A0A0A);
  static const Color semiBlack = Color(0xFF212121);
  static const Color textBlack = Color(0xFF332E2E);
  static const Color white = Color(0xFFFFFFFF);

  static const Color greyNavigation = Color(0xFF333333);
  static const Color greyMenu = Color(0xFF828282);
  static const Color greyText = Color(0xFFC8C8C8);
  static const Color greyLine = Color(0xFF2D303A);
  static const Color greyText300 = Color(0xFF7B7A7A);

  static const Color bgWindow = Color(0xFF2D2D39);

  static const Color yellowMenu = Color(0xFFF2C94C);

  static const Color grey50 = Color(0xFFFAFAFA);
  static const Color grey100 = Color(0xFFF5F5F5);
  static const Color grey300 = Color(0xFFE0E0E0);
  static const Color grey400 = Color(0xFFD8D8D8);

  static const Color red100 = Color(0xFFF4C7C3);
  static const Color red300 = Color(0xFFE67C73);
  static const Color red500 = Color(0xFFDB4437);
  static const Color red700 = Color(0xFFC53929);

  static const Color blue100 = Color(0xFFC6DAFC);
  static const Color blue300 = Color(0xFF7BAAF7);
  static const Color blue500 = Color(0xFF4285F4);
  static const Color blue700 = Color(0xFF3367D6);

  static const Color green100 = Color(0xFFB7E1CD);
  static const Color green300 = Color(0xFF57BB8A);
  static const Color green500 = Color(0xFF0F9D58);
  static const Color green700 = Color(0xFF0B8043);

  static const Color yellow100 = Color(0xFFFCE8B2);
  static const Color yellow300 = Color(0xFFF7CB4D);
  static const Color yellow500 = Color(0xFFF4B400);
  static const Color yellow700 = Color(0xFFF09300);

  static const Color magnolia50 = Color(0xFFEFE5FD);
  static const Color seasonTimer = Color(0xFFFF2039);
  static const Color magnolia100 = Color(0xFFD4BFF9);
  static const Color purple500 = Color(0xFF6200EE);
  static const Color teal200 = Color(0xFF03DAC5);
  static const Color teal300 = Color(0xFF4DB6AC);
}`,
        },
      ],
    },
    {
      id: 'theme',
      judul: 'lib/core/theme/app_theme.dart — tema gelap + font',
      tujuan:
        'Font Android semuanya font Google yang bisa diunduh, jadi pakai package google_fonts: Bebas Neue (judul besar), Poppins (subjudul), Roboto/Inter (isi). Bentuk XML (rounded_*, button) diganti BoxDecoration.',
      pngHasil: [],
      asetDipakai: [],
      kerangka: 'AppTheme.dark > ThemeData.dark + textTheme + colorScheme + input/elevated/snackbar theme',
      bedah: [
        { widget: 'GoogleFonts.bebasNeue', fungsi: 'Judul display (pengganti font/bebas_neue.xml)', bagianPng: 'Judul besar Welcome' },
        { widget: 'ColorScheme.dark', fungsi: 'Warna primer kuning untuk seluruh app', bagianPng: 'Tombol + tab aktif' },
        { widget: 'inputDecorationTheme', fungsi: 'Style semua TextField sekaligus', bagianPng: 'Kolom email/password' },
        { widget: 'SnackBarBehavior.floating', fungsi: 'Toast melayang, tidak mendorong layout', bagianPng: 'Toast sukses login' },
      ],
      kode: [
        {
          file: 'lib/core/theme/app_theme.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// Dark-first Material 3 theme. Android fonts (\`res/font/*.xml\`) are
/// downloadable Google Fonts, so they are served via \`google_fonts\`:
/// Bebas Neue (display), Poppins Light (headings), Roboto/Inter (body).
/// Replaces XML drawables (\`button_rectangle_background\`,
/// \`rounded_*\`, \`register_bg_custom_input\`, \`chat_bg_custom_input\`,
/// \`scan_rounded_background\`, \`search_rectangle_background\`,
/// \`home_rounded_rectangle\`) with [BoxDecoration] equivalents below.
abstract final class AppTheme {
  static const double radiusSmall = 8;
  static const double radiusMedium = 12;
  static const double radiusLarge = 24;

  static BoxDecoration get cardDecoration => BoxDecoration(
        color: AppColors.semiBlack,
        borderRadius: BorderRadius.circular(radiusMedium),
      );

  static BoxDecoration get dialogDecoration => BoxDecoration(
        color: AppColors.bgWindow,
        borderRadius: BorderRadius.circular(radiusLarge),
      );

  static BoxDecoration get inputFillDecoration => const BoxDecoration(
        color: AppColors.semiBlack,
      );

  static ThemeData get dark {
    final base = ThemeData.dark(useMaterial3: true);
    final textTheme = TextTheme(
      displayLarge: GoogleFonts.bebasNeue(fontSize: 32, color: AppColors.white),
      displayMedium:
          GoogleFonts.bebasNeue(fontSize: 28, color: AppColors.white),
      titleLarge: GoogleFonts.poppins(
        fontSize: 20,
        fontWeight: FontWeight.w300,
        color: AppColors.white,
      ),
      titleMedium: GoogleFonts.poppins(
        fontSize: 18,
        fontWeight: FontWeight.w300,
        color: AppColors.white,
      ),
      bodyLarge: GoogleFonts.roboto(fontSize: 14, color: AppColors.white),
      bodyMedium: GoogleFonts.roboto(fontSize: 14, color: AppColors.white),
      bodySmall: GoogleFonts.roboto(fontSize: 12, color: AppColors.greyText),
      labelLarge: GoogleFonts.inter(fontSize: 14, color: AppColors.white),
    );

    final colorScheme = const ColorScheme.dark(
      primary: AppColors.yellowMenu,
      secondary: AppColors.yellow300,
      surface: AppColors.semiBlack,
      error: AppColors.red500,
    );

    return base.copyWith(
      scaffoldBackgroundColor: AppColors.black,
      colorScheme: colorScheme,
      textTheme: textTheme,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.black,
        foregroundColor: AppColors.white,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.greyNavigation,
        selectedItemColor: AppColors.yellowMenu,
        unselectedItemColor: AppColors.greyMenu,
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.yellowMenu,
        foregroundColor: AppColors.black,
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.yellowMenu,
        linearTrackColor: AppColors.greyLine,
        circularTrackColor: AppColors.greyLine,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.semiBlack,
        hintStyle: const TextStyle(color: AppColors.greyMenu, fontSize: 14),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: const BorderSide(color: AppColors.yellowMenu),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: const BorderSide(color: AppColors.red500),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.yellowMenu,
          foregroundColor: AppColors.black,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMedium),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      snackBarTheme: const SnackBarThemeData(
        backgroundColor: AppColors.bgWindow,
        contentTextStyle: TextStyle(color: AppColors.white),
        behavior: SnackBarBehavior.floating,
      ),
      dividerColor: AppColors.greyLine,
    );
  }
}`,
        },
      ],
    },
    {
      id: 'assets-const',
      judul: 'lib/core/theme/app_assets.dart — alamat gambar',
      tujuan:
        'Supaya tidak ada path string berserakan di widget. Termasuk badgeForExp untuk rank (dipakai Sesi 3).',
      pngHasil: [],
      asetDipakai: ['img/logo_gg.png'],
      kode: [
        {
          file: 'lib/core/theme/app_assets.dart',
          lang: 'dart',
          code: `/// Typed asset paths for bitmaps copied from \`Fitpedia/assets/\` per
/// \`docs/05-ASSET_MAP.md\`. Prototype PNGs and \`*.xml\` drawables are
/// intentionally absent (rebuilt with widgets per \`docs/02-DESIGN_SYSTEM.md\`).
abstract final class AppAssets {
  // Brand
  static const String logoGg = 'assets/brand/logo_gg.png';
  static const String logoGgIconWhite = 'assets/brand/logo_gg_icon_white.png';
  static const String icGmail = 'assets/brand/ic_gmail.png';
  static const String icFacebook = 'assets/brand/ic_facebook.png';
  static const String icApple = 'assets/brand/ic_apple.png';

  // Backgrounds
  static const String homeBackground = 'assets/backgrounds/home_background.png';
  static const String welcomeBackground =
      'assets/backgrounds/welcome_background.png';
  static const String robotFitness = 'assets/backgrounds/robot_fitness.jpg';

  // Rank badges keyed by exp tier (see \`RankBadge\` widget, Phase 5).
  static const String badgeBronze = 'assets/badges/badge_bronze.png';
  static const String badgeSilver = 'assets/badges/badge_silver.png';
  static const String badgeGold = 'assets/badges/badge_gold.png';
  static const String badgePlatinum = 'assets/badges/badge_platinum.png';
  static const String badgeRuby = 'assets/badges/badge_ruby.png';
  static const String badgeSapphire = 'assets/badges/badge_sapphire.png';
  static const String badgeAmethyst = 'assets/badges/badge_amethyst.png';

  /// Resolves the badge asset for an exp value (tiers finalized in Phase 5).
  static String badgeForExp(int exp) {
    if (exp >= 4000) return badgeAmethyst;
    if (exp >= 3000) return badgeSapphire;
    if (exp >= 2000) return badgeRuby;
    if (exp >= 1500) return badgePlatinum;
    if (exp >= 1000) return badgeGold;
    if (exp >= 500) return badgeSilver;
    return badgeBronze;
  }

  // Trainer / scan / nearby
  static const String consultTrainer = 'assets/trainer/consult_trainer.png';
  static const String scanEquip = 'assets/trainer/scan_equip.png';
  static const String scanMeal = 'assets/trainer/scan_meal.png';
  static const String nearbyLocation = 'assets/trainer/nearby_location.png';
  static const String trainerNode1 = 'assets/trainer/trainer_node1.png';
  static const String trainerNode2 = 'assets/trainer/trainer_node2.png';
  static const String trainerNode3 = 'assets/trainer/trainer_node3.png';
  static const String userNode = 'assets/trainer/user_node.png';

  // Articles
  static const String articleCategory = 'assets/articles/article_category.png';
  static const String articleTime = 'assets/articles/article_time.png';
  static const String articleViews = 'assets/articles/article_views.png';
  static const String windowIcons = 'assets/articles/window_icons.png';
  static const String windowLike = 'assets/articles/window_like.png';
  static const String line = 'assets/articles/line.png';

  // Dev placeholders (sample_* / reference_*): card content only,
  // never full-screen UI.
  static const String placeholdersDir = 'assets/placeholders/';
  static const String sampleExercise = 'assets/placeholders/sample_exercise.png';
  static const String sampleTip = 'assets/placeholders/sample_tip.png';
  static const String sampleList = 'assets/placeholders/sample_list.png';
  static const String sampleClassifyOutput =
      'assets/placeholders/sample_classify_output.png';
  static const String sampleExercisePhoto =
      'assets/placeholders/sample_exercise_photo.png';
  static const String sampleDumbbell = 'assets/placeholders/sample_dumbbell.jpg';
  static const String sampleExercisePic =
      'assets/placeholders/sample_exercise_photo.png';
  static const String referenceAppointmentFor =
      'assets/placeholders/reference_appointment_for.png';
  static const String referenceAppointmentDate =
      'assets/placeholders/reference_appointment_date.png';
  static const String referenceAppointmentTime =
      'assets/placeholders/reference_appointment_time.png';
  static const String referenceSuccessBook =
      'assets/placeholders/reference_success_book.png';
  static const String referenceUserRank =
      'assets/placeholders/reference_user_rank.png';
  static const String referenceEditProfile =
      'assets/placeholders/reference_edit_profile.png';
  static const String sampleCalorieBurned =
      'assets/placeholders/sample_calorie_burned.png';
  static const String sampleCalorieIn =
      'assets/placeholders/sample_calorie_in.png';
  static const String sampleCalorieInItem =
      'assets/placeholders/sample_calorie_in_item.png';
  static const String sampleWater = 'assets/placeholders/sample_water.png';
  static const String sampleSleepTracker =
      'assets/placeholders/sample_sleep_tracker.png';
  static const String sampleTrainerPhoto =
      'assets/placeholders/sample_trainer_photo.png';

  // Muscle map SVGs converted from \`Fitpedia/assets/muscle_front*.xml\`
  // vectors (base silhouette + per-muscle yellow overlays).
  static const String muscleFront = 'assets/muscles/muscle_front.svg';
  static String muscleOverlay(String muscleKey) =>
      'assets/muscles/muscle_front_$muscleKey.svg';
}`,
        },
      ],
    },
    {
      id: 'strings',
      judul: 'lib/core/constants/app_strings.dart — semua tulisan',
      tujuan:
        'Disalin kata-per-kata dari layout Android supaya pesannya sama persis. File panjang tapi hanya ditempel sekali.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/core/constants/app_strings.dart',
          lang: 'dart',
          code: `/// Centralized strings. Error/toast copy is verbatim from
/// \`LoginActivity.kt\`, \`RegisterActivity.kt\`, \`ClassifyEquipActivity.kt\`,
/// and \`MuscleMapActivity.kt\` to keep validation parity.
abstract final class AppStrings {
  static const String appName = 'Fitpedia';

  // Validation (\`LoginActivity.kt:83-97\`, \`RegisterActivity.kt:85-115\`).
  static const String emailEmpty = 'Email is empty';
  static const String emailInvalid = 'Invalid email format';
  static const String nameEmpty = 'Name is empty';
  static const String passwordEmpty = 'Password is empty';
  static const String passwordTooShort =
      'Password must be at least 8 characters long';
  static const String confirmPasswordEmpty = 'Password again is empty';
  static const String confirmPasswordMismatch =
      'Password again is different than password';

  // Auth outcomes.
  static const String loginSuccess = 'Authentication success.';
  static const String loginFailedPrefix = 'Login failed.';
  static const String registerSuccess = 'Account created successfully.';
  static const String registerFailedPrefix = 'Register failed.';

  // Stub scope (parity toasts, never implemented).
  static const String googleStub =
      'Google sign in is still under development, use email';
  static const String appleStub =
      'Apple sign in is still under development, use google or email';
  static const String facebookStub =
      'Facebook sign in is still under development, use google or email';
  static const String forgetPasswordStub =
      'Forget password is still under development';
  static const String backMuscleMapStub = 'Back muscle map is still under development';

  // Food classify (\`ClassifyFoodActivity.kt:130-173\`).
  static const String foodNoResponse = 'No response received.';
  static const String foodWrongImage =
      'Unable to classify the image. Please select a clear image of food or drink.';

  // Chat (\`ChatActivity.kt:174\`).
  static const String chatFailedPrefix = 'Failed to load response due to';

  // Shared loading/failed retry copy.
  static const String retry = 'Retry';
  static const String back = 'Back';
  static const String cancel = 'cancel';

  // Welcome (\`activity_welcome.xml:26-135\`).
  static const String welcomeLine1 = 'WITH GREAT BODY';
  static const String welcomeLine2 = 'COMES GREAT';
  static const String welcomeHighlight = 'MIND';
  static const String welcomeDescription =
      'Scan your workout equipment and get list of exercise on how to perform it to help you on your transformation journey';
  static const String getStarted = 'Get Started';
  static const String logIn = 'Log in';
  static const String becomeTrainer = 'Become a trainer';

  // Login / register (\`activity_login.xml\`, \`activity_register.xml\`).
  static const String signIn = 'Sign In';
  static const String signUp = 'Sign Up';
  static const String loginSubtitle = 'Enchance Your Fitness Journey!';
  static const String registerSubtitle = 'Level Up Your Workout Today!';
  static const String hintName = 'Name';
  static const String hintEmail = 'Email';
  static const String hintPassword = 'Password';
  static const String hintConfirmPassword = 'Confirm Password';
  static const String rememberMe = 'Remember me';
  static const String forgetPassword = 'Forget password?';
  static const String orDivider = 'or';
  static const String noAccount = "Don't have an account?";
  static const String hasAccount = 'Already have an account?';
  static const String newsletterOptIn =
      'I would like to receive newsletter and other promotional information';

  // Home (\`fragment_home.xml\`, \`HomeFragment.kt:62-69\`).
  static const String welcomeFallback = 'Welcome To Fitpedia';
  static String welcomeUser(String name) => 'Welcome, $name!';
  static const String getStartedWith = 'GET STARTED WITH FITPEDIA';
  static const String featuredWorkout = 'Waist Clinching Workout';
  static const String featuredProgress = '75% Completed';
  static const String continueLabel = 'Continue';
  static const String streak = '\\u{1F525}10';
  static const String recent = 'RECENT';
  static const String more = 'MORE';
  static const String proTipTitle = 'Pro Tip: Warm Out';
  static const String proTipSubtitle = 'tap to learn how to warming out';
  static const String articleBannerTitle = 'Upper Body Attack';
  static const String articleBannerBody =
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.';
  static const String failedMessage =
      'Please check your internet connection, press button below to try again';

  // Exercise detail (\`activity_detail_exercise.xml\`).
  static const String beginExercise = 'Begin Exercise';
  static const String overview = 'OVERVIEW';
  static const String videoTutorial = 'VIDEO TUTORIAL';
  static const String otherExercise = 'OTHER EXERCISE';
  static const String watchOnYouTube = 'Watch on YouTube';
  static const String cannotOpenVideo = 'Cannot open the video link.';

  // Scan hub (\`ScanFragment.kt\`, \`fragment_scan.xml\`).
  static const String scanSearchHint = 'Exercise/Food/Trainer/Article/Gym';
  static const String muscleMapTitle = 'Muscle Map';
  static const String muscleMapSubtitle =
      'Find specific muscle you want to train. Tap here to see the muscle map';
  static const String everythingHere = 'Everything is here';
  static const String everythingHereBody =
      'Let’s do this. Find all your fitness needs here. \\nTap search to see results';
  static const String pickEquipTitle = 'Select Equip Image Source';
  static const String pickFoodTitle = 'Select Food Image Source';
  static const String sourceCamera = 'Camera';
  static const String sourceGallery = 'Gallery';
  static const String permissionDeniedSettings =
      'Permission denied, please enable it via settings';

  // Muscle (\`MuscleMapActivity.kt\`, \`activity_muscle_map.xml\`,
  // \`MuscleDetailActivity.kt:33\`).
  static const String muscleMapPrompt =
      'Click Specific Muscle \\nYou Want To Train';
  static const String backMuscle = 'Back Muscle';
  static String exerciseListFor(String muscleText) =>
      'Exercise List for $muscleText';

  // Start exercise (\`activity_start_exercise.xml\`).
  static const String pause = 'Pause';
  static const String checkMovement = 'Check Movement';
  static const String startTimerPlaceholder = '00:27';

  // Trainer (\`TrainerActivity.kt\`, \`DetailTrainerActivity.kt\`,
  // \`BookTrainerActivity.kt\`, \`ScheduleTrainerActivity.kt\`,
  // \`activity_trainer.xml\`, \`activity_detail_trainer.xml\`,
  // \`activity_book_trainer.xml\`, \`activity_schedule_trainer.xml\`,
  // \`strings.xml\` formats).
  static const List<String> trainerCategories = <String>[
    'General',
    'Cardio',
    'Strength',
    'Yoga',
    'Lifestyle',
  ];
  static const String topTrainers = 'Top Rated Personal Trainers';
  static const String trainerSpecialist = 'Cardio Specialist';
  static const String bookAppointment = 'Book An Appointment';
  static const String comments = 'Comments';
  static const String commentsCount = '2703';
  static const String likes = 'Likes';
  static const String likesCount = '3233';
  static const String suggested = 'Suggested';
  static const String suggestedCount = '1101';
  static const String articles = 'ARTICLES';
  static const String viewAll = 'VIEW ALL';
  static const String schedule = 'Schedule';
  static const String confirm = 'Confirm';
  static String trainerLocation(String location) => '\\u{1F4CD} $location';
  static String trainerRating(String rating) => '⭐\\n$rating';

  // Chat (\`ChatActivity.kt\`, \`activity_chat.xml\`, \`item_chat.xml\`).
  static const String fitAiName = 'GymChat Guru (Bot)';
  static const String chatStatus = 'Ask Your Fitness Need';
  static const String sendMessageHint = 'Send a message';
  static const String attachStub = 'Attachments are still under development';

  // Discover (\`fragment_discover.xml\`, static banners, no \`.kt\` logic).
  static const String workoutTracking = 'Workout Tracking';
  static const String calorieTracking = 'Calorie Tracking';
  static const String waterIntake = 'Water Intake';
  static const String sleepTracker = 'Sleep Tracker';

  // Article (\`ArticleActivity.kt\`, \`activity_article.xml\`,
  // \`strings.xml\` lorem/ipsum).
  static const String articleTitle =
      'Exercise and the Brain: How Fitness Impacts Learning';
  static const String articleSubtitle =
      'Vivamus mattis dapibus hendreritt. Phalessus ullamcopper orci sapien, et lacinia magna hendreritt.';
  static const String articleAuthor = 'Pelican Steve';
  static const String articleSection = 'Exercise';
  static const String lorem =
      'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet mauris commodo quis imperdiet massa tincidunt. Vel risus commodo viverra maecenas accumsan lacus. \\n\\nNisl pretium fusce id velit ut tortor. Nisl pretium fusce id velit ut tortor. Vel risus commodo viverra maecenas accumsan lacus. Nisl pretium fusce id velit ut tortor.';
  static const String ipsum =
      'Vel risus commodo viverra maecenas accumsan lacus. Nisl pretium fusce id velit ut tortor. Vel risus commodo viverra maecenas accumsan lacus. Nisl pretium fusce id velit ut tortor. Vel risus commodo viverra maecenas accumsan lacus. Nisl pretium fusce id velit ut tortor.';

  // Maps (\`MapsFragment.kt\`, \`fragment_maps.xml\`).
  static const String locationPermissionRationale =
      'Please accept the permission before accessing this feature!';
  static const String nearbyName = 'Brandon Guidelines';
  static const String nearbyRole = 'Senior Weightlifter';
  static const String mapTrainerName = 'Brendon Guidelines';

  // Rank (\`RankFragment.kt\`, \`RankDetailActivity.kt\`, \`fragment_rank.xml\`,
  // \`item_rank.xml\`, \`strings.xml\` user_exp_format).
  static const String platinumRank = 'Platinum Rank';
  static const String seasonCountdown = '7m 40s';
  static String userExp(String exp) => '$exp EXP';

  // Settings (\`SettingsFragment.kt\`, \`EditProfileActivity.kt\`,
  // \`fragment_setting.xml\`).
  static const String profileSection = 'Profile';
  static const String editProfile = 'Edit Profile';
  static const String myEmail = 'My Email';
  static const String resetPassword = 'Reset Password';
  static const String myLocation = 'My Location';
  static const String notifications = 'Notifications';
  static const String supportSection = 'Support';
  static const String termsPolicies = 'Terms & Policies';
  static const String logOut = 'Log Out';

  // Survey + subscribe (PNG-only, no \`.kt\` — copy from
  // \`Fitpedia Prototype UI/Fitness Survey Menu 1-5.png\`, \`Subscribe Menu.png\`).
  static const String createAccount = 'BUAT AKUN';
  static const String surveyStep1Title = 'Fitness Level';
  static const String surveyStep2Title = 'Tujuan';
  static const String surveyStep2Subtitle = 'Pilih sebanyak yang Anda suka';
  static const String surveyStep3Title = 'Tinggi Badan';
  static const String surveyStep4Title = 'Berat Badan';
  static const String surveyStep5Title = 'Pullups Maksimal';
  static const String surveyStep5Subtitle =
      'Berapa banyak pull-up yang dapat Anda lakukan tanpa terputus?';
  static const String lanjutkan = 'Lanjutkan';
  static const String getRecommendation = 'Dapatkan Rekomendasi';
  static const String subscribeTitle = 'Choose Subscription Plan';
  static const String subscribeSubtitle =
      'Get the best service with our subscription plans tailored to make exercise fun and live.';
  static const String monthly = 'Monthly';
  static const String annually = 'Annual';
  static const String tapToSubscribe = 'Tap to Subscribe';
  static const String subscribeStub =
      'Subscriptions are still under development';

  // Classify (\`activity_classify_equip.xml\`, \`activity_classify_food.xml\`).
  static const String classificationResult = 'Classification Result';
  static const String classifiedAs = 'Classified as';
  static const String musclePart = 'Muscle part';
  static const String musclePartValue = 'Hand, Leg, Bisep, Tricep';
  static const String exerciseRecommendation = 'Exercise Recommendation';
  static const String nutritionInformation = 'Nutrition Information';
  static const String addButton = 'Add +';
  static String caloriesLabel(int total) => '$total calories';
}`,
        },
      ],
    },
    {
      id: 'api-constants',
      judul: 'lib/core/constants/api_constants.dart — alamat server + kunci',
      tujuan:
        'Satu-satunya tempat menyimpan URL dan kunci. Rahasia dibaca dari --dart-define (file .env.json).',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/core/constants/api_constants.dart',
          lang: 'dart',
          code: `/// API + service constants. Source: \`docs/04-API_CONTRACTS.md\`,
/// \`data/RetrofitInstance.kt\`, \`data/ExerciseApi.kt\`.
/// Secrets arrive via \`--dart-define\`, never hardcoded.
abstract final class ApiConstants {
  // Exercise API (\`RetrofitInstance.kt:8\`, \`ExerciseApi.kt:7\`).
  static const String exerciseBaseUrl =
      'https://exercise-crng4qpv6q-et.a.run.app';
  static const String exercisesPath = '/exercises';

  // Gemini (\`ClassifyFoodActivity.kt:28\`, \`ChatActivity.kt:114\`).
  static const String geminiModel = 'gemini-1.5-flash';
  static const String geminiApiKey = String.fromEnvironment('GEMINI_API_KEY');

  // Chat persistence keys (\`ChatActivity.kt:27-29\`).
  static const String chatPrefs = 'chat_prefs';
  static const String chatMessagesKey = 'chat_messages';
  static const String appLaunchedKey = 'app_launched';

  // Muscle map hotspot keys (\`MuscleMapActivity.kt:21-83\`).
  static const List<String> muscleKeys = <String>[
    'calves',
    'quads',
    'chest',
    'traps',
    'shoulders',
    'biceps',
    'forearms',
    'obliques',
    'abdominals',
  ];
}`,
        },
      ],
    },
    {
      id: 'validators',
      judul: 'lib/core/utils/validators.dart — aturan form',
      tujuan:
        'Aturan validasi sama persis dengan Android: email wajib + format benar, password minimal 8, konfirmasi harus sama.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/core/utils/validators.dart',
          lang: 'dart',
          code: `import '../constants/app_strings.dart';

/// Validation parity with \`LoginActivity.kt:83-97\` and
/// \`RegisterActivity.kt:85-115\` (email non-empty + format, password ≥ 8,
/// register confirm-match). Returns the field error or null when valid.
abstract final class Validators {
  static final RegExp _emailPattern = RegExp(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
  );

  static String? email(String? value) {
    final text = (value ?? '').trim();
    if (text.isEmpty) return AppStrings.emailEmpty;
    if (!_emailPattern.hasMatch(text)) return AppStrings.emailInvalid;
    return null;
  }

  static String? password(String? value) {
    final text = (value ?? '').trim();
    if (text.isEmpty) return AppStrings.passwordEmpty;
    if (text.length < 8) return AppStrings.passwordTooShort;
    return null;
  }

  static String? name(String? value) {
    if ((value ?? '').trim().isEmpty) return AppStrings.nameEmpty;
    return null;
  }

  static String? confirmPassword(String? password, String? confirm) {
    final confirmText = (confirm ?? '').trim();
    if (confirmText.isEmpty) return AppStrings.confirmPasswordEmpty;
    if (confirmText.length < 8) return AppStrings.passwordTooShort;
    if ((password ?? '').trim() != confirmText) {
      return AppStrings.confirmPasswordMismatch;
    }
    return null;
  }
}`,
        },
      ],
    },
    {
      id: 'local-auth',
      judul: 'lib/data/datasources/local_auth_ds.dart — database akun',
      tujuan:
        'SQLite di HP + SharedPreferences untuk sesi login. Password tidak pernah disimpan polos (SHA-256 + salt acak). Di Windows/Linux otomatis pakai FFI supaya tidak layar hitam.',
      pngHasil: [],
      asetDipakai: [],
      bedah: [
        { widget: 'AppDatabase', fungsi: 'Buka/buat file fitpedia.db + tabel users', bagianPng: '— (infrastruktur)' },
        { widget: 'AuthSession', fungsi: 'Status login yang didengar router; berubah saat login/logout', bagianPng: 'Pindah otomatis ke Home' },
        { widget: 'LocalAuthRepository', fungsi: 'register (email unik), signIn (cek hash), signOut, restoreSession', bagianPng: 'Login/Register' },
      ],
      kode: [
        {
          file: 'lib/data/datasources/local_auth_ds.dart',
          lang: 'dart',
          code: `import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path/path.dart' as p;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

/// Local account stored in on-device SQLite (works on every platform:
/// native \`sqflite\` on Android/iOS/macOS, FFI on Windows/Linux).
class LocalUser {
  const LocalUser({
    required this.id,
    required this.name,
    required this.email,
  });

  final int id;
  final String name;
  final String email;
}

/// Clean error messages for SnackBars (no \`Exception:\`/\`Bad state:\` prefix).
class AuthException implements Exception {
  const AuthException(this.message);

  final String message;

  @override
  String toString() => message;
}

class AppDatabase {
  static const String _fileName = 'fitpedia.db';
  static const String sessionUserIdKey = 'auth_user_id';

  static Database? _db;
  static bool _ffiReady = false;

  /// \`sqflite\` has no Windows/Linux implementation — route those platforms
  /// through \`sqflite_common_ffi\` (missing this was the desktop blank-screen
  /// crash: \`MissingPluginException\` before \`runApp\`).
  static void _ensureDesktopFactory() {
    if (_ffiReady || kIsWeb) return;
    if (Platform.isWindows || Platform.isLinux) {
      sqfliteFfiInit();
      databaseFactory = databaseFactoryFfi;
      _ffiReady = true;
    }
  }

  static Future<Database> instance() async {
    if (_db != null) return _db!;
    _ensureDesktopFactory();
    final dir = await getDatabasesPath();
    _db = await openDatabase(
      p.join(dir, _fileName),
      version: 1,
      onCreate: (db, _) => createSchema(db),
    );
    return _db!;
  }

  static Future<void> createSchema(Database db) {
    return db.execute(
      'CREATE TABLE users('
      'id INTEGER PRIMARY KEY AUTOINCREMENT, '
      'name TEXT NOT NULL, '
      'email TEXT NOT NULL UNIQUE, '
      'password_hash TEXT NOT NULL, '
      'salt TEXT NOT NULL, '
      'created_at TEXT NOT NULL)',
    );
  }
}

/// App-wide session, observed by the router guard. Restored once in \`main\`.
class AuthSession extends ChangeNotifier {
  LocalUser? _user;

  LocalUser? get user => _user;

  void set(LocalUser? user) {
    _user = user;
    notifyListeners();
  }
}

final authSession = AuthSession();

/// Email/password auth against SQLite. Unlike Android
/// (\`RegisterActivity.kt:121-142\`), the validated \`name\` is actually stored
/// and shown on Home.
class LocalAuthRepository {
  LocalAuthRepository(this._db, this._prefs);

  final Database _db;
  final SharedPreferences _prefs;

  LocalUser? get currentUser => authSession.user;

  static String _normalizeEmail(String email) => email.trim().toLowerCase();

  static String _salt() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    return base64Url.encode(bytes);
  }

  static String _hash(String salt, String password) =>
      sha256.convert(utf8.encode('$salt:$password')).toString();

  static LocalUser _rowToUser(Map<String, Object?> row) => LocalUser(
        id: row['id'] as int,
        name: row['name'] as String,
        email: row['email'] as String,
      );

  Future<LocalUser> registerWithEmail(
    String name,
    String email,
    String password,
  ) async {
    final normalized = _normalizeEmail(email);
    final salt = _salt();
    try {
      final id = await _db.insert('users', <String, Object?>{
        'name': name.trim(),
        'email': normalized,
        'password_hash': _hash(salt, password.trim()),
        'salt': salt,
        'created_at': DateTime.now().toIso8601String(),
      });
      return LocalUser(id: id, name: name.trim(), email: normalized);
    } on DatabaseException catch (e) {
      if (e.isUniqueConstraintError()) {
        throw const AuthException(
          'An account with this email already exists.',
        );
      }
      rethrow;
    }
  }

  Future<LocalUser> signInWithEmail(String email, String password) async {
    final normalized = _normalizeEmail(email);
    final rows = await _db.query(
      'users',
      where: 'email = ?',
      whereArgs: <Object?>[normalized],
      limit: 1,
    );
    if (rows.isEmpty) {
      throw const AuthException('No account found for this email.');
    }
    final row = rows.first;
    final salt = row['salt'] as String;
    if (_hash(salt, password.trim()) != row['password_hash']) {
      throw const AuthException('Incorrect password.');
    }
    final user = _rowToUser(row);
    await _prefs.setInt(AppDatabase.sessionUserIdKey, user.id);
    authSession.set(user);
    return user;
  }

  Future<LocalUser?> restoreSession() async {
    final id = _prefs.getInt(AppDatabase.sessionUserIdKey);
    if (id == null) return null;
    final rows = await _db.query(
      'users',
      where: 'id = ?',
      whereArgs: <Object?>[id],
      limit: 1,
    );
    if (rows.isEmpty) return null;
    return _rowToUser(rows.first);
  }

  Future<void> signOut() async {
    await _prefs.remove(AppDatabase.sessionUserIdKey);
    authSession.set(null);
  }
}

final databaseProvider = Provider<Database>(
  (ref) => throw UnimplementedError('Overridden in main()'),
);

final sharedPrefsProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError('Overridden in main()'),
);

final authRepositoryProvider = Provider<LocalAuthRepository>((ref) {
  return LocalAuthRepository(
    ref.watch(databaseProvider),
    ref.watch(sharedPrefsProvider),
  );
});`,
        },
      ],
    },
    {
      id: 'router-v1',
      judul: 'lib/core/router/app_router.dart — versi Sesi 1 (sementara)',
      tujuan:
        'Hanya rute auth + 5 tab placeholder. Penjaga rute: belum login di luar auth → /welcome; sudah login di auth → /home. Akan diganti versi lengkap di Sesi 3.',
      pngHasil: [],
      asetDipakai: [],
      kerangka: 'GoRouter > GoRoute(/welcome,/login,/register) + StatefulShellRoute(5 PlaceholderTab)',
      kode: [
        {
          file: 'lib/core/router/app_router.dart (sementara)',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../data/datasources/local_auth_ds.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/auth/welcome_screen.dart';
import '../../features/shell/main_shell.dart';

/// Sesi 1: auth + shell placeholder. Diganti versi lengkap di Sesi 3.
class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/welcome',
    refreshListenable: authSession,
    redirect: (BuildContext context, GoRouterState state) {
      final loggedIn = authSession.user != null;
      final location = state.matchedLocation;
      const authRoutes = <String>['/welcome', '/login', '/register'];
      final isAuthRoute = authRoutes.contains(location);
      if (!loggedIn && !isAuthRoute) return '/welcome';
      if (loggedIn && isAuthRoute) return '/home';
      return null;
    },
    routes: <RouteBase>[
      GoRoute(
        path: '/welcome',
        builder: (context, state) => const WelcomeScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            MainShell(navigationShell: navigationShell),
        branches: <StatefulShellBranch>[
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/home',
                builder: (context, state) =>
                    const PlaceholderTab(label: 'Home'),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/discover',
                builder: (context, state) =>
                    const PlaceholderTab(label: 'Discover'),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/scan',
                builder: (context, state) =>
                    const PlaceholderTab(label: 'Scan'),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/rank',
                builder: (context, state) =>
                    const PlaceholderTab(label: 'Rank'),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/settings',
                builder: (context, state) =>
                    const PlaceholderTab(label: 'Settings'),
              ),
            ],
          ),
        ],
      ),
    ],
  );
}`,
        },
      ],
    },
    {
      id: 'shell',
      judul: 'lib/features/shell/main_shell.dart — bar bawah + kamera',
      tujuan:
        'Bottom bar buatan sendiri (bukan BottomNavigationBar) supaya saat tab Scan aktif tidak ada tab yang kuning. FAB selalu kuning. resizeToAvoidBottomInset false agar keyboard tidak mendorong bar ke atas.',
      pngHasil: [],
      asetDipakai: [],
      kerangka: 'Scaffold > body + FAB(centerDocked) + BottomAppBar(notch) > Row[tab, tab, Spacer, tab, tab]',
      bedah: [
        { widget: 'StatefulShellRoute', fungsi: '5 tab yang state-nya tidak hilang saat pindah', bagianPng: 'Navigasi bawah' },
        { widget: 'FloatingActionButton.centerDocked', fungsi: 'Tombol kamera tengah masuk ke lekukan bar', bagianPng: 'Tombol kamera kuning' },
        { widget: 'BottomAppBar + CircularNotchedRectangle', fungsi: 'Bar abu + coakan lingkaran untuk FAB', bagianPng: 'Bar bawah' },
        { widget: '_BarItem (active?)', fungsi: 'Kuning jika branch-nya aktif, abu jika tidak', bagianPng: 'Label Home/Discover/Rank/Settings' },
      ],
      kode: [
        {
          file: 'lib/features/shell/main_shell.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';

/// Bottom bar + center FAB scan hub mirroring \`MainActivity.kt\`:
/// Home / Discover / (FAB → Scan) / Rank / Settings. Selected tab uses
/// \`yellowMenu\`, inactive tabs \`greyMenu\` (\`MainActivity.kt:53-69\`).
/// Custom bar (not \`BottomNavigationBar\`) so that while the Scan branch is
/// active no tab stays highlighted. \`resizeToAvoidBottomInset: false\` keeps
/// the keyboard from pushing the bar up.
class MainShell extends StatelessWidget {
  const MainShell({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  static const List<_TabItem> _tabs = <_TabItem>[
    _TabItem(label: 'Home', icon: Icons.home, branchIndex: 0),
    _TabItem(label: 'Discover', icon: Icons.dashboard, branchIndex: 1),
    // Index 2 is the center FAB (Scan hub), not a bottom-bar item.
    _TabItem(label: 'Rank', icon: Icons.leaderboard, branchIndex: 3),
    _TabItem(label: 'Settings', icon: Icons.account_circle, branchIndex: 4),
  ];

  void _goBranch(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentIndex = navigationShell.currentIndex;
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: navigationShell,
      floatingActionButton: FloatingActionButton(
        onPressed: () => _goBranch(2),
        backgroundColor: AppColors.yellowMenu,
        foregroundColor: AppColors.black,
        child: const Icon(Icons.photo_camera),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: AppColors.greyNavigation,
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            _BarItem(
              tab: _tabs[0],
              active: currentIndex == 0,
              onTap: () => _goBranch(0),
            ),
            _BarItem(
              tab: _tabs[1],
              active: currentIndex == 1,
              onTap: () => _goBranch(1),
            ),
            const Spacer(),
            _BarItem(
              tab: _tabs[2],
              active: currentIndex == 3,
              onTap: () => _goBranch(3),
            ),
            _BarItem(
              tab: _tabs[3],
              active: currentIndex == 4,
              onTap: () => _goBranch(4),
            ),
          ],
        ),
      ),
    );
  }
}

class _BarItem extends StatelessWidget {
  const _BarItem({
    required this.tab,
    required this.active,
    required this.onTap,
  });

  final _TabItem tab;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? AppColors.yellowMenu : AppColors.greyMenu;
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(tab.icon, color: color),
            const SizedBox(height: 2),
            Text(
              tab.label,
              style: TextStyle(color: color, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class _TabItem {
  const _TabItem({
    required this.label,
    required this.icon,
    required this.branchIndex,
  });

  final String label;
  final IconData icon;
  final int branchIndex;
}

/// Temporary tab body; replaced by the real tab in its phase.
class PlaceholderTab extends StatelessWidget {
  const PlaceholderTab({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(label)),
      body: Center(
        child: Text(
          '$label — coming in its phase',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ),
    );
  }
}`,
        },
      ],
    },
    {
      id: 'shared',
      judul: 'lib/shared/widgets/ — 4 widget dipakai ulang',
      tujuan:
        'LoadingView/FailedView(+retry)/WrongImageView + renderer AsyncValue; kartu exercise horizontal; kartu rekomendasi vertikal; tombol back lingkaran untuk Windows.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/shared/widgets/loading_error_view.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';

/// Shared loading/success/failed views giving parity with
/// \`HomeFragment.kt:107-138\` (\`progressBar\` / \`successLayout\` /
/// \`failedLayout\` + retry) and the wrong-image state in
/// \`ClassifyFoodActivity.kt:197-200\`.
class LoadingView extends StatelessWidget {
  const LoadingView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }
}

class FailedView extends StatelessWidget {
  const FailedView({
    super.key,
    required this.message,
    required this.onRetry,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.cloud_off,
              size: 64,
              color: AppColors.greyMenu,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              child: const Text(AppStrings.retry),
            ),
          ],
        ),
      ),
    );
  }
}

class WrongImageView extends StatelessWidget {
  const WrongImageView({
    super.key,
    required this.message,
    required this.onBack,
  });

  final String message;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.image_not_supported_outlined,
              size: 64,
              color: AppColors.greyMenu,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onBack,
              child: const Text(AppStrings.back),
            ),
          ],
        ),
      ),
    );
  }
}

/// Riverpod \`AsyncValue\` renderer: loading → progress, error → failed+retry,
/// data → success builder.
class AsyncStateView<T> extends StatelessWidget {
  const AsyncStateView({
    super.key,
    required this.value,
    required this.data,
    required this.onRetry,
  });

  final AsyncValue<T> value;
  final Widget Function(T data) data;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return value.when(
      loading: () => const LoadingView(),
      error: (error, _) => FailedView(
        message: error.toString(),
        onRetry: onRetry,
      ),
      data: data,
    );
  }
}`,
        },
        {
          file: 'lib/shared/widgets/exercise_card.dart',
          lang: 'dart',
          code: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/exercise.dart';

/// Horizontal exercise card mirroring \`item_exercise.xml\` as bound by
/// \`ExerciseAdapter.kt:79-108\`: 220×140 rounded picture (Glide →
/// \`cached_network_image\`), name, 2-line instructions. Tap pushes
/// \`/exercise/detail\` with the \`Exercise\` object (replacing 10 extras).
class ExerciseCard extends StatelessWidget {
  const ExerciseCard({
    super.key,
    required this.exercise,
    required this.onTap,
  });

  final Exercise exercise;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 220,
        margin: const EdgeInsets.only(right: 16),
        color: AppColors.black,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: CachedNetworkImage(
                imageUrl: exercise.picture,
                width: 220,
                height: 140,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  width: 220,
                  height: 140,
                  color: AppColors.semiBlack,
                  child: const Center(
                    child: SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Image.asset(
                  AppAssets.sampleExercise,
                  width: 220,
                  height: 140,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              exercise.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              exercise.instructions,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 12,
                fontWeight: FontWeight.w300,
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
        },
        {
          file: 'lib/shared/widgets/recommendation_card.dart',
          lang: 'dart',
          code: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/exercise.dart';

/// Vertical recommendation row mirroring
/// \`item_exercise_recommendation.xml\` as bound by
/// \`ExerciseAdapter.kt:94-105\`: 180×100 rounded picture + name + 3-line
/// instructions. Used by the equipment result list
/// (\`activity_classify_equip.xml:121-132\`).
class RecommendationCard extends StatelessWidget {
  const RecommendationCard({
    super.key,
    required this.exercise,
    required this.onTap,
  });

  final Exercise exercise;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        color: AppColors.black,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: CachedNetworkImage(
                imageUrl: exercise.picture,
                width: 180,
                height: 100,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  width: 180,
                  height: 100,
                  color: AppColors.semiBlack,
                  child: const Center(
                    child: SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Image.asset(
                  AppAssets.sampleExercise,
                  width: 180,
                  height: 100,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    exercise.name,
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    exercise.instructions,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
        },
        {
          file: 'lib/shared/widgets/screen_back_button.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';

/// Circular back button for pushed screens. Desktop builds (Windows/Linux)
/// have no system back button or gesture, so every dead-end route shows one.
/// Hides itself when there is nothing to pop.
class ScreenBackButton extends StatelessWidget {
  const ScreenBackButton({super.key});

  @override
  Widget build(BuildContext context) {
    if (!context.canPop()) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Material(
        color: AppColors.black.withValues(alpha: 0.55),
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: () => context.pop(),
          child: const Padding(
            padding: EdgeInsets.all(8),
            child: Icon(Icons.arrow_back, color: AppColors.white),
          ),
        ),
      ),
    );
  }
}`,
        },
      ],
    },
    {
      id: 'auth-widgets',
      judul: 'Auth backdrop + input + sosial (auth/widgets)',
      tujuan:
        'Kerangka dipakai login & register: foto latar + gradasi, input putih ikon hitam (pengganti register_bg_custom_input.xml), tombol sosial.',
      pngHasil: ['img/sign-in.png', 'img/sign-up.png'],
      asetDipakai: ['img/welcome_background.png', 'img/ic_gmail.png', 'img/ic_facebook.png', 'img/ic_apple.png'],
      kerangka: 'Scaffold > Stack[Image(bg), gradient, scroll(Column), back?] | AuthTextField | SocialRow',
      bedah: [
        { widget: 'Positioned.fill + Image.asset', fungsi: 'Foto latar penuhi layar', bagianPng: 'Background gym' },
        { widget: 'LinearGradient', fungsi: 'Gelapkan foto supaya tulisan terbaca', bagianPng: 'Overlay gelap' },
        { widget: 'TextFormField + validator', fungsi: 'Input + pesan error per aturan', bagianPng: 'Kolom Email/Password' },
        { widget: 'SocialRow', fungsi: 'Tiga tombol gambar 50px', bagianPng: 'Ikon Gmail/FB/Apple' },
      ],
      kode: [
        {
          file: 'lib/features/auth/widgets/auth_widgets.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';

import '../../../core/theme/app_assets.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/screen_back_button.dart';

/// Full-screen auth backdrop: \`welcome_background.png\` with a dark gradient
/// overlay (\`gradient.xml\` equivalent) and centered content column.
/// Mirrors \`activity_login.xml:1-9\` / \`activity_register.xml:1-9\`.
class AuthScaffold extends StatelessWidget {
  const AuthScaffold({super.key, required this.children, this.showBack = false});

  final List<Widget> children;
  final bool showBack;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              AppAssets.welcomeBackground,
              fit: BoxFit.cover,
            ),
          ),
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.black.withValues(alpha: 0.55),
                    AppColors.black.withValues(alpha: 0.85),
                  ],
                ),
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: children,
                ),
              ),
            ),
          ),
          if (showBack)
            const Positioned(
              top: 0,
              left: 0,
              child: SafeArea(
                child: ScreenBackButton(),
              ),
            ),
        ],
      ),
    );
  }
}

/// White rounded input with black leading icon, replacing
/// \`register_bg_custom_input.xml\` (white fill, 8dp radius).
class AuthTextField extends StatefulWidget {
  const AuthTextField({
    super.key,
    required this.controller,
    required this.hint,
    required this.icon,
    this.validator,
    this.obscure = false,
    this.keyboardType,
  });

  final TextEditingController controller;
  final String hint;
  final IconData icon;
  final String? Function(String?)? validator;
  final bool obscure;
  final TextInputType? keyboardType;

  @override
  State<AuthTextField> createState() => _AuthTextFieldState();
}

class _AuthTextFieldState extends State<AuthTextField> {
  late bool _obscured = widget.obscure;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      validator: widget.validator,
      obscureText: _obscured,
      keyboardType: widget.keyboardType,
      style: const TextStyle(color: AppColors.textBlack, fontSize: 14),
      decoration: InputDecoration(
        hintText: widget.hint,
        hintStyle: const TextStyle(color: AppColors.greyMenu, fontSize: 14),
        filled: true,
        fillColor: AppColors.white,
        prefixIcon: Icon(widget.icon, color: AppColors.black),
        suffixIcon: widget.obscure
            ? IconButton(
                icon: Icon(
                  _obscured ? Icons.visibility_off : Icons.visibility,
                  color: AppColors.black,
                ),
                onPressed: () => setState(() => _obscured = !_obscured),
              )
            : null,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.yellowMenu, width: 2),
        ),
        errorStyle: const TextStyle(color: AppColors.yellow300),
      ),
    );
  }
}

/// "or" divider with side lines (\`activity_login.xml:106-146\`).
class OrDivider extends StatelessWidget {
  const OrDivider({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider(color: AppColors.white, thickness: 1)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Text(
            label,
            style: const TextStyle(color: AppColors.white, fontSize: 20),
          ),
        ),
        const Expanded(child: Divider(color: AppColors.white, thickness: 1)),
      ],
    );
  }
}

/// Social row: Facebook left, Google/Gmail center, Apple right
/// (\`activity_login.xml:159-185\`). Apple/Facebook are stubs.
class SocialRow extends StatelessWidget {
  const SocialRow({
    super.key,
    required this.onGoogle,
    required this.onFacebook,
    required this.onApple,
  });

  final VoidCallback onGoogle;
  final VoidCallback onFacebook;
  final VoidCallback onApple;

  @override
  Widget build(BuildContext context) {
    Widget button(String asset, VoidCallback onTap) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(25),
        child: Image.asset(asset, width: 50, height: 50),
      );
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        button(AppAssets.icFacebook, onFacebook),
        const SizedBox(width: 16),
        button(AppAssets.icGmail, onGoogle),
        const SizedBox(width: 16),
        button(AppAssets.icApple, onApple),
      ],
    );
  }
}`,
        },
      ],
    },
    {
      id: 'welcome',
      judul: 'lib/features/auth/welcome_screen.dart — layar sambutan',
      tujuan:
        'Headline Bebas 54 + kotak kuning MIND, tombol Get Started (kuning) + Log in (putih). Tiru Welcome Screen.png.',
      pngHasil: ['img/welcome-screen.png'],
      asetDipakai: ['img/welcome_background.png'],
      kerangka: 'Stack[Image, gradient, Column[Text, Row[Text, MIND], Spacer, Row[Button, Button], Text]]',
      bedah: [
        { widget: 'displayMedium.copyWith(54)', fungsi: 'Judul raksasa Bebas Neue', bagianPng: 'WITH GREAT BODY…' },
        { widget: 'Container(yellow, radius 4)', fungsi: 'Kotak kuning di belakang kata MIND', bagianPng: 'Kotak MIND' },
        { widget: 'Spacer', fungsi: 'Dorong tombol ke bawah layar', bagianPng: 'Jarak tengah' },
        { widget: 'context.push', fungsi: 'Pindah ke /register atau /login', bagianPng: 'Dua tombol' },
      ],
      kode: [
        {
          file: 'lib/features/auth/welcome_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';

/// \`/welcome\` from \`WelcomeActivity.kt\` + \`activity_welcome.xml\`,
/// visual spec \`Welcome Screen.png\`. Get Started → \`/register\`,
/// Log in → \`/login\`; signed-in users skip via the router guard
/// (\`WelcomeActivity.kt:14-23\`).
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final headline = Theme.of(context).textTheme.displayMedium?.copyWith(
          fontSize: 54,
          height: 1.0,
        );

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              AppAssets.welcomeBackground,
              fit: BoxFit.cover,
            ),
          ),
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.black.withValues(alpha: 0.35),
                    AppColors.black.withValues(alpha: 0.75),
                  ],
                ),
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(32, 44, 32, 44),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppStrings.welcomeLine1,
                    style: headline,
                  ),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(AppStrings.welcomeLine2, style: headline),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.yellowMenu,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          AppStrings.welcomeHighlight,
                          style: headline?.copyWith(
                            color: AppColors.black,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    AppStrings.welcomeDescription,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const Spacer(),
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 56,
                          child: ElevatedButton(
                            onPressed: () => context.push('/register'),
                            child: const Text(AppStrings.getStarted),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: SizedBox(
                          height: 56,
                          child: ElevatedButton(
                            onPressed: () => context.push('/login'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.white,
                            ),
                            child: const Text(AppStrings.logIn),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Center(
                    child: Text(
                      AppStrings.becomeTrainer,
                      style:
                          TextStyle(color: AppColors.white, fontSize: 14),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}`,
        },
      ],
    },
    {
      id: 'login',
      judul: 'lib/features/auth/login_screen.dart — masuk',
      tujuan:
        'Form email + password dengan validasi, loading saat proses, gagal → SnackBar, sukses → toast + pindah /home. Tombol sosial = toast stub.',
      pngHasil: ['img/sign-in.png'],
      asetDipakai: ['img/logo_gg.png'],
      kerangka: 'AuthScaffold > Column[logo, judul, Form[email, password], Row[remember, lupa], Button, OrDivider, SocialRow, link daftar]',
      bedah: [
        { widget: 'Form + GlobalKey', fungsi: 'Validasi semua kolom sekaligus saat tombol ditekan', bagianPng: 'Pesan error merah' },
        { widget: 'ConsumerStatefulWidget', fungsi: 'Baca database lewat Riverpod (ref.read)', bagianPng: '— (logika)' },
        { widget: 'context.go(/home)', fungsi: 'Pindah + buang halaman auth dari tumpukan', bagianPng: 'Masuk Home' },
      ],
      kode: [
        {
          file: 'lib/features/auth/login_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/validators.dart';
import '../../data/datasources/local_auth_ds.dart';
import 'widgets/auth_widgets.dart';

/// \`/login\` from \`LoginActivity.kt\` + \`activity_login.xml\`,
/// visual spec \`Sign In.png\`. Email + password validation, progress overlay,
/// local SQLite sign-in (failure → SnackBar), Google/Apple/Facebook and
/// forget-password stub toasts.
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _loading = false;
  bool _rememberMe = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  void _snack(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _stub(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Future<void> _signIn() async {
    FocusScope.of(context).unfocus();
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      await ref
          .read(authRepositoryProvider)
          .signInWithEmail(_email.text, _password.text);
      if (!mounted) return;
      _snack(AppStrings.loginSuccess);
      context.go('/home');
    } catch (e) {
      if (!mounted) return;
      _snack('\${AppStrings.loginFailedPrefix} $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _signInWithGoogle() async {
    // No cloud identity without Firebase — stub like Apple/Facebook.
    if (!mounted) return;
    _stub(AppStrings.googleStub);
  }

  @override
  Widget build(BuildContext context) {
    return AuthScaffold(
      showBack: true,
      children: [
        Image.asset(AppAssets.logoGg, width: 170, height: 50),
        const SizedBox(height: 32),
        Text(
          AppStrings.signIn,
          style: Theme.of(context)
              .textTheme
              .titleLarge
              ?.copyWith(fontSize: 24, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 4),
        const Text(
          AppStrings.loginSubtitle,
          style: TextStyle(color: AppColors.white, fontSize: 20),
        ),
        const SizedBox(height: 16),
        Form(
          key: _formKey,
          child: Column(
            children: [
              AuthTextField(
                controller: _email,
                hint: AppStrings.hintEmail,
                icon: Icons.email,
                keyboardType: TextInputType.emailAddress,
                validator: Validators.email,
              ),
              const SizedBox(height: 4),
              AuthTextField(
                controller: _password,
                hint: AppStrings.hintPassword,
                icon: Icons.lock,
                obscure: true,
                validator: Validators.password,
              ),
            ],
          ),
        ),
        Row(
          children: [
            Checkbox(
              value: _rememberMe,
              activeColor: AppColors.yellowMenu,
              onChanged: (value) =>
                  setState(() => _rememberMe = value ?? false),
            ),
            const Text(
              AppStrings.rememberMe,
              style: TextStyle(color: AppColors.white, fontSize: 14),
            ),
            const Spacer(),
            TextButton(
              onPressed: () => _stub(AppStrings.forgetPasswordStub),
              child: const Text(
                AppStrings.forgetPassword,
                style: TextStyle(color: AppColors.white, fontSize: 14),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 56,
          width: double.infinity,
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton(
                  onPressed: _signIn,
                  child: const Text(AppStrings.signIn),
                ),
        ),
        const SizedBox(height: 8),
        const OrDivider(label: AppStrings.orDivider),
        const SizedBox(height: 8),
        SocialRow(
          onGoogle: _signInWithGoogle,
          onFacebook: () => _stub(AppStrings.facebookStub),
          onApple: () => _stub(AppStrings.appleStub),
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              AppStrings.noAccount,
              style: TextStyle(color: AppColors.yellowMenu, fontSize: 16),
            ),
            TextButton(
              onPressed: () => context.push('/register'),
              child: const Text(
                AppStrings.signUp,
                style: TextStyle(
                  color: AppColors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}`,
        },
      ],
    },
    {
      id: 'register',
      judul: 'lib/features/auth/register_screen.dart — daftar',
      tujuan:
        'Sama seperti login + kolom Nama & Konfirmasi Password. Sukses → toast + pindah /login (belum otomatis masuk, sama seperti Android).',
      pngHasil: ['img/sign-up.png'],
      asetDipakai: ['img/logo_gg.png'],
      kode: [
        {
          file: 'lib/features/auth/register_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/validators.dart';
import '../../data/datasources/local_auth_ds.dart';
import 'widgets/auth_widgets.dart';

/// \`/register\` from \`RegisterActivity.kt\` + \`activity_register.xml\`,
/// visual spec \`Sign Up.png\`. Name/email/password/confirm validation,
/// create-user → success toast + \`/login\`, failure → SnackBar.
class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirm.dispose();
    super.dispose();
  }

  void _snack(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Future<void> _signUp() async {
    FocusScope.of(context).unfocus();
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      await ref
          .read(authRepositoryProvider)
          .registerWithEmail(_name.text, _email.text, _password.text);
      if (!mounted) return;
      _snack(AppStrings.registerSuccess);
      context.go('/login');
    } catch (e) {
      if (!mounted) return;
      _snack('\${AppStrings.registerFailedPrefix} $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _signInWithGoogle() async {
    // No cloud identity without Firebase — stub like Apple/Facebook.
    if (!mounted) return;
    _snack(AppStrings.googleStub);
  }

  @override
  Widget build(BuildContext context) {
    return AuthScaffold(
      showBack: true,
      children: [
        Image.asset(AppAssets.logoGg, width: 170, height: 50),
        const SizedBox(height: 32),
        Text(
          AppStrings.signUp,
          style: Theme.of(context)
              .textTheme
              .titleLarge
              ?.copyWith(fontSize: 24, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 4),
        const Text(
          AppStrings.registerSubtitle,
          style: TextStyle(color: AppColors.white, fontSize: 20),
        ),
        const SizedBox(height: 16),
        Form(
          key: _formKey,
          child: Column(
            children: [
              AuthTextField(
                controller: _name,
                hint: AppStrings.hintName,
                icon: Icons.person,
                validator: Validators.name,
              ),
              const SizedBox(height: 4),
              AuthTextField(
                controller: _email,
                hint: AppStrings.hintEmail,
                icon: Icons.email,
                keyboardType: TextInputType.emailAddress,
                validator: Validators.email,
              ),
              const SizedBox(height: 4),
              AuthTextField(
                controller: _password,
                hint: AppStrings.hintPassword,
                icon: Icons.lock,
                obscure: true,
                validator: Validators.password,
              ),
              const SizedBox(height: 8),
              AuthTextField(
                controller: _confirm,
                hint: AppStrings.hintConfirmPassword,
                icon: Icons.lock,
                obscure: true,
                validator: (value) =>
                    Validators.confirmPassword(_password.text, value),
              ),
            ],
          ),
        ),
        const Row(
          children: [
            Checkbox(value: false, onChanged: null),
            Expanded(
              child: Text(
                AppStrings.newsletterOptIn,
                style: TextStyle(color: AppColors.white, fontSize: 14),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 56,
          width: double.infinity,
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton(
                  onPressed: _signUp,
                  child: const Text(AppStrings.signUp),
                ),
        ),
        const SizedBox(height: 8),
        const OrDivider(label: AppStrings.orDivider),
        const SizedBox(height: 8),
        SocialRow(
          onGoogle: _signInWithGoogle,
          onFacebook: () => _snack(AppStrings.facebookStub),
          onApple: () => _snack(AppStrings.appleStub),
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              AppStrings.hasAccount,
              style: TextStyle(color: AppColors.yellowMenu, fontSize: 16),
            ),
            TextButton(
              onPressed: () => context.push('/login'),
              child: const Text(
                AppStrings.signIn,
                style: TextStyle(
                  color: AppColors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}`,
        },
      ],
    },
    {
      id: 'manifest',
      judul: 'Izin Android + titik cek Sesi 1',
      tujuan:
        'Tambahkan izin internet (wajib untuk API, font, dan peta). Izin kamera/lokasi diminta saat dipakai via permission_handler.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'android/app/src/main/AndroidManifest.xml (dalam <manifest>)',
          lang: 'xml',
          code: `<uses-permission android:name="android.permission.INTERNET" />

<!-- Camera Permission -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Location Permissions -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`,
        },
        {
          file: 'terminal — verifikasi',
          lang: 'powershell',
          code: 'flutter pub get\nflutter analyze\nflutter test\nflutter run --dart-define-from-file=.env.json',
        },
      ],
      checkpoint: [
        'flutter analyze → No issues found!',
        'Buka Welcome → Get Started → isi register → login → 5 tab placeholder',
        'Bandingkan dengan Welcome Screen.png, Sign In.png, Sign Up.png',
      ],
    },
  ],
};
