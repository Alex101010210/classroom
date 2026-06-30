-- Tabla de encuestas
CREATE TABLE IF NOT EXISTS encuestas (
    id           SERIAL PRIMARY KEY,
    clase_id     INTEGER NOT NULL REFERENCES clases(id),
    maestro_id   INTEGER NOT NULL REFERENCES usuarios(id),
    titulo       TEXT    NOT NULL,
    descripcion  TEXT,
    preguntas    TEXT    NOT NULL DEFAULT '[]',  -- JSON: [{ id, texto, tipo, opciones, respuesta_correcta, puntos }]
    activa       BOOLEAN NOT NULL DEFAULT TRUE,
    tiempo_limite INTEGER,                        -- minutos, NULL = sin límite
    fecha_inicio TIMESTAMPTZ,
    fecha_fin    TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de respuestas de alumnos
CREATE TABLE IF NOT EXISTS respuestas_encuestas (
    id               SERIAL PRIMARY KEY,
    poll_id          INTEGER NOT NULL REFERENCES encuestas(id),
    alumno_id        INTEGER NOT NULL REFERENCES usuarios(id),
    respuestas       TEXT    NOT NULL DEFAULT '[]',  -- JSON: [{ questionId, answer }]
    calificacion     REAL,
    calificacion_max REAL,
    porcentaje       REAL,
    submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (poll_id, alumno_id)   -- un alumno sólo puede responder una vez por encuesta
);
