import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import '../../utils/chartConfig'; // registers Chart.js components
import { BAR_PALETTE, PIE_PALETTE, defaultBarOptions, defaultPieOptions } from '../../utils/chartConfig';

export interface DistributionItem {
  answer: string;
  label: string;
  count: number;
  percentage: number;
}

export interface QuestionStat {
  questionId: string;
  questionText: string;
  questionType: string;
  totalAnswers: number;
  distribution: DistributionItem[];
}

interface ResultsChartProps {
  stats: QuestionStat[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return (
      <p style={{ color: '#57606a', textAlign: 'center', padding: '1.5rem 0' }}>
        Sin datos suficientes para generar gráficas.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {stats.map((qs, qi) => {
        const isShort = qs.questionType === 'short' || qs.questionType === 'short-answer' || qs.questionType === 'paragraph';
        const labels = qs.distribution.map(d => d.label);
        const counts = qs.distribution.map(d => d.count);
        const percentages = qs.distribution.map(d => d.percentage);

        return (
          <div
            key={qs.questionId}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '1.25rem 1.5rem',
            }}
          >
            <p style={{ margin: '0 0 1rem', fontWeight: 600, color: '#1f2328', fontSize: '0.95rem' }}>
              <span style={{ color: '#57606a', fontWeight: 400, marginRight: 6 }}>
                P{qi + 1}.
              </span>
              {qs.questionText || '(sin texto)'}
            </p>

            {isShort || qs.distribution.length === 0 ? (
              <p style={{ color: '#57606a', fontSize: '0.88rem' }}>
                Pregunta de respuesta abierta — {qs.totalAnswers} respuesta{qs.totalAnswers !== 1 ? 's' : ''} recibida{qs.totalAnswers !== 1 ? 's' : ''}.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                {/* Bar chart */}
                <div>
                  <Bar
                    data={{
                      labels,
                      datasets: [{
                        label: 'Respuestas',
                        data: counts,
                        backgroundColor: labels.map((_, i) => BAR_PALETTE[i % BAR_PALETTE.length]),
                        borderRadius: 4,
                      }],
                    }}
                    options={defaultBarOptions}
                  />
                </div>

                {/* Pie chart */}
                <div style={{ maxWidth: 220, margin: '0 auto' }}>
                  <Pie
                    data={{
                      labels,
                      datasets: [{
                        data: percentages,
                        backgroundColor: labels.map((_, i) => PIE_PALETTE[i % PIE_PALETTE.length]),
                        borderWidth: 1,
                      }],
                    }}
                    options={defaultPieOptions}
                  />
                </div>
              </div>
            )}

            {/* Distribution table */}
            {qs.distribution.length > 0 && !isShort && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f7f8fa' }}>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.75rem', borderBottom: '1px solid #e5e7eb', color: '#57606a' }}>Opción</th>
                    <th style={{ textAlign: 'right', padding: '0.4rem 0.75rem', borderBottom: '1px solid #e5e7eb', color: '#57606a' }}>Respuestas</th>
                    <th style={{ textAlign: 'right', padding: '0.4rem 0.75rem', borderBottom: '1px solid #e5e7eb', color: '#57606a' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {qs.distribution.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.4rem 0.75rem', color: '#1f2328' }}>{d.label}</td>
                      <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: '#1f2328' }}>{d.count}</td>
                      <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: '#57606a' }}>{d.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResultsChart;

// Made with Bob
