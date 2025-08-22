'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageSquare } from 'lucide-react';

interface MessageUsageData {
  remaining: number;
  limit: number;
  used: number;
}

export function MessageUsage() {
  const [messageUsage, setMessageUsage] = useState<MessageUsageData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessageUsage = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher<MessageUsageData>('/api/chat/message-usage');
      setMessageUsage(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch message usage');
      console.error('Error fetching message usage:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageUsage();
  }, []);

  // Function to refresh data - can be called after sending messages
  const refreshUsage = () => {
    fetchMessageUsage();
  };

  // Expose refresh function globally for other components to use
  useEffect(() => {
    (window as any).refreshMessageUsage = refreshUsage;
    return () => {
      delete (window as any).refreshMessageUsage;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MessageSquare className="w-4 h-4" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !messageUsage) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MessageSquare className="w-4 h-4" />
        <span>Messages</span>
      </div>
    );
  }

  const { remaining, limit, used } = messageUsage;
  const percentageUsed = (used / limit) * 100;

  // Determine color based on remaining messages
  const getColorClass = () => {
    if (remaining === 0) return 'text-red-500';
    if (remaining <= 5) return 'text-orange-500';
    if (remaining <= 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center gap-1 text-sm cursor-help ${getColorClass()}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            {remaining}/{limit}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <p>Messages remaining today</p>
          <p className="text-xs text-muted-foreground">
            {used} used out of {limit} daily limit
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
