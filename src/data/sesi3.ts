import type { Sesi } from './types';

export const sesi3: Sesi = {
  id: 'sesi-3',
  nomor: 'SESI 3',
  judul: 'Fitur Lanjutan + Build',
  deskripsi:
    'Router final, Trainer + booking, Chat AI, Artikel, Discover, Maps, Rank, Settings, tes lengkap, lalu build APK dan Windows.',
  steps: [
    {
      id: 'router-final',
      judul: 'Router final — ganti seluruh app_router.dart',
      tujuan:
        'Semua rute + kirim objek lewat extra (pengganti belasan putExtra Android). Guard tetap: belum login → /welcome.',
      pngHasil: [],
      asetDipakai: [],
      kerangka: 'GoRouter > GoRoute × 17 + StatefulShellRoute(5 tab)',
      kode: [
        {
          file: 'lib/core/router/app_router.dart (final)',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../data/datasources/local_auth_ds.dart';
import '../../data/models/article.dart';
import '../../data/models/exercise.dart';
import '../../data/models/rank.dart';
import '../../data/models/trainer.dart';
import '../../features/article/article_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/auth/welcome_screen.dart';
import '../../features/chat/chat_screen.dart';
import '../../features/classify/equip_result_screen.dart';
import '../../features/classify/food_result_screen.dart';
import '../../features/discover/discover_tab.dart';
import '../../features/exercise/exercise_detail_screen.dart';
import '../../features/exercise/start_exercise_screen.dart';
import '../../features/home/home_tab.dart';
import '../../features/maps/maps_screen.dart';
import '../../features/muscle/muscle_args.dart';
import '../../features/muscle/muscle_detail_screen.dart';
import '../../features/muscle/muscle_map_screen.dart';
import '../../features/rank/rank_detail_screen.dart';
import '../../features/rank/rank_tab.dart';
import '../../features/scan/scan_tab.dart';
import '../../features/settings/edit_profile_screen.dart';
import '../../features/settings/settings_tab.dart';
import '../../features/shell/main_shell.dart';
import '../../features/subscribe/subscribe_screen.dart';
import '../../features/survey/survey_screen.dart';
import '../../features/trainer/book_trainer_screen.dart';
import '../../features/trainer/schedule_trainer_screen.dart';
import '../../features/trainer/trainer_detail_screen.dart';
import '../../features/trainer/trainer_list_screen.dart';

/// go_router map per \`docs/03-SCREEN_MAP.md\`. Android Intent extras
/// become typed \`extra\` objects (\`Exercise\`, \`Trainer\`, \`MuscleArgs\`;
/// trainer-chat header extras in \`ChatActivity.kt:53-65\`).
/// Auth guard parity (signed-in user → \`/home\`) now reads the local SQLite
/// session instead of Firebase Auth.
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
      GoRoute(
        path: '/exercise/detail',
        builder: (context, state) {
          final exercise = state.extra as Exercise;
          return ExerciseDetailScreen(exercise: exercise);
        },
      ),
      GoRoute(
        path: '/exercise/start',
        builder: (context, state) {
          final exercise = state.extra as Exercise;
          return StartExerciseScreen(exercise: exercise);
        },
      ),
      GoRoute(
        path: '/scan/equipment-result',
        builder: (context, state) {
          final imagePath = state.extra as String;
          return EquipResultScreen(imagePath: imagePath);
        },
      ),
      GoRoute(
        path: '/scan/food-result',
        builder: (context, state) {
          final imagePath = state.extra as String;
          return FoodResultScreen(imagePath: imagePath);
        },
      ),
      GoRoute(
        path: '/muscle-map',
        builder: (context, state) => const MuscleMapScreen(),
      ),
      GoRoute(
        path: '/muscle/detail',
        builder: (context, state) {
          final args = state.extra as MuscleArgs;
          return MuscleDetailScreen(args: args);
        },
      ),
      GoRoute(
        path: '/trainer',
        builder: (context, state) => const TrainerListScreen(),
      ),
      GoRoute(
        path: '/trainer/detail',
        builder: (context, state) {
          final trainer = state.extra as Trainer;
          return TrainerDetailScreen(trainer: trainer);
        },
      ),
      GoRoute(
        path: '/trainer/book',
        builder: (context, state) {
          final trainer = state.extra as Trainer;
          return BookTrainerScreen(trainer: trainer);
        },
      ),
      GoRoute(
        path: '/trainer/schedule',
        builder: (context, state) {
          final trainer = state.extra as Trainer;
          return ScheduleTrainerScreen(trainer: trainer);
        },
      ),
      GoRoute(
        path: '/trainer/chat',
        builder: (context, state) {
          final trainer = state.extra as Trainer;
          return ChatScreen(trainer: trainer);
        },
      ),
      GoRoute(
        path: '/chat-ai',
        builder: (context, state) => const ChatScreen(),
      ),
      GoRoute(
        path: '/article',
        builder: (context, state) =>
            ArticleScreen(article: state.extra as Article?),
      ),
      GoRoute(
        path: '/maps',
        builder: (context, state) => const MapsScreen(),
      ),
      GoRoute(
        path: '/rank/detail',
        builder: (context, state) {
          final rank = state.extra as Rank;
          return RankDetailScreen(rank: rank);
        },
      ),
      GoRoute(
        path: '/settings/edit-profile',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/survey',
        builder: (context, state) => const SurveyScreen(),
      ),
      GoRoute(
        path: '/subscribe',
        builder: (context, state) => const SubscribeScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            MainShell(navigationShell: navigationShell),
        branches: <StatefulShellBranch>[
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/home',
                builder: (context, state) => const HomeTab(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/discover',
                builder: (context, state) => const DiscoverTab(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/scan',
                builder: (context, state) => const ScanTab(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/rank',
                builder: (context, state) => const RankTab(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/settings',
                builder: (context, state) => const SettingsTab(),
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
      id: 'trainer-data',
      judul: 'Data dummy trainer + rank',
      tujuan:
        'Disalin kata-per-kata dari TrainerData.kt / RankData.kt (nama One Piece, exp acak 0–5000).',
      pngHasil: ['img/trainer-list.png', 'img/rank-menu.png'],
      asetDipakai: ['img/sample_trainer_photo.png', 'img/badge_gold.png', 'img/badge_platinum.png'],
      kode: [
        {
          file: 'lib/data/datasources/trainer_data.dart (10 trainer + 2 artikel)',
          lang: 'dart',
          code: `import '../../core/theme/app_assets.dart';
import '../models/article.dart';
import '../models/trainer.dart';

/// Dummy data verbatim from \`data/TrainerData.kt\` (\`TrainerDataSource\`).
/// Article \`pictureUrl\` drawable ids resolve to placeholder asset paths.
abstract final class TrainerData {
  static const List<Trainer> trainers = <Trainer>[
    Trainer(
      name: 'Monkey D. Luffy',
      location: 'SHP01',
      picture: 'https://reqres.in/img/faces/1-image.jpg',
      rating: 4.3,
      description:
          'Embark on a fitness adventure with Monkey D. Luffy, your guide to achieving peak fitness. Discover the boundless world of exercise as Luffy takes you on a journey of self-discovery and strength building. Unleash your inner pirate spirit, overcome fitness challenges, and sculpt a physique worthy of the Pirate King himself.',
    ),
    Trainer(
      name: 'Roronoa Zoro',
      location: 'SHP02',
      picture: 'https://reqres.in/img/faces/2-image.jpg',
      rating: 4.5,
      description:
          'Unleash your inner swordsman with Roronoa Zoro. With his expert guidance, you\'ll learn the art of three-sword style and become a master of the blade.',
    ),
    Trainer(
      name: 'Nami',
      location: 'SHP03',
      picture: 'https://reqres.in/img/faces/3-image.jpg',
      rating: 5.0,
      description:
          'Navigate the seas of fitness with Nami, your expert navigator. She\'ll help you chart a course to optimal health and wellness.',
    ),
    Trainer(
      name: 'Sanji',
      location: 'SHP05',
      picture: 'https://reqres.in/img/faces/4-image.jpg',
      rating: 2.0,
      description:
          'Join Sanji in the kitchen of fitness. He\'ll teach you the importance of a balanced diet and the culinary secrets to a healthier lifestyle.',
    ),
    Trainer(
      name: 'Tony Tony Chopper',
      location: 'SHP06',
      picture: 'https://reqres.in/img/faces/5-image.jpg',
      rating: 3.0,
      description:
          'Embrace the spirit of adventure with Tony Tony Chopper. His unique approach to fitness combines strength training with a touch of reindeer magic.',
    ),
    Trainer(
      name: 'Nico Robin',
      location: 'SHP07',
      picture: 'https://reqres.in/img/faces/6-image.jpg',
      rating: 4.0,
      description:
          'Unlock the mysteries of fitness with Nico Robin. Her expertise will guide you through a diverse range of exercises for a well-rounded routine.',
    ),
    Trainer(
      name: 'Usopp',
      location: 'SHP04',
      picture: 'https://reqres.in/img/faces/7-image.jpg',
      rating: 5.0,
      description:
          'Embark on a fitness journey with Usopp, the master marksman. His workouts are as accurate and effective as his shots.',
    ),
    Trainer(
      name: 'Franky',
      location: 'SHP08',
      picture: 'https://reqres.in/img/faces/8-image.jpg',
      rating: 3.7,
      description:
          'Get ready to unleash the power of the cola-fueled workouts with Franky. Become a fitness cyborg and transform your body with his unique approach.',
    ),
    Trainer(
      name: 'Brook',
      location: 'SHP09',
      picture: 'https://reqres.in/img/faces/9-image.jpg',
      rating: 3.8,
      description:
          'Dance your way to fitness with the soulful guidance of Brook. His rhythm-infused workouts will have you moving and grooving to a healthier you.',
    ),
    Trainer(
      name: 'Jimbei',
      location: 'SHP010',
      picture: 'https://reqres.in/img/faces/10-image.jpg',
      rating: 3.9,
      description:
          'Dive into fitness with Jimbei, the fish-man karate master. His workouts will help you flow through exercises with the grace of the ocean currents.',
    ),
  ];

  static const List<Article> articles = <Article>[
    Article(
      name: 'Exercise and the Brain',
      description: 'Lorem ipsum dolor sit amet, ... (lengkap di repo)',
      pictureAsset: AppAssets.sampleDumbbell,
    ),
    Article(
      name: '5 Benefits of HIIT',
      description: 'Lorem ipsum dolor sit amet, ... (lengkap di repo)',
      pictureAsset: AppAssets.sampleExercisePic,
    ),
  ];
}`,
        },
        {
          file: 'lib/data/datasources/rank_data.dart',
          lang: 'dart',
          code: `import 'dart:math';

import '../models/rank.dart';

/// Dummy leaderboard verbatim from \`data/RankData.kt\` (\`RankDataSource\`):
/// same 10 names/pictures, exp random 0..5000.
abstract final class RankData {
  static final Random _random = Random();

  static List<Rank> get ranks => <Rank>[
        _rank('Monkey D. Luffy', 'SHP01',
            'https://reqres.in/img/faces/1-image.jpg'),
        _rank('Roronoa Zoro', 'SHP02',
            'https://reqres.in/img/faces/2-image.jpg'),
        _rank('Nami', 'SHP03', 'https://reqres.in/img/faces/3-image.jpg'),
        _rank('Sanji', 'SHP05', 'https://reqres.in/img/faces/4-image.jpg'),
        _rank('Tony Tony Chopper', 'SHP06',
            'https://reqres.in/img/faces/5-image.jpg'),
        _rank('Nico Robin', 'SHP07',
            'https://reqres.in/img/faces/6-image.jpg'),
        _rank('Usopp', 'SHP04', 'https://reqres.in/img/faces/7-image.jpg'),
        _rank('Franky', 'SHP08', 'https://reqres.in/img/faces/8-image.jpg'),
        _rank('Brook', 'SHP09', 'https://reqres.in/img/faces/9-image.jpg'),
        _rank('Jimbei', 'SHP010',
            'https://reqres.in/img/faces/10-image.jpg'),
      ];

  static Rank _rank(String name, String nim, String picture) => Rank(
        name: name,
        nim: nim,
        picture: picture,
        exp: _random.nextInt(5001),
      );
}`,
        },
      ],
    },
    {
      id: 'trainer-flow',
      judul: 'Alur trainer — list, detail, book, schedule',
      tujuan:
        'List 5 tab kategori → detail (header + Book/chat/call + statistik + artikel) → book (jadwal) → schedule (Confirm → overlay sukses → /home).',
      pngHasil: [
        'img/trainer-list.png',
        'img/consult-trainer-menu.png',
        'img/book-an-appointment-menu.png',
        'img/schedule-appointment-menu.png',
        'img/book-appointment-success.png',
      ],
      asetDipakai: [
        'img/sample_trainer_photo.png',
        'img/reference_appointment_for.png',
        'img/reference_appointment_date.png',
        'img/reference_appointment_time.png',
        'img/reference_success_book.png',
      ],
      kerangka: 'TrainerHeader(foto 100 + nama + lokasi) dipakai ulang di detail/book/schedule',
      bedah: [
        { widget: 'DefaultTabController + TabBarView', fungsi: '5 kategori, tiap halaman list yang sama (seperti TrainerView.kt)', bagianPng: 'Tab General/Cardio/…' },
        { widget: 'FAB chat', fungsi: 'Lompat ke /chat-ai', bagianPng: 'Tombol chat' },
        { widget: 'Success overlay (Stack + if)', fungsi: 'Confirm → tampil sukses → tap → /home', bagianPng: 'Book Appointment Success' },
      ],
      kode: [
        {
          file: 'lib/features/trainer/widgets/trainer_widgets.dart',
          lang: 'dart',
          code: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../data/models/trainer.dart';

/// Trainer header shared by detail/book/schedule
/// (\`activity_detail_trainer.xml:23-79\`, same block in book/schedule):
/// 100px rounded image, name, static specialist line, location row.
class TrainerHeader extends StatelessWidget {
  const TrainerHeader({super.key, required this.trainer, this.specialist});

  final Trainer trainer;
  final String? specialist;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: CachedNetworkImage(
            imageUrl: trainer.picture,
            width: 100,
            height: 100,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(
              width: 100,
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
            errorWidget: (context, url, error) => Container(
              width: 100,
              height: 100,
              color: AppColors.semiBlack,
              child: const Icon(
                Icons.person,
                color: AppColors.greyMenu,
                size: 48,
              ),
            ),
          ),
        ),
        const SizedBox(width: 32),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                trainer.name,
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                specialist ?? '',
                style: const TextStyle(
                  color: AppColors.greyText,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    color: AppColors.greyText,
                    size: 16,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      trainer.location,
                      style: const TextStyle(
                        color: AppColors.greyText,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// \`item_trainer.xml\` as bound by \`TrainerAdapter.kt:53-67\`: 75px circular
/// image, name, \`📍 <location>\` (\`trainer_desc_format\`), \`⭐\\n<rating>\`
/// (\`trainer_rating_format\`).
class TrainerTile extends StatelessWidget {
  const TrainerTile({
    super.key,
    required this.trainer,
    required this.locationLabel,
    required this.ratingLabel,
    required this.onTap,
  });

  final Trainer trainer;
  final String locationLabel;
  final String ratingLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        color: AppColors.black,
        child: Row(
          children: [
            ClipOval(
              child: CachedNetworkImage(
                imageUrl: trainer.picture,
                width: 75,
                height: 75,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  width: 75,
                  height: 75,
                  color: AppColors.semiBlack,
                  child: const Center(
                    child: SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Container(
                  width: 75,
                  height: 75,
                  color: AppColors.semiBlack,
                  child: const Icon(
                    Icons.person,
                    color: AppColors.greyMenu,
                    size: 36,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    trainer.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    locationLabel,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              ratingLabel,
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 16,
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
          file: 'lib/features/trainer/trainer_list_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../data/datasources/trainer_data.dart';
import '../../shared/widgets/screen_back_button.dart';
import 'widgets/trainer_widgets.dart';

/// \`/trainer\` from \`TrainerActivity.kt\` + \`activity_trainer.xml\`,
/// visual spec \`Trainer List.png\`: \`Top Rated Personal Trainers\` title,
/// 5 category tabs (every page shows the same dummy list like
/// \`TrainerView.kt:35\`), yellow chat-AI FAB → \`/chat-ai\`, tap →
/// \`/trainer/detail\` with the \`Trainer\` object.
class TrainerListScreen extends StatelessWidget {
  const TrainerListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: AppStrings.trainerCategories.length,
      child: Scaffold(
        backgroundColor: AppColors.black,
        body: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 24, 24, 0),
                child: Row(
                  children: [
                    const ScreenBackButton(),
                    const Expanded(
                      child: Text(
                        AppStrings.topTrainers,
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              TabBar(
                isScrollable: true,
                indicatorColor: AppColors.yellowMenu,
                labelColor: AppColors.yellowMenu,
                unselectedLabelColor: AppColors.white,
                tabs: AppStrings.trainerCategories
                    .map((category) => Tab(text: category))
                    .toList(),
              ),
              Expanded(
                child: TabBarView(
                  children: AppStrings.trainerCategories
                      .map((_) => const _TrainerList())
                      .toList(),
                ),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () => context.push('/chat-ai'),
          child: const Icon(Icons.chat),
        ),
      ),
    );
  }
}

class _TrainerList extends StatelessWidget {
  const _TrainerList();

  @override
  Widget build(BuildContext context) {
    final trainers = TrainerData.trainers;
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      itemCount: trainers.length,
      itemBuilder: (context, index) {
        final trainer = trainers[index];
        return TrainerTile(
          trainer: trainer,
          locationLabel: AppStrings.trainerLocation(trainer.location),
          ratingLabel:
              AppStrings.trainerRating(trainer.rating.toString()),
          onTap: () => context.push('/trainer/detail', extra: trainer),
        );
      },
    );
  }
}`,
        },
        {
          file: 'lib/features/trainer/trainer_detail_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../data/datasources/trainer_data.dart';
import '../../data/models/trainer.dart';
import '../../shared/widgets/screen_back_button.dart';
import 'widgets/trainer_widgets.dart';

/// \`/trainer/detail\` from \`DetailTrainerActivity.kt\` +
/// \`activity_detail_trainer.xml\`, visual spec \`Consult Trainer Menu.png\`:
/// header, description, Book An Appointment (+ chat → \`/trainer/chat\`,
/// call icon visual-only), Comments/Likes/Suggested stats, ARTICLES +
/// VIEW ALL, article list → \`/article\` (Phase 5, \`TODO\` parity).
class TrainerDetailScreen extends StatelessWidget {
  const TrainerDetailScreen({super.key, required this.trainer});

  final Trainer trainer;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 32, 16, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const ScreenBackButton(),
              TrainerHeader(
                trainer: trainer,
                specialist: AppStrings.trainerSpecialist,
              ),
              const SizedBox(height: 32),
              Text(
                trainer.description,
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    flex: 10,
                    child: SizedBox(
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () => context.push(
                          '/trainer/book',
                          extra: trainer,
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.white,
                        ),
                        child: const Text(
                          AppStrings.bookAppointment,
                          style: TextStyle(fontSize: 12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: IconButton(
                      padding: const EdgeInsets.all(8),
                      icon: const Icon(
                        Icons.chat,
                        color: AppColors.yellowMenu,
                      ),
                      onPressed: () => context.push(
                        '/trainer/chat',
                        extra: trainer,
                      ),
                    ),
                  ),
                  const Expanded(
                    child: Padding(
                      padding: EdgeInsets.all(8),
                      child: Icon(
                        Icons.call,
                        color: AppColors.greyMenu,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _StatColumn(
                    value: AppStrings.likesCount,
                    label: AppStrings.likes,
                    highlight: false,
                  ),
                  _StatColumn(
                    value: AppStrings.commentsCount,
                    label: AppStrings.comments,
                    highlight: true,
                  ),
                  _StatColumn(
                    value: AppStrings.suggestedCount,
                    label: AppStrings.suggested,
                    highlight: false,
                  ),
                ],
              ),
              const SizedBox(height: 32),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    AppStrings.articles,
                    style: TextStyle(
                      color: AppColors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    AppStrings.viewAll,
                    style: TextStyle(
                      color: AppColors.yellowMenu,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              ...TrainerData.articles.map(
                (article) => _ArticleTile(
                  name: article.name,
                  description: article.description,
                  asset: article.pictureAsset,
                  onTap: () => context.push('/article'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatColumn extends StatelessWidget {
  const _StatColumn({
    required this.value,
    required this.label,
    required this.highlight,
  });

  final String value;
  final String label;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.white,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.greyText,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

/// \`item_article.xml\`: 75px rounded image, 1-line name, 2-line grey desc.
class _ArticleTile extends StatelessWidget {
  const _ArticleTile({
    required this.name,
    required this.description,
    required this.asset,
    required this.onTap,
  });

  final String name;
  final String description;
  final String asset;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.symmetric(vertical: 10),
        color: AppColors.black,
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(
                asset,
                width: 75,
                height: 75,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 75,
                  height: 75,
                  color: AppColors.semiBlack,
                  child: const Icon(
                    Icons.article,
                    color: AppColors.greyMenu,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.greyText,
                      fontSize: 14,
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
          file: 'lib/features/trainer/book_trainer_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/trainer.dart';
import '../../shared/widgets/screen_back_button.dart';
import 'widgets/trainer_widgets.dart';

/// \`/trainer/book\` from \`BookTrainerActivity.kt\` +
/// \`activity_book_trainer.xml\`, visual spec
/// \`Book An Appointment Menu.png\`: trainer header, appointment-for
/// reference art, Schedule → \`/trainer/schedule\` with the \`Trainer\` object.
class BookTrainerScreen extends StatelessWidget {
  const BookTrainerScreen({super.key, required this.trainer});

  final Trainer trainer;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 32, 16, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: ScreenBackButton(),
              ),
              TrainerHeader(
                trainer: trainer,
                specialist: AppStrings.trainerSpecialist,
              ),
              const SizedBox(height: 32),
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  AppAssets.referenceAppointmentFor,
                  fit: BoxFit.contain,
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: () => context.push(
                    '/trainer/schedule',
                    extra: trainer,
                  ),
                  child: const Text(AppStrings.schedule),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`,
        },
        {
          file: 'lib/features/trainer/schedule_trainer_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/trainer.dart';
import '../../shared/widgets/screen_back_button.dart';
import 'widgets/trainer_widgets.dart';

/// \`/trainer/schedule\` from \`ScheduleTrainerActivity.kt\` +
/// \`activity_schedule_trainer.xml\`, visual spec
/// \`Schedule Appointment Menu.png\` + \`Book Appointment Success.png\`:
/// trainer header, date/time reference art, Confirm → success overlay,
/// tap overlay → \`/home\` (\`MainActivity\` parity, \`:37-41\`).
class ScheduleTrainerScreen extends StatefulWidget {
  const ScheduleTrainerScreen({super.key, required this.trainer});

  final Trainer trainer;

  @override
  State<ScheduleTrainerScreen> createState() => _ScheduleTrainerScreenState();
}

class _ScheduleTrainerScreenState extends State<ScheduleTrainerScreen> {
  bool _confirmed = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: Stack(
        children: [
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 32, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TrainerHeader(
                    trainer: widget.trainer,
                    specialist: AppStrings.trainerSpecialist,
                  ),
                  const SizedBox(height: 32),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      AppAssets.referenceAppointmentDate,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      AppAssets.referenceAppointmentTime,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () =>
                          setState(() => _confirmed = true),
                      child: const Text(AppStrings.confirm),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const Positioned(
            top: 0,
            left: 0,
            child: SafeArea(
              child: ScreenBackButton(),
            ),
          ),
          if (_confirmed)
            Positioned.fill(
              child: GestureDetector(
                onTap: () => context.go('/home'),
                child: Container(
                  color: AppColors.black.withValues(alpha: 0.9),
                  padding: const EdgeInsets.all(32),
                  child: Image.asset(
                    AppAssets.referenceSuccessBook,
                    fit: BoxFit.contain,
                  ),
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
      id: 'chat',
      judul: 'Chat AI — store + Fit AI + layar',
      tujuan:
        'Satu layar untuk /trainer/chat (header trainer) dan /chat-ai (robot). Riwayat tersimpan, pesan saya kuning kanan, bot abu kiri.',
      pngHasil: ['img/chat-ai-menu.png', 'img/chat-menu.png'],
      asetDipakai: ['img/robot_fitness.jpg'],
      kerangka: 'Column[header(back, avatar, nama), ListView(bubbles), input bar]',
      bedah: [
        { widget: 'ChatMessages (Notifier)', fungsi: 'Kirim → simpan → tanya Gemini → simpan jawaban', bagianPng: '— (logika)' },
        { widget: 'ChatStore', fungsi: 'JSON riwayat di SharedPreferences, hapus saat pertama dibuka', bagianPng: 'Riwayat abadi' },
        { widget: '_Bubble (isMe)', fungsi: 'Kanan kuning vs kiri abu', bagianPng: 'Tiap pesan' },
      ],
      kode: [
        {
          file: 'lib/data/datasources/chat_store.dart',
          lang: 'dart',
          code: `import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../../core/constants/api_constants.dart';
import '../models/chat_message.dart';

/// SharedPreferences JSON persistence mirroring
/// \`ChatActivity.kt:184-216\` (\`CHAT_PREFS\` / \`chat_messages\`,
/// cleared on first launch).
class ChatStore {
  const ChatStore();

  Future<List<ChatMessage>> loadMessages() async {
    final prefs = await SharedPreferences.getInstance();
    final json = prefs.getString(ApiConstants.chatMessagesKey);
    if (json == null) return <ChatMessage>[];
    final raw = jsonDecode(json) as List<dynamic>;
    return raw
        .map((e) => ChatMessage.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> saveMessages(List<ChatMessage> messages) async {
    final prefs = await SharedPreferences.getInstance();
    final json = jsonEncode(messages.map((e) => e.toJson()).toList());
    await prefs.setString(ApiConstants.chatMessagesKey, json);
  }

  Future<void> clearMessages() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(ApiConstants.chatMessagesKey);
  }

  Future<bool> isFirstLaunch() async {
    final prefs = await SharedPreferences.getInstance();
    return !(prefs.getBool(ApiConstants.appLaunchedKey) ?? false);
  }

  Future<void> setAppLaunched() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(ApiConstants.appLaunchedKey, true);
  }
}`,
        },
        {
          file: 'lib/data/datasources/fit_ai.dart',
          lang: 'dart',
          code: `import 'package:google_generative_ai/google_generative_ai.dart';

import '../../core/constants/ai_prompts.dart';
import '../../core/constants/api_constants.dart';

/// Fit-AI backend mirroring \`ChatActivity.kt:134-178\`: \`gemini-1.5-flash\`
/// with the verbatim system prompt + user question as multi-part content.
/// Null response text adds no message (\`:169\`); failures surface
/// \`Failed to load response due to …\` (\`:174\`).
class FitAiClient {
  const FitAiClient();

  Future<String?> ask(String question) async {
    final model = GenerativeModel(
      model: ApiConstants.geminiModel,
      apiKey: ApiConstants.geminiApiKey,
    );
    final response = await model.generateContent([
      Content.multi([
        TextPart(AiPrompts.fitAiSystem),
        TextPart(question),
      ]),
    ]);
    return response.text?.trim();
  }
}`,
        },
        {
          file: 'lib/features/chat/chat_controller.dart',
          lang: 'dart',
          code: `import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/datasources/chat_store.dart';
import '../../data/datasources/fit_ai.dart';
import '../../data/models/chat_message.dart';
import '../../core/constants/app_strings.dart';

/// Chat state mirroring \`ChatActivity.kt:43-50,126-133,180-216\`: first
/// launch clears history, messages load from SharedPreferences JSON, every
/// send + reply persists. One shared store for trainer chat and Fit AI
/// (single \`CHAT_PREFS\`, like Android).
class ChatMessages extends Notifier<List<ChatMessage>> {
  final ChatStore _store = const ChatStore();
  final FitAiClient _ai = const FitAiClient();

  @override
  List<ChatMessage> build() {
    _restore();
    return const <ChatMessage>[];
  }

  Future<void> _restore() async {
    if (await _store.isFirstLaunch()) {
      await _store.clearMessages();
      await _store.setAppLaunched();
    }
    state = await _store.loadMessages();
  }

  Future<void> send(String rawText) async {
    final question = rawText.trim();
    if (question.isEmpty) return;
    state = [
      ...state,
      ChatMessage(message: question, sentBy: ChatMessage.sentByMe),
    ];
    await _store.saveMessages(state);
    try {
      final answer = await _ai.ask(question);
      if (answer == null || answer.isEmpty) return;
      state = [
        ...state,
        ChatMessage(message: answer, sentBy: ChatMessage.sentByBot),
      ];
    } catch (e) {
      state = [
        ...state,
        ChatMessage(
          message: '\${AppStrings.chatFailedPrefix} $e',
          sentBy: ChatMessage.sentByBot,
        ),
      ];
    }
    await _store.saveMessages(state);
  }
}

final chatProvider =
    NotifierProvider<ChatMessages, List<ChatMessage>>(ChatMessages.new);`,
        },
        {
          file: 'lib/features/chat/chat_screen.dart',
          lang: 'dart',
          code: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/chat_message.dart';
import '../../data/models/trainer.dart';
import 'chat_controller.dart';

/// Shared by \`/trainer/chat\` (header extras name/picture, \`ChatActivity.kt:53-65\`)
/// and \`/chat-ai\` (defaults \`GymChat Guru (Bot)\` + robot avatar).
/// Bubbles mirror \`item_chat.xml\` via \`MessageAdapter.kt:55-64\`:
/// me → right yellow, bot → left grey. Input mirrors
/// \`activity_chat.xml:99-118\` (attach → stub, send → ask + persist).
class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key, this.trainer});

  final Trainer? trainer;

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _controller = TextEditingController();
  final _scroll = ScrollController();

  @override
  void dispose() {
    _controller.dispose();
    _scroll.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (!_scroll.hasClients) return;
    _scroll.animateTo(
      _scroll.position.maxScrollExtent,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  void _send() {
    final text = _controller.text;
    if (text.trim().isEmpty) return;
    _controller.clear();
    FocusScope.of(context).unfocus();
    ref.read(chatProvider.notifier).send(text);
  }

  @override
  Widget build(BuildContext context) {
    final messages = ref.watch(chatProvider);
    ref.listen(chatProvider, (_, _) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    });

    final trainer = widget.trainer;
    final title = trainer?.name ?? AppStrings.fitAiName;

    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 32, 16, 0),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(
                      Icons.arrow_back,
                      color: AppColors.white,
                      size: 32,
                    ),
                    onPressed: () => context.pop(),
                  ),
                  const SizedBox(width: 8),
                  _Avatar(trainer: trainer),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          AppStrings.chatStatus,
                          style: TextStyle(
                            color: AppColors.greyText,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.more_horiz,
                    color: AppColors.white,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                controller: _scroll,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: messages.length,
                itemBuilder: (context, index) =>
                    _Bubble(message: messages[index]),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
              child: Container(
                height: 56,
                padding: const EdgeInsets.symmetric(horizontal: 8),
                decoration: BoxDecoration(
                  color: AppColors.semiBlack,
                  borderRadius: BorderRadius.circular(28),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(
                        Icons.attach_file,
                        color: AppColors.white,
                      ),
                      onPressed: () =>
                          ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(AppStrings.attachStub),
                        ),
                      ),
                    ),
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        onSubmitted: (_) => _send(),
                        style: const TextStyle(
                          color: AppColors.white,
                          fontSize: 14,
                        ),
                        decoration: const InputDecoration(
                          hintText: AppStrings.sendMessageHint,
                          hintStyle: TextStyle(
                            color: AppColors.white,
                            fontSize: 14,
                          ),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          filled: false,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.send,
                        color: AppColors.yellowMenu,
                      ),
                      onPressed: _send,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Avatar extends StatelessWidget {
  const _Avatar({this.trainer});

  final Trainer? trainer;

  @override
  Widget build(BuildContext context) {
    final url = trainer?.picture;
    if (url == null || url.isEmpty) {
      return ClipOval(
        child: Image.asset(
          AppAssets.robotFitness,
          width: 75,
          height: 75,
          fit: BoxFit.cover,
        ),
      );
    }
    return ClipOval(
      child: CachedNetworkImage(
        imageUrl: url,
        width: 75,
        height: 75,
        fit: BoxFit.cover,
        placeholder: (context, url) => Container(
          width: 75,
          height: 75,
          color: AppColors.semiBlack,
        ),
        errorWidget: (context, url, error) => Image.asset(
          AppAssets.robotFitness,
          width: 75,
          height: 75,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.message});

  final ChatMessage message;

  @override
  Widget build(BuildContext context) {
    final isMe = message.sentBy == ChatMessage.sentByMe;
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Row(
        mainAxisAlignment:
            isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          Flexible(
            child: Container(
              margin: EdgeInsets.only(right: isMe ? 0 : 80),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isMe ? AppColors.yellowMenu : AppColors.greyText,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                message.message,
                style: const TextStyle(
                  color: AppColors.black,
                  fontSize: 14,
                ),
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
      id: 'article-discover',
      judul: 'Artikel + Discover',
      tujuan:
        'Artikel: hero + bottom sheet geser (author, galeri, lorem). Discover: banner statis sesuai XML.',
      pngHasil: ['img/article-menu.png', 'img/discover-menu.png'],
      asetDipakai: ['img/sample_dumbbell.jpg', 'img/sample_exercise_photo.png', 'img/article_category.png'],
      kerangka: 'Artikel: Stack[scroll(hero), DraggableScrollableSheet] | Discover: scroll banner',
      kode: [
        {
          file: 'lib/features/article/article_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/datasources/trainer_data.dart';
import '../../data/models/article.dart';

/// \`/article\` from \`ArticleActivity.kt\` + \`activity_article.xml\`,
/// visual spec \`Article Menu.png\`: hero image + gradient + back, category
/// badge, title, subtitle; bottom sheet (hidden → 350 peek parity via
/// \`DraggableScrollableSheet\`) with author row, section, lorem, gallery,
/// ipsum. Takes the tapped \`Article\` or defaults to the first dummy.
class ArticleScreen extends StatelessWidget {
  const ArticleScreen({super.key, this.article});

  final Article? article;

  @override
  Widget build(BuildContext context) {
    final data = article ?? TrainerData.articles.first;
    return Scaffold(
      backgroundColor: AppColors.black,
      body: Stack(
        children: [
          SingleChildScrollView(
            child: Column(
              children: [
                Stack(
                  children: [
                    Image.asset(
                      data.pictureAsset,
                      width: double.infinity,
                      height: 420,
                      fit: BoxFit.cover,
                    ),
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              AppColors.black.withValues(alpha: 0.2),
                              AppColors.black.withValues(alpha: 0.85),
                            ],
                            stops: const [0.0, 1.0],
                          ),
                        ),
                      ),
                    ),
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
                        child: Column(
                          children: [
                            Align(
                              alignment: Alignment.centerLeft,
                              child: IconButton(
                                icon: const Icon(
                                  Icons.arrow_back,
                                  color: AppColors.white,
                                  size: 32,
                                ),
                                onPressed: () => context.pop(),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Image.asset(
                              AppAssets.articleCategory,
                              height: 90,
                              fit: BoxFit.contain,
                            ),
                            const SizedBox(height: 12),
                            const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 30),
                              child: Text(
                                AppStrings.articleTitle,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: AppColors.white,
                                  fontSize: 25,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                            const SizedBox(height: 10),
                            const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 30),
                              child: Text(
                                AppStrings.articleSubtitle,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: AppColors.white,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  height: 1.5,
                                ),
                              ),
                            ),
                            const SizedBox(height: 320),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          DraggableScrollableSheet(
            initialChildSize: 0.55,
            minChildSize: 0.4,
            maxChildSize: 0.92,
            builder: (context, scrollController) => Container(
              decoration: const BoxDecoration(
                color: AppColors.bgWindow,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: SingleChildScrollView(
                controller: scrollController,
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 48,
                        height: 4,
                        decoration: BoxDecoration(
                          color: AppColors.greyMenu,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        ClipOval(
                          child: Image.asset(
                            AppAssets.sampleTrainerPhoto,
                            width: 38,
                            height: 38,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          AppStrings.articleAuthor,
                          style: TextStyle(
                            color: AppColors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const Spacer(),
                        Image.asset(AppAssets.articleTime, height: 20),
                        const SizedBox(width: 5),
                        Image.asset(AppAssets.articleViews, height: 20),
                      ],
                    ),
                    const SizedBox(height: 28),
                    const Text(
                      AppStrings.articleSection,
                      style: TextStyle(
                        color: AppColors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '\${data.name}\\n\\n\${data.description}',
                      style: const TextStyle(
                        color: AppColors.greyText,
                        fontSize: 15,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 250,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        children: [
                          _GalleryImage(AppAssets.sampleExercisePic),
                          _GalleryImage(AppAssets.sampleDumbbell),
                          _GalleryImage(AppAssets.sampleExercisePic),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      AppStrings.ipsum,
                      style: TextStyle(
                        color: AppColors.greyText,
                        fontSize: 15,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _GalleryImage extends StatelessWidget {
  const _GalleryImage(this.asset);

  final String asset;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 250,
      height: 250,
      margin: const EdgeInsets.only(right: 10),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.asset(asset, fit: BoxFit.cover),
      ),
    );
  }
}`,
        },
        {
          file: 'lib/features/discover/discover_tab.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';

/// \`DiscoverTab\` (\`/discover\`) from \`DiscoverFragment.kt\` (no logic) +
/// \`fragment_discover.xml\`: static tracking banners built with widgets +
/// placeholder bitmaps (card content, never full-screen UI).
class DiscoverTab extends StatelessWidget {
  const DiscoverTab({super.key});

  @override
  Widget build(BuildContext context) {
    const sections = <_DiscoverSection>[
      _DiscoverSection(
        title: AppStrings.workoutTracking,
        asset: AppAssets.sampleCalorieBurned,
      ),
      _DiscoverSection(
        title: AppStrings.calorieTracking,
        asset: AppAssets.sampleCalorieIn,
      ),
      _DiscoverSection(
        title: null,
        asset: AppAssets.sampleCalorieInItem,
      ),
      _DiscoverSection(
        title: AppStrings.waterIntake,
        asset: AppAssets.sampleWater,
      ),
      _DiscoverSection(
        title: AppStrings.sleepTracker,
        asset: AppAssets.sampleSleepTracker,
      ),
    ];
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (var i = 0; i < sections.length; i++) ...[
                if (sections[i].title != null) ...[
                  Text(
                    sections[i].title!,
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                ] else
                  const SizedBox(height: 16),
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    sections[i].asset,
                    width: double.infinity,
                    fit: BoxFit.contain,
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _DiscoverSection {
  const _DiscoverSection({required this.title, required this.asset});

  final String? title;
  final String asset;
}`,
        },
      ],
    },
    {
      id: 'maps',
      judul: 'Maps — peta gratis tanpa API key',
      tujuan:
        'flutter_map + ubin OpenStreetMap: izin lokasi, marker user + 10 marker trainer acak, tap marker → kartu info → detail trainer.',
      pngHasil: ['img/nearby-location-menu.png', 'img/nearby-facility.png'],
      asetDipakai: ['img/user_node.png', 'img/trainer_node1.png', 'img/trainer_node2.png', 'img/trainer_node3.png', 'img/window_like.png', 'img/window_icons.png', 'img/sample_trainer_photo.png'],
      kerangka: 'Stack[FlutterMap, search bar, kartu info?]',
      bedah: [
        { widget: 'TileLayer (OSM)', fungsi: 'Ubin peta gratis, tanpa kunci', bagianPng: 'Latar peta' },
        { widget: 'MarkerLayer', fungsi: 'Ikon user + 10 trainer ±0.01 derajat', bagianPng: 'Pin peta' },
        { widget: 'RichAttributionWidget', fungsi: 'Atribusi OSM wajib', bagianPng: 'Teks kecil bawah' },
        { widget: '_InfoCard', fungsi: 'Kartu nama + foto + ikon, tap → detail', bagianPng: 'Kartu trainer' },
      ],
      kode: [
        {
          file: 'lib/features/maps/maps_screen.dart',
          lang: 'dart',
          code: `import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/trainer.dart';
import '../../shared/widgets/screen_back_button.dart';

/// \`/maps\` from \`MapsFragment.kt\` + \`fragment_maps.xml\`, visual spec
/// \`Nearby Location Menu.png\` / \`Nearby Facility.png\`, rendered with
/// \`flutter_map\` + OpenStreetMap tiles (no API key): fine-location
/// permission (\`:42-56\` rationale toast parity), user marker + camera on
/// last location, 10 random trainer markers ±0.01 (\`:187-212\`), tap marker
/// → custom info card, tap card → trainer detail (\`onInfoWindowClick\`,
/// \`:116-122\`).
class MapsScreen extends StatefulWidget {
  const MapsScreen({super.key});

  @override
  State<MapsScreen> createState() => _MapsScreenState();
}

class _MapsScreenState extends State<MapsScreen> {
  static const LatLng _fallback = LatLng(-6.2, 106.816666);

  final MapController _mapController = MapController();
  List<Marker> _markers = const <Marker>[];
  bool _selected = false;
  bool _permissionDenied = false;

  @override
  void initState() {
    super.initState();
    _initLocation();
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  Future<void> _initLocation() async {
    var status = await Permission.locationWhenInUse.status;
    if (!status.isGranted) {
      status = await Permission.locationWhenInUse.request();
    }
    if (!status.isGranted) {
      if (!mounted) return;
      setState(() => _permissionDenied = true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(AppStrings.locationPermissionRationale),
        ),
      );
      return;
    }
    LatLng target = _fallback;
    try {
      final position = await Geolocator.getCurrentPosition();
      target = LatLng(position.latitude, position.longitude);
    } catch (_) {
      // No fix available — stay on the fallback city view.
    }
    if (!mounted) return;
    final random = Random();
    const nodeAssets = <String>[
      AppAssets.trainerNode1,
      AppAssets.trainerNode2,
      AppAssets.trainerNode3,
    ];
    final markers = <Marker>[
      Marker(
        point: target,
        width: 48,
        height: 48,
        alignment: Alignment.center,
        child: Image.asset(AppAssets.userNode),
      ),
    ];
    for (var i = 0; i < 10; i++) {
      final point = LatLng(
        target.latitude + (random.nextDouble() - 0.5) * 2 * 0.01,
        target.longitude + (random.nextDouble() - 0.5) * 2 * 0.01,
      );
      markers.add(
        Marker(
          point: point,
          width: 48,
          height: 48,
          alignment: Alignment.center,
          child: GestureDetector(
            onTap: () {
              _mapController.move(point, 16);
              setState(() => _selected = true);
            },
            child: Image.asset(
              nodeAssets[random.nextInt(nodeAssets.length)],
            ),
          ),
        ),
      );
    }
    setState(() => _markers = markers);
    _mapController.move(target, 16);
  }

  void _openTrainer() {
    // \`onInfoWindowClick\` parity: name + nim extras, detail reads name.
    context.push(
      '/trainer/detail',
      extra: const Trainer(
        name: AppStrings.mapTrainerName,
        location: '',
        picture: '',
        rating: 0,
        description: '',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.semiBlack,
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _fallback,
              initialZoom: 16,
              onTap: (_, _) => setState(() => _selected = false),
            ),
            children: [
              TileLayer(
                urlTemplate:
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.example.fitpedia_flutter',
              ),
              MarkerLayer(markers: _markers),
              const RichAttributionWidget(
                attributions: [
                  TextSourceAttribution('OpenStreetMap contributors'),
                ],
              ),
            ],
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(8, 32, 16, 0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const ScreenBackButton(),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      enabled: false,
                      decoration: InputDecoration(
                        hintText: AppStrings.scanSearchHint,
                        hintStyle: const TextStyle(
                          color: AppColors.greyMenu,
                          fontSize: 14,
                        ),
                        filled: true,
                        fillColor: AppColors.white,
                        prefixIcon: const Icon(
                          Icons.search,
                          color: AppColors.black,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        disabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (_permissionDenied)
            const Center(
              child: Text(
                AppStrings.locationPermissionRationale,
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.white, fontSize: 16),
              ),
            ),
          if (_selected)
            Positioned(
              left: 16,
              right: 16,
              bottom: 130,
              child: GestureDetector(
                onTap: _openTrainer,
                child: const _InfoCard(),
              ),
            ),
        ],
      ),
    );
  }
}

/// Custom info window (\`fragment_maps.xml:37-114\`): rounded_window card,
/// like icon, name/role, divider, action icons, overlapping avatar.
class _InfoCard extends StatelessWidget {
  const _InfoCard();

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 30),
          decoration: BoxDecoration(
            color: AppColors.bgWindow,
            borderRadius: BorderRadius.circular(24),
          ),
          padding: const EdgeInsets.fromLTRB(16, 70, 16, 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          AppStrings.nearbyName,
                          style: TextStyle(
                            color: AppColors.white,
                            fontSize: 23,
                          ),
                        ),
                        SizedBox(height: 6),
                        Text(
                          AppStrings.nearbyRole,
                          style: TextStyle(
                            color: AppColors.greyText,
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Image.asset(AppAssets.windowLike, height: 24),
                ],
              ),
              const SizedBox(height: 14),
              const Divider(color: AppColors.white, thickness: 2, height: 2),
              const SizedBox(height: 14),
              Image.asset(
                AppAssets.windowIcons,
                width: double.infinity,
                fit: BoxFit.contain,
              ),
            ],
          ),
        ),
        Positioned(
          left: 16,
          top: 0,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.asset(
              AppAssets.sampleTrainerPhoto,
              width: 90,
              height: 90,
              fit: BoxFit.cover,
            ),
          ),
        ),
      ],
    );
  }
}`,
        },
      ],
    },
    {
      id: 'rank-settings',
      judul: 'Rank + Settings',
      tujuan:
        'Rank: header kuning + strip badge + list EXP → detail (tap = kembali). Settings: seksi Profile/Support, hanya Edit Profile + Log Out yang beraksi.',
      pngHasil: ['img/rank-menu.png', 'img/rank-up-menu.png', 'img/settings-menu.png', 'img/settings-menu-1.png'],
      asetDipakai: ['img/badge_bronze.png', 'img/badge_silver.png', 'img/badge_gold.png', 'img/badge_platinum.png'],
      kerangka: 'Rank: Column[header kuning, ListView] | Settings: scroll seksi + baris ikon',
      bedah: [
        { widget: 'AppAssets.badgeForExp', fungsi: 'Pilih badge sesuai tier EXP', bagianPng: 'Strip badge' },
        { widget: 'GestureDetector(onTap: pop)', fungsi: 'Tap di mana saja = kembali (detail rank & edit profile)', bagianPng: '— (gesture)' },
        { widget: 'signOut + go(/welcome)', fungsi: 'Keluar + buang tumpukan layar', bagianPng: 'Log Out' },
      ],
      kode: [
        {
          file: 'lib/features/rank/rank_tab.dart',
          lang: 'dart',
          code: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/datasources/rank_data.dart';
import '../../data/models/rank.dart';

/// \`RankTab\` (\`/rank\`) from \`RankFragment.kt\` + \`fragment_rank.xml\`,
/// visual spec \`Rank Menu.png\`: yellow badge header (bronze→platinum),
/// \`Platinum Rank\` + season timer, leaderboard rows, tap → \`/rank/detail\`
/// with the \`Rank\` object (name + nim extras parity).
class RankTab extends StatelessWidget {
  const RankTab({super.key});

  @override
  Widget build(BuildContext context) {
    final ranks = RankData.ranks;
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              color: AppColors.yellowMenu,
              padding: const EdgeInsets.only(top: 32, bottom: 16),
              child: Column(
                children: [
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        _Badge(AppAssets.badgeBronze, 75),
                        const SizedBox(width: 8),
                        _Badge(AppAssets.badgeSilver, 75),
                        const SizedBox(width: 8),
                        _Badge(AppAssets.badgeGold, 75),
                        const SizedBox(width: 8),
                        _Badge(AppAssets.badgeRuby, 75),
                        const SizedBox(width: 8),
                        _Badge(AppAssets.badgeSapphire, 75),
                        const SizedBox(width: 8),
                        _Badge(AppAssets.badgeAmethyst, 75),
                        const SizedBox(width: 8),
                        _Badge(AppAssets.badgePlatinum, 120),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    AppStrings.platinumRank,
                    style: TextStyle(
                      color: AppColors.black,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Text(
                    AppStrings.seasonCountdown,
                    style: TextStyle(
                      color: AppColors.seasonTimer,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.fromLTRB(0, 16, 0, 90),
                itemCount: ranks.length,
                itemBuilder: (context, index) => _RankTile(
                  rank: ranks[index],
                  onTap: () => context.push(
                    '/rank/detail',
                    extra: ranks[index],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge(this.asset, this.size);

  final String asset;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Image.asset(asset, width: size, height: size);
  }
}

/// \`RankBadge\` widget keyed by exp tier (\`docs/02-DESIGN_SYSTEM.md\`).
class RankBadge extends StatelessWidget {
  const RankBadge({super.key, required this.exp, this.size = 75});

  final int exp;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      AppAssets.badgeForExp(exp),
      width: size,
      height: size,
    );
  }
}

/// \`item_rank.xml\` as bound by \`RankAdapter.kt:53-67\`: 75px circular image,
/// bold name, yellow \`N EXP\` (\`user_exp_format\`).
class _RankTile extends StatelessWidget {
  const _RankTile({required this.rank, required this.onTap});

  final Rank rank;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        color: AppColors.black,
        child: Row(
          children: [
            const SizedBox(width: 16),
            ClipOval(
              child: CachedNetworkImage(
                imageUrl: rank.picture,
                width: 75,
                height: 75,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  width: 75,
                  height: 75,
                  color: AppColors.semiBlack,
                  child: const Center(
                    child: SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Container(
                  width: 75,
                  height: 75,
                  color: AppColors.semiBlack,
                  child: const Icon(
                    Icons.person,
                    color: AppColors.greyMenu,
                    size: 36,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                rank.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Text(
              AppStrings.userExp(rank.exp.toString()),
              style: const TextStyle(
                color: AppColors.yellowMenu,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 16),
          ],
        ),
      ),
    );
  }
}`,
        },
        {
          file: 'lib/features/rank/rank_detail_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/rank.dart';

/// \`/rank/detail\` from \`RankDetailActivity.kt\` +
/// \`activity_rank_detail.xml\` (full-bleed \`reference_user_rank\`,
/// tap → back): shows the tapped rank's badge by exp tier.
class RankDetailScreen extends StatelessWidget {
  const RankDetailScreen({super.key, required this.rank});

  final Rank rank;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: GestureDetector(
        onTap: () => context.pop(),
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.asset(
                AppAssets.referenceUserRank,
                fit: BoxFit.cover,
              ),
            ),
            SafeArea(
              child: Align(
                alignment: Alignment.topCenter,
                child: Container(
                  margin: const EdgeInsets.only(top: 48),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 16,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.black.withValues(alpha: 0.7),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        AppAssets.badgeForExp(rank.exp),
                        width: 48,
                        height: 48,
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            rank.name,
                            style: const TextStyle(
                              color: AppColors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '\${rank.exp} EXP',
                            style: const TextStyle(
                              color: AppColors.yellowMenu,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
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
          file: 'lib/features/settings/settings_tab.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../data/datasources/local_auth_ds.dart';

/// \`SettingsTab\` (\`/settings\`) from \`SettingsFragment.kt\` +
/// \`fragment_setting.xml\`: Profile + Support sections, Material icons
/// replacing \`outline_*\`/\`baseline_*\` XML drawables. Only Edit Profile and
/// Log Out have listeners in the \`.kt\` (others visual-only); logout signs
/// out and clears the stack to \`/welcome\` (\`:36-41\`).
class SettingsTab extends ConsumerWidget {
  const SettingsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(0, 28, 0, 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 16),
                child: Text(
                  AppStrings.profileSection,
                  style: TextStyle(
                    color: AppColors.yellowMenu,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              _Row(
                icon: Icons.person_outline,
                label: AppStrings.editProfile,
                onTap: () => context.push('/settings/edit-profile'),
              ),
              const _Divider(),
              const _Row(
                icon: Icons.email_outlined,
                label: AppStrings.myEmail,
              ),
              const _Divider(),
              const _Row(
                icon: Icons.lock_outline,
                label: AppStrings.resetPassword,
              ),
              const _Divider(),
              const _Row(
                icon: Icons.location_on_outlined,
                label: AppStrings.myLocation,
              ),
              const _Divider(),
              const _Row(
                icon: Icons.notifications_outlined,
                label: AppStrings.notifications,
              ),
              const _Divider(),
              const Padding(
                padding: EdgeInsets.only(left: 16, top: 64),
                child: Text(
                  AppStrings.supportSection,
                  style: TextStyle(
                    color: AppColors.yellowMenu,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const _Row(
                icon: Icons.shield_outlined,
                label: AppStrings.termsPolicies,
                topMargin: 28,
              ),
              const _Divider(),
              _Row(
                icon: Icons.power_settings_new,
                label: AppStrings.logOut,
                labelColor: AppColors.yellowMenu,
                onTap: () async {
                  await ref.read(authRepositoryProvider).signOut();
                  if (context.mounted) context.go('/welcome');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({
    required this.icon,
    required this.label,
    this.labelColor = AppColors.white,
    this.onTap,
    this.topMargin = 20,
  });

  final IconData icon;
  final String label;
  final Color labelColor;
  final VoidCallback? onTap;
  final double topMargin;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 50,
        margin: EdgeInsets.only(top: topMargin),
        padding: const EdgeInsets.only(left: 14),
        child: Row(
          children: [
            Icon(icon, color: AppColors.white, size: 32),
            const SizedBox(width: 16),
            Text(
              label,
              style: TextStyle(color: labelColor, fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 2,
      margin: const EdgeInsets.symmetric(horizontal: 18),
      color: AppColors.greyLine,
    );
  }
}`,
        },
        {
          file: 'lib/features/settings/edit_profile_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';

/// \`/settings/edit-profile\` from \`EditProfileActivity.kt\` +
/// \`activity_edit_profile.xml\` (full-bleed \`reference_edit_profile\`,
/// tap → back).
class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: GestureDetector(
        onTap: () => context.pop(),
        child: SizedBox.expand(
          child: Image.asset(
            AppAssets.referenceEditProfile,
            fit: BoxFit.cover,
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
      id: 'tests-build',
      judul: 'Tes + build APK/Windows',
      tujuan:
        'Tambah 4 file tes, jalankan semuanya, lalu build rilis.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'test/classify_test.dart',
          lang: 'dart',
          code: `import 'package:fitpedia_flutter/core/constants/ai_prompts.dart';
import 'package:fitpedia_flutter/core/constants/exercise_constants.dart';
import 'package:fitpedia_flutter/data/datasources/equip_classifier.dart';
import 'package:fitpedia_flutter/data/datasources/food_classifier.dart';
import 'package:fitpedia_flutter/data/models/food_result.dart';
import 'package:flutter_test/flutter_test.dart';

/// Phase 3 tests: class table parity (\`ExerciseConstants.kt\`), Gemini
/// equipment prompt + label parsing, and Gemini food-JSON parsing
/// (\`ClassifyFoodActivity.kt:139-166\`).
void main() {
  group('ExerciseConstants', () {
    test('23 classes fully covered by display map', () {
      expect(ExerciseConstants.classes, hasLength(23));
      expect(ExerciseConstants.classesText, hasLength(23));
      for (final key in ExerciseConstants.classes) {
        expect(ExerciseConstants.classToTextMap[key], isNotNull);
      }
    });

    test('displayText falls back to raw prediction', () {
      expect(ExerciseConstants.displayText('bench-press'), 'Bench Press');
      expect(ExerciseConstants.displayText('unknown-key'), 'unknown-key');
    });
  });

  group('Equipment prompt + parsing', () {
    test('prompt enumerates all 23 classes', () {
      final prompt = AiPrompts.equipmentVision;
      for (final key in ExerciseConstants.classes) {
        expect(prompt, contains(key));
      }
    });

    test('parseEquipmentLabel accepts exact, quoted, sentence forms', () {
      expect(parseEquipmentLabel('bench-press'), 'bench-press');
      expect(parseEquipmentLabel('  Lat-Pulldown\\n'), 'lat-pulldown');
      expect(parseEquipmentLabel('"chest-fly"'), 'chest-fly');
      expect(
        parseEquipmentLabel('The equipment shown is a smith-machine.'),
        'smith-machine',
      );
    });

    test('parseEquipmentLabel rejects unknown output', () {
      expect(() => parseEquipmentLabel('unknown'), throwsStateError);
      expect(() => parseEquipmentLabel('treadmill'), throwsStateError);
      expect(() => parseEquipmentLabel(''), throwsStateError);
    });
  });

  group('FoodResult', () {
    test('parses the documented Gemini JSON shape', () {
      const json = <String, dynamic>{
        'food_name': 'Coto Makassar',
        'total_calories': 525,
        'items': [
          <String, dynamic>{
            'name': 'Beef soup',
            'estimated_calories': 400,
            'portion_size': '1 bowl (300g)',
            'nutrients': <String, dynamic>{
              'carbohydrates': '13 grams',
              'protein': '25 grams',
              'vitamins': 'A, C',
              'minerals': 'Iron, Zinc',
              'fats': '15 grams',
            },
          },
        ],
      };
      final result = FoodResult.fromJson(json);
      expect(result.foodName, 'Coto Makassar');
      expect(result.totalCalories, 525);
      expect(result.items, hasLength(1));
      expect(result.items.first.nutrients.protein, '25 grams');
    });

    test('stripCodeFences keeps fenced JSON parseable', () {
      const fenced = '\`\`\`json\\n{"a": 1}\\n\`\`\`';
      expect(stripCodeFences(fenced), '{"a": 1}');
      expect(stripCodeFences('plain'), 'plain');
    });
  });
}`,
        },
        {
          file: 'test/local_auth_test.dart',
          lang: 'dart',
          code: `import 'package:fitpedia_flutter/data/datasources/local_auth_ds.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

/// Local SQLite auth tests (in-memory) — same screens/copy as
/// \`LoginActivity.kt\` / \`RegisterActivity.kt\`, no server needed.
Future<LocalAuthRepository> repository() async {
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;
  final db = await databaseFactory.openDatabase(
    inMemoryDatabasePath,
    options: OpenDatabaseOptions(
      version: 1,
      onCreate: (db, _) => AppDatabase.createSchema(db),
    ),
  );
  SharedPreferences.setMockInitialValues(<String, Object>{});
  final prefs = await SharedPreferences.getInstance();
  authSession.set(null);
  return LocalAuthRepository(db, prefs);
}

void main() {
  group('LocalAuthRepository', () {
    test('register stores name and hashes password', () async {
      final repo = await repository();
      final user = await repo.registerWithEmail(
        'Luffy',
        'luffy@example.com',
        'password123',
      );
      expect(user.name, 'Luffy');
      expect(user.email, 'luffy@example.com');
      expect(
        await repo.restoreSession(),
        isNull,
      ); // parity: register does not log in
    });

    test('login sets session, logout clears it', () async {
      final repo = await repository();
      await repo.registerWithEmail('Nami', 'nami@example.com', 'password123');
      final user =
          await repo.signInWithEmail('nami@example.com', 'password123');
      expect(repo.currentUser?.email, 'nami@example.com');
      expect(user.name, 'Nami');
      await repo.signOut();
      expect(repo.currentUser, isNull);
    });

    test('duplicate email rejected', () async {
      final repo = await repository();
      await repo.registerWithEmail('Zoro', 'zoro@example.com', 'password123');
      expect(
        () => repo.registerWithEmail('Zoro2', 'zoro@example.com', 'password123'),
        throwsA(isA<AuthException>()),
      );
    });

    test('unknown email and wrong password rejected', () async {
      final repo = await repository();
      expect(
        () => repo.signInWithEmail('ghost@example.com', 'password123'),
        throwsA(isA<AuthException>()),
      );
      await repo.registerWithEmail('Sanji', 'sanji@example.com', 'password123');
      expect(
        () => repo.signInWithEmail('sanji@example.com', 'wrongpass'),
        throwsA(isA<AuthException>()),
      );
    });

    test('email matching is case-insensitive', () async {
      final repo = await repository();
      await repo.registerWithEmail('Robin', 'Robin@Example.com', 'password123');
      final user =
          await repo.signInWithEmail('robin@example.com', 'password123');
      expect(user.email, 'robin@example.com');
    });
  });
}`,
        },
        {
          file: 'test/phase4_test.dart',
          lang: 'dart',
          code: `import 'package:fitpedia_flutter/core/constants/app_strings.dart';
import 'package:fitpedia_flutter/data/datasources/trainer_data.dart';
import 'package:fitpedia_flutter/features/muscle/muscle_args.dart';
import 'package:flutter_test/flutter_test.dart';

/// Phase 4 tests: dummy catalogue parity (\`TrainerData.kt\`, \`RankData.kt\`
/// port invariants) and muscle route-args shape.
void main() {
  group('TrainerData', () {
    test('10 trainers with rating + description', () {
      expect(TrainerData.trainers, hasLength(10));
      for (final trainer in TrainerData.trainers) {
        expect(trainer.name, isNotEmpty);
        expect(trainer.description, isNotEmpty);
        expect(trainer.rating, inInclusiveRange(0, 5));
      }
    });

    test('2 articles with placeholder assets', () {
      expect(TrainerData.articles, hasLength(2));
      for (final article in TrainerData.articles) {
        expect(article.pictureAsset, startsWith('assets/placeholders/'));
      }
    });

    test('5 trainer categories', () {
      expect(AppStrings.trainerCategories,
          ['General', 'Cardio', 'Strength', 'Yoga', 'Lifestyle']);
    });
  });

  group('MuscleArgs', () {
    test('carries muscle key + display text', () {
      const args = MuscleArgs(muscle: 'chest', muscleText: 'Chest');
      expect(args.muscle, 'chest');
      expect(AppStrings.exerciseListFor(args.muscleText),
          'Exercise List for Chest');
    });
  });
}`,
        },
        {
          file: 'test/phase5_test.dart',
          lang: 'dart',
          code: `import 'package:fitpedia_flutter/core/constants/app_strings.dart';
import 'package:fitpedia_flutter/core/theme/app_assets.dart';
import 'package:fitpedia_flutter/data/datasources/rank_data.dart';
import 'package:flutter_test/flutter_test.dart';

/// Phase 5 tests: leaderboard parity (\`RankData.kt\`), badge tier mapping
/// (\`docs/02-DESIGN_SYSTEM.md\`), and string formats (\`strings.xml\`).
void main() {
  group('RankData', () {
    test('10 ranks with exp in 0..5000', () {
      expect(RankData.ranks, hasLength(10));
      for (final rank in RankData.ranks) {
        expect(rank.exp, inInclusiveRange(0, 5000));
        expect(rank.picture, startsWith('https://'));
      }
    });

    test('badge tiers cover all badges', () {
      expect(AppAssets.badgeForExp(0), AppAssets.badgeBronze);
      expect(AppAssets.badgeForExp(499), AppAssets.badgeBronze);
      expect(AppAssets.badgeForExp(500), AppAssets.badgeSilver);
      expect(AppAssets.badgeForExp(1000), AppAssets.badgeGold);
      expect(AppAssets.badgeForExp(1500), AppAssets.badgePlatinum);
      expect(AppAssets.badgeForExp(2000), AppAssets.badgeRuby);
      expect(AppAssets.badgeForExp(3000), AppAssets.badgeSapphire);
      expect(AppAssets.badgeForExp(4000), AppAssets.badgeAmethyst);
      expect(AppAssets.badgeForExp(5000), AppAssets.badgeAmethyst);
    });

    test('formats match strings.xml', () {
      expect(AppStrings.userExp('4836'), '4836 EXP');
      expect(
        AppStrings.trainerLocation('SHP01'),
        '\\u{1F4CD} SHP01',
      );
      expect(AppStrings.trainerRating('4.5'), '⭐\\n4.5');
    });
  });
}`,
        },
        {
          file: 'terminal — verifikasi + build',
          lang: 'powershell',
          code: 'flutter analyze\nflutter test\nflutter build apk --dart-define-from-file=.env.json\nflutter build windows --dart-define-from-file=.env.json',
        },
      ],
      checkpoint: [
        'flutter analyze → No issues found!',
        'flutter test → All tests passed!',
        'Cocokkan tiap layar dengan PNG-nya; tiap deep-link ada tombol kembali',
      ],
    },
  ],
};
