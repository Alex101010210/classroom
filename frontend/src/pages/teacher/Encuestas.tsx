import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPlus,
  faTrash,
  faPollH,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { encuestaService } from '../../services/api';
import './Encuestas.css';

type QuestionType = 'multiple' | 'checkbox' | 'short';

interface Option {
  id: string;
  text: string;
}

interface PollQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  required: boolean;
}

const questionTypeLabels: Record<QuestionType, string> = {
  multiple: 'Opción múltiple',
  checkbox: 'Casillas de verificación',
  short: 'Respuesta corta',
};

const newOption = (): Option => ({ id: Date.now().toString() + Math.random(), text: '' });

const newQuestion = (): PollQuestion => ({
  id: Date.now().toString() + Math.random(),
  text: '',
  type: 'multiple',
  options: [
    { id: '1', text: 'Opción 1' },
    { id: '2', text: 'Opción 2' },
  ],
  required: false,
});

const Encuestas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = (location.state as any)?.subject;

  const [pollTitle, setPollTitle] = useState('Encuesta sin título');
  const [pollDesc, setPollDesc] = useState('');
  const [questions, setQuestions] = useState<PollQuestion[]>([newQuestion()]);

  /* ── question helpers ─────────────────────────── */
  const updateQ = (id: string, patch: Partial<PollQuestion>) =>
    setQuestions(qs => qs.map(q => (q.id === id ? { ...q, ...patch } : q)));

  const updateOpt = (qId: string, optId: string, text: string) =>
    setQuestions(qs =>
      qs.map(q =>
        q.id === qId
          ? { ...q, options: q.options.map(o => (o.id === optId ? { ...o, text } : o)) }
          : q
      )
    );

  const addOption = (qId: string) =>
    setQuestions(qs =>
      qs.map(q => (q.id === qId ? { ...q, options: [...q.options, newOption()] } : q))
    );

  const removeOption = (qId: string, optId: string) =>
    setQuestions(qs =>
      qs.map(q =>
        q.id === qId ? { ...q, options: q.options.filter(o => o.id !== optId) } : q
      )
    );

  const addQuestion = () => setQuestions(qs => [...qs, newQuestion()]);

  const removeQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(qs => qs.filter(q => q.id !== id));
  };

  /* ── save ─────────────────────────────────────── */
  const handleSave = async () => {
    if (!pollTitle.trim()) {
      alert('Por favor ingresa un título para la encuesta.');
      return;
    }
    if (!subject?.id) {
      alert('No se encontró la clase. Vuelve a entrar desde el detalle de la clase.');
      return;
    }
    try {
      await encuestaService.create({
        clase_id: subject.id,
        titulo: pollTitle,
        descripcion: pollDesc,
        preguntas: questions,
      });
      alert('Encuesta guardada exitosamente');
      navigate(-1);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar la encuesta');
    }
  };

  const hasOptions = (type: QuestionType) => type === 'multiple' || type === 'checkbox';

  /* ── render ───────────────────────────────────── */
  return (
    <div className="enc-page">

      {/* Top bar */}
      <header className="enc-topbar">
        <div className="enc-topbar-left">
          <button className="enc-icon-btn" onClick={() => navigate('/teacher/dashboard')} title="Volver">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <FontAwesomeIcon icon={faPollH} className="enc-topbar-icon" />
          <span className="enc-topbar-title">
            {subject?.nombre_class || subject?.name
              ? `Encuesta — ${subject.nombre_class || subject.name}`
              : 'Nueva Encuesta'}
          </span>
        </div>
        <button className="enc-save-btn" onClick={handleSave}>
          GUARDAR
        </button>
      </header>

      {/* Body */}
      <div className="enc-body">
        <div className="enc-center-col">

          {/* Title card */}
          <div className="enc-card enc-title-card">
            <input
              className="enc-title-input"
              value={pollTitle}
              onChange={e => setPollTitle(e.target.value)}
              placeholder="Título de la encuesta"
            />
            <input
              className="enc-desc-input"
              value={pollDesc}
              onChange={e => setPollDesc(e.target.value)}
              placeholder="Descripción (opcional)"
            />
          </div>

          {/* Question cards */}
          {questions.map((q, qi) => (
            <div key={q.id} className="enc-card enc-question-card">
              <div className="enc-q-header">
                <span className="enc-q-num">{qi + 1}.</span>
                <input
                  className="enc-q-text-input"
                  value={q.text}
                  onChange={e => updateQ(q.id, { text: e.target.value })}
                  placeholder="Escribe la pregunta..."
                />
                <select
                  className="enc-q-type-select"
                  value={q.type}
                  onChange={e => updateQ(q.id, { type: e.target.value as QuestionType })}
                >
                  {(Object.keys(questionTypeLabels) as QuestionType[]).map(t => (
                    <option key={t} value={t}>{questionTypeLabels[t]}</option>
                  ))}
                </select>
              </div>

              {/* Options */}
              {hasOptions(q.type) && (
                <div className="enc-options">
                  {q.options.map((opt, oi) => (
                    <div key={opt.id} className="enc-option-row">
                      <span className="enc-option-bullet">
                        {q.type === 'checkbox' ? '☐' : '○'}
                      </span>
                      <input
                        className="enc-option-input"
                        value={opt.text}
                        onChange={e => updateOpt(q.id, opt.id, e.target.value)}
                        placeholder={`Opción ${oi + 1}`}
                      />
                      {q.options.length > 1 && (
                        <button
                          className="enc-opt-del"
                          onClick={() => removeOption(q.id, opt.id)}
                          title="Eliminar opción"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="enc-add-opt-btn" onClick={() => addOption(q.id)}>
                    <FontAwesomeIcon icon={faPlus} /> Añadir opción
                  </button>
                </div>
              )}

              {q.type === 'short' && (
                <div className="enc-short-preview">Respuesta de texto corto</div>
              )}

              {/* Footer */}
              <div className="enc-q-footer">
                <label className="enc-required-label">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={e => updateQ(q.id, { required: e.target.checked })}
                  />
                  Obligatorio
                </label>
                <button
                  className="enc-q-del-btn"
                  onClick={() => removeQuestion(q.id)}
                  title="Eliminar pregunta"
                  disabled={questions.length === 1}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}

          {/* Add question */}
          <button className="enc-add-question-btn" onClick={addQuestion}>
            <FontAwesomeIcon icon={faPlus} /> Agregar pregunta
          </button>
        </div>
      </div>

    </div>
  );
};

export default Encuestas;
