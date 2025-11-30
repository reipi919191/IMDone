import React from 'react';
import { Memo } from '../types';
import { ICONS } from '../constants';
import { formatDateTime } from '../utils/export';

interface MemoListProps {
  memos: Memo[];
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  isTrashMode: boolean;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const MemoList: React.FC<MemoListProps> = ({ 
  memos, 
  onDelete, 
  onRestore, 
  onPermanentDelete,
  isTrashMode 
}) => {
  
  if (memos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
            {isTrashMode ? (
                <ICONS.Trash className="w-8 h-8 opacity-50" />
            ) : (
                <ICONS.Microphone className="w-8 h-8 opacity-50" />
            )}
        </div>
        <p className="text-center text-sm">
            {isTrashMode ? 'ゴミ箱は空です' : <>マイクボタンを押して<br />「やったこと」を記録しましょう</>}
        </p>
      </div>
    );
  }

  const getRemainingDays = (deletedAt?: number) => {
      if (!deletedAt) return 0;
      const elapsed = Date.now() - deletedAt;
      const remaining = THIRTY_DAYS_MS - elapsed;
      return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
  };

  return (
    <div className="space-y-3 pb-32">
      {memos.map((memo) => (
        <div
          key={memo.id}
          className={`rounded-xl p-4 shadow-sm border transition-all hover:shadow-md group ${
             isTrashMode ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-blue-600">
                    {formatDateTime(memo.timestamp)}
                </p>
                {isTrashMode && memo.deletedAt && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        あと{getRemainingDays(memo.deletedAt)}日
                    </span>
                )}
              </div>
              <p className={`text-base break-words whitespace-pre-wrap leading-relaxed ${isTrashMode ? 'text-slate-500' : 'text-slate-800'}`}>
                {memo.content}
              </p>
            </div>
            
            <div className="flex items-center gap-1 -mr-2">
                {isTrashMode ? (
                    <>
                        <button
                            onClick={() => onRestore(memo.id)}
                            className="text-blue-400 hover:text-blue-600 transition-colors p-2"
                            title="復元する"
                        >
                            <ICONS.Restore className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                if(window.confirm('完全に削除しますか？この操作は取り消せません。')) {
                                    onPermanentDelete(memo.id);
                                }
                            }}
                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                            title="完全に削除"
                        >
                            <ICONS.X className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onDelete(memo.id)} // Soft delete without confirmation for better UX, or confirm? Keep confirm if user prefers safety, but user complained about it. Let's make soft delete instant.
                        className="text-slate-300 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="ゴミ箱へ移動"
                    >
                        <ICONS.Trash className="w-4 h-4" />
                    </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoList;