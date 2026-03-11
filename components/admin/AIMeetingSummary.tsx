"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HiChatBubbleLeft, HiClipboardDocumentList } from "react-icons/hi2";

export function AIMeetingSummary() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      alert("Please enter meeting transcript");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/meeting-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingTranscript: transcript }),
      });

      if (!response.ok) throw new Error("Failed to summarize meeting");

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      alert(error.message || "Failed to summarize meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <HiChatBubbleLeft className="h-6 w-6 text-teal-600" />
        <h3 className="text-lg font-semibold">Meeting Summary Generator</h3>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Meeting Transcript or Notes
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript or notes here..."
          className="w-full min-h-[200px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={loading}
        />
      </div>

      <Button
        onClick={handleSummarize}
        disabled={loading || !transcript.trim()}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        Generate Summary
      </Button>

      {result && (
        <div className="space-y-4 mt-6">
          <Card className="p-4 bg-muted border-primary/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <HiClipboardDocumentList className="h-5 w-5 text-teal-600" />
              Meeting Summary
            </h4>
            <p className="text-sm text-foreground p-3 rounded">
              {result.summary}
            </p>
          </Card>

          <Card className="p-4">
            <h5 className="font-semibold mb-3">Key Points</h5>
            <ul className="space-y-2">
              {result.keyPoints?.map((point: string, idx: number) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-teal-600 font-bold mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          {result.actionItems && result.actionItems.length > 0 && (
            <Card className="p-4 bg-amber-50">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                Action Items
              </h5>
              <div className="space-y-2">
                {result.actionItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-card p-3 rounded border border-amber-200"
                  >
                    <p className="font-medium text-sm">{item.task}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      {item.assignee && (
                        <span>
                          Assignee: <strong>{item.assignee}</strong>
                        </span>
                      )}
                      {item.deadline && (
                        <span>
                          Deadline: <strong>{item.deadline}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {result.decisions && result.decisions.length > 0 && (
            <Card className="p-4">
              <h5 className="font-semibold mb-3">Decisions Made</h5>
              <ul className="space-y-2">
                {result.decisions.map((decision: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-muted-foreground font-bold mt-1">✓</span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
