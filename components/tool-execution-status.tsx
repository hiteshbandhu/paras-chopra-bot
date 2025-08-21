'use client';

import { motion } from 'framer-motion';
import { LoaderIcon } from './icons';

interface ToolExecutionStatusProps {
  toolName: string;
  isExecuting: boolean;
}

const toolMessages = {
  ragSearch: {
    executing: "Searching Paras' essays for relevant content...",
    completed: 'Found relevant essays and excerpts',
  },
  essaySearch: {
    executing: 'Retrieving specific essay document...',
    completed: 'Essay document retrieved',
  },
  getWeather: {
    executing: 'Getting current weather information...',
    completed: 'Weather data retrieved',
  },
  createDocument: {
    executing: 'Creating new document...',
    completed: 'Document created',
  },
  updateDocument: {
    executing: 'Updating document...',
    completed: 'Document updated',
  },
  requestSuggestions: {
    executing: 'Generating writing suggestions...',
    completed: 'Suggestions generated',
  },
};

export function ToolExecutionStatus({
  toolName,
  isExecuting,
}: ToolExecutionStatusProps) {
  const toolInfo = toolMessages[toolName as keyof typeof toolMessages];

  if (!toolInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border"
    >
      {isExecuting && (
        <div className="animate-spin">
          <LoaderIcon />
        </div>
      )}
      <span className="font-medium">
        {isExecuting ? toolInfo.executing : toolInfo.completed}
      </span>
    </motion.div>
  );
}
