require("dotenv").config();
const authService = require("./src/services/authService");
const { initDatabase, db } = require("./src/config/database");

async function runSeed() {
  try {
    await initDatabase();
    console.log("✅ Banco Inicializado.");

    const email = "contato@mayayamamoto.com.br";

    // 1. Criar ou Recuperar Usuário
    let user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE user_email = ?", [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!user) {
      console.log("⏳ Criando novo usuário...");
      await authService.register("Maya Yamamoto", email, "senha123", 1);
      user = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE user_email = ?", [email], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    }

    if (user) {
      console.log(`✅ Usuário ID ${user.user_id} pronto.`);
      
      // 2. Criar ou Atualizar Dados Médicos
      const doctor = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM doctors WHERE user_id = ?", [user.user_id], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      if (!doctor) {
        console.log("⏳ Vinculando dados em 'doctors'...");
        await new Promise((resolve, reject) => {
          db.run(`INSERT INTO doctors (user_id, doctor_crefito, doctor_specialty) VALUES (?, ?, ?)`, 
          [user.user_id, "123456-SP", "Fisioterapia Traumato-Ortopédica"], (err) => {
            if (err) reject(err);
            resolve();
          });
        });
        console.log("✅ Dados médicos vinculados.");
      } else {
        console.log("✅ Dados médicos já existiam.");
      }
    }

    console.log("\n🚀 SEED COMPLETO! Você já pode logar.");
    process.exit(0);

  } catch (error) {
    console.error("❌ ERRO NO SEED:", error);
    process.exit(1);
  }
}

runSeed();
