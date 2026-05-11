package com.example.front_pi;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.example.api.LogResponse;
import com.example.api.PrescricaoResponse;

import java.util.ArrayList;
import java.util.List;

/**
 * Cache local SQLite — persiste exercícios e logs para funcionamento offline.
 * Requisito Entrega 2: "armazenar informações localmente utilizando SQLite"
 */
public class CacheLocal extends SQLiteOpenHelper {

    private static final String BANCO_NOME    = "maya_cache.db";
    private static final int    BANCO_VERSAO  = 1;

    private static final String TABELA_PLANO =
            "CREATE TABLE IF NOT EXISTS plano (" +
                    "prescription_id INTEGER PRIMARY KEY," +
                    "exercise_id INTEGER," +
                    "exercise_title TEXT," +
                    "exercise_description TEXT," +
                    "exercise_tags TEXT," +
                    "instructions TEXT," +
                    "frequency_per_week INTEGER," +
                    "active INTEGER)";

    private static final String TABELA_HISTORICO =
            "CREATE TABLE IF NOT EXISTS historico (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "exercise_title TEXT," +
                    "pain_level INTEGER," +
                    "observations TEXT," +
                    "executed_at TEXT)";

    public CacheLocal(Context context) {
        super(context, BANCO_NOME, null, BANCO_VERSAO);
    }

    @Override public void onCreate(SQLiteDatabase db) {
        db.execSQL(TABELA_PLANO);
        db.execSQL(TABELA_HISTORICO);
    }

    @Override public void onUpgrade(SQLiteDatabase db, int oldV, int newV) {
        db.execSQL("DROP TABLE IF EXISTS plano");
        db.execSQL("DROP TABLE IF EXISTS historico");
        onCreate(db);
    }

    /** Grava a lista de prescrições no cache local */
    public void gravarPlano(List<PrescricaoResponse> lista) {
        SQLiteDatabase db = getWritableDatabase();
        db.execSQL("DELETE FROM plano");
        for (PrescricaoResponse p : lista) {
            ContentValues v = new ContentValues();
            v.put("prescription_id",      p.getPrescriptionId());
            v.put("exercise_id",          p.getExerciseId());
            v.put("exercise_title",       p.getExerciseTitle());
            v.put("exercise_description", p.getExerciseDescription());
            v.put("exercise_tags",        p.getExerciseTags());
            v.put("instructions",         p.getInstructions());
            v.put("frequency_per_week",   p.getFrequencyPerWeek());
            v.put("active",               p.isActive() ? 1 : 0);
            db.replace("plano", null, v);
        }
    }

    /** Lê os exercícios ativos do cache local */
    public List<PrescricaoResponse> lerPlano() {
        List<PrescricaoResponse> lista = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT * FROM plano WHERE active = 1", null);
        while (c.moveToNext()) {
            PrescricaoResponse p = new PrescricaoResponse();
            p.setPrescriptionId(c.getInt(c.getColumnIndexOrThrow("prescription_id")));
            p.setExerciseId(c.getInt(c.getColumnIndexOrThrow("exercise_id")));
            p.setExerciseTitle(c.getString(c.getColumnIndexOrThrow("exercise_title")));
            p.setExerciseDescription(c.getString(c.getColumnIndexOrThrow("exercise_description")));
            p.setExerciseTags(c.getString(c.getColumnIndexOrThrow("exercise_tags")));
            p.setInstructions(c.getString(c.getColumnIndexOrThrow("instructions")));
            p.setFrequencyPerWeek(c.getInt(c.getColumnIndexOrThrow("frequency_per_week")));
            p.setActive(c.getInt(c.getColumnIndexOrThrow("active")) == 1);
            lista.add(p);
        }
        c.close();
        return lista;
    }

    /** Grava uma execução de exercício localmente */
    public void gravarExecucao(String titulo, int dor, String obs) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues v = new ContentValues();
        v.put("exercise_title", titulo);
        v.put("pain_level",     dor);
        v.put("observations",   obs);
        v.put("executed_at",    new java.util.Date().toString());
        db.insert("historico", null, v);
    }
}
