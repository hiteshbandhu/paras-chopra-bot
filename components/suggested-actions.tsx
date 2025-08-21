'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { memo } from 'react';
import type { VisibilityType } from './visibility-selector';
import type { ChatMessage } from '@/lib/types';

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: (message: {
    role: 'user';
    parts: Array<{ type: 'text'; text: string }>;
  }) => void;
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'How should I choose what to work on next?',
      label: 'curiosity → exploration → experiments → commit',
      action: 'How should I choose what to work on next?',
    },
    {
      title: 'How can a solo founder validate an idea quickly?',
      label: 'reversible tests, user talks, measure traction',
      action: 'How can a solo founder validate an idea quickly?',
    },
    {
      title: 'How do I learn faster and remember more?',
      label: 'knowledge system, practice & notes',
      action: 'How do I learn faster and remember more?',
    },
    {
      title: 'What does "meaning is constructed" look like ?',
      label: 'principles → routines → projects → feedback',
      action: 'What does "meaning is constructed" look like in daily life?',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              sendMessage({
                role: 'user',
                parts: [{ type: 'text', text: suggestedAction.action }],
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground text-xs">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    return (
      prevProps.chatId === nextProps.chatId &&
      prevProps.selectedVisibilityType === nextProps.selectedVisibilityType
    );
  },
);
