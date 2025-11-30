import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MemoList from './components/MemoList';
import InputArea from './components/InputArea';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { loadMemos, saveMemos } from './utils/storage';
import { exportToCsv, copyToClipboard } from './utils/export';
import { Memo } from './types';
import { ICONS } from './constants';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const App: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    toggleListening,
    resetTranscript,
    setManualTranscript,
  } = useSpeechRecognition();

  // Load memos on mount & Cleanup old trash
  useEffect(() => {
    const loaded = loadMemos();
    const now = Date.now();
    
    // Filter out items that are deleted and older than 30 days
    const activeAndRecentTrash = loaded.filter(memo => {
      if (!memo.deletedAt) return true; // Active
      return (now - memo.deletedAt) < THIRTY_DAYS_MS; // Keep valid trash
    });

    // If we removed anything, save the cleanup result
    if (activeAndRecentTrash.length !== loaded.length) {
      saveMemos(activeAndRecentTrash);
    }

    // Sort desc by timestamp
    setMemos(activeAndRecentTrash.sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  // Save Memo
  const handleSave = () => {
    if (!transcript.trim()) return;

    const newMemo: Memo = {
      id: crypto.randomUUID(),
      content: transcript.trim(),
      timestamp: Date.now(),
    };

    const updatedMemos = [newMemo, ...memos];
    setMemos(updatedMemos);
    saveMemos(updatedMemos);
    resetTranscript();
  };

  // Soft Delete (Move to Trash)
  const handleMoveToTrash = (id: string) => {
    const updatedMemos = memos.map((m) => 
      m.id === id ? { ...m, deletedAt: Date.now() } : m
    );
    setMemos(updatedMemos);
    saveMemos(updatedMemos);
  };

  // Restore from Trash
  const handleRestore = (id: string) => {
    const updatedMemos = memos.map((m) => 
      m.id === id ? { ...m, deletedAt: undefined } : m
    );
    setMemos(updatedMemos);
    saveMemos(updatedMemos);
  };

  // Permanent Delete
  const handlePermanentDelete = (id: string) => {
    const updatedMemos = memos.filter((m) => m.id !== id);
    setMemos(updatedMemos);
    saveMemos(updatedMemos);
  };

  // Filter Memos based on view mode and search
  const filteredMemos = useMemo(() => {
    // First separate active vs trash
    let currentSet = memos.filter(m => showTrash ? !!m.deletedAt : !m.deletedAt);
    
    // Then apply search
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      currentSet = currentSet.filter((m) => m.content.toLowerCase().includes(lowerQ));
    }
    
    return currentSet.sort((a, b) => b.timestamp - a.timestamp);
  }, [memos, searchQuery, showTrash]);

  // Export handlers (only export active memos usually, but let's respect current view)
  const handleExportCsv = () => {
    exportToCsv(filteredMemos);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(filteredMemos);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen font-sans ${showTrash ? 'bg-slate-100' : 'bg-slate-50'} text-slate-900 transition-colors`}>
      <Header
        onExportCsv={handleExportCsv}
        onCopyToClipboard={handleCopy}
        copySuccess={copySuccess}
        showTrash={showTrash}
        onToggleTrash={() => setShowTrash(!showTrash)}
      />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Title / Status Bar */}
        <div className="flex items-center justify-between mb-6">
           <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ICONS.Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={showTrash ? "ゴミ箱を検索..." : "キーワードで検索..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
           </div>
        </div>

        {/* View Indicator */}
        {showTrash && (
           <div className="mb-4 p-3 bg-slate-200 rounded-lg text-sm text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-2">
                 <ICONS.Trash className="w-4 h-4" />
                 ゴミ箱（30日後に自動削除されます）
              </span>
           </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center gap-2">
            <ICONS.MicrophoneOff className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* List */}
        <MemoList 
          memos={filteredMemos} 
          onDelete={handleMoveToTrash}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          isTrashMode={showTrash}
        />
      </main>

      {/* Input Area (Only show in active mode) */}
      {!showTrash && (
        <InputArea
            isListening={isListening}
            transcript={transcript}
            interimTranscript={interimTranscript}
            onToggleListening={toggleListening}
            onSave={handleSave}
            onChangeText={setManualTranscript}
        />
      )}
    </div>
  );
};

export default App;