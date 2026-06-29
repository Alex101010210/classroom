import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faPalette, faEye,
  faPlus, faImage,
  faCopy, faTrash, faTimes
} from '@fortawesome/free-solid-svg-icons';
import './Examen.css';

type QuestionType = 'multiple' | 'checkbox' | 'short' | 'paragraph' | 'dropdown';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options: Option[];
  required: boolean;
  imageUrl?: string | null;
}

const questionTypeLabels: Record<QuestionType, string> = {
  multiple:  'Varias opciones',
  checkbox:  'Casillas de verificación',
  short:     'Respuesta corta',
  paragraph: 'Párrafo',
  dropdown:  'Desplegable',
};

const PALETTE_COLORS = [
  '#673ab7', '#9c27b0', '#e91e63', '#f44336',
  '#ff5722', '#ff9800', '#ffc107', '#4caf50',
  '#009688', '#2196f3', '#3f51b5', '#607d8b',
];

const newOption = (): Option => ({ id: Date.now().toString() + Math.random(), text: '' });

const newQuestion = (): Question => ({
  id: Date.now().toString() + Math.random(),
  title: '',
  type: 'multiple',
  options: [{ id: '1', text: 'Opción 1' }],
  required: false,
  imageUrl: null,
});

const Examen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = (location.state as any)?.subject;

  const [activeTab, setActiveTab]     = useState<'preguntas' | 'respuestas'>('preguntas');
  const [examTitle, setExamTitle]     = useState('Examen sin título');
  const [examDesc, setExamDesc]       = useState('');
  const [questions, setQuestions]     = useState<Question[]>([newQuestion()]);
  const [activeQId, setActiveQId]     = useState<string>(questions[0].id);
  const [accentColor, setAccentColor] = useState('#673ab7');
  const [showPalette, setShowPalette] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const imgInputRef = useRef<HTMLInputElement>(null);
  const [pendingImgQId, setPendingImgQId] = useState<string | null>(null);

  /* ── question helpers ──────────────────────────── */
  const updateQ = (id: string, patch: Partial<Question>) =>
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q));

  const updateOpt = (qId: string, optId: string, text: string) =>
    setQuestions(qs => qs.map(q =>
      q.id === qId ? { ...q, options: q.options.map(o => o.id === optId ? { ...o, text } : o) } : q
    ));

  const addOption = (qId: string) =>
    setQuestions(qs => qs.map(q =>
      q.id === qId ? { ...q, options: [...q.options, newOption()] } : q
    ));

  const removeOption = (qId: string, optId: string) =>
    setQuestions(qs => qs.map(q =>
      q.id === qId ? { ...q, options: q.options.filter(o => o.id !== optId) } : q
    ));

  const addQuestion = () => {
    const q = newQuestion();
    setQuestions(qs => [...qs, q]);
    setActiveQId(q.id);
  };

  const duplicateQuestion = (id: string) => {
    const src = questions.find(q => q.id === id);
    if (!src) return;
    const copy: Question = {
      ...src,
      id: Date.now().toString() + Math.random(),
      options: src.options.map(o => ({ ...o, id: Date.now().toString() + Math.random() })),
    };
    setQuestions(qs => {
      const idx = qs.findIndex(q => q.id === id);
      const next = [...qs];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setActiveQId(copy.id);
  };

  const deleteQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(qs => {
      const next = qs.filter(q => q.id !== id);
      setActiveQId(next[0].id);
      return next;
    });
  };

  /* ── image upload ──────────────────────────────── */
  const triggerImageUpload = (qId: string) => {
    setPendingImgQId(qId);
    imgInputRef.current?.click();
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingImgQId) return;
    const reader = new FileReader();
    reader.onload = ev => {
      updateQ(pendingImgQId, { imageUrl: ev.target?.result as string });
      setPendingImgQId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* ── send ──────────────────────────────────────── */
  const handleSend = () => {
    if (!examTitle.trim()) { alert('Por favor ingresa un título para el examen.'); return; }
    const data = {
      id: Date.now().toString(),
      claseId: subject?.id,
      claseNombre: subject?.nombre_class || subject?.name,
      titulo: examTitle,
      descripcion: examDesc,
      preguntas: questions,
      color: accentColor,
    };
    const saved = JSON.parse(localStorage.getItem('examenes') || '[]');
    saved.push(data);
    localStorage.setItem('examenes', JSON.stringify(saved));
    alert('Examen guardado exitosamente');
    navigate('/teacher/dashboard');
  };

  const hasOptions = (type: QuestionType) =>
    type === 'multiple' || type === 'checkbox' || type === 'dropdown';

  /* ── render ───────────────────────────────────── */
  return (
    <div className="ef-page">

      {/* hidden file input for images */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFile}
      />

      {/* ─── Top bar ─────────────────────────── */}
      <header className="ef-topbar" style={{ backgroundColor: accentColor }}>
        <div className="ef-topbar-left">
          <button className="ef-icon-btn" onClick={() => navigate('/teacher/dashboard')} title="Volver">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span className="ef-topbar-title">{examTitle || 'Examen sin título'}</span>
        </div>
        <div className="ef-topbar-right">

          {/* Palette */}
          <div className="ef-palette-wrapper">
            <button
              className="ef-icon-btn"
              title="Paleta de colores"
              onClick={() => setShowPalette(v => !v)}
            >
              <FontAwesomeIcon icon={faPalette} />
            </button>
            {showPalette && (
              <div className="ef-palette-panel">
                <p className="ef-palette-label">Color del formulario</p>
                <div className="ef-palette-grid">
                  {PALETTE_COLORS.map(c => (
                    <button
                      key={c}
                      className={`ef-palette-swatch ${accentColor === c ? 'ef-palette-swatch--active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => { setAccentColor(c); setShowPalette(false); }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vista previa */}
          <button className="ef-icon-btn" title="Vista previa" onClick={() => setShowPreview(true)}>
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button className="ef-send-btn" style={{ color: accentColor }} onClick={handleSend}>
            ENVIAR
          </button>
        </div>
      </header>

      {/* ─── Tabs ────────────────────────────── */}
      <div className="ef-tabs-bar" style={{ backgroundColor: accentColor }}>
        <button
          className={`ef-tab ${activeTab === 'preguntas' ? 'ef-tab--active' : ''}`}
          onClick={() => setActiveTab('preguntas')}
        >
          PREGUNTAS
        </button>
        <button
          className={`ef-tab ${activeTab === 'respuestas' ? 'ef-tab--active' : ''}`}
          onClick={() => setActiveTab('respuestas')}
        >
          RESPUESTAS
        </button>
      </div>

      {/* ─── Body ────────────────────────────── */}
      <div className="ef-body">
        <div className="ef-center-col">

          {activeTab === 'preguntas' && (
            <>
              {/* Title card */}
              <div className="ef-card ef-title-card" style={{ borderTopColor: accentColor }}>
                <input
                  className="ef-title-input"
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  placeholder="Título del examen"
                />
                <input
                  className="ef-desc-input"
                  value={examDesc}
                  onChange={e => setExamDesc(e.target.value)}
                  placeholder="Descripción del examen"
                />
              </div>

              {/* Question cards */}
              {questions.map(q => {
                const isActive = q.id === activeQId;
                return (
                  <div
                    key={q.id}
                    className={`ef-card ef-question-card ${isActive ? 'ef-question-card--active' : ''}`}
                    onClick={() => setActiveQId(q.id)}
                    style={isActive ? { borderLeftColor: accentColor } : undefined}
                  >
                    {isActive && <div className="ef-q-accent" style={{ backgroundColor: accentColor }} />}

                    {/* drag handle */}
                    <div className="ef-drag-handle">〓</div>

                    <div className="ef-q-top">
                      <input
                        className="ef-q-title-input"
                        value={q.title}
                        onChange={e => updateQ(q.id, { title: e.target.value })}
                        placeholder="Pregunta sin título"
                        onClick={e => e.stopPropagation()}
                      />
                      <select
                        className="ef-q-type-select"
                        value={q.type}
                        onChange={e => updateQ(q.id, { type: e.target.value as QuestionType })}
                        onClick={e => e.stopPropagation()}
                      >
                        {(Object.keys(questionTypeLabels) as QuestionType[]).map(t => (
                          <option key={t} value={t}>{questionTypeLabels[t]}</option>
                        ))}
                      </select>
                    </div>

                    {/* Image attached to question */}
                    {q.imageUrl && (
                      <div className="ef-q-image-wrapper">
                        <img src={q.imageUrl} alt="Imagen de pregunta" className="ef-q-image" />
                        <button
                          className="ef-q-image-remove"
                          onClick={e => { e.stopPropagation(); updateQ(q.id, { imageUrl: null }); }}
                          title="Quitar imagen"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    )}

                    {/* Options */}
                    {hasOptions(q.type) && (
                      <div className="ef-options">
                        {q.options.map((opt, idx) => (
                          <div key={opt.id} className="ef-option-row">
                            <span className="ef-option-bullet">
                              {q.type === 'checkbox' ? '☐' : q.type === 'dropdown' ? `${idx + 1}.` : '○'}
                            </span>
                            <input
                              className="ef-option-input"
                              value={opt.text}
                              onChange={e => updateOpt(q.id, opt.id, e.target.value)}
                              placeholder={`Opción ${idx + 1}`}
                              onClick={e => e.stopPropagation()}
                            />
                            {q.options.length > 1 && (
                              <button
                                className="ef-opt-del"
                                onClick={e => { e.stopPropagation(); removeOption(q.id, opt.id); }}
                                title="Eliminar opción"
                              >×</button>
                            )}
                          </div>
                        ))}
                        <div className="ef-option-row">
                          <span className="ef-option-bullet ef-option-bullet--muted">
                            {q.type === 'checkbox' ? '☐' : q.type === 'dropdown' ? `${q.options.length + 1}.` : '○'}
                          </span>
                          <button className="ef-add-option-btn" onClick={e => { e.stopPropagation(); addOption(q.id); }}>
                            Añadir opción
                          </button>
                          <span className="ef-or-text">&nbsp;o&nbsp;</span>
                          <button
                            className="ef-add-other-btn"
                            style={{ color: accentColor }}
                            onClick={e => { e.stopPropagation(); addOption(q.id); }}
                          >
                            AÑADIR RESPUESTA "OTRO"
                          </button>
                        </div>
                      </div>
                    )}

                    {q.type === 'short' && (
                      <div className="ef-short-preview">Respuesta de texto corto</div>
                    )}
                    {q.type === 'paragraph' && (
                      <div className="ef-short-preview">Respuesta de párrafo largo</div>
                    )}

                    {/* Footer */}
                    <div className="ef-q-footer">
                      <div className="ef-q-footer-actions">
                        <button
                          className="ef-footer-btn"
                          onClick={e => { e.stopPropagation(); duplicateQuestion(q.id); }}
                          title="Copiar pregunta"
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                        <button
                          className="ef-footer-btn ef-footer-btn--danger"
                          onClick={e => { e.stopPropagation(); deleteQuestion(q.id); }}
                          title="Eliminar pregunta"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <div className="ef-divider-v" />
                        <span className="ef-required-label">Obligatorio</span>
                        <label className="ef-toggle">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={e => { updateQ(q.id, { required: e.target.checked }); }}
                            onClick={e => e.stopPropagation()}
                          />
                          <span className="ef-toggle-slider" style={q.required ? { backgroundColor: accentColor } : undefined} />
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === 'respuestas' && (
            <div className="ef-card ef-empty-responses">
              <p>Aún no hay respuestas para este examen.</p>
            </div>
          )}
        </div>

        {/* ─── Right toolbar ───────────────── */}
        {activeTab === 'preguntas' && (
          <div className="ef-right-toolbar">
            <button className="ef-toolbar-btn" onClick={addQuestion} title="Agregar nueva pregunta">
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className="ef-toolbar-btn"
              title="Agregar imagen a la pregunta activa"
              onClick={() => triggerImageUpload(activeQId)}
            >
              <FontAwesomeIcon icon={faImage} />
            </button>
          </div>
        )}
      </div>

      {/* ─── Vista previa modal ───────────── */}
      {showPreview && (
        <div className="ef-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="ef-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="ef-preview-header" style={{ backgroundColor: accentColor }}>
              <span className="ef-preview-header-title">Vista previa</span>
              <button className="ef-icon-btn" onClick={() => setShowPreview(false)} title="Cerrar">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="ef-preview-body">
              <div className="ef-preview-title-card" style={{ borderTopColor: accentColor }}>
                <h2 className="ef-preview-exam-title">{examTitle || 'Examen sin título'}</h2>
                {examDesc && <p className="ef-preview-exam-desc">{examDesc}</p>}
              </div>
              {questions.map((q, qi) => (
                <div key={q.id} className="ef-preview-q-card">
                  <p className="ef-preview-q-title">
                    {qi + 1}. {q.title || 'Pregunta sin título'}
                    {q.required && <span className="ef-preview-required"> *</span>}
                  </p>
                  {q.imageUrl && <img src={q.imageUrl} alt="" className="ef-preview-q-image" />}
                  {q.type === 'short' && (
                    <input className="ef-preview-text-input" placeholder="Tu respuesta" readOnly />
                  )}
                  {q.type === 'paragraph' && (
                    <textarea className="ef-preview-textarea" placeholder="Tu respuesta" readOnly rows={3} />
                  )}
                  {(q.type === 'multiple' || q.type === 'checkbox' || q.type === 'dropdown') && (
                    <div className="ef-preview-options">
                      {q.options.map((opt, oi) => (
                        <label key={opt.id} className="ef-preview-option">
                          <input
                            type={q.type === 'checkbox' ? 'checkbox' : q.type === 'dropdown' ? 'radio' : 'radio'}
                            name={`prev-${q.id}`}
                            readOnly
                          />
                          <span>{opt.text || `Opción ${oi + 1}`}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Examen;
