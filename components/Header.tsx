import React from 'react';
import { ICONS } from '../constants';

interface HeaderProps {
  onExportCsv: () => void;
  onCopyToClipboard: () => void;
  copySuccess: boolean;
  showTrash: boolean;
  onToggleTrash: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onExportCsv, 
    onCopyToClipboard, 
    copySuccess,
    showTrash,
    onToggleTrash
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if(showTrash) onToggleTrash(); }}>
            <div className={`p-1.5 rounded-lg ${showTrash ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                {showTrash ? <ICONS.Trash className="w-5 h-5" /> : <ICONS.Check className="w-5 h-5" />}
            </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">ImDone</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleTrash}
            className={`p-2 rounded-full transition-colors ${
                showTrash ? 'bg-slate-200 text-slate-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={showTrash ? "リストに戻る" : "ゴミ箱を表示"}
          >
             {showTrash ? <ICONS.List className="w-5 h-5" /> : <ICONS.Trash className="w-5 h-5" />}
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <button
            onClick={onCopyToClipboard}
            className={`p-2 rounded-full transition-colors relative group ${
              copySuccess ? 'bg-green-100 text-green-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="クリップボードにコピー"
          >
            {copySuccess ? <ICONS.Check className="w-5 h-5" /> : <ICONS.Copy className="w-5 h-5" />}
            <span className="sr-only">コピー</span>
          </button>
          
          <button
            onClick={onExportCsv}
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-full transition-colors"
            title="CSV出力"
          >
            <ICONS.Download className="w-5 h-5" />
            <span className="sr-only">CSV出力</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;