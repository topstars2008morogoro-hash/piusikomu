export interface TechStackItem {
  layer: string;
  technology: string;
  alternative: string;
  verdict_and_reason: string;
  verdict_sw: string;
}

export const TECH_STACK_RECOMMENDATIONS: TechStackItem[] = [
  {
    layer: 'Programming Language & Platform',
    technology: 'Kotlin + Jetpack Compose (Modern Android Native)',
    alternative: 'Flutter (Dart) au React Native',
    verdict_and_reason: 'Recommended: Kotlin + Jetpack Compose. Native architecture offers superior memory efficiency, 60fps rendering on budget Android devices common in Morogoro (Tecno, Infinix, Samsung Galaxy A series), zero bridge overhead, and direct access to Android Background WorkManager for background offline sync.',
    verdict_sw: 'Inapendekezwa: Kotlin na Jetpack Compose. Inafaa sana kwa simu nyingi za bajeti nchini Tanzania (Tecno, Infinix, Samsung A-series) kwa sababu hailemei RAM, inafanya kazi haraka sana bila intaneti, na ina mfumo imara wa Background Sync (WorkManager).'
  },
  {
    layer: 'Local Device Database (Offline Mode)',
    technology: 'Android Room Persistence Library (SQLite with WAL)',
    alternative: 'Realm DB au SQLiteOpenHelper',
    verdict_and_reason: 'Recommended: Room DB. Room provides compile-time verification of SQL queries, reactive Flow/LiveData streams, seamless migration support, and native integration with Android Paging3 and WorkManager.',
    verdict_sw: 'Inapendekezwa: Room Database. Huwezesha walimu kuingiza mahudhurio na alama wakiwa darasani bila intaneti. Data inahifadhiwa kwenye simu na kuhamishiwa kwenye seva pindi mtandao wa Wi-Fi au 4G ukiwaka.'
  },
  {
    layer: 'Cloud Database & Backend Server',
    technology: 'PostgreSQL 15+ & Node.js / Kotlin Ktor or Go Backend API',
    alternative: 'MySQL 8.0 au Firebase Firestore Pekee',
    verdict_and_reason: 'Recommended: PostgreSQL for cloud storage. Outstanding relational integrity, JSONB support for flexible fee structures, robust transactions for financial auditing, and easy indexing.',
    verdict_sw: 'Inapendekezwa: PostgreSQL kwenye Seva ya Mtandaoni. Ni imara zaidi kwa mifumo ya fedha za ada (TZS), usalama wa taarifa za wanafunzi, na kuzuia makosa ya kuingiliana kwa data (Data Integrity).'
  },
  {
    layer: 'Background Sync Engine',
    technology: 'Android WorkManager with Exponential Backoff',
    alternative: 'AlarmManager au Custom Background Service',
    verdict_and_reason: 'Recommended: Android WorkManager. Ensures guaranteed background execution even if the teacher restarts the phone or closes the app. Manages battery constraints and triggers sync automatically when network connectivity is restored.',
    verdict_sw: 'Inapendekezwa: Android WorkManager. Huhakikisha kuwa taarifa zote zilizojazwa darasani zitatumwa kwenye seva kiotomatiki mara tu simu inapopata mtandao, hata kama mwalimu alishazima app.'
  },
  {
    layer: 'Push Notifications & Alerts',
    technology: 'Firebase Cloud Messaging (FCM) + Tanzania SMS Gateway (Beem Africa / Twilio)',
    alternative: 'OneSignal pekee',
    verdict_and_reason: 'Recommended: Hybrid FCM + SMS. For active internet parents, FCM delivers instantaneous free push notifications. For parents who do not have an active data bundle or smartphone access in rural/peri-urban Morogoro, system triggers fallback transactional SMS via Tanzania SMS gateway.',
    verdict_sw: 'Inapendekezwa: Mchanganyiko wa Firebase (FCM) na SMS za Kawaida (Beem Africa). Wazazi wenye intaneti wanapata Notification ya bure, lakini kama mzazi hana bando la intaneti simuni, mfumo unatuma SMS ya kawaida ya ujumbe wa ada au mahudhurio ya mtoto.'
  },
  {
    layer: 'Network & API Client',
    technology: 'Retrofit 2 + OkHttp 4 + Kotlinx Serialization',
    alternative: 'Ktor Client au Volley',
    verdict_and_reason: 'Recommended: Retrofit + OkHttp. Includes built-in HTTP caching, offline cache interceptors, auth token refresh interceptors, and automatic retry on unstable 3G/4G cellular connections.',
    verdict_sw: 'Inapendekezwa: Retrofit 2 na OkHttp. Ina uwezo wa kukariri data (Cache) na kujaribu tena kutuma maombi kiotomatiki mtandao ukikatika katikati ya muamala.'
  }
];

export const KOTLIN_CODE_SNIPPETS = {
  roomEntity: `// ============================================================================
// Android Room Entity: AttendanceEntity.kt
// Top Stars Nursery and Primary School - Morogoro
// ============================================================================
package tz.ac.topstarsschool.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Index
import java.util.UUID

@Entity(
    tableName = "local_attendances",
    indices = [
        Index(value = ["studentId", "date"], unique = true),
        Index(value = ["classId", "date"]),
        Index(value = ["isSynced"])
    ]
)
data class AttendanceEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val studentId: String,
    val studentName: String,
    val classId: String,
    val date: String,              // Format: "YYYY-MM-DD"
    val status: String,            // "present", "absent", "excused", "sick"
    val remarks: String? = null,
    val recordedByStaffId: String,
    val isSynced: Boolean = false, // false when taken offline in Morogoro classroom
    val updatedAtTimestamp: Long = System.currentTimeMillis()
)`,

  roomDao: `// ============================================================================
// Android Room DAO: AttendanceDao.kt
// ============================================================================
package tz.ac.topstarsschool.data.local.dao

import androidx.room.*
import kotlinx.coroutines.flow.Flow
import tz.ac.topstarsschool.data.local.entity.AttendanceEntity

@Dao
interface AttendanceDao {
    @Query("SELECT * FROM local_attendances WHERE classId = :classId AND date = :date")
    fun getAttendanceForClass(classId: String, date: String): Flow<List<AttendanceEntity>>

    @Query("SELECT * FROM local_attendances WHERE isSynced = 0")
    suspend fun getPendingSyncAttendances(): List<AttendanceEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateAttendance(attendance: AttendanceEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(attendances: List<AttendanceEntity>)

    @Query("UPDATE local_attendances SET isSynced = 1 WHERE id IN (:ids)")
    suspend fun markAsSynced(ids: List<String>)
}`,

  syncWorker: `// ============================================================================
// Android WorkManager: OfflineSyncWorker.kt
// Automatically runs when network connection is restored
// ============================================================================
package tz.ac.topstarsschool.sync

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import tz.ac.topstarsschool.data.repository.AttendanceRepository

class OfflineSyncWorker(
    appContext: Context,
    params: WorkerParameters,
    private val attendanceRepository: AttendanceRepository
) : CoroutineWorker(appContext, params) {

    override suspend fun doWork(): Result {
        return try {
            // 1. Fetch pending offline items from Room DB
            val syncResult = attendanceRepository.syncPendingAttendancesToCloud()
            
            if (syncResult.isSuccess) {
                Result.success()
            } else {
                // Retry with exponential backoff if server temporarily unreachable
                Result.retry()
            }
        } catch (e: Exception) {
            Result.retry()
        }
    }
}`
};
