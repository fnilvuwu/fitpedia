import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  file: string;
  lang: string;
  code: string;
  noCopy?: boolean;
}

const langMap: Record<string, string> = {
  dart: 'dart',
  yaml: 'yaml',
  json: 'json',
  xml: 'markup',
  powershell: 'powershell',
  python: 'python',
  text: 'text',
};

export default function CodeBlock({ file, lang, code, noCopy }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-fit-line bg-fit-card">
      <div className="flex items-center justify-between gap-2 border-b border-fit-line bg-fit-window px-4 py-2">
        <span className="min-w-0 flex-1 break-all font-mono text-xs text-fit-text">{file}</span>
        {!noCopy && (
          <button
            onClick={copy}
            className="shrink-0 rounded-md bg-fit-yellow px-3 py-1 text-xs font-bold text-black transition hover:bg-fit-yellow-soft"
          >
            {copied ? 'Disalin!' : 'Salin'}
          </button>
        )}
      </div>
      <SyntaxHighlighter
        language={langMap[lang] ?? 'text'}
        style={oneDark}
        customStyle={{ margin: 0, fontSize: 12.5, maxHeight: 560, background: '#161616' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
