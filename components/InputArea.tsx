import React, { useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface InputAreaProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  onToggleListening: () => void;
  onSave: () => void;
  onChangeText: (text: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  isListening,
  transcript,
  interimTranscript,
  onToggleListening,
  onSave,
  onChangeText,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [transcript, interimTranscript]);

  const hasContent = transcript.trim().length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 pb-safe-area-bottom z-20">
      <div className="max-w-md mx-auto flex flex-col gap-3">
        {/* Text Input Display */}
        <div className="relative">
            <textarea
            ref={textareaRef}
            value={isListening ? transcript + interimTranscript : transcript}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="記録する内容を話してください..."
            className={`w-full bg-slate-100 rounded-2xl px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all ${isListening ? 'border-blue-400 ring-2 ring-blue-100' : 'border-transparent'}`}
            rows={1}
            disabled={isListening && interimTranscript.length > 0} // Prevent editing while interim results flow in
            />
            
            {hasContent && !isListening && (
                 <button 
                    onClick={() => onChangeText('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                 >
                     <ICONS.X className="w-5 h-5" />
                 </button>
            )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
            {/* Mic Button - Main Action */}
            <button
                onClick={onToggleListening}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg active:scale-95 ${
                isListening
                    ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse'
                    : 'bg-slate-800 text-white shadow-slate-800/20 hover:bg-slate-700'
                }`}
            >
                {isListening ? (
                <>
                    <ICONS.MicrophoneOff className="w-6 h-6" />
                    <span>停止</span>
                </>
                ) : (
                <>
                    <ICONS.Microphone className="w-6 h-6" />
                    <span>話す</span>
                </>
                )}
            </button>

            {/* Save Button */}
            <button
                onClick={onSave}
                disabled={!hasContent || isListening}
                className={`w-14 h-14 flex items-center justify-center rounded-full transition-all shadow-md border ${
                hasContent && !isListening
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30 hover:bg-blue-700 active:scale-95'
                    : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                }`}
                aria-label="保存"
            >
                <ICONS.Save className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;