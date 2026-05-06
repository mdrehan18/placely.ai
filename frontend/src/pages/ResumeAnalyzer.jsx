import React, { useState } from 'react';
import api from '../services/api';
import { Upload, FileText, CheckCircle, XCircle, Sparkles, Loader2, AlertCircle, Star } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setAnalysis(null);
    setError(null);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (typeof response.data.feedback === 'string') {
        setError(response.data.feedback);
      } else {
        setAnalysis(response.data.feedback);
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(err.response?.data?.message || 'Failed to analyze resume. Please ensure it is a valid PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4 uppercase tracking-widest">
            <Sparkles size={12} className="fill-current" /> AI Insights
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">Resume Analyzer</h1>
          <p className="text-muted-foreground text-lg max-w-xl mt-2 leading-relaxed">
            Upload your resume to get instant feedback on ATS compatibility and hiring standards.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Upload Section */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden group transition-all duration-500 hover:border-primary/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700 shadow-glow relative z-10">
              <Upload size={40} className="group-hover:-translate-y-1 transition-transform duration-500" />
            </div>
            
            <h2 className="text-2xl font-bold font-heading mb-3 relative z-10">Select PDF Resume</h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xs text-sm relative z-10 leading-relaxed opacity-80">
              Drag and drop your file here, or click below. Best for PDF formats under 5MB.
            </p>
            
            <form onSubmit={handleUpload} className="w-full max-w-xs relative z-10 space-y-5">
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="resume-upload"
                />
                <label 
                  htmlFor="resume-upload"
                  className="flex items-center justify-center gap-3 w-full p-4 bg-secondary/30 border border-border/50 rounded-2xl cursor-pointer hover:bg-secondary/50 transition-all group/label"
                >
                  <FileText size={18} className="text-primary" />
                  <span className="text-sm font-bold truncate max-w-[180px]">
                    {file ? file.name : 'Choose File'}
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isUploading || !file}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-glow hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <><Loader2 className="animate-spin" size={20} /> Processing...</>
                ) : (
                  <><Sparkles size={20} /> Analyze Now</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 min-h-[450px] flex flex-col shadow-soft">
            {isUploading ? (
              <div className="h-full flex-1 flex flex-col items-center justify-center text-center animate-pulse py-20">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full animate-ping absolute inset-0" />
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center relative">
                    <Loader2 size={40} className="text-primary animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">Reading your resume...</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Our AI is analyzing keywords, formatting, and industry standards.</p>
              </div>
            ) : analysis ? (
              <div className="space-y-10 animate-slide-up h-full">
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-border/30">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle className="text-secondary/40" strokeWidth="10" stroke="currentColor" fill="transparent" r="54" cx="64" cy="64"/>
                      <circle 
                        className={`${analysis.ats_score > 75 ? 'text-success' : 'text-warning'}`} 
                        strokeWidth="10" 
                        strokeDasharray="339.3" 
                        strokeDashoffset={339.3 - (339.3 * analysis.ats_score) / 100}
                        strokeLinecap="round"
                        stroke="currentColor" 
                        fill="transparent" 
                        r="54" 
                        cx="64" 
                        cy="64"
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-extrabold font-heading tracking-tighter">{analysis.ats_score}</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-3xl font-extrabold font-heading mb-2 tracking-tight">ATS Compatibility</h3>
                    <p className="text-muted-foreground font-medium opacity-80 leading-relaxed max-w-sm">
                      Your resume has a <span className="text-foreground font-bold">{analysis.ats_score}%</span> match with modern hiring filters.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={48} className="text-primary" />
                  </div>
                  <p className="text-[15px] font-medium leading-relaxed text-foreground/90 italic">
                    <span className="font-extrabold text-primary not-italic uppercase tracking-widest text-xs block mb-2">AI Summary</span> 
                    "{analysis.final_summary}"
                  </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 font-bold text-success text-sm uppercase tracking-widest">
                      <CheckCircle size={18} /> Strengths
                    </div>
                    <div className="space-y-3">
                      {analysis.strengths?.map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-success/5 border border-success/10 text-[14px] font-medium leading-snug group hover:bg-success/10 transition-colors">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 font-bold text-destructive text-sm uppercase tracking-widest">
                      <XCircle size={18} /> Gaps Found
                    </div>
                    <div className="space-y-3">
                      {analysis.weaknesses?.map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-[14px] font-medium leading-snug group hover:bg-destructive/10 transition-colors">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2.5 font-bold text-warning text-sm uppercase tracking-widest">
                    <Star size={18} /> Suggested Keywords
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {analysis.missing_keywords?.map((kw, i) => (
                      <span key={i} className="px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-xs font-bold text-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-default">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-[2rem] flex items-center justify-center mb-6 shadow-glow border border-destructive/20">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">Analysis Failed</h3>
                <p className="text-muted-foreground font-medium mb-8 max-w-xs">{error}</p>
                <button onClick={() => setError(null)} className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-bold transition-all">Try Another File</button>
              </div>
            ) : (
              <div className="h-full flex-1 flex flex-col items-center justify-center text-center py-20 opacity-50">
                <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mb-6 border border-border">
                  <FileText size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">Waiting for File</h3>
                <p className="text-muted-foreground font-medium max-w-xs">Once you upload, we'll generate a complete breakdown here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
