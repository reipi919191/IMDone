import { Memo } from '../types';

/**
 * Formats a date timestamp into YYYY/MM/DD HH:MM:SS
 */
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Copies memos to clipboard in a readable text format.
 */
export const copyToClipboard = async (memos: Memo[]): Promise<boolean> => {
  const text = memos
    .map((memo) => `${formatDateTime(memo.timestamp)}, ${memo.content}`)
    .join('\n');
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Exports memos to a CSV file and triggers a download.
 * Adds BOM for Excel compatibility.
 */
export const exportToCsv = (memos: Memo[]): void => {
  const csvContent = memos
    .map((memo) => {
      const dateStr = formatDateTime(memo.timestamp);
      // Escape double quotes in content
      const safeContent = memo.content.replace(/"/g, '""');
      return `"${dateStr}","${safeContent}"`;
    })
    .join('\n');

  const header = '"日時","メモ内容"\n';
  // Add Byte Order Mark (BOM) for UTF-8 support in Excel
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, header, csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  // Filename with current date
  const now = new Date();
  const filenameDate = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  link.setAttribute('download', `imdone_export_${filenameDate}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};