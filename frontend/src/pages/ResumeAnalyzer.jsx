import React, { useState } from 'react';
import api from '../services/api';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setAnalysis(null);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('API Response:', response.data);
      
      // The backend returns { feedback: ... }
      if (typeof response.data.feedback === 'string') {
        setAnalysis({ error: true, message: response.data.feedback });
      } else {
        setAnalysis(response.data.feedback);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      const errorMsg = error.response?.data?.error || 'Something went wrong';
      setAnalysis({ error: true, message: errorMsg });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading mb-1">Resume Analyzer</h1>
          <p className="text-muted-foreground text-sm">Upload your resume to get instant AI feedback.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-soft flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group transition-all duration-300 hover:border-primary/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-glow relative z-10">
            <Upload size={36} />
          </div>
          
          <h2 className="text-xl font-bold font-heading mb-3 relative z-10">Upload Resume (PDF)</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xs text-sm relative z-10">
            Drag and drop your file here, or click to browse. Max file size: 5MB.
          </p>
          
          <form onSubmit={handleUpload} className="w-full max-w-xs relative z-10 space-y-4">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 transition-colors cursor-pointer"
            />
            <button 
              type="submit" 
              disabled={isUploading || !file}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {isUploading ? 'Analyzing Document...' : 'Analyze Resume'}
            </button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft flex flex-col">
          {analysis ? (
            analysis.error ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                <XCircle size={48} className="mb-4 text-warning" />
                <p className="font-medium text-lg mb-1 text-center">{analysis.message}</p>
              </div>
            ) : (
            <div className="space-y-8 animate-in fade-in duration-500 flex-1">
              <div className="flex items-center gap-6 pb-6 border-b border-border/50">
                <div className="relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle className="text-secondary" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48"/>
                    <circle 
                      className={`${analysis.ats_score > 70 ? 'text-success' : 'text-warning'}`} 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * analysis.ats_score) / 100}
                      strokeLinecap="round"
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="48" 
                      cy="48"
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold font-heading">{analysis.ats_score}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading mb-1">ATS Score</h3>
                  <p className="text-muted-foreground text-sm">Based on industry standard parsing and keyword density.</p>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
                <p className="text-sm italic leading-relaxed text-foreground/80">
                  <span className="font-bold text-primary not-italic">Summary:</span> "{analysis.final_summary}"
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <CheckCircle size={20} /> Strengths
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.strengths && analysis.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm bg-primary/5 text-foreground border border-primary/10 px-3 py-2 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" /> <span className="flex-1">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-destructive">
                    <XCircle size={20} /> Weaknesses
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.weaknesses && analysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm bg-destructive/5 text-destructive border border-destructive/10 px-3 py-2 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" /> {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-warning">
                    <Upload size={20} className="rotate-180" /> Missing Keywords
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords && analysis.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-medium uppercase tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <FileText size={20} /> Actionable Suggestions
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.suggestions && analysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm bg-secondary text-secondary-foreground border border-border px-3 py-2 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 flex-shrink-0 mt-1.5" /> <span className="flex-1">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="font-medium text-lg mb-1">No analysis data yet</p>
              <p className="text-sm">Upload a resume to see your detailed breakdown here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
