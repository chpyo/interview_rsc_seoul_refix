import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { runTranscribeAudio } from "@/lib/ai/run";
import { formatAudioBytes, formatDurationSec, getAudioBlob, getAudioDownloadUrl } from "@/lib/audio";
import type { SessionAudio } from "@/lib/types";

export function SessionAudioPlayer({
  audio,
  canRetranscribe,
  onRetranscribe,
}: {
  audio: SessionAudio;
  canRetranscribe?: boolean;
  onRetranscribe?: (text: string) => Promise<void>;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAudioDownloadUrl(audio.storagePath)
      .then((next) => {
        if (!cancelled) setUrl(next);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [audio.storagePath]);

  const retryMut = useMutation({
    mutationFn: async () => {
      const blob = await getAudioBlob(audio.storagePath, audio.mimeType);
      const res = await runTranscribeAudio({
        blob,
        mimeType: audio.mimeType,
        storagePath: audio.storagePath,
      });
      if (!res.ok) throw new Error(res.error);
      if (!onRetranscribe) return;
      await onRetranscribe(res.text);
    },
    onSuccess: () => toast.success("원본을 다시 전사했습니다."),
    onError: (err: Error) => toast.error(err.message),
  });

  const duration = formatDurationSec(audio.durationSec);

  return (
    <div className="flex flex-col gap-2 border-b border-border px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          원본 녹음 {audio.filename}
          {duration ? ` · ${duration}` : ""}
          {audio.sizeBytes ? ` · ${formatAudioBytes(audio.sizeBytes)}` : ""}
        </p>
        {canRetranscribe && onRetranscribe ? (
          <Button
            size="sm"
            variant="outline"
            disabled={retryMut.isPending}
            onClick={() => {
              if (window.confirm("원본을 다시 전사할까요? 지금 원문 구간이 바뀝니다.")) {
                retryMut.mutate();
              }
            }}
          >
            {retryMut.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
            원본 다시 전사
          </Button>
        ) : null}
      </div>
      {url ? (
        <audio controls src={url} className="w-full" preload="metadata">
          이 브라우저는 오디오 재생을 지원하지 않습니다.
        </audio>
      ) : (
        <p className="text-xs text-muted-foreground">원본 오디오를 불러오는 중</p>
      )}
    </div>
  );
}
