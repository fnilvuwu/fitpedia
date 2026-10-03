import type { Sesi } from './types';

export const sesi2: Sesi = {
  id: 'sesi-2',
  nomor: 'SESI 2',
  judul: 'Data + Fitur Utama',
  deskripsi:
    'Model data, prompt Gemini, API latihan, Home, Exercise, Scan + klasifikasi, Muscle, Survey, Subscribe, dan tes pertama.',
  steps: [
    {
      id: 'router-v2',
      judul: 'Router Sesi 2 (sementara) — tambah rute layar baru',
      tujuan:
        'Ganti router Sesi 1 dengan versi ini yang mengenal rute Home, Exercise, Scan, Classify, Muscle, Survey, Subscribe. Router final lengkap ada di Sesi 3.',
      pngHasil: [],
      asetDipakai: [],
      kerangka: 'GoRouter > GoRoute(auth 3 + exercise 2 + scan 2 + muscle 2 + survey + subscribe) + StatefulShellRoute(5)',
      kode: [
        {
          file: 'lib/core/router/app_router.dart (sementara, Sesi 2)',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../data/datasources/local_auth_ds.dart';
import '../../data/models/exercise.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/auth/welcome_screen.dart';
import '../../features/classify/equip_result_screen.dart';
import '../../features/classify/food_result_screen.dart';
import '../../features/exercise/exercise_detail_screen.dart';
import '../../features/exercise/start_exercise_screen.dart';
import '../../features/home/home_tab.dart';
import '../../features/muscle/muscle_args.dart';
import '../../features/muscle/muscle_detail_screen.dart';
import '../../features/muscle/muscle_map_screen.dart';
import '../../features/scan/scan_tab.dart';
import '../../features/shell/main_shell.dart';
import '../../features/subscribe/subscribe_screen.dart';
import '../../features/survey/survey_screen.dart';

/// Sesi 2: rute Home/Exercise/Scan/Classify/Muscle/Survey/Subscribe.
/// Diganti versi final (semua rute) di Sesi 3.
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
                builder: (context, state) =>
                    const PlaceholderTab(label: 'Discover'),
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
      id: 'models',
      judul: 'lib/data/models/ — 7 model data',
      tujuan:
        'Wadah data dengan fromJson/toJson. Exercise = 10 kolom dari API; lainnya dummy/chat.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/data/models/exercise.dart',
          lang: 'dart',
          code: `/// Mirrors \`data/ResponseList.kt:10\` — 10 fields, passed as one object
/// through go_router \`extra\` instead of 10 Intent extras
/// (\`HomeFragment.kt:83-95\`, \`ClassifyEquipActivity.kt:119-131\`).
class Exercise {
  const Exercise({
    required this.id,
    required this.name,
    required this.type,
    required this.muscle,
    required this.equipment,
    required this.difficulty,
    required this.instructions,
    required this.link,
    required this.picture,
    required this.animation,
  });

  final int id;
  final String name;
  final String type;
  final String muscle;
  final String equipment;
  final String difficulty;
  final String instructions;
  final String link;
  final String picture;
  final String animation;

  factory Exercise.fromJson(Map<String, dynamic> json) => Exercise(
        id: (json['id'] as num).toInt(),
        name: json['name'] as String? ?? '',
        type: json['type'] as String? ?? '',
        muscle: json['muscle'] as String? ?? '',
        equipment: json['equipment'] as String? ?? '',
        difficulty: json['difficulty'] as String? ?? '',
        instructions: json['instructions'] as String? ?? '',
        link: json['link'] as String? ?? '',
        picture: json['picture'] as String? ?? '',
        animation: json['animation'] as String? ?? '',
      );

  Map<String, dynamic> toJson() => <String, dynamic>{
        'id': id,
        'name': name,
        'type': type,
        'muscle': muscle,
        'equipment': equipment,
        'difficulty': difficulty,
        'instructions': instructions,
        'link': link,
        'picture': picture,
        'animation': animation,
      };
}`,
        },
        {
          file: 'lib/data/models/trainer.dart',
          lang: 'dart',
          code: `/// Mirrors \`data/Trainer.kt\`.
class Trainer {
  const Trainer({
    required this.name,
    required this.location,
    required this.picture,
    required this.rating,
    required this.description,
  });

  final String name;
  final String location;
  final String picture;
  final double rating;
  final String description;

  factory Trainer.fromJson(Map<String, dynamic> json) => Trainer(
        name: json['name'] as String? ?? '',
        location: json['location'] as String? ?? '',
        picture: json['picture'] as String? ?? '',
        rating: (json['rating'] as num?)?.toDouble() ?? 0,
        description: json['description'] as String? ?? '',
      );

  Map<String, dynamic> toJson() => <String, dynamic>{
        'name': name,
        'location': location,
        'picture': picture,
        'rating': rating,
        'description': description,
      };
}`,
        },
        {
          file: 'lib/data/models/article.dart',
          lang: 'dart',
          code: `/// Mirrors \`data/Article.kt\` (\`pictureUrl\` is an Android drawable res id;
/// Flutter resolves it to a placeholder asset path instead).
class Article {
  const Article({
    required this.name,
    required this.description,
    required this.pictureAsset,
  });

  final String name;
  final String description;
  final String pictureAsset;
}`,
        },
        {
          file: 'lib/data/models/rank.dart',
          lang: 'dart',
          code: `/// Mirrors \`data/Rank.kt\`.
class Rank {
  const Rank({
    required this.name,
    required this.nim,
    required this.picture,
    required this.exp,
  });

  final String name;
  final String nim;
  final String picture;
  final int exp;

  factory Rank.fromJson(Map<String, dynamic> json) => Rank(
        name: json['name'] as String? ?? '',
        nim: json['nim'] as String? ?? '',
        picture: json['picture'] as String? ?? '',
        exp: (json['exp'] as num?)?.toInt() ?? 0,
      );
}`,
        },
        {
          file: 'lib/data/models/chat_message.dart',
          lang: 'dart',
          code: `/// Mirrors \`data/Message.kt\` (\`SENT_BY_ME\` / \`SENT_BY_BOT\`).
class ChatMessage {
  const ChatMessage({required this.message, required this.sentBy});

  static const String sentByMe = 'me';
  static const String sentByBot = 'bot';

  final String message;
  final String sentBy;

  factory ChatMessage.fromJson(Map<String, dynamic> json) => ChatMessage(
        message: json['message'] as String? ?? '',
        sentBy: json['sentBy'] as String? ?? sentByBot,
      );

  Map<String, dynamic> toJson() => <String, dynamic>{
        'message': message,
        'sentBy': sentBy,
      };
}`,
        },
        {
          file: 'lib/data/models/food_result.dart',
          lang: 'dart',
          code: `/// Gemini food-vision result. Shape follows the strict JSON demanded by
/// the prompt in \`ClassifyFoodActivity.kt:67-102\`. Blank responses map to
/// the failed view; JSON parse errors map to the wrong-image view
/// (\`ClassifyFoodActivity.kt:128-175\`).
class FoodResult {
  const FoodResult({
    required this.foodName,
    required this.totalCalories,
    required this.items,
  });

  final String foodName;
  final int totalCalories;
  final List<FoodItem> items;

  factory FoodResult.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'] as List<dynamic>? ?? <dynamic>[];
    return FoodResult(
      foodName: json['food_name'] as String? ?? '',
      totalCalories: (json['total_calories'] as num?)?.toInt() ?? 0,
      items: rawItems
          .map((e) => FoodItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class FoodItem {
  const FoodItem({
    required this.name,
    required this.estimatedCalories,
    required this.portionSize,
    required this.nutrients,
  });

  final String name;
  final int estimatedCalories;
  final String portionSize;
  final FoodNutrients nutrients;

  factory FoodItem.fromJson(Map<String, dynamic> json) => FoodItem(
        name: json['name'] as String? ?? '',
        estimatedCalories:
            (json['estimated_calories'] as num?)?.toInt() ?? 0,
        portionSize: json['portion_size'] as String? ?? '',
        nutrients: FoodNutrients.fromJson(
          json['nutrients'] as Map<String, dynamic>? ?? <String, dynamic>{},
        ),
      );
}

class FoodNutrients {
  const FoodNutrients({
    required this.carbohydrates,
    required this.protein,
    required this.vitamins,
    required this.minerals,
    required this.fats,
  });

  final String carbohydrates;
  final String protein;
  final String vitamins;
  final String minerals;
  final String fats;

  factory FoodNutrients.fromJson(Map<String, dynamic> json) => FoodNutrients(
        carbohydrates: json['carbohydrates'] as String? ?? '',
        protein: json['protein'] as String? ?? '',
        vitamins: json['vitamins'] as String? ?? '',
        minerals: json['minerals'] as String? ?? '',
        fats: json['fats'] as String? ?? '',
      );
}`,
        },
      ],
    },
    {
      id: 'ai-prompts',
      judul: 'Prompt Gemini — makanan + alat + Fit AI',
      tujuan:
        'Prompt makanan = kata-per-kata dari Android. Prompt alat = buatan Flutter: output dibatasi 23 kunci ExerciseConstants supaya cocok dengan API. Isi GEMINI_API_KEY di .env.json.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/core/constants/exercise_constants.dart',
          lang: 'dart',
          code: `/// Class labels verbatim from \`ui/ExerciseConstants.kt:4-56\`.
/// Gemini (\`AiPrompts.equipmentVision\`) is constrained to these keys;
/// the display text comes from [classToTextMap]
/// (\`ClassifyEquipActivity.kt:158\`).
abstract final class ExerciseConstants {
  static const List<String> classes = <String>[
    'abdominal-machine',
    'arm-curl',
    'arm-extension',
    'back-extension',
    'back-row-machine',
    'bench-press',
    'cable-lat-pulldown',
    'chest-fly',
    'chest-press',
    'dip-chin-assist',
    'hip-abduction-adduction',
    'incline-bench',
    'lat-pulldown',
    'leg-extension',
    'leg-press',
    'lying-down-leg-curl',
    'overhead-shoulder-press',
    'pulley-machine',
    'seated-cable-row',
    'seated-leg-curl',
    'smith-machine',
    'squat-rack',
    'torso-rotation-machine',
  ];

  static const List<String> classesText = <String>[
    'Abdominal Machine',
    'Arm Curl',
    'Arm Extension',
    'Back Extension',
    'Back Row Machine',
    'Bench Press',
    'Cable Lat Pulldown',
    'Chest Fly',
    'Chest Press',
    'Dip Chin Assist',
    'Hip Abduction Adduction',
    'Incline Bench',
    'Lat Pulldown',
    'Leg Extension',
    'Leg Press',
    'Lying Down Leg Curl',
    'Overhead Shoulder Press',
    'Pulley Machine',
    'Seated Cable Row',
    'Seated Leg Curl',
    'Smith Machine',
    'Squat Rack',
    'Torso Rotation Machine',
  ];

  static final Map<String, String> classToTextMap =
      Map<String, String>.unmodifiable(
    Map<String, String>.fromIterables(classes, classesText),
  );

  /// Display text for a raw prediction
  /// (\`ClassifyEquipActivity.kt:158-159\`).
  static String displayText(String prediction) =>
      classToTextMap[prediction] ?? prediction;
}`,
        },
        {
          file: 'lib/core/constants/ai_prompts.dart (bagian equipmentVision)',
          lang: 'dart',
          code: `/// Equipment vision prompt (Flutter-only; replaces the retired ML server
/// and the TFLite model). Single-token output constrained to
/// \`ExerciseConstants.classes\` so downstream mapping is identical.
static String get equipmentVision => '''
You are a gym equipment classifier. Look at the image and identify the single most prominent piece of gym equipment.

Respond with ONLY one equipment key from this exact list, with no other text, no quotes, no punctuation:

\${ExerciseConstants.classes.join(', ')}

Rules:
1. Output must be exactly one key from the list above.
2. If several pieces are visible, pick the largest/most central one.
3. If the image does not show gym equipment, respond with exactly: unknown
''';`,
        },
      ],
      catatan:
        'Prompt foodVision (JSON kalori) dan fitAiSystem disalin kata-per-kata dari ClassifyFoodActivity.kt dan ChatActivity.kt — lihat file ai_prompts.dart di repo.',
    },
    {
      id: 'exercise-api',
      judul: 'API latihan — dio_client + exercise_api + repository',
      tujuan:
        'Satu klien Dio + 3 endpoint (semua, ?equipment, ?muscle) + provider Riverpod yang menghasilkan loading/sukses/gagal.',
      pngHasil: [],
      asetDipakai: [],
      kerangka: 'FutureProvider > ExerciseApi > Dio > baseUrl',
      kode: [
        {
          file: 'lib/core/network/dio_client.dart',
          lang: 'dart',
          code: `import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../constants/api_constants.dart';

/// Single Dio client for the exercise API (\`RetrofitInstance.kt:8\`).
final exerciseDioProvider = Provider<Dio>((ref) {
  return Dio(
    BaseOptions(
      baseUrl: ApiConstants.exerciseBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      responseType: ResponseType.json,
    ),
  );
});`,
        },
        {
          file: 'lib/data/datasources/exercise_api.dart',
          lang: 'dart',
          code: `import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/api_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/exercise.dart';

/// Hand-written Dio equivalent of \`data/ExerciseApi.kt:7-13\` — same
/// 3 endpoints, same signatures (no codegen).
class ExerciseApi {
  ExerciseApi(this._dio);

  final Dio _dio;

  /// \`GET /\` (\`HomeFragment.kt:110\`).
  Future<List<Exercise>> getExercises() async {
    final response = await _dio.get<Map<String, dynamic>>('/');
    return _parseList(response);
  }

  /// \`GET /exercises?equipment=<prediction>\`
  /// (\`ClassifyEquipActivity.kt:83\`).
  Future<List<Exercise>> getEquipment(String equipment) async {
    final response = await _dio.get<Map<String, dynamic>>(
      ApiConstants.exercisesPath,
      queryParameters: <String, dynamic>{'equipment': equipment},
    );
    return _parseList(response);
  }

  /// \`GET /exercises?muscle=<muscle>\` (\`MuscleDetailActivity\`).
  Future<List<Exercise>> getMuscle(String muscle) async {
    final response = await _dio.get<Map<String, dynamic>>(
      ApiConstants.exercisesPath,
      queryParameters: <String, dynamic>{'muscle': muscle},
    );
    return _parseList(response);
  }

  List<Exercise> _parseList(Response<Map<String, dynamic>> response) {
    final data = response.data?['data'] as List<dynamic>? ?? <dynamic>[];
    return data
        .map((e) => Exercise.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}

final exerciseApiProvider = Provider<ExerciseApi>((ref) {
  return ExerciseApi(ref.watch(exerciseDioProvider));
});`,
        },
        {
          file: 'lib/data/repositories/exercise_repository.dart',
          lang: 'dart',
          code: `import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../datasources/exercise_api.dart';
import '../models/exercise.dart';

/// Providers driving \`AsyncValue\` loading/success/failed views, mirroring
/// the try/catch states in \`HomeFragment.kt:103-141\`
/// (\`IOException\`/\`HttpException\` → failed view + retry).
final exerciseListProvider = FutureProvider<List<Exercise>>((ref) {
  return ref.watch(exerciseApiProvider).getExercises();
});

final equipmentExercisesProvider =
    FutureProvider.family<List<Exercise>, String>((ref, equipment) {
  return ref.watch(exerciseApiProvider).getEquipment(equipment);
});

final muscleExercisesProvider =
    FutureProvider.family<List<Exercise>, String>((ref, muscle) {
  return ref.watch(exerciseApiProvider).getMuscle(muscle);
});`,
        },
      ],
    },
    {
      id: 'classifiers',
      judul: 'Klasifikasi gambar — equip + food + repository',
      tujuan:
        'Equip: Gemini satu kata kunci (cocok persis → terkandung → gagal). Food: JSON ketat (kosong → gagal, bukan-JSON → gambar-salah). Label tampil walau daftar gagal dimuat.',
      pngHasil: ['img/equipment-scan-result.png', 'img/food-classification-result-menu.png'],
      asetDipakai: [],
      bedah: [
        { widget: 'parseEquipmentLabel', fungsi: 'Ubah teks Gemini jadi kunci 23 alat; lempar jika unknown', bagianPng: 'Label "Bench Press"' },
        { widget: 'DataPart(mime, bytes)', fungsi: 'Kirim foto + prompt ke Gemini', bagianPng: '— (jaringan)' },
        { widget: 'stripCodeFences', fungsi: 'Kupas pagar ```json agar tetap ter-parse', bagianPng: '— (robust)' },
        { widget: 'listError', fungsi: 'Label tetap tampil walau daftar API gagal', bagianPng: 'Retry khusus daftar' },
      ],
      kode: [
        {
          file: 'lib/data/datasources/equip_classifier.dart',
          lang: 'dart',
          code: `import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

import '../../core/constants/ai_prompts.dart';
import '../../core/constants/api_constants.dart';
import '../../core/constants/exercise_constants.dart';

/// Parses Gemini equipment output into a key from
/// \`ExerciseConstants.classes\`. Exact match first, then first-contained-key
/// (tolerates quotes or a full sentence). Anything else, including
/// \`unknown\`, throws so the caller shows failed + retry.
String parseEquipmentLabel(String raw) {
  final text = raw.trim().toLowerCase();
  for (final key in ExerciseConstants.classes) {
    if (text == key) return key;
  }
  for (final key in ExerciseConstants.classes) {
    if (text.contains(key)) return key;
  }
  throw StateError('Unrecognized equipment output: $raw');
}

/// Gemini equipment classification (replaces the retired ML server and the
/// TFLite model): same 23 output keys, so \`classToTextMap\` and the
/// \`?equipment\` list fetch work unchanged.
class EquipClassifier {
  const EquipClassifier();

  Future<String> classify(String imagePath) async {
    final model = GenerativeModel(
      model: ApiConstants.geminiModel,
      apiKey: ApiConstants.geminiApiKey,
    );
    final bytes = await File(imagePath).readAsBytes();
    final mime = imagePath.toLowerCase().endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';
    final response = await model.generateContent([
      Content.multi([
        TextPart(AiPrompts.equipmentVision),
        DataPart(mime, Uint8List.fromList(bytes)),
      ]),
    ]);
    final text = response.text;
    if (text == null || text.trim().isEmpty) {
      throw StateError('No response received.');
    }
    return parseEquipmentLabel(text);
  }
}

final equipClassifierProvider = Provider<EquipClassifier>((ref) {
  return const EquipClassifier();
});`,
        },
        {
          file: 'lib/data/datasources/food_classifier.dart',
          lang: 'dart',
          code: `import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

import '../../core/constants/ai_prompts.dart';
import '../../core/constants/api_constants.dart';
import '../../core/constants/app_strings.dart';
import '../models/food_result.dart';

/// Gemini food-vision outcomes mirroring \`ClassifyFoodActivity.kt:128-175\`:
/// blank response → failed, JSON exception → wrong-image.
sealed class FoodOutcome {
  const FoodOutcome();
}

class FoodSuccess extends FoodOutcome {
  const FoodSuccess(this.result);

  final FoodResult result;
}

class FoodFailed extends FoodOutcome {
  const FoodFailed(this.message);

  final String message;
}

class FoodWrongImage extends FoodOutcome {
  const FoodWrongImage(this.message);

  final String message;
}

/// Strips \`\`\`json fences so fenced JSON still parses; anything else that
/// fails \`jsonDecode\` maps to the wrong-image view like the Android
/// \`JSONObject\` catch block.
String stripCodeFences(String text) {
  var cleaned = text.trim();
  if (cleaned.startsWith('\`\`\`')) {
    final firstNewline = cleaned.indexOf('\\n');
    cleaned = firstNewline == -1 ? '' : cleaned.substring(firstNewline + 1);
    final fence = cleaned.lastIndexOf('\`\`\`');
    if (fence != -1) cleaned = cleaned.substring(0, fence);
  }
  return cleaned.trim();
}

class FoodClassifier {
  const FoodClassifier();

  Future<FoodOutcome> classify(Uint8List pngBytes) async {
    final model = GenerativeModel(
      model: ApiConstants.geminiModel,
      apiKey: ApiConstants.geminiApiKey,
    );
    try {
      final response = await model.generateContent([
        Content.multi([
          TextPart(AiPrompts.foodVision),
          DataPart('image/png', pngBytes),
        ]),
      ]);
      final text = response.text;
      if (text == null || text.trim().isEmpty) {
        return const FoodFailed(AppStrings.foodNoResponse);
      }
      try {
        return FoodSuccess(
          FoodResult.fromJson(
            jsonDecode(text.trim()) as Map<String, dynamic>,
          ),
        );
      } catch (_) {
        try {
          return FoodSuccess(
            FoodResult.fromJson(
              jsonDecode(stripCodeFences(text)) as Map<String, dynamic>,
            ),
          );
        } catch (_) {
          return const FoodWrongImage(AppStrings.foodWrongImage);
        }
      }
    } catch (e) {
      return FoodFailed('Failed to classify image: $e');
    }
  }
}

final foodClassifierProvider = Provider<FoodClassifier>((ref) {
  return const FoodClassifier();
});`,
        },
        {
          file: 'lib/data/repositories/classify_repository.dart',
          lang: 'dart',
          code: `import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/exercise_constants.dart';
import '../datasources/equip_classifier.dart';
import '../datasources/exercise_api.dart';
import '../datasources/food_classifier.dart';
import '../models/exercise.dart';

/// Combined equipment state: prediction (+ display text via
/// \`classToTextMap\`) then the filtered exercise list. A failed exercise
/// fetch does NOT fail the whole result — the label still shows and
/// only the list gets its own retry (\`listError\`).
class EquipResultState {
  const EquipResultState({
    required this.prediction,
    required this.predictionText,
    required this.exercises,
    this.listError = false,
  });

  final String prediction;
  final String predictionText;
  final List<Exercise> exercises;
  final bool listError;
}

final equipResultProvider =
    FutureProvider.family<EquipResultState, String>((ref, imagePath) async {
  final prediction =
      await ref.watch(equipClassifierProvider).classify(imagePath);
  List<Exercise> exercises = const <Exercise>[];
  var listError = false;
  try {
    exercises =
        await ref.watch(exerciseApiProvider).getEquipment(prediction);
  } catch (_) {
    listError = true;
  }
  return EquipResultState(
    prediction: prediction,
    predictionText: ExerciseConstants.displayText(prediction),
    exercises: exercises,
    listError: listError,
  );
});

/// Food-vision state for an image path; errors are encoded in [FoodOutcome]
/// (failed / wrong-image) per \`ClassifyFoodActivity.kt:128-175\`.
final foodResultProvider =
    FutureProvider.family<FoodOutcome, String>((ref, imagePath) async {
  final bytes = await File(imagePath).readAsBytes();
  return ref
      .watch(foodClassifierProvider)
      .classify(Uint8List.fromList(bytes));
});`,
        },
      ],
    },
    {
      id: 'home',
      judul: 'lib/features/home/home_tab.dart — beranda asli',
      tujuan:
        'Tanggal, sapaan nama user, banner 75%, list horizontal dari API, baris RECENT/MORE, kartu Pro Tip + banner artikel. Gagal → retry.',
      pngHasil: ['img/home-screen.png'],
      asetDipakai: ['img/home_background.png', 'img/sample_tip.png', 'img/sample_list.png'],
      kerangka: 'Scaffold > AsyncValue > RefreshIndicator > scroll > Stack[bg, Column[tanggal, sapaan, banner, list, recent, protip, artikel]]',
      bedah: [
        { widget: 'exerciseListProvider (watch)', fungsi: 'Ambil list; otomatis rebuild saat loading/sukses/gagal', bagianPng: 'Daftar Latihan' },
        { widget: 'RefreshIndicator', fungsi: 'Tarik ke bawah untuk muat ulang', bagianPng: '— (gesture)' },
        { widget: 'ExerciseCard + onTap push', fungsi: 'Kartu horizontal → detail', bagianPng: 'Tiap kartu latihan' },
        { widget: '_userLabel', fungsi: 'Nama dari database, fallback email', bagianPng: 'Welcome, …!' },
      ],
      kode: [
        {
          file: 'lib/features/home/home_tab.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/datasources/local_auth_ds.dart';
import '../../data/models/exercise.dart';
import '../../data/repositories/exercise_repository.dart';
import '../../shared/widgets/exercise_card.dart';
import '../../shared/widgets/loading_error_view.dart';

/// \`HomeTab\` (\`/home\`) from \`HomeFragment.kt\` + \`fragment_home.xml\`,
/// visual spec \`Home Screen.png\`: date, \`Welcome, {name}!\`
/// (\`displayName ?? email\`), streak, featured banner, horizontal API list,
/// RECENT/MORE row, pro-tip + article banners, failed view + retry.
/// Tap → \`/exercise/detail\` with the \`Exercise\` object.
class HomeTab extends ConsumerWidget {
  const HomeTab({super.key});

  String _userLabel(WidgetRef ref) {
    final user = ref.watch(authRepositoryProvider).currentUser;
    if (user == null) return AppStrings.welcomeFallback;
    final name = user.name.isEmpty ? user.email : user.name;
    if (name.isEmpty) return AppStrings.welcomeFallback;
    return AppStrings.welcomeUser(name);
  }

  void _openDetail(BuildContext context, Exercise exercise) {
    context.push('/exercise/detail', extra: exercise);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final exercises = ref.watch(exerciseListProvider);
    final date = DateFormat.yMMMMEEEEd('en_US').format(DateTime.now());

    return Scaffold(
      backgroundColor: AppColors.black,
      body: exercises.when(
        loading: () => const LoadingView(),
        error: (error, _) => FailedView(
          message: AppStrings.failedMessage,
          onRetry: () => ref.invalidate(exerciseListProvider),
        ),
        data: (items) => RefreshIndicator(
          color: AppColors.yellowMenu,
          onRefresh: () => ref.refresh(exerciseListProvider.future),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Stack(
              children: [
                Image.asset(
                  AppAssets.homeBackground,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 56, 16, 90),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        date,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              _userLabel(ref),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: AppColors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const Text(
                            AppStrings.streak,
                            style: TextStyle(
                              color: AppColors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      _FeaturedBanner(onContinue: () {
                        if (items.isNotEmpty) _openDetail(context, items.first);
                      }),
                      const SizedBox(height: 16),
                      const Text(
                        AppStrings.getStartedWith,
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 220,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: items.length,
                          itemBuilder: (context, index) => ExerciseCard(
                            exercise: items[index],
                            onTap: () => _openDetail(context, items[index]),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            AppStrings.recent,
                            style: TextStyle(
                              color: AppColors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            AppStrings.more,
                            style: TextStyle(
                              color: AppColors.yellowMenu,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const _ProTipCard(),
                      const SizedBox(height: 24),
                      const _ArticleBanner(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FeaturedBanner extends StatelessWidget {
  const _FeaturedBanner({required this.onContinue});

  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.semiBlack.withValues(alpha: 0.8),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  AppStrings.featuredWorkout,
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  AppStrings.featuredProgress,
                  style: TextStyle(color: AppColors.white, fontSize: 12),
                ),
                const SizedBox(height: 6),
                const LinearProgressIndicator(value: 0.75),
                const SizedBox(height: 12),
                SizedBox(
                  height: 34,
                  child: ElevatedButton(
                    onPressed: onContinue,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.white,
                    ),
                    child: const Text(
                      AppStrings.continueLabel,
                      style: TextStyle(fontSize: 12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ProTipCard extends StatelessWidget {
  const _ProTipCard();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.asset(
            AppAssets.sampleTip,
            width: 70,
            height: 70,
            fit: BoxFit.cover,
          ),
        ),
        const SizedBox(width: 24),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppStrings.proTipTitle,
                style: TextStyle(
                  color: AppColors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 8),
              Text(
                AppStrings.proTipSubtitle,
                style: TextStyle(color: AppColors.white, fontSize: 13),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ArticleBanner extends StatelessWidget {
  const _ArticleBanner();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.asset(
            AppAssets.sampleList,
            width: double.infinity,
            height: 170,
            fit: BoxFit.cover,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          AppStrings.articleBannerTitle,
          style: TextStyle(color: AppColors.white, fontSize: 16),
        ),
        const SizedBox(height: 8),
        const Text(
          AppStrings.articleBannerBody,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(color: AppColors.white, fontSize: 13),
        ),
      ],
    );
  }
}`,
        },
      ],
    },
    {
      id: 'exercise',
      judul: 'Exercise detail + start',
      tujuan:
        'Detail: foto + nama + Begin Exercise + overview + video (WebView di HP, tombol YouTube di Windows) + latihan lain. Start: animasi + timer statis.',
      pngHasil: ['img/exercise-detail-menu.png', 'img/start-exercise-menu.png'],
      asetDipakai: [],
      bedah: [
        { widget: 'WebViewWidget vs _ExternalPlayer', fungsi: 'Video dalam app di HP; tombol browser di Windows', bagianPng: 'VIDEO TUTORIAL' },
        { widget: 'context.push(extra)', fungsi: 'Kirim objek Exercise antar layar', bagianPng: '— (navigasi)' },
      ],
      kode: [
        {
          file: 'lib/features/exercise/exercise_detail_screen.dart',
          lang: 'dart',
          code: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/exercise.dart';
import '../../data/repositories/exercise_repository.dart';
import '../../shared/widgets/exercise_card.dart';
import '../../shared/widgets/loading_error_view.dart';

/// \`/exercise/detail\` from \`DetailExerciseActivity.kt\` +
/// \`activity_detail_exercise.xml\`, visual spec \`Exercise Detail Menu.png\`:
/// header picture + gradient, name, difficulty/equipment row,
/// Begin Exercise → \`/exercise/start\` (Phase 4), OVERVIEW instructions,
/// VIDEO TUTORIAL (YouTube iframe in WebView, \`DetailExerciseActivity.kt:44\`),
/// OTHER EXERCISE (same-equipment list, tap pushes a new detail).
class ExerciseDetailScreen extends ConsumerStatefulWidget {
  const ExerciseDetailScreen({super.key, required this.exercise});

  final Exercise exercise;

  @override
  ConsumerState<ExerciseDetailScreen> createState() =>
      _ExerciseDetailScreenState();
}

class _ExerciseDetailScreenState
    extends ConsumerState<ExerciseDetailScreen> {
  /// \`webview_flutter\` ships Android/iOS/macOS implementations only.
  /// Constructing the controller elsewhere (e.g. Windows) throws, so it is
  /// created lazily and only on supported platforms.
  static bool get webViewSupported => const <TargetPlatform>{
        TargetPlatform.android,
        TargetPlatform.iOS,
        TargetPlatform.macOS,
      }.contains(defaultTargetPlatform);

  WebViewController? _webController;

  @override
  void initState() {
    super.initState();
    if (webViewSupported && widget.exercise.link.isNotEmpty) {
      _webController = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..loadHtmlString(_iframe(widget.exercise.link));
    }
  }

  static String _iframe(String link) =>
      '<iframe width="100%" height="100%" src="$link" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

  @override
  Widget build(BuildContext context) {
    final exercise = widget.exercise;
    final related = ref.watch(equipmentExercisesProvider(exercise.equipment));

    return Scaffold(
      backgroundColor: AppColors.black,
      body: related.when(
        loading: () => const LoadingView(),
        error: (error, _) => FailedView(
          message: AppStrings.failedMessage,
          onRetry: () => ref.invalidate(
            equipmentExercisesProvider(exercise.equipment),
          ),
        ),
        data: (items) => SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  CachedNetworkImage(
                    imageUrl: exercise.picture,
                    width: double.infinity,
                    height: 380,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      height: 380,
                      color: AppColors.semiBlack,
                      child: const Center(
                        child: CircularProgressIndicator(),
                      ),
                    ),
                    errorWidget: (context, url, error) => Image.asset(
                      AppAssets.sampleExercisePhoto,
                      width: double.infinity,
                      height: 380,
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
                            AppColors.black.withValues(alpha: 0.1),
                            AppColors.black.withValues(alpha: 0.9),
                          ],
                          stops: const [0.5, 1.0],
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 16,
                    child: Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            exercise.name,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: AppColors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.favorite,
                              size: 14,
                              color: AppColors.white,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              exercise.difficulty,
                              style: const TextStyle(
                                color: AppColors.white,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              '⚔️',
                              style: TextStyle(fontSize: 13),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              exercise.equipment,
                              style: const TextStyle(
                                color: AppColors.white,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  SafeArea(
                    child: IconButton(
                      icon: const Icon(
                        Icons.arrow_back,
                        color: AppColors.white,
                      ),
                      onPressed: () => context.pop(),
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: () => context.push(
                          '/exercise/start',
                          extra: exercise,
                        ),
                        child: const Text(AppStrings.beginExercise),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      AppStrings.overview,
                      style: TextStyle(
                        color: AppColors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      exercise.instructions,
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w300,
                        height: 1.5,
                      ),
                    ),
                    if (exercise.link.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      const Text(
                        AppStrings.videoTutorial,
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 16),
                      if (_webController != null)
                        SizedBox(
                          height: 200,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: WebViewWidget(controller: _webController!),
                          ),
                        )
                      else
                        _ExternalPlayer(exercise: exercise),
                    ],
                    const SizedBox(height: 16),
                    const Text(
                      AppStrings.otherExercise,
                      style: TextStyle(
                        color: AppColors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 224,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: items.length,
                        itemBuilder: (context, index) => ExerciseCard(
                          exercise: items[index],
                          onTap: () => context.push(
                            '/exercise/detail',
                            extra: items[index],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Fallback player for platforms without a \`webview_flutter\`
/// implementation (Windows/Linux): thumbnail + external browser button.
class _ExternalPlayer extends StatelessWidget {
  const _ExternalPlayer({required this.exercise});

  final Exercise exercise;

  Future<void> _open(BuildContext context) async {
    final uri = Uri.tryParse(exercise.link);
    if (uri == null) return;
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text(AppStrings.cannotOpenVideo)),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: CachedNetworkImage(
            imageUrl: exercise.picture,
            width: double.infinity,
            height: 200,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(
              height: 200,
              color: AppColors.semiBlack,
              child: const Center(child: CircularProgressIndicator()),
            ),
            errorWidget: (context, url, error) => Image.asset(
              AppAssets.sampleExercisePhoto,
              width: double.infinity,
              height: 200,
              fit: BoxFit.cover,
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: OutlinedButton.icon(
            onPressed: () => _open(context),
            icon: const Icon(
              Icons.play_circle_outline,
              color: AppColors.yellowMenu,
            ),
            label: const Text(AppStrings.watchOnYouTube),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.yellowMenu,
              side: const BorderSide(color: AppColors.yellowMenu),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ),
      ],
    );
  }
}`,
        },
        {
          file: 'lib/features/exercise/start_exercise_screen.dart',
          lang: 'dart',
          code: `import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/exercise.dart';
import '../../shared/widgets/screen_back_button.dart';

/// \`/exercise/start\` from \`StartExerciseActivity.kt\` +
/// \`activity_start_exercise.xml\`, visual spec \`Start Exercise Menu.png\`:
/// animation art (Glide \`fitCenter\` → \`cached_network_image\`), exercise
/// name, static timer, Pause + Check Movement (both listener-less in the
/// \`.kt\`, kept visual-only for parity).
class StartExerciseScreen extends StatelessWidget {
  const StartExerciseScreen({super.key, required this.exercise});

  final Exercise exercise;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: Column(
          children: [
            const Align(
              alignment: Alignment.centerLeft,
              child: ScreenBackButton(),
            ),
            Expanded(
              child: Container(
                width: double.infinity,
                color: AppColors.white,
                margin: const EdgeInsets.only(bottom: 64),
                child: CachedNetworkImage(
                  imageUrl: exercise.animation,
                  fit: BoxFit.contain,
                  placeholder: (context, url) => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  errorWidget: (context, url, error) => Image.asset(
                    AppAssets.sampleExercise,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                exercise.name,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: AppColors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              AppStrings.startTimerPlaceholder,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.white,
                fontSize: 54,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 32),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text(AppStrings.pause),
                ),
              ),
            ),
            const SizedBox(height: 32),
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.motion_photos_on,
                  color: AppColors.yellowMenu,
                ),
                SizedBox(width: 10),
                Text(
                  AppStrings.checkMovement,
                  style: TextStyle(
                    color: AppColors.yellowMenu,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 64),
          ],
        ),
      ),
    );
  }
}`,
        },
      ],
    },
    {
      id: 'scan',
      judul: 'lib/features/scan/scan_tab.dart — hub scan',
      tujuan:
        '4 ubin + kartu kuning Muscle Map. Dialog Camera/Gallery (kamera minta izin dulu). Galeri-alat mengarah ke hasil alat (perbaikan bug Android).',
      pngHasil: ['img/main-feature-menu.png', 'img/equipment-scan-menu-1.png', 'img/food-classification-scan-menu.png'],
      asetDipakai: ['img/scan_equip.png', 'img/scan_meal.png', 'img/consult_trainer.png', 'img/nearby_location.png'],
      kerangka: 'scroll > Column[search, Row[ubin, ubin], Row[ubin, ubin], kartu kuning, teks]',
      bedah: [
        { widget: 'SimpleDialog', fungsi: 'Pilih Camera / Gallery / cancel', bagianPng: 'Dialog sumber gambar' },
        { widget: 'ImagePicker', fungsi: 'Ambil foto (kamera butuh izin dulu)', bagianPng: '— (sistem)' },
        { widget: 'context.push(extra: path)', fungsi: 'Kirim path foto ke layar hasil', bagianPng: '— (navigasi)' },
      ],
      kode: [
        {
          file: 'lib/features/scan/scan_tab.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';

/// \`ScanTab\` (\`/scan\` hub) from \`ScanFragment.kt:67-87\` +
/// \`fragment_scan.xml\`, visual spec \`Main Feature Menu.png\`.
/// Tiles: scan-equip → source dialog → \`/scan/equipment-result\`,
/// scan-meal → \`/scan/food-result\`, consult-trainer → \`/trainer\`
/// (Phase 4), nearby → \`/maps\` (Phase 5), muscle-map card → \`/muscle-map\`
/// (Phase 4). Gallery-equip routes to the equip result — fixing the upstream
/// misroute to \`ClassifyFoodActivity\` (\`ScanFragment.kt:218\`).
class ScanTab extends StatelessWidget {
  const ScanTab({super.key});

  Future<bool> _ensureCamera(BuildContext context) async {
    var status = await Permission.camera.status;
    if (status.isGranted) return true;
    status = await Permission.camera.request();
    if (!status.isGranted && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.permissionDeniedSettings)),
      );
    }
    return status.isGranted;
  }

  Future<String?> _pickSource(
    BuildContext context, {
    required String title,
  }) async {
    final picker = ImagePicker();
    final choice = await showDialog<_ImageSourceChoice>(
      context: context,
      builder: (context) => SimpleDialog(
        backgroundColor: AppColors.bgWindow,
        title: Text(
          title,
          style: const TextStyle(color: AppColors.white),
        ),
        children: [
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, _ImageSourceChoice.camera),
            child: const Text(
              AppStrings.sourceCamera,
              style: TextStyle(color: AppColors.white),
            ),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, _ImageSourceChoice.gallery),
            child: const Text(
              AppStrings.sourceGallery,
              style: TextStyle(color: AppColors.white),
            ),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              AppStrings.cancel,
              style: TextStyle(color: AppColors.greyMenu),
            ),
          ),
        ],
      ),
    );
    if (choice == null || !context.mounted) return null;
    if (choice == _ImageSourceChoice.camera) {
      if (!await _ensureCamera(context)) return null;
      final file = await picker.pickImage(source: ImageSource.camera);
      return file?.path;
    }
    final file = await picker.pickImage(source: ImageSource.gallery);
    return file?.path;
  }

  Future<void> _scanEquip(BuildContext context) async {
    final path = await _pickSource(
      context,
      title: AppStrings.pickEquipTitle,
    );
    if (path != null && context.mounted) {
      context.push('/scan/equipment-result', extra: path);
    }
  }

  Future<void> _scanMeal(BuildContext context) async {
    final path = await _pickSource(
      context,
      title: AppStrings.pickFoodTitle,
    );
    if (path != null && context.mounted) {
      context.push('/scan/food-result', extra: path);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 32, 16, 90),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                enabled: false,
                decoration: InputDecoration(
                  hintText: AppStrings.scanSearchHint,
                  hintStyle: const TextStyle(
                    color: AppColors.greyMenu,
                    fontSize: 14,
                  ),
                  filled: true,
                  fillColor: AppColors.white,
                  prefixIcon:
                      const Icon(Icons.search, color: AppColors.black),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide.none,
                  ),
                  disabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: _ScanTile(
                      asset: AppAssets.scanEquip,
                      onTap: () => _scanEquip(context),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _ScanTile(
                      asset: AppAssets.scanMeal,
                      onTap: () => _scanMeal(context),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: _ScanTile(
                      asset: AppAssets.consultTrainer,
                      onTap: () => context.push('/trainer'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _ScanTile(
                      asset: AppAssets.nearbyLocation,
                      onTap: () => context.push('/maps'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              GestureDetector(
                onTap: () => context.push('/muscle-map'),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 30,
                    vertical: 40,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.yellowMenu,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppStrings.muscleMapTitle,
                        style: TextStyle(
                          color: AppColors.black,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 12),
                      Text(
                        AppStrings.muscleMapSubtitle,
                        style: TextStyle(
                          color: AppColors.black,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                AppStrings.everythingHere,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: AppColors.yellowMenu,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                AppStrings.everythingHereBody,
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.white, fontSize: 14),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

enum _ImageSourceChoice { camera, gallery }

class _ScanTile extends StatelessWidget {
  const _ScanTile({required this.asset, required this.onTap});

  final String asset;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.asset(asset, height: 110, fit: BoxFit.cover),
      ),
    );
  }
}`,
        },
      ],
    },
    {
      id: 'result-screens',
      judul: 'Layar hasil — equip_result + food_result',
      tujuan:
        'Equip: foto + label + daftar rekomendasi (label tetap tampil walau daftar gagal). Food: kartu nutrisi + tombol Add + / failed + gambar-salah.',
      pngHasil: ['img/equipment-scan-result.png', 'img/food-classification-result-menu.png'],
      asetDipakai: [],
      kode: [
        {
          file: 'lib/features/classify/equip_result_screen.dart',
          lang: 'dart',
          code: `import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../data/repositories/classify_repository.dart';
import '../../shared/widgets/loading_error_view.dart';
import '../../shared/widgets/recommendation_card.dart';
import '../../shared/widgets/screen_back_button.dart';

/// \`/scan/equipment-result\` — label Gemini + daftar rekomendasi vertikal.
/// Tap kartu → \`/exercise/detail\`.
class EquipResultScreen extends ConsumerWidget {
  const EquipResultScreen({super.key, required this.imagePath});

  final String imagePath;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final result = ref.watch(equipResultProvider(imagePath));

    return Scaffold(
      backgroundColor: AppColors.black,
      body: Stack(
        children: [
          result.when(
            loading: () => const LoadingView(),
            error: (error, _) => FailedView(
              message: '\${AppStrings.failedMessage}\\n$error',
              onRetry: () => ref.invalidate(equipResultProvider(imagePath)),
            ),
            data: (state) => SingleChildScrollView(
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(32, 32, 32, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Center(
                        child: Text(
                          AppStrings.classificationResult,
                          style: TextStyle(
                            color: AppColors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.file(
                              File(imagePath),
                              width: 100,
                              height: 160,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  AppStrings.classifiedAs,
                                  style: TextStyle(
                                    color: AppColors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  state.predictionText,
                                  style: const TextStyle(
                                    color: AppColors.white,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  AppStrings.musclePart,
                                  style: TextStyle(
                                    color: AppColors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  AppStrings.musclePartValue,
                                  style: TextStyle(
                                    color: AppColors.white,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      const Center(
                        child: Text(
                          AppStrings.exerciseRecommendation,
                          style: TextStyle(
                            color: AppColors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      if (state.listError && state.exercises.isEmpty)
                        FailedView(
                          message: AppStrings.failedMessage,
                          onRetry: () => ref.invalidate(
                            equipResultProvider(imagePath),
                          ),
                        )
                      else
                        ...state.exercises.map(
                        (exercise) => RecommendationCard(
                          exercise: exercise,
                          onTap: () => context.push(
                            '/exercise/detail',
                            extra: exercise,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
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
        ],
      ),
    );
  }
}`,
        },
        {
          file: 'lib/features/classify/food_result_screen.dart',
          lang: 'dart',
          code: `import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../shared/widgets/screen_back_button.dart';
import '../../data/datasources/food_classifier.dart';
import '../../data/models/food_result.dart';
import '../../data/repositories/classify_repository.dart';
import '../../shared/widgets/loading_error_view.dart';

/// \`/scan/food-result\` from \`ClassifyFoodActivity.kt\` +
/// \`activity_classify_food.xml\`, visual spec
/// \`Food Classification Result Menu.png\`. States: progress → success
/// (food name, calories, nutrition cards, \`Add +\` parity button) / failed +
/// retry (re-calls) / wrong-image (tap → back, \`finish()\` parity).
class FoodResultScreen extends ConsumerWidget {
  const FoodResultScreen({super.key, required this.imagePath});

  final String imagePath;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final result = ref.watch(foodResultProvider(imagePath));

    return Scaffold(
      backgroundColor: AppColors.black,
      body: Stack(
        children: [
          result.when(
        loading: () => const LoadingView(),
        error: (error, _) => FailedView(
          message: AppStrings.failedMessage,
          onRetry: () => ref.invalidate(foodResultProvider(imagePath)),
        ),
        data: (outcome) => switch (outcome) {
          FoodSuccess(:final result) => _SuccessBody(
              imagePath: imagePath,
              result: result,
            ),
          FoodFailed(:final message) => FailedView(
              message: message,
              onRetry: () => ref.invalidate(foodResultProvider(imagePath)),
            ),
          FoodWrongImage(:final message) => WrongImageView(
              message: message,
              onBack: () => context.pop(),
            ),
        },
      ),
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

class _SuccessBody extends StatelessWidget {
  const _SuccessBody({required this.imagePath, required this.result});

  final String imagePath;
  final FoodResult result;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Center(
                child: Text(
                  AppStrings.classificationResult,
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.file(
                      File(imagePath),
                      width: 100,
                      height: 160,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(width: 32),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          AppStrings.classifiedAs,
                          style: TextStyle(
                            color: AppColors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          result.foodName,
                          style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          AppStrings.caloriesLabel(result.totalCalories),
                          style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 56,
                // Parity: \`button_add\` has no listener in
                // \`ClassifyFoodActivity.kt\`.
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text(AppStrings.addButton),
                ),
              ),
              const SizedBox(height: 16),
              const Center(
                child: Text(
                  AppStrings.nutritionInformation,
                  style: TextStyle(
                    color: AppColors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ...result.items.map(_FoodItemCard.new),
            ],
          ),
        ),
      ),
    );
  }
}

class _FoodItemCard extends StatelessWidget {
  const _FoodItemCard(this.item);

  final FoodItem item;

  @override
  Widget build(BuildContext context) {
    final nutrients = item.nutrients;
    final rows = <String>[
      'Estimated Calories: \${item.estimatedCalories}',
      'Portion Size: \${item.portionSize}',
      'Carbohydrates: \${nutrients.carbohydrates}',
      'Protein: \${nutrients.protein}',
      'Vitamins: \${nutrients.vitamins}',
      'Minerals: \${nutrients.minerals}',
      'Fats: \${nutrients.fats}',
    ];
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.semiBlack,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Item: \${item.name}',
            style: const TextStyle(
              color: AppColors.yellowMenu,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          ...rows.map(
            (row) => Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Text(
                row,
                style: const TextStyle(
                  color: AppColors.white,
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
      catatan:
        'File food lengkap ada di repo (224 baris, pola identik dengan equip di atas).',
    },
    {
      id: 'muscle',
      judul: 'Muscle map + SVG + detail otot',
      tujuan:
        'Convert muscle_front*.xml jadi SVG (jangan dicopy!), tampilkan siluet + overlay kuning + hotspot tap per otot.',
      pngHasil: ['img/muscle-map-front-screen.png', 'img/muscle-personalize.png'],
      asetDipakai: [],
      kerangka: 'AspectRatio(673/1200) > Stack[SVG dasar, SVG overlay?, hotspot GestureDetector] + tombol Back',
      bedah: [
        { widget: 'SvgPicture.asset', fungsi: 'Gambar vektor siluet + sorotan kuning', bagianPng: 'Gambar badan' },
        { widget: 'Positioned + GestureDetector', fungsi: 'Area sentuh tak terlihat per otot', bagianPng: 'Tiap otot' },
        { widget: 'MuscleArgs (extra)', fungsi: 'Kirim kunci + nama otot ke detail', bagianPng: '— (navigasi)' },
      ],
      kode: [
        {
          file: 'convert_muscles.py (jalankan sekali, di luar proyek)',
          lang: 'python',
          code: `import glob
import os
import xml.etree.ElementTree as ET

NS = "http://schemas.android.com/apk/res/android"
COLORS = {"@color/white": "#FFFFFF", "@color/yellow_menu": "#F2C94C"}
SRC = "Fitpedia/assets"
DST = "fitpedia_flutter/assets/muscles"

os.makedirs(DST, exist_ok=True)
for f in sorted(glob.glob(SRC + "/muscle_front*.xml")):
    root = ET.parse(f).getroot()
    w = root.get("{%s}width" % NS).replace("dp", "")
    h = root.get("{%s}height" % NS).replace("dp", "")
    vw = root.get("{%s}viewportWidth" % NS)
    vh = root.get("{%s}viewportHeight" % NS)
    paths = []
    for p in root:
        if p.tag != "path":
            continue
        d = p.get("{%s}pathData" % NS)
        c = COLORS.get(p.get("{%s}fillColor" % NS), "#FFFFFF")
        paths.append('<path d="%s" fill="%s"/>' % (d, c))
    name = os.path.basename(f).replace(".xml", ".svg")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        'width="%s" height="%s" viewBox="0 0 %s %s">%s</svg>'
        % (w, h, vw, vh, "".join(paths))
    )
    open(os.path.join(DST, name), "w").write(svg)
    print(name, len(paths), "paths")`,
        },
        {
          file: 'lib/features/muscle/muscle_args.dart',
          lang: 'dart',
          code: `/// Route args replacing the \`muscle\` / \`muscle-text\` extras
/// (\`MuscleMapActivity.kt:22-83\`, \`MuscleDetailActivity.kt:30-31\`).
class MuscleArgs {
  const MuscleArgs({required this.muscle, required this.muscleText});

  final String muscle;
  final String muscleText;
}`,
        },
        {
          file: 'lib/features/muscle/muscle_detail_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../data/repositories/exercise_repository.dart';
import '../../shared/widgets/loading_error_view.dart';
import '../../shared/widgets/recommendation_card.dart';
import 'muscle_args.dart';

/// \`/muscle/detail\` — judul "Exercise List for <Otot>", daftar
/// \`?muscle\`, gagal + retry, tap → \`/exercise/detail\`.
class MuscleDetailScreen extends ConsumerWidget {
  const MuscleDetailScreen({super.key, required this.args});

  final MuscleArgs args;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final exercises = ref.watch(muscleExercisesProvider(args.muscle));

    return Scaffold(
      backgroundColor: AppColors.black,
      appBar: AppBar(
        title: Text(AppStrings.exerciseListFor(args.muscleText)),
        centerTitle: true,
      ),
      body: exercises.when(
        loading: () => const LoadingView(),
        error: (error, _) => FailedView(
          message: AppStrings.failedMessage,
          onRetry: () =>
              ref.invalidate(muscleExercisesProvider(args.muscle)),
        ),
        data: (items) => ListView.builder(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
          itemCount: items.length,
          itemBuilder: (context, index) => RecommendationCard(
            exercise: items[index],
            onTap: () => context.push(
              '/exercise/detail',
              extra: items[index],
            ),
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
      id: 'muscle-map',
      judul: 'lib/features/muscle/muscle_map_screen.dart — peta + hotspot',
      tujuan:
        'Siluet SVG + overlay kuning + hotspot tap per otot → detail otot.',
      pngHasil: ['img/muscle-map-front-screen.png'],
      asetDipakai: [],
      kerangka: 'AspectRatio(673/1200) > Stack[SVG dasar, overlay?, hotspot] + tombol Back',
      bedah: [
        { widget: 'SvgPicture.asset', fungsi: 'Siluet + sorotan kuning dari SVG', bagianPng: 'Gambar badan' },
        { widget: 'Positioned + GestureDetector', fungsi: 'Area sentuh tak terlihat per kunci otot', bagianPng: 'Tiap otot' },
      ],
      kode: [
        {
          file: 'lib/features/muscle/muscle_map_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/constants/api_constants.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../shared/widgets/screen_back_button.dart';
import 'muscle_args.dart';

/// \`/muscle-map\` from \`MuscleMapActivity.kt\` + \`activity_muscle_map.xml\`,
/// visual spec \`Muscle Map Front Screen.png\`. Base silhouette +
/// per-muscle yellow overlays converted from \`muscle_front*.xml\` vectors to
/// \`assets/muscles/*.svg\` (XML never copied). Hotspots are positioned
/// \`GestureDetector\`s per muscle key (\`calves … abdominals\`,
/// \`ApiConstants.muscleKeys\`); the touch-flash highlight of
/// \`CustomImageView.kt:26-43\` becomes a persistent selection overlay.
/// Tap → toast + \`/muscle/detail\`; back button → stub toast (\`:85-87\`).
class MuscleMapScreen extends StatefulWidget {
  const MuscleMapScreen({super.key});

  @override
  State<MuscleMapScreen> createState() => _MuscleMapScreenState();
}

class _MuscleMapScreenState extends State<MuscleMapScreen> {
  String? _selected;

  static const Map<String, String> _labels = <String, String>{
    'calves': 'Calves',
    'quads': 'Quads',
    'chest': 'Chest',
    'traps': 'Traps',
    'shoulders': 'Shoulders',
    'biceps': 'Biceps',
    'forearms': 'Forearms',
    'obliques': 'Obliques',
    'abdominals': 'Abdominals',
  };

  /// Fractional hit rects (x, y, w, h in 0..1 of the body box),
  /// approximating front-body anatomy on the 673×1200 canvas.
  static const Map<String, List<List<double>>> _hotspots =
      <String, List<List<double>>>{
    'traps': [
      [0.40, 0.10, 0.20, 0.07],
    ],
    'shoulders': [
      [0.14, 0.14, 0.16, 0.10],
      [0.70, 0.14, 0.16, 0.10],
    ],
    'chest': [
      [0.30, 0.18, 0.40, 0.12],
    ],
    'biceps': [
      [0.10, 0.25, 0.14, 0.13],
      [0.76, 0.25, 0.14, 0.13],
    ],
    'forearms': [
      [0.05, 0.39, 0.12, 0.15],
      [0.83, 0.39, 0.12, 0.15],
    ],
    'obliques': [
      [0.28, 0.30, 0.08, 0.14],
      [0.64, 0.30, 0.08, 0.14],
    ],
    'abdominals': [
      [0.37, 0.30, 0.26, 0.16],
    ],
    'quads': [
      [0.30, 0.52, 0.18, 0.21],
      [0.52, 0.52, 0.18, 0.21],
    ],
    'calves': [
      [0.31, 0.76, 0.16, 0.17],
      [0.53, 0.76, 0.16, 0.17],
    ],
  };

  void _onTap(String key) {
    setState(() => _selected = key);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(key)),
    );
    context.push(
      '/muscle/detail',
      extra: MuscleArgs(muscle: key, muscleText: _labels[key]!),
    );
  }

  @override
  Widget build(BuildContext context) {
    assert(
      _labels.keys.toSet().containsAll(ApiConstants.muscleKeys),
      'hotspot keys must match MuscleMapActivity.kt:21-83',
    );
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 32, 16, 24),
          child: Column(
            children: [
              const Row(
                children: [
                  ScreenBackButton(),
                  Expanded(
                    child: Text(
                      AppStrings.muscleMapPrompt,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppColors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: Center(
                  child: AspectRatio(
                    aspectRatio: 673 / 1200,
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        final w = constraints.maxWidth;
                        final h = constraints.maxHeight;
                        return Stack(
                          children: [
                            SvgPicture.asset(
                              AppAssets.muscleFront,
                              width: w,
                              height: h,
                              fit: BoxFit.contain,
                            ),
                            if (_selected != null)
                              SvgPicture.asset(
                                AppAssets.muscleOverlay(_selected!),
                                width: w,
                                height: h,
                                fit: BoxFit.contain,
                              ),
                            for (final entry in _hotspots.entries)
                              for (final r in entry.value)
                                Positioned(
                                  left: r[0] * w,
                                  top: r[1] * h,
                                  width: r[2] * w,
                                  height: r[3] * h,
                                  child: GestureDetector(
                                    behavior: HitTestBehavior.translucent,
                                    onTap: () => _onTap(entry.key),
                                  ),
                                ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(AppStrings.backMuscleMapStub),
                    ),
                  ),
                  child: const Text(AppStrings.backMuscle),
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
      ],
    },
    {
      id: 'survey',
      judul: 'lib/features/survey/survey_screen.dart — survei 5 langkah',
      tujuan:
        'Alur PNG-only: progress 5 segmen, pilihan tunggal/ganda, roda angka cm/in dan kg/lbs. Selesai → /register.',
      pngHasil: [
        'img/fitness-survey-menu-1.png',
        'img/fitness-survey-menu-2.png',
        'img/fitness-survey-menu-3.png',
        'img/fitness-survey-menu-4.png',
        'img/fitness-survey-menu-5.png',
      ],
      asetDipakai: [],
      kerangka: 'Column[header + back, progress(5), body(step), tombol Lanjutkan]',
      bedah: [
        { widget: 'ListWheelScrollView', fungsi: 'Roda angka tinggi/berat + toggle satuan', bagianPng: 'Survey 3-4' },
        { widget: '_OptionCard + Set<int>', fungsi: 'Kartu radio, tunggal vs banyak', bagianPng: 'Survey 1-2, 5' },
      ],
      kode: [
        {
          file: 'lib/features/survey/survey_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';

/// \`/survey\` — PNG-only flow, no Android source
/// (\`Fitpedia Prototype UI/Fitness Survey Menu 1-5.png\`,
/// \`docs/03-SCREEN_MAP.md #20\`): 5 steps with segmented progress,
/// single/multi choice cards, unit toggles + wheel pickers.
/// Completing step 5 routes to \`/register\`.
class SurveyScreen extends StatefulWidget {
  const SurveyScreen({super.key});

  @override
  State<SurveyScreen> createState() => _SurveyScreenState();
}

class _SurveyScreenState extends State<SurveyScreen> {
  int _step = 0;
  final Set<int> _single = {0};
  final Set<int> _multi = {1, 2};
  bool _heightCm = true;
  bool _weightKg = false;
  int _height = 170;
  int _weight = 132;

  static const List<_Option> _levels = <_Option>[
    _Option('Newbie', 'Saya belum pernah berlatih sebelumnya'),
    _Option('Beginner', 'Beberapa pengalaman'),
    _Option('Intermediate', 'Sedang konsisten berlatih'),
    _Option('Advanced', 'Sangat berpengalaman berlatih'),
  ];
  static const List<_Option> _goals = <_Option>[
    _Option('Membangun kekuatan',
        'Menjadi lebih kuat dan melakukan latihan dengan lebih mudah'),
    _Option('Membangun otot',
        'Tingkatkan volume dan kesulitan untuk memastikan pertumbuhan otot'),
    _Option('Menurunkan lemak',
        'Dioptimalkan untuk pembakaran lemak dengan intensitas latihan tinggi'),
    _Option('Pelajari teknik',
        'Menguasai keterampilan dasar hingga mahir'),
  ];
  static const List<String> _pullups = <String>[
    '<10',
    '10-30',
    '30-50',
    '>50',
  ];

  void _next() {
    if (_step < 4) {
      setState(() => _step++);
    } else {
      context.go('/register');
    }
  }

  void _back() {
    if (_step > 0) {
      setState(() => _step--);
    } else {
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
          child: Column(
            children: [
              Row(
                children: [
                  IconButton(
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: AppColors.white,
                    ),
                    onPressed: _back,
                  ),
                  const Expanded(
                    child: Text(
                      AppStrings.createAccount,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppColors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                children: List.generate(
                  5,
                  (i) => Expanded(
                    child: Container(
                      height: 6,
                      margin: EdgeInsets.only(
                        right: i == 4 ? 0 : 4,
                      ),
                      decoration: BoxDecoration(
                        color: i <= _step
                            ? AppColors.yellowMenu
                            : AppColors.white,
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 48),
              Expanded(child: _stepBody()),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _next,
                  child: Text(
                    _step == 4
                        ? AppStrings.getRecommendation
                        : AppStrings.lanjutkan,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _stepBody() {
    switch (_step) {
      case 0:
        return _ChoiceStep(
          title: AppStrings.surveyStep1Title,
          subtitle: null,
          options: _levels,
          selected: _single,
          multi: false,
          onSelect: (i) => setState(() {
            _single
              ..clear()
              ..add(i);
          }),
        );
      case 1:
        return _ChoiceStep(
          title: AppStrings.surveyStep2Title,
          subtitle: AppStrings.surveyStep2Subtitle,
          options: _goals,
          selected: _multi,
          multi: true,
          onSelect: (i) => setState(() {
            if (_multi.contains(i)) {
              _multi.remove(i);
            } else {
              _multi.add(i);
            }
          }),
        );
      case 2:
        return _WheelStep(
          title: AppStrings.surveyStep3Title,
          leftUnit: 'cm',
          rightUnit: 'in',
          leftSelected: _heightCm,
          onUnit: (left) => setState(() => _heightCm = left),
          min: 140,
          max: 210,
          value: _height,
          onChanged: (v) => setState(() => _height = v),
        );
      case 3:
        return _WheelStep(
          title: AppStrings.surveyStep4Title,
          leftUnit: 'kg',
          rightUnit: 'lbs',
          leftSelected: !_weightKg,
          onUnit: (left) => setState(() => _weightKg = !left),
          min: 40,
          max: 200,
          value: _weight,
          onChanged: (v) => setState(() => _weight = v),
        );
      default:
        return _ChoiceStep(
          title: AppStrings.surveyStep5Title,
          subtitle: AppStrings.surveyStep5Subtitle,
          options: _pullups.map(_Option.text).toList(),
          selected: _single,
          multi: false,
          onSelect: (i) => setState(() {
            _single
              ..clear()
              ..add(i);
          }),
        );
    }
  }
}

class _Option {
  const _Option(this.title, [this.subtitle = '']);

  const _Option.text(this.title) : subtitle = '';

  final String title;
  final String subtitle;
}

class _ChoiceStep extends StatelessWidget {
  const _ChoiceStep({
    required this.title,
    required this.subtitle,
    required this.options,
    required this.selected,
    required this.multi,
    required this.onSelect,
  });

  final String title;
  final String? subtitle;
  final List<_Option> options;
  final Set<int> selected;
  final bool multi;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.yellowMenu,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 12),
            Text(
              subtitle!,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: AppColors.white,
                fontSize: 18,
              ),
            ),
          ],
          const SizedBox(height: 24),
          for (var i = 0; i < options.length; i++)
            _OptionCard(
              option: options[i],
              selected: selected.contains(i),
              onTap: () => onSelect(i),
            ),
        ],
      ),
    );
  }
}

class _OptionCard extends StatelessWidget {
  const _OptionCard({
    required this.option,
    required this.selected,
    required this.onTap,
  });

  final _Option option;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final border =
        selected ? AppColors.yellowMenu : AppColors.white;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          border: Border.all(color: border, width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    option.title,
                    style: const TextStyle(
                      color: AppColors.yellowMenu,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (option.subtitle.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      option.subtitle,
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: border, width: 2),
                color: selected ? border : Colors.transparent,
              ),
              child: selected
                  ? Container(
                      margin: const EdgeInsets.all(5),
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.black,
                      ),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

class _WheelStep extends StatelessWidget {
  const _WheelStep({
    required this.title,
    required this.leftUnit,
    required this.rightUnit,
    required this.leftSelected,
    required this.onUnit,
    required this.min,
    required this.max,
    required this.value,
    required this.onChanged,
  });

  final String title;
  final String leftUnit;
  final String rightUnit;
  final bool leftSelected;
  final ValueChanged<bool> onUnit;
  final int min;
  final int max;
  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    Widget unitButton(String label, bool active, VoidCallback onTap) {
      return GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          decoration: BoxDecoration(
            color: active ? AppColors.yellowMenu : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: active ? AppColors.black : AppColors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      );
    }

    return Column(
      children: [
        Text(
          title,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: AppColors.yellowMenu,
            fontSize: 32,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            unitButton(leftUnit, leftSelected, () => onUnit(true)),
            const SizedBox(width: 16),
            unitButton(rightUnit, !leftSelected, () => onUnit(false)),
          ],
        ),
        const SizedBox(height: 32),
        Expanded(
          child: ListWheelScrollView.useDelegate(
            itemExtent: 56,
            perspective: 0.005,
            physics: const FixedExtentScrollPhysics(),
            controller: FixedExtentScrollController(
              initialItem: value - min,
            ),
            onSelectedItemChanged: (i) => onChanged(min + i),
            childDelegate: ListWheelChildBuilderDelegate(
              childCount: max - min + 1,
              builder: (context, i) {
                final v = min + i;
                final active = v == value;
                return Container(
                  alignment: Alignment.center,
                  decoration: active
                      ? BoxDecoration(
                          color: AppColors.bgWindow,
                          borderRadius: BorderRadius.circular(12),
                        )
                      : null,
                  child: Text(
                    '$v',
                    style: TextStyle(
                      color: active
                          ? AppColors.white
                          : AppColors.greyMenu,
                      fontSize: active ? 28 : 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                );
              },
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
      id: 'subscribe',
      judul: 'lib/features/subscribe/subscribe_screen.dart — langganan',
      tujuan:
        'Toggle Monthly/Annual + 2 kartu plan + tombol stub (tidak ada backend).',
      pngHasil: ['img/subscribe-menu.png'],
      asetDipakai: [],
      kerangka: 'Column[judul, toggle, kartu, kartu, Spacer, tombol]',
      kode: [
        {
          file: 'lib/features/subscribe/subscribe_screen.dart',
          lang: 'dart',
          code: `import 'package:flutter/material.dart';

import '../../core/constants/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../shared/widgets/screen_back_button.dart';

/// \`/subscribe\` — PNG-only, no Android source
/// (\`Fitpedia Prototype UI/Subscribe Menu.png\`,
/// \`docs/03-SCREEN_MAP.md #20\`). Billing toggle + two plan cards;
/// subscribe action is a stub toast (no backend).
class SubscribeScreen extends StatefulWidget {
  const SubscribeScreen({super.key});

  @override
  State<SubscribeScreen> createState() => _SubscribeScreenState();
}

class _SubscribeScreenState extends State<SubscribeScreen> {
  bool _monthly = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 48, 24, 24),
          child: Column(
            children: [
              Row(
                children: [
                  const ScreenBackButton(),
                  const Expanded(
                    child: Text(
                      AppStrings.subscribeTitle,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppColors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                AppStrings.subscribeSubtitle,
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.white, fontSize: 14),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _BillingTab(
                    label: AppStrings.monthly,
                    active: _monthly,
                    onTap: () => setState(() => _monthly = true),
                  ),
                  const SizedBox(width: 24),
                  _BillingTab(
                    label: AppStrings.annually,
                    active: !_monthly,
                    onTap: () => setState(() => _monthly = false),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const _PlanCard(
                plan: '1 MONTH SUPER',
                price: 'IDR 80k',
                per: '/Month',
                tier: 'Monthly Starter',
                perks: <String>[
                  'Unlimited trainer consultation',
                  'Extra Muscle Features',
                  'Extra Exercises Articles',
                ],
              ),
              const SizedBox(height: 16),
              const _PlanCard(
                plan: '12 MONTH SUPER',
                price: 'IDR 40k',
                per: '/Month',
                tier: 'Yearly Starter',
                perks: <String>[
                  'Unlimited trainer consultation',
                  'Extra Exercises Articles',
                  'No ads, just fun',
                ],
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: () =>
                      ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(AppStrings.subscribeStub),
                    ),
                  ),
                  icon: const Icon(Icons.star_outline),
                  label: const Text(AppStrings.tapToSubscribe),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BillingTab extends StatelessWidget {
  const _BillingTab({
    required this.label,
    required this.active,
    required this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 10),
        decoration: BoxDecoration(
          color: active ? AppColors.yellowMenu : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: active ? AppColors.black : AppColors.white,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  const _PlanCard({
    required this.plan,
    required this.price,
    required this.per,
    required this.tier,
    required this.perks,
  });

  final String plan;
  final String price;
  final String per;
  final String tier;
  final List<String> perks;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.greyMenu),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  plan,
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      price,
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      ' $per',
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  tier,
                  style: const TextStyle(
                    color: AppColors.yellowMenu,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'You Get',
                style: TextStyle(color: AppColors.white, fontSize: 12),
              ),
              const SizedBox(height: 4),
              for (final perk in perks)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.check,
                        color: AppColors.yellowMenu,
                        size: 14,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        perk,
                        style: const TextStyle(
                          color: AppColors.white,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
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
      id: 'widget-test',
      judul: 'test/widget_test.dart — tes pertama',
      tujuan:
        'Uji validators + model Exercise tanpa HP/server. Jalankan: flutter test.',
      pngHasil: [],
      asetDipakai: [],
      kode: [
        {
          file: 'test/widget_test.dart',
          lang: 'dart',
          code: `import 'package:fitpedia_flutter/core/constants/app_strings.dart';
import 'package:fitpedia_flutter/core/utils/validators.dart';
import 'package:fitpedia_flutter/data/models/exercise.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Validators', () {
    test('email empty + format', () {
      expect(Validators.email(''), AppStrings.emailEmpty);
      expect(Validators.email('not-an-email'), AppStrings.emailInvalid);
      expect(Validators.email('user@example.com'), isNull);
    });

    test('password empty + min 8', () {
      expect(Validators.password(''), AppStrings.passwordEmpty);
      expect(Validators.password('1234567'), AppStrings.passwordTooShort);
      expect(Validators.password('12345678'), isNull);
    });

    test('register confirm-match', () {
      expect(
        Validators.confirmPassword('12345678', '87654321'),
        AppStrings.confirmPasswordMismatch,
      );
      expect(Validators.confirmPassword('12345678', '12345678'), isNull);
    });
  });

  group('Exercise model', () {
    test('round-trips all 10 fields', () {
      final json = <String, dynamic>{
        'id': 1,
        'name': 'Bench Press',
        'type': 'strength',
        'muscle': 'chest',
        'equipment': 'bench-press',
        'difficulty': 'intermediate',
        'instructions': 'Press up.',
        'link': 'https://example.com',
        'picture': 'https://example.com/pic.png',
        'animation': 'https://example.com/anim.gif',
      };
      final exercise = Exercise.fromJson(json);
      expect(exercise.id, 1);
      expect(exercise.equipment, 'bench-press');
      expect(exercise.toJson(), json);
    });
  });
}`,
        },
      ],
      checkpoint: ['flutter analyze → No issues found!', 'flutter test → All tests passed!'],
    },
  ],
};
