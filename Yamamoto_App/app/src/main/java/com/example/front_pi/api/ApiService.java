package com.example.front_pi.api;

import com.example.front_pi.api.PrescricaoResponse;
import com.example.front_pi.api.LogResponse;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.*;

public interface ApiService {

    @POST("auth/login")
    Call<LoginResponse> login(@Body LoginRequest body);

    @POST("auth/register")
    Call<RegisterResponse> register(@Body RegisterRequest body);

    @GET("prescriptions/patient/{patientId}")
    Call<List<PrescricaoResponse>> getPlano(
            @Path("patientId") int patientId,
            @Header("Authorization") String token
    );

    @POST("logs")
    Call<Void> salvarLog(
            @Body LogRequest body,
            @Header("Authorization") String token
    );

    @GET("logs/patient/{patientId}")
    Call<List<LogResponse>> getHistorico(
            @Path("patientId") int patientId,
            @Header("Authorization") String token
    );
}